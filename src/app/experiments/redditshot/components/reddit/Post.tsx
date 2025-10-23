'use client';

import type { RedditPost } from '../../lib/types/reddit';
import { ArrowBigUp, ArrowBigDown, Bookmark, MessageSquare, Share } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import ImageCarousel from '../ImageCarousel';
import VideoPlayer from '../VideoPlayer';
import { getProxiedImageUrl } from '../../lib/utils/imageProxy';
import { parseRedditMarkdown, truncateText } from '../../lib/utils/markdown';

interface PostProps {
  post: RedditPost;
  darkMode?: boolean;
  voteState?: 'up' | 'down' | null;
  onVote?: (vote: 'up' | 'down' | null) => void;
  saved?: boolean;
  onSave?: () => void;
  hasComments?: boolean;
  showPosterUsername?: boolean;
  truncatePostContent?: boolean;
  truncationLength?: number;
}

export default function RedditPost({
  post,
  darkMode = false,
  voteState,
  onVote,
  saved,
  onSave,
  hasComments = false,
  showPosterUsername = true,
  truncatePostContent = false,
  truncationLength = 300
}: PostProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  
  const formatScore = (score: number): string => {
    if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
    return score.toString();
  };

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    const intervals = [
      { label: 'y', seconds: 31536000 },
      { label: 'mo', seconds: 2592000 },
      { label: 'd', seconds: 86400 },
      { label: 'h', seconds: 3600 },
      { label: 'm', seconds: 60 },
      { label: 's', seconds: 1 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) return `${count}${interval.label}`;
    }
    return 'just now';
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const getDisplayImageUrl = () => {
    // If user has selected an image from carousel, use that (already proxied)
    if (selectedImageUrl) {
      return selectedImageUrl;
    }

    // For gallery posts without selection, use the first image and proxy it
    if (post.is_gallery && post.gallery_data && post.media_metadata) {
      const firstItem = post.gallery_data.items[0];
      const metadata = post.media_metadata[firstItem?.media_id];
      const originalUrl = metadata?.s?.u || metadata?.p?.[0]?.u || null;
      const proxiedUrl = getProxiedImageUrl(originalUrl);
      return proxiedUrl;
    }

    // For regular image posts, use preview and proxy it
    if (post.preview?.images?.[0]) {

      // Try multiple approaches to get the URL
      let originalUrl = post.preview.images[0].source?.u;

      // Fallback to post URL if preview source URL is undefined
      if (!originalUrl && post.url) {
        originalUrl = post.url;
      }

      // Fallback to GIF variant if available
      if (!originalUrl && post.preview.images[0].variants?.gif?.source?.u) {
        originalUrl = post.preview.images[0].variants.gif.source.u;
      }

      const proxiedUrl = getProxiedImageUrl(originalUrl);
      return proxiedUrl;
    }

    return null;
  };

  const getVideoUrl = () => {

    // Always prefer MP4 variant for all video content (including GIFs)
    if (post.preview?.images?.[0]?.variants?.mp4) {
      const mp4Variant = post.preview.images[0].variants.mp4;

      // Try different property names for the URL
      const mp4Url = mp4Variant.source?.u;

      if (mp4Url) {
        const proxiedUrl = getProxiedImageUrl(mp4Url);
        return proxiedUrl;
      }
    }

    // Fall back to GIF variant only if MP4 is not available
    if (post.preview?.images?.[0]?.variants?.gif) {
      const gifVariant = post.preview.images[0].variants.gif;
      const gifUrl = gifVariant.source?.u;

      if (gifUrl) {
        const proxiedUrl = getProxiedImageUrl(gifUrl);
        return proxiedUrl;
      }
    }

    // Fall back to direct GIF URL (less ideal, but functional)
    if (post.url?.toLowerCase().endsWith('.gif')) {
      const proxiedUrl = getProxiedImageUrl(post.url);
      return proxiedUrl;
    }

    return null;
  };

  const isGifOrVideo = () => {
    const hasMp4 = post.preview?.images?.[0]?.variants?.mp4 !== undefined;
    const hasGifVariant = post.preview?.images?.[0]?.variants?.gif !== undefined;
    const isGifByUrl = post.url?.toLowerCase().endsWith('.gif') || false;

    // Always use video player for GIFs (prefer MP4 over GIF)
    return hasMp4 || hasGifVariant || isGifByUrl;
  };

  const isOriginallyGif = () => {
    const hasGifVariant = post.preview?.images?.[0]?.variants?.gif !== undefined;
    const isGifByUrl = post.url?.toLowerCase().endsWith('.gif') || false;
    return hasGifVariant || isGifByUrl;
  };

  return (
    <div
      className={`border ${hasComments ? 'rounded-t-lg' : 'rounded-lg'}`}
      style={{
        backgroundColor: darkMode ? '#1f1f1f' : '#ffffff',
        borderColor: hasComments
          ? (darkMode ? '#374151' : '#e5e7eb')
          : (darkMode ? '#374151' : '#e5e7eb'),
        borderBottomWidth: hasComments ? '0px' : '1px',
        borderBottomStyle: hasComments ? 'none' : 'solid'
      }}
    >
      {/* Post Content */}
      <div className="p-4">
        {/* Post Header */}
        <div className="flex items-center mb-3">
          {/* Subreddit Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
            style={{
              backgroundColor: darkMode ? '#2563eb' : '#3b82f6'
            }}
          >
            <span className="text-white text-xs font-bold">r/{post.subreddit.slice(0, 1).toUpperCase()}</span>
          </div>

          {/* Post Meta */}
          <div className="flex items-center text-sm">
            <span
              className="font-medium"
              style={{
                color: darkMode ? '#d1d5db' : '#111827'
              }}
            >
              r/{post.subreddit}
            </span>
            {showPosterUsername && (
              <>
                <span style={{ color: darkMode ? '#6b7280' : '#6b7280' }} className="mx-1">•</span>
                <span
                  style={{
                    color: darkMode ? '#9ca3af' : '#4b5563'
                  }}
                >
                  Posted by u/{post.author}
                </span>
              </>
            )}
            <span style={{ color: darkMode ? '#6b7280' : '#6b7280' }} className="mx-1">•</span>
            <span
              style={{
                color: darkMode ? '#9ca3af' : '#4b5563'
              }}
            >
              {formatTimeAgo(post.created_utc)}
            </span>
          </div>

          {/* Join Button */}
          <button
            className="ml-auto px-3 py-1 text-sm font-medium rounded-full text-white transition-colors"
            style={{
              backgroundColor: darkMode ? '#2563eb' : '#3b82f6'
            }}
          >
            Join
          </button>
        </div>

        {/* Post Title */}
        <h2
          className="text-lg font-medium mb-3"
          style={{
            color: darkMode ? '#f3f4f6' : '#111827'
          }}
        >
          {post.title}
        </h2>

        {/* Post Body/Self Text */}
        {post.selftext && (
          <div
            className="mb-3 text-sm prose prose-sm max-w-none"
            style={{
              color: darkMode ? '#d1d5db' : '#374151'
            }}
            dangerouslySetInnerHTML={{
              __html: parseRedditMarkdown(
                truncatePostContent
                  ? truncateText(post.selftext, truncationLength)
                  : post.selftext,
                darkMode
              )
            }}
          />
        )}

        {/* Gallery Carousel */}
        {post.is_gallery && post.gallery_data && post.media_metadata && (
          <div className="mb-3">
            <ImageCarousel
              galleryData={post.gallery_data}
              mediaMetadata={post.media_metadata}
              darkMode={darkMode}
              onImageSelect={handleImageSelect}
            />
          </div>
        )}

        {/* Single Media (non-gallery) */}
        {!post.is_gallery && getDisplayImageUrl() && (
          <div className="mb-3 rounded-lg overflow-hidden">
            {(() => {
              const shouldShowVideo = isGifOrVideo();
              const displayImageUrl = getDisplayImageUrl();
              const videoUrl = getVideoUrl();

              // Check if MP4 variant was available (for control visibility)
              const hasMp4Variant = post.preview?.images?.[0]?.variants?.mp4 !== undefined;

              return shouldShowVideo ? (
                <VideoPlayer
                  thumbnailUrl={displayImageUrl}
                  videoUrl={videoUrl}
                  posterUrl={displayImageUrl}
                  width={post.preview?.images?.[0]?.source?.x || 800}
                  height={post.preview?.images?.[0]?.source?.y || 600}
                  darkMode={darkMode}
                  isGif={isOriginallyGif()}
                  hasMp4Variant={hasMp4Variant}
                />
              ) : (
                <>
                  <Image
                    src={displayImageUrl!}
                    alt="Post image"
                    width={post.preview?.images?.[0]?.source?.x || 800}
                    height={post.preview?.images?.[0]?.source?.y || 600}
                    className="w-full h-auto object-contain"
                    onLoad={handleImageLoad}
                    style={{ display: isImageLoaded ? 'block' : 'none' }}
                    priority={false}
                    unoptimized={true}
                  />
                  {!isImageLoaded && (
                    <div
                      className="w-full h-64 animate-pulse"
                      style={{
                        backgroundColor: darkMode ? '#374151' : '#e5e7eb'
                      }}
                    />
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between">
          {/* Vote Section */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onVote?.(voteState === 'up' ? null : 'up')}
              className="p-1 rounded transition-colors"
              style={{
                color: voteState === 'up' ? '#f97316' : darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              <ArrowBigUp size={20} className={voteState === 'up' ? 'fill-current' : ''} />
            </button>

            <span
              className="font-medium text-sm min-w-[3rem] text-center"
              style={{
                color: voteState === 'up' ? '#f97316' : voteState === 'down' ? '#2563eb' : darkMode ? '#d1d5db' : '#374151'
              }}
            >
              {formatScore(post.score)}
            </span>

            <button
              onClick={() => onVote?.(voteState === 'down' ? null : 'down')}
              className="p-1 rounded transition-colors"
              style={{
                color: voteState === 'down' ? '#2563eb' : darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              <ArrowBigDown size={20} className={voteState === 'down' ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Other Actions */}
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center space-x-1 text-sm transition-colors"
              style={{
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              <MessageSquare size={18} />
              <span>{Math.floor(post.score * 0.1)} Comments</span>
            </button>

            <button
              className="flex items-center space-x-1 text-sm transition-colors"
              style={{
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              <Share size={18} />
              <span>Share</span>
            </button>

            <button
              onClick={onSave}
              className="flex items-center space-x-1 text-sm transition-colors"
              style={{
                color: saved ? '#eab308' : darkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              <Bookmark size={18} className={saved ? 'fill-current' : ''} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}