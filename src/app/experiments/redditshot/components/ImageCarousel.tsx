'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { RedditGalleryData, RedditMediaMetadata } from '../lib/types/reddit';
import { getProxiedImageUrl } from '../lib/utils/imageProxy';

interface ImageCarouselProps {
  galleryData: RedditGalleryData;
  mediaMetadata: Record<string, RedditMediaMetadata>;
  darkMode?: boolean;
  onImageSelect?: (imageUrl: string) => void;
}

export default function ImageCarousel({
  galleryData,
  mediaMetadata,
  darkMode = false,
  onImageSelect
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const images = useMemo(() => galleryData?.items || [], [galleryData?.items]);
  const currentImage = images[currentIndex];
  const metadata = mediaMetadata[currentImage?.media_id];

  // Preload all images when component mounts
  useEffect(() => {
    const urls = images.map((image) => {
      const imgMetadata = mediaMetadata[image.media_id];
      const url = imgMetadata?.s?.u || imgMetadata?.p?.[0]?.u;
      return url ? getProxiedImageUrl(url) : null;
    }).filter(Boolean) as string[];

    // Preload all images
    urls.forEach((url) => {
      if (url && !loadedImages.has(url)) {
        const img = document.createElement('img');
        img.onload = () => {
          setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(url);
            return newSet;
          });
        };
        img.src = url;
      }
    });
  }, [images, mediaMetadata, loadedImages]);

  // Return early if no data
  if (images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const selectImage = () => {
    if (metadata && onImageSelect) {
      // Use the highest resolution image (s field) and proxy it
      const imageUrl = metadata.s.u;
      const proxiedUrl = getProxiedImageUrl(imageUrl);
      if (proxiedUrl) {
        onImageSelect(proxiedUrl);
      }
    }
  };

  const getBestImageUrl = () => {
    if (!metadata) return null;

    // Try to use the highest resolution (s field), fallback to first preview (p[0])
    // and proxy the URL through our image API
    const originalUrl = metadata.s?.u || metadata.p?.[0]?.u || null;
    return originalUrl ? getProxiedImageUrl(originalUrl) : null;
  };

  const bestImageUrl = getBestImageUrl();

  return (
    <div className="relative">
      {/* Main Image */}
      <div
        className="relative rounded-lg overflow-hidden cursor-pointer transition-all"
        style={{
          backgroundColor: darkMode ? '#1f1f1f' : '#f3f4f6'
        }}
        onClick={selectImage}
      >
        {bestImageUrl ? (
          <>
            {!loadedImages.has(bestImageUrl) && (
              <div
                className="w-full h-64 flex items-center justify-center animate-pulse"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#e5e7eb'
                }}
              >
                <span
                  style={{
                    color: darkMode ? '#9ca3af' : '#6b7280'
                  }}
                >
                  Loading image...
                </span>
              </div>
            )}
            <Image
              src={bestImageUrl}
              alt={`Gallery image ${currentIndex + 1}`}
              width={metadata?.s?.x || 800}
              height={metadata?.s?.y || 600}
              className="w-full h-auto object-contain"
              priority={currentIndex === 0}
              unoptimized={true}
              style={{ display: loadedImages.has(bestImageUrl) ? 'block' : 'none' }}
            />
          </>
        ) : (
          <div
            className="w-full h-64 flex items-center justify-center"
            style={{
              backgroundColor: darkMode ? '#374151' : '#e5e7eb'
            }}
          >
            <span
              style={{
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              Image unavailable
            </span>
          </div>
        )}

        {/* Gallery Overlay */}
        <div className="absolute bottom-2 right-2 px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Navigation Controls */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors"
            style={{
              backgroundColor: darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
              color: darkMode ? '#ffffff' : '#111827'
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors"
            style={{
              backgroundColor: darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
              color: darkMode ? '#ffffff' : '#111827'
            }}
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const thumbMetadata = mediaMetadata[image.media_id];
            const originalThumbnailUrl = thumbMetadata?.p?.[1]?.u || thumbMetadata?.p?.[0]?.u;
            const fullSizeUrl = thumbMetadata?.s?.u || thumbMetadata?.p?.[0]?.u;
            const thumbnailUrl = originalThumbnailUrl ? getProxiedImageUrl(originalThumbnailUrl) : null;
            const fullImageUrl = fullSizeUrl ? getProxiedImageUrl(fullSizeUrl) : null;
            const isLoaded = fullImageUrl ? loadedImages.has(fullImageUrl) : false;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => goToImage(index)}
                className="flex-shrink-0 rounded overflow-hidden transition-all border-2"
                style={{
                  borderColor: index === currentIndex
                    ? (darkMode ? '#10b981' : '#059669')
                    : (darkMode ? '#4b5563' : '#d1d5db')
                }}
                aria-label={`Go to image ${index + 1}`}
              >
                {thumbnailUrl ? (
                  <div className="relative">
                    {!isLoaded && (
                      <div
                        className="absolute inset-0 animate-pulse"
                        style={{
                          backgroundColor: darkMode ? '#374151' : '#e5e7eb'
                        }}
                      />
                    )}
                    <Image
                      src={thumbnailUrl}
                      alt={`Thumbnail ${index + 1}`}
                      width={thumbMetadata?.p?.[1]?.x || 60}
                      height={thumbMetadata?.p?.[1]?.y || 60}
                      className="w-12 h-12 object-cover"
                      unoptimized={true}
                    />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#e5e7eb'
                    }}
                  >
                    <span
                      style={{
                        color: darkMode ? '#9ca3af' : '#6b7280'
                      }}
                    >
                      {index + 1}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

          </div>
  );
}