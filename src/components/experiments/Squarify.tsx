import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Download, Copy } from 'lucide-react';

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

export default function Squarify() {
  const [dragActive, setDragActive] = useState(false);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#000000');
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [squareSize, setSquareSize] = useState<Size>('original');
  const [customSize, setCustomSize] = useState<number>(512);
  const [showWatermark, setShowWatermark] = useState(true);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const getTargetSize = useCallback((image: HTMLImageElement, size: Size): number => {
    if (size === 'original') {
      return Math.max(image.width, image.height);
    }
    return size;
  }, []);

  const drawBlurredBackground = useCallback((ctx: CanvasRenderingContext2D, canvasSize: number, image: HTMLImageElement) => {
    if (!image) return;

    ctx.save();

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = canvasSize;
    tempCanvas.height = canvasSize;

    const scale = Math.max(canvasSize / image.width, canvasSize / image.height);
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const x = (canvasSize - scaledWidth) / 2;
    const y = (canvasSize - scaledHeight) / 2;

    tempCtx.drawImage(image, x, y, scaledWidth, scaledHeight);

    ctx.filter = 'blur(20px)';
    ctx.drawImage(tempCanvas, 0, 0);

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
    ctx.restore();
  }, [backgroundColor, showWatermark]);

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result || typeof e.target.result !== 'string') return;

      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setOriginalImage(img);
        setSquareSize('original');

        setTimeout(() => {
          const canvas = previewCanvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (canvas && ctx && img.complete) {
            const PREVIEW_SIZE = 596;
            canvas.width = PREVIEW_SIZE;
            canvas.height = PREVIEW_SIZE;

            ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

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
              addWatermark(ctx, PREVIEW_SIZE);
            } catch (error) {
              console.error(error);
            }
          }
        }, 50);
      };
      img.onerror = () => {
        console.error('Failed to load image');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [backgroundColor, getTargetSize, addWatermark, drawBlurredBackground]);

  const updatePreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    const image = originalImage;

    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PREVIEW_SIZE = 596;
    canvas.width = PREVIEW_SIZE;
    canvas.height = PREVIEW_SIZE;

    ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

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

    try {
      ctx.drawImage(image, x, y, width, height);
    } catch (error) {
       console.error(error);
    }

    addWatermark(ctx, PREVIEW_SIZE);
  }, [originalImage, backgroundColor, squareSize, getTargetSize, addWatermark, drawBlurredBackground]);

  useEffect(() => {
    if (originalImage && originalImage.complete) {
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
        canvas.toBlob(resolve as BlobCallback, 'image/png')
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
    <div className="squarify-wrapper">
      <div
        className={`
          border border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          min-h-[200px] flex items-center justify-center
          ${originalImage
            ? 'border-[var(--border)] bg-[var(--surface)] p-0 aspect-square overflow-hidden'
            : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]'
          }
          ${dragActive ? 'border-[var(--accent)] bg-[var(--bg)]' : ''}
        `}
        onClick={!originalImage ? handleDropzoneClick : undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Click to upload image"
      >
        {originalImage ? (
          <canvas
            ref={previewCanvasRef}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-[var(--text-muted)]">
            <Upload size={32} className="text-[var(--text-muted)]" />
            <div className="space-y-1">
              <p className="font-medium text-[var(--text)]">Drag and drop an image</p>
              <p className="text-sm">or click to upload</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload image"
            />
            <p className="text-xs text-[var(--text-muted)] opacity-60">
              or paste from clipboard (Ctrl+V)
            </p>
          </div>
        )}
      </div>

      {originalImage && (
        <div className="text-[var(--text-muted)] text-xs text-center mt-2 font-mono">
          Original: {originalSize.width} × {originalSize.height}
        </div>
      )}

      {originalImage && (
        <div className="squarify-controls">
          {/* Output Size */}
          <div className="control-group">
            <label className="control-label">Output Size</label>
            <div className="size-selector">
              {sizeOptions.map((option) => (
                <button
                  key={option.value}
                  className={`size-option ${squareSize === option.value ? 'active' : ''}`}
                  onClick={() => setSquareSize(option.value)}
                >
                  {option.label}
                </button>
              ))}
              <span className="size-divider" />
              <div className="custom-size">
                <input
                  type="number"
                  min="1"
                  step="1"
                  className={typeof squareSize === 'number' && !sizeOptions.find((opt) => opt.value === squareSize) ? 'active' : ''}
                  value={typeof squareSize === 'number' ? squareSize : customSize}
                  onChange={handleCustomSizeInput}
                  placeholder="Custom"
                />
                <span className="size-unit">px</span>
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="control-group">
            <label className="control-label">Background</label>
            <div className="color-swatches">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  aria-label={option.label}
                  className={`color-swatch ${backgroundColor === option.value ? 'active' : ''} ${option.value === 'transparent' ? 'bg-checkered' : ''} ${option.value === 'blurred' ? 'bg-blurred-swatches' : ''}`}
                  onClick={() => setBackgroundColor(option.value)}
                  style={{
                    backgroundColor: option.value !== 'transparent' && option.value !== 'blurred' ? option.value : undefined,
                  }}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          {/* Watermark Toggle */}
          <label className="toggle-label">
            <button
              role="switch"
              aria-checked={showWatermark}
              onClick={() => setShowWatermark(!showWatermark)}
              className={`toggle-switch ${showWatermark ? 'active' : ''}`}
            >
              <span className="toggle-thumb" />
            </button>
            <span className="toggle-text">Add watermark</span>
          </label>

          {/* Actions */}
          <div className="action-buttons">
            <button className="btn-reset" onClick={resetForm}>
              Reset
            </button>
            <button className="btn-secondary" onClick={copyImage}>
              <Copy size={16} />
              Copy
            </button>
            <button className="btn-primary" onClick={saveImage}>
              <Download size={16} />
              Save
            </button>
          </div>
        </div>
      )}

      <style>{`
        .squarify-wrapper {
          max-width: 600px;
          margin: 0 auto;
        }

        .squarify-controls {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .control-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        /* Size Selector */
        .size-selector {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 4px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          width: fit-content;
        }

        .size-option {
          padding: 0.5rem 0.875rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .size-option:hover {
          color: var(--text);
        }

        .size-option.active {
          background: var(--text);
          color: var(--bg);
        }

        .size-divider {
          width: 1px;
          height: 20px;
          background: var(--border);
          margin: 0 4px;
        }

        .custom-size {
          position: relative;
          display: flex;
          align-items: center;
        }

        .custom-size input {
          width: 70px;
          padding: 0.5rem 0.5rem;
          padding-right: 1.75rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: 6px;
          outline: none;
          transition: all 0.15s ease;
        }

        .custom-size input:focus,
        .custom-size input.active {
          color: var(--text);
          background: var(--bg);
        }

        .size-unit {
          position: absolute;
          right: 8px;
          font-size: 0.75rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        /* Color Swatches */
        .color-swatches {
          display: flex;
          gap: 0.625rem;
          flex-wrap: wrap;
        }

        .color-swatch {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }

        .color-swatch:hover {
          transform: scale(1.1);
        }

        .color-swatch.active {
          border-color: var(--text);
          box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--text);
        }

        .color-swatch[style*="background-color: #FFFFFF"],
        .color-swatch[style*="background-color: rgb(255, 255, 255)"] {
          box-shadow: inset 0 0 0 1px var(--border);
        }

        .color-swatch[style*="background-color: #FFFFFF"].active,
        .color-swatch[style*="background-color: rgb(255, 255, 255)"].active {
          box-shadow: inset 0 0 0 1px var(--border), 0 0 0 2px var(--bg), 0 0 0 4px var(--text);
        }

        /* Toggle */
        .toggle-label {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .toggle-switch {
          position: relative;
          width: 44px;
          height: 26px;
          background: var(--border);
          border: none;
          border-radius: 13px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .toggle-switch.active {
          background: var(--accent);
        }

        .toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .toggle-switch.active .toggle-thumb {
          transform: translateX(18px);
        }

        .toggle-text {
          font-size: 0.875rem;
          color: var(--text-muted);
          user-select: none;
          transition: color 0.15s ease;
        }

        .toggle-label:hover .toggle-text {
          color: var(--text);
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-top: 1.5rem;
          margin-top: 0.5rem;
          border-top: 1px solid var(--border);
        }

        .btn-reset {
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .btn-reset:hover {
          color: var(--text);
        }

        .btn-secondary {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-secondary:hover {
          border-color: var(--text-muted);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--bg);
          background: var(--text);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        /* Checkered & Blurred backgrounds */
        .bg-checkered {
          position: relative;
          background-color: #ffffff;
        }

        .bg-checkered::before {
          content: "";
          position: absolute;
          inset: 2px;
          background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
            linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
            linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
          background-size: 8px 8px;
          background-position: 0 0, 0 4px, 4px -4px, -4px 0;
          border-radius: 9999px;
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

        /* Hide number input spinners */
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
  );
}
