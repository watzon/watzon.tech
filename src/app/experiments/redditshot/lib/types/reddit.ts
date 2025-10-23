export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  ratio: number;
  created_utc: number;
  permalink: string;
  url: string;
  selftext?: string;
  over_18: boolean;
  post_hint?: string;
  preview?: RedditPreview;
  is_gallery?: boolean;
  gallery_data?: RedditGalleryData;
  media_metadata?: Record<string, RedditMediaMetadata>;
  url_overridden_by_dest?: string;
}

export interface RedditComment {
  id: string;
  author: string;
  body: string;
  score: number;
  replies?: RedditComment[];
  depth: number;
  created_utc: number;
  permalink: string;
}

// Raw Reddit API comment data structure
export interface RedditApiComment {
  kind: string;
  data: {
    id: string;
    author: string;
    body: string;
    score: number;
    replies?: {
      data: {
        children: RedditApiComment[];
      };
    } | null;
    depth: number;
    created_utc: number;
    permalink: string;
    stickied: boolean;
    [key: string]: unknown;
  };
}

export interface RedditPreview {
  images: RedditImage[];
}

export interface RedditImage {
  source: RedditImageSource;
  resolutions: RedditImageResolution[];
  id: string;
  variants?: {
    gif?: RedditImageVariant;
    mp4?: RedditImageVariant;
    obfuscated?: RedditImageVariant;
    nsfw?: RedditImageVariant;
  };
}

export interface RedditImageVariant {
  source: RedditImageSource;
  resolutions: RedditImageResolution[];
}

export interface RedditImageSource {
  u: string; // URL
  x: number; // Width
  y: number; // Height
}

export interface RedditImageResolution {
  u: string; // URL
  x: number; // Width
  y: number; // Height
}

export interface RedditMediaMetadata {
  status: string;
  e: string;
  m: string;
  o: RedditImageResolution[];
  p: RedditImageResolution[];
  s: RedditImageSource;
  id: string;
}

export interface RedditGalleryItem {
  media_id: string;
  id: number;
}

export interface RedditGalleryData {
  items: RedditGalleryItem[];
}

export interface RedditData {
  post: RedditPost;
  comments: RedditComment[];
  maxThreadDepth?: number;
}