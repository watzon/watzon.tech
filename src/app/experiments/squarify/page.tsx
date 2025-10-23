'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Download, Copy, X } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';

type PresetSize = (typeof sizeOptions)[number]['value'];
type Size = PresetSize | number;

const sizeOptions = [
  { label: 'Original Size', value: 'original' as const },
  { label: '256×256', value: 256 },
  { label: '512×512', value: 512 },
  { label: '1024×1024', value: 1024 },
] as const;

const colorOptions = [
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Light Gray', value: '#94a3b8' },
  { label: 'Navy', value: '#0f172a' },
  { label: 'Dark Navy', value: '#1e293b' },
  { label: 'Teal', value: '#5eead4' },
  { label: 'Transparent', value: 'transparent' },
  { label: 'Blurred Image', value: 'blurred' },
] as const;

export default function SquarifyPage() {
  const [dragActive, setDragActive] = useState(false);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#000000');
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [squareSize, setSquareSize] = useState<Size>('original');
  const [customSize, setCustomSize] = useState<number>(512);
  const [showWatermark, setShowWatermark] = useState(true);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const getTargetSize = useCallback((image: HTMLImageElement, size: Size): number => {
    if (size === 'original') {
      return Math.max(image.width, image.height);
    }
    return size;
  }, []);

  const drawBlurredBackground = useCallback((ctx: CanvasRenderingContext2D, canvasSize: number, image: HTMLImageElement) => {
    if (!image) return;

    // Save context state
    ctx.save();

    // Create temporary canvas for blur effect
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Set temp canvas to final size
    tempCanvas.width = canvasSize;
    tempCanvas.height = canvasSize;

    // Calculate scale to cover entire canvas with image
    const scale = Math.max(canvasSize / image.width, canvasSize / image.height);
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const x = (canvasSize - scaledWidth) / 2;
    const y = (canvasSize - scaledHeight) / 2;

    // Draw scaled image to temp canvas
    tempCtx.drawImage(image, x, y, scaledWidth, scaledHeight);

    // Apply blur filter using CSS filter on canvas context
    ctx.filter = 'blur(20px)';
    ctx.drawImage(tempCanvas, 0, 0);

    // Restore context state
    ctx.restore();
  }, []);

  const addWatermark = useCallback((ctx: CanvasRenderingContext2D, canvasSize: number) => {
    if (!showWatermark) return;

    const text = 'wtz.nz/squarify';
    const padding = Math.round(canvasSize * 0.03);

    ctx.save();
    ctx.font = `${Math.round(canvasSize * 0.035)}px system-ui, sans-serif`;

    if (backgroundColor === 'transparent' || backgroundColor === 'blurred') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    } else {
      const isLightBackground = [
        '#FFFFFF',
        '#94a3b8',
        '#5eead4'
      ].includes(backgroundColor);

      ctx.fillStyle = isLightBackground
        ? 'rgba(0, 0, 0, 0.6)'
        : 'rgba(255, 255, 255, 0.6)';
    }

    const metrics = ctx.measureText(text);
    const x = canvasSize - metrics.width - padding;
    const y = canvasSize - padding;

    ctx.fillText(text, x, y);
  }, [backgroundColor, showWatermark]);

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    console.log('Processing image:', file.type, file.name);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result || typeof e.target.result !== 'string') return;

      const img = new Image();
      img.onload = () => {
        console.log('Image loaded successfully:', {
          width: img.width,
          height: img.height,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        });
        setOriginalSize({ width: img.width, height: img.height });
        setOriginalImage(img);
        setSquareSize('original');

        // Force a preview update after setting the image - use setTimeout to ensure state is updated
        setTimeout(() => {
          const canvas = previewCanvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (canvas && ctx && img.complete) {
            const PREVIEW_SIZE = 596;
            canvas.width = PREVIEW_SIZE;
            canvas.height = PREVIEW_SIZE;

            ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

            // Draw background
            if (backgroundColor === 'transparent') {
              const squareSize = 10;
              for (let i = 0; i < PREVIEW_SIZE; i += squareSize) {
                for (let j = 0; j < PREVIEW_SIZE; j += squareSize) {
                  ctx.fillStyle = (i + j) % (squareSize * 2) === 0 ? '#ffffff' : '#e2e8f0';
                  ctx.fillRect(i, j, squareSize, squareSize);
                }
              }
            } else if (backgroundColor === 'blurred') {
              drawBlurredBackground(ctx, PREVIEW_SIZE, img);
            } else {
              ctx.fillStyle = backgroundColor;
              ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
            }

            // Calculate and draw image
            const targetSize = getTargetSize(img, 'original');
            const scale = PREVIEW_SIZE / targetSize;
            const imageScale = Math.min(
              targetSize / img.width,
              targetSize / img.height,
            ) * scale;

            const width = img.width * imageScale;
            const height = img.height * imageScale;
            const x = (PREVIEW_SIZE - width) / 2;
            const y = (PREVIEW_SIZE - height) / 2;

            try {
              ctx.drawImage(img, x, y, width, height);
              console.log('Image drawn successfully in processImage');
              addWatermark(ctx, PREVIEW_SIZE);
            } catch (error) {
              console.error('Failed to draw image in processImage:', error);
            }
          }
        }, 50);
      };
      img.onerror = (error) => {
        console.error('Failed to load image:', error);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [backgroundColor, getTargetSize, addWatermark, drawBlurredBackground]);

  const updatePreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    const image = originalImage;

    if (!canvas || !image) {
      console.log('Missing canvas or image:', { canvas: !!canvas, image: !!image });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('Failed to get canvas context');
      return;
    }

    console.log('Updating preview with image:', {
      imageSize: { width: image.width, height: image.height },
      complete: image.complete,
      naturalSize: { width: image.naturalWidth, height: image.naturalHeight }
    });

    const PREVIEW_SIZE = 596;
    canvas.width = PREVIEW_SIZE;
    canvas.height = PREVIEW_SIZE;

    ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

    // Draw background
    if (backgroundColor === 'transparent') {
      const squareSize = 10;
      for (let i = 0; i < PREVIEW_SIZE; i += squareSize) {
        for (let j = 0; j < PREVIEW_SIZE; j += squareSize) {
          ctx.fillStyle = (i + j) % (squareSize * 2) === 0 ? '#ffffff' : '#e2e8f0';
          ctx.fillRect(i, j, squareSize, squareSize);
        }
      }
    } else if (backgroundColor === 'blurred') {
      drawBlurredBackground(ctx, PREVIEW_SIZE, image);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    }

    // Calculate dimensions
    const targetSize = getTargetSize(image, squareSize);
    const scale = PREVIEW_SIZE / targetSize;
    const imageScale = Math.min(
      targetSize / image.width,
      targetSize / image.height,
    ) * scale;

    const width = image.width * imageScale;
    const height = image.height * imageScale;
    const x = (PREVIEW_SIZE - width) / 2;
    const y = (PREVIEW_SIZE - height) / 2;

    console.log('Drawing image with dimensions:', {
      targetSize,
      scale,
      imageScale,
      drawRect: { x, y, width, height }
    });

    // Draw image
    try {
      ctx.drawImage(image, x, y, width, height);
      console.log('Image drawn successfully');
    } catch (error) {
      console.error('Failed to draw image:', error);
    }

    // Add watermark
    addWatermark(ctx, PREVIEW_SIZE);
  }, [originalImage, backgroundColor, squareSize, getTargetSize, addWatermark, drawBlurredBackground]);

  // Update preview when dependencies change
  useEffect(() => {
    if (originalImage && originalImage.complete) {
      console.log('Triggering preview update');
      updatePreview();
    }
  }, [originalImage, updatePreview]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) processImage(file);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processImage]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files[0];
    if (file) processImage(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) processImage(file);
  };

  const handleCustomSizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setCustomSize(value);
      setSquareSize(value);
    }
  };

  const saveImage = async () => {
    if (!originalImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const targetSize = getTargetSize(originalImage, squareSize);

    canvas.width = targetSize;
    canvas.height = targetSize;

    if (backgroundColor === 'transparent') {
      // Transparent - no background fill
    } else if (backgroundColor === 'blurred') {
      drawBlurredBackground(ctx, targetSize, originalImage);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, targetSize, targetSize);
    }

    const scale = Math.min(
      targetSize / originalImage.width,
      targetSize / originalImage.height,
    );
    const width = originalImage.width * scale;
    const height = originalImage.height * scale;
    const x = (targetSize - width) / 2;
    const y = (targetSize - height) / 2;
    ctx.drawImage(originalImage, x, y, width, height);

    addWatermark(ctx, targetSize);

    const link = document.createElement('a');
    link.download = 'square-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyImage = async () => {
    if (!originalImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetSize = getTargetSize(originalImage, squareSize);

    canvas.width = targetSize;
    canvas.height = targetSize;

    if (backgroundColor === 'transparent') {
      // Transparent - no background fill
    } else if (backgroundColor === 'blurred') {
      drawBlurredBackground(ctx, targetSize, originalImage);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, targetSize, targetSize);
    }

    const scale = Math.min(
      targetSize / originalImage.width,
      targetSize / originalImage.height,
    );
    const width = originalImage.width * scale;
    const height = originalImage.height * scale;
    const x = (targetSize - width) / 2;
    const y = (targetSize - height) / 2;
    ctx.drawImage(originalImage, x, y, width, height);

    addWatermark(ctx, targetSize);

    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob(resolve as BlobCallback),
      );
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };

  const resetForm = () => {
    setOriginalImage(null);
    setBackgroundColor('#000000');
    setOriginalSize({ width: 0, height: 0 });
    setSquareSize('original');
  };

  return (
    <PageTransition>
      <div className="max-w-3xl px-4 my-8 mx-auto">
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-phosphor-accent">
            {`// SQUARIFY`}
          </h1>
          <p className="text-phosphor-secondary opacity-80">
            Create square images with custom backgrounds
          </p>
          <p className="text-phosphor-accent text-sm">
            Fast and free. Allows pasting images from clipboard.
          </p>
        </div>

        <div
          className={`
            border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
            min-h-[200px] flex items-center justify-center
            ${originalImage
              ? 'border-phosphor-primary/30 bg-phosphor-primary/5 p-0 max-w-[600px] mx-auto aspect-square rounded-lg border-none'
              : 'border-phosphor-secondary/30 bg-phosphor-primary/5 hover:border-phosphor-primary/50 hover:bg-phosphor-primary/10'
            }
            ${dragActive ? 'border-phosphor-primary bg-phosphor-primary/10' : ''}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="region"
          aria-label="Image upload dropzone"
        >
          {originalImage ? (
            <canvas
              ref={previewCanvasRef}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-phosphor-secondary">
              <Upload size={48} />
              <span>Drag and Drop</span>
              <span>or</span>
              <label className="bg-phosphor-primary/20 border border-phosphor-primary/30 text-phosphor-accent px-6 py-3 rounded-lg cursor-pointer transition-all font-medium hover:bg-phosphor-primary/30 hover:-translate-y-0.5">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <span className="text-phosphor-secondary opacity-60 text-sm">
                or paste from clipboard (Ctrl+V)
              </span>
            </div>
          )}
        </div>

        {originalImage && (
          <div className="text-phosphor-secondary opacity-80 text-sm text-center mt-2">
            Original: {originalSize.width} × {originalSize.height}
          </div>
        )}

        {originalImage && (
          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-phosphor-accent text-sm font-medium">
                Output Size
              </label>
              <div className="flex gap-2 flex-wrap">
                {sizeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`
                      px-4 py-2 border rounded-lg cursor-pointer transition-all text-sm
                      ${squareSize === option.value
                        ? 'bg-phosphor-primary/20 border-phosphor-primary text-phosphor-accent'
                        : 'border-phosphor-secondary/30 bg-phosphor-primary/5 text-phosphor-secondary hover:border-phosphor-primary/50 hover:text-phosphor-accent'
                      }
                    `}
                    onClick={() => setSquareSize(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className={`
                      w-28 px-4 py-2 pr-10 border rounded-lg text-sm transition-all
                      ${typeof squareSize === 'number' && !sizeOptions.find((opt) => opt.value === squareSize)
                        ? 'bg-phosphor-primary/20 border-phosphor-primary text-phosphor-accent'
                        : 'border-phosphor-secondary/30 bg-phosphor-primary/5 text-phosphor-secondary hover:border-phosphor-primary/50 hover:text-phosphor-accent'
                      }
                    `}
                    value={typeof squareSize === 'number' ? squareSize : customSize}
                    onInput={handleCustomSizeInput}
                    placeholder="Custom size"
                  />
                  <span className="absolute right-4 pointer-events-none text-inherit text-sm">
                    px
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-phosphor-accent text-sm font-medium">
                Background
              </label>
              <div className="flex gap-3 flex-wrap">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    aria-label={option.label}
                    className={`
                      w-10 h-10 rounded-lg cursor-pointer transition-all border
                      ${backgroundColor === option.value
                        ? 'border-2 border-phosphor-accent'
                        : 'border-phosphor-secondary/30 hover:-translate-y-0.5'
                      }
                      ${option.value === 'transparent' ? 'bg-checkered' : ''}
                      ${option.value === 'blurred' ? 'bg-blurred-swatches' : ''}
                    `}
                    onClick={() => setBackgroundColor(option.value)}
                    style={{
                      backgroundColor: option.value !== 'transparent' && option.value !== 'blurred' ? option.value : undefined,
                    }}
                    title={option.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-phosphor-secondary/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-phosphor-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-phosphor-secondary/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-phosphor-primary"></div>
                <span className="ms-3 text-sm font-medium text-phosphor-secondary">
                  Add watermark
                </span>
              </label>
            </div>

            <div className="grid grid-cols-[auto_1fr_1fr] gap-4 mt-2">
              <button
                className="px-6 py-3 rounded-lg cursor-pointer transition-all font-medium bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 hover:-translate-y-0.5 flex items-center gap-2"
                onClick={resetForm}
              >
                <X size={16} />
                Cancel
              </button>
              <button
                className="px-3 py-3 rounded-lg cursor-pointer transition-all font-medium bg-phosphor-primary/20 border border-phosphor-primary/30 text-phosphor-accent hover:bg-phosphor-primary/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                onClick={saveImage}
              >
                <Download size={16} />
                Save Image
              </button>
              <button
                className="px-3 py-3 rounded-lg cursor-pointer transition-all font-medium border border-phosphor-secondary/30 text-phosphor-secondary hover:border-phosphor-primary/50 hover:text-phosphor-accent hover:-translate-y-0.5 flex items-center justify-center gap-2"
                onClick={copyImage}
              >
                <Copy size={16} />
                Copy Image
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          .bg-checkered {
            position: relative;
            background-color: #ffffff;
          }

          .bg-checkered::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
              linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
              linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
            background-size: 10px 10px;
            background-position: 0 0, 0 5px, 5px -5px, -5px 0;
            border-radius: 0.5rem;
          }

          .bg-blurred-swatches {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
          }

          .bg-blurred-swatches::before {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 50%),
                        radial-gradient(circle at 70% 60%, rgba(255,255,255,0.2) 0%, transparent 50%);
            filter: blur(2px);
          }

          .bg-blurred-swatches::after {
            content: "🌄";
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            opacity: 0.7;
          }

          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          input[type="number"] {
            -moz-appearance: textfield;
            appearance: textfield;
          }
        `}</style>
      </div>
    </PageTransition>
  );
}