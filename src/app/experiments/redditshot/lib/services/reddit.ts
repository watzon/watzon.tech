import type { RedditPost, RedditComment, RedditData, RedditPreview, RedditGalleryData, RedditMediaMetadata } from '../types/reddit';

// API base URL (our own proxy)
const API_BASE = '/api/reddit';

export async function fetchRedditData(url: string, urlType: 'post' | 'comment', commentDepth: number = Infinity): Promise<RedditData> {
  try {
    if (urlType === 'post') {
      return await fetchPostData(url);
    } else if (urlType === 'comment') {
      return await fetchCommentData(url, commentDepth);
    } else {
      throw new Error('Invalid URL type');
    }
  } catch (error) {
    throw new Error(`Failed to fetch Reddit data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function fetchPostData(url: string): Promise<RedditData> {
  // Fetch post data through our proxy API
  const response = await fetch(`${API_BASE}?url=${encodeURIComponent(`https://www.reddit.com${url}.json`)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Reddit post');
  }

  const data = await response.json();
  const post = transformRedditPost(data[0].data.children[0].data);

  return { post, comments: [] };
}

async function fetchCommentData(url: string, commentDepth: number = Infinity): Promise<RedditData> {
  // Extract comment ID from URL for comment URLs
  const commentMatch = url.match(/\/r\/([^\/]+)\/comments\/([^\/]+)\/comment\/([^\/]+)\/?$/);

  if (!commentMatch) {
    throw new Error(`Invalid comment URL format: ${url}`);
  }

  const [, subreddit, postId, commentId] = commentMatch;

  // Construct the API URL using Reddit's API format for specific comments
  // This API returns the comment with limited context (parent + 1 level up + replies)
  const apiUrl = `https://www.reddit.com/r/${subreddit}/comments/${postId}/comment/${commentId}.json`;

  // Fetch both post and comments data through our proxy API
  const response = await fetch(`${API_BASE}?url=${encodeURIComponent(apiUrl)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Reddit data');
  }

  const data = await response.json();

  // Handle different response structures
  let post, allComments;

  if (data.length === 1) {
    // Some comment URLs return only the comment structure
    // We need to fetch the post separately
    const postResponse = await fetch(`${API_BASE}?url=${encodeURIComponent(`https://www.reddit.com/r/${subreddit}/comments/${postId}.json`)}`);
    if (postResponse.ok) {
      const postData = await postResponse.json();
      post = transformRedditPost(postData[0].data.children[0].data);
    } else {
      throw new Error('Failed to fetch post data');
    }
    allComments = transformRedditComments(data[0].data.children);
  } else {
    // Standard response: [post_data, comments_data]
    post = transformRedditPost(data[0].data.children[0].data);
    allComments = transformRedditComments(data[1].data.children);
  }

  // Find the specific comment and build comment tree
  const { comments: commentTree, maxDepth } = buildCommentTree(allComments, commentId, commentDepth);

  return { post, comments: commentTree, maxThreadDepth: maxDepth };
}

export function buildCommentTree(comments: RedditComment[], targetCommentId: string, maxComments: number = Infinity): { comments: RedditComment[], maxDepth: number } {

  // Create a map of comment IDs to comments for easy lookup
  const commentMap = new Map<string, RedditComment>();
  const parentMap = new Map<string, RedditComment>(); // Track parent relationships

  // Build the comment map and parent map
  const buildCommentMaps = (comments: RedditComment[], parent: RedditComment | null = null) => {
    comments.forEach(comment => {
      commentMap.set(comment.id, comment);
      if (parent) {
        parentMap.set(comment.id, parent);
      }

      // Recursively process replies
      if (comment.replies && Array.isArray(comment.replies)) {
        buildCommentMaps(comment.replies, comment);
      }
    });
  };

  buildCommentMaps(comments);

  // Find the target comment
  const targetComment = commentMap.get(targetCommentId);
  if (!targetComment) {
    // If we can't find the target comment, return empty array
    return { comments: [], maxDepth: 0 };
  }

  // Build the path from target comment up to the root
  const threadPath: RedditComment[] = [];
  let currentComment = targetComment;

  while (currentComment) {
    threadPath.unshift(currentComment); // Add to beginning of path
    const parent = parentMap.get(currentComment.id);
    if (parent) {
      currentComment = parent;
    } else {
      // This is the root comment (has no parent in our structure)
      break;
    }
  }

  // Store the full thread depth (before limiting)
  const fullThreadDepth = threadPath.length;

  // Limit the thread path based on maxComments
  const limitedThreadPath = threadPath.slice(-maxComments);

  // Build the result tree starting from the root comment of this limited thread
  const result: RedditComment[] = [];
  const visited = new Set<string>();
  const targetCommentIds = new Set(limitedThreadPath.map(c => c.id));

  const buildTreeRecursive = (comment: RedditComment, depth: number): boolean => {
    if (visited.has(comment.id)) return false;
    visited.add(comment.id);

    // Only process this comment if it's in our target thread path
    if (targetCommentIds.has(comment.id)) {
      // Add this comment to result
      result.push({
        ...comment,
        depth: depth
      });

      // If this is the target comment, include all its replies
      if (comment.id === targetCommentId) {
        if (comment.replies && Array.isArray(comment.replies)) {
          for (const reply of comment.replies) {
            buildTreeRecursive(reply, depth + 1);
          }
        }
        return true; // Found the target, stop traversing this branch
      }

      // Otherwise, continue looking for the target in the replies
      if (comment.replies && Array.isArray(comment.replies)) {
        for (const reply of comment.replies) {
          const foundTarget = buildTreeRecursive(reply, depth + 1);
          if (foundTarget) {
            return true; // Found target in this branch, don't check other siblings
          }
        }
      }
    }

    return false; // Target not found in this branch
  };

  // Start building from the root comment of the limited thread
  const rootComment = limitedThreadPath[0];
  buildTreeRecursive(rootComment, 0);

  return { comments: result, maxDepth: fullThreadDepth };
}

function transformRedditPost(data: Record<string, unknown>): RedditPost {
  return {
    id: String(data.id),
    title: String(data.title),
    author: String(data.author),
    subreddit: String(data.subreddit),
    score: Number(data.score) || 0,
    ratio: Number(data.upvote_ratio) || 0.5,
    created_utc: Number(data.created_utc) || 0,
    permalink: String(data.permalink),
    url: String(data.url),
    selftext: data.selftext ? String(data.selftext) : undefined,
    over_18: Boolean(data.over_18),
    post_hint: data.post_hint ? String(data.post_hint) : undefined,
    preview: data.preview as RedditPreview | undefined,
    is_gallery: Boolean(data.is_gallery),
    gallery_data: data.gallery_data as RedditGalleryData | undefined,
    media_metadata: data.media_metadata as Record<string, RedditMediaMetadata> | undefined,
    url_overridden_by_dest: data.url_overridden_by_dest ? String(data.url_overridden_by_dest) : undefined
  };
}

export function transformRedditComments(comments: Array<{ kind: string; data: Record<string, unknown> }>): RedditComment[] {
  return comments
    .filter((comment) => comment.kind === 't1' && !comment.data.stickied)
    .map((comment) => transformRedditComment(comment.data));
}

function transformRedditComment(data: Record<string, unknown>): RedditComment {
  return {
    id: String(data.id),
    author: String(data.author),
    body: String(data.body),
    score: Number(data.score) || 0,
    replies: data.replies && typeof data.replies === 'object' && 'data' in data.replies &&
              data.replies.data && typeof data.replies.data === 'object' && 'children' in data.replies.data
              ? transformRedditComments(data.replies.data.children as Array<{ kind: string; data: Record<string, unknown> }>)
              : [],
    depth: Number(data.depth) || 0,
    created_utc: Number(data.created_utc) || 0,
    permalink: String(data.permalink)
  };
}