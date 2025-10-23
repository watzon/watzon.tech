'use client';

import { useRef } from 'react';
import Image from 'next/image';

interface VideoPlayerProps {
  thumbnailUrl: string | null;
  videoUrl: string | null;
  posterUrl: string | null;
  width?: number;
  height?: number;
  darkMode?: boolean;
  isGif?: boolean; // Indicate if this content was originally a GIF
  hasMp4Variant?: boolean; // Indicate if an MP4 variant was available (for controls)
}

export default function VideoPlayer({
  thumbnailUrl,
  videoUrl,
  posterUrl,
  width = 800,
  height = 600,
  darkMode = false,
  isGif = false,
  hasMp4Variant = true
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasMedia = thumbnailUrl || videoUrl;

  // For GIFs, we want autoplay and loop. For regular videos, we want browser controls.
  const isLoopedMedia = isGif;
  const showBrowserControls = hasMp4Variant && !isGif;

  // Return early if no media
  if (!hasMedia) {
    return (
      <div
        className="w-full h-64 flex items-center justify-center"
        style={{
           backgroundColor: darkMode ? '#374151' : '#e5e7eb',
         }}
       >
         <span
           style={{
             color: darkMode ? '#9ca3af' : '#6b7280',
           }}
         >
           Media unavailable
         </span>
       </div>
     );
   }
 
   return (
     <div
       className="relative rounded-lg overflow-hidden"
       style={{
         backgroundColor: darkMode ? '#1f1f1f' : '#f3f4f6',
       }}
     >
       {videoUrl ? (
         <>
           <video
             ref={videoRef}
             className="w-full h-auto object-contain"
             width={width}
             height={height}
             poster={posterUrl || thumbnailUrl || undefined}
             src={videoUrl}
             muted={isLoopedMedia} // Mute GIFs by default
             autoPlay={isLoopedMedia} // Autoplay GIFs
             loop={isLoopedMedia} // Loop GIFs
             playsInline={true}
             controls={showBrowserControls} // Show browser controls for non-GIFs
             preload="metadata"
             style={{ maxHeight: '512px' }}
           >
             Your browser does not support the video tag.
           </video>
 
           <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
             {isGif ? 'GIF' : 'Video'}
           </div>
         </>
       ) : (
         /* Fallback to static image */
         <div>
           <Image
             src={thumbnailUrl || ''}
             alt="Media preview"
             className="w-full h-auto object-contain"
             style={{ maxHeight: '512px' }}
             width={width}
             height={height}
             unoptimized={true}
             priority={false}
           />
           <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
             {isGif ? 'GIF' : 'Image'}
           </div>
         </div>
       )}
     </div>
   );
}