'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import Post from './components/reddit/Post';
import Comment from './components/reddit/Comment';
import { fetchRedditData, buildCommentTree, transformRedditComments } from './lib/services/reddit';
import type { RedditData, RedditApiComment } from './lib/types/reddit';
import html2canvas from 'html2canvas-pro';
import { Download, Copy, Loader2 } from 'lucide-react';

export default function RedditShotPage() {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null);
  const [redditData, setRedditData] = useState<RedditData | null>(null);
  const [rawRedditData, setRawRedditData] = useState<RedditData | null>(null);
  const [originalComments, setOriginalComments] = useState<RedditApiComment[] | null>(null); // Store raw Reddit API comment data
  const [targetCommentId, setTargetCommentId] = useState<string | null>(null); // Store the target comment ID from URL
  const [darkMode, setDarkMode] = useState(false);
  const [maxComments] = useState(5);
  const [commentDepth, setCommentDepth] = useState(1);
  const [urlType, setUrlType] = useState<'post' | 'comment' | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [maxCommentDepth, setMaxCommentDepth] = useState(1);

  // Display options
  const [showPosterUsername, setShowPosterUsername] = useState(true);
  const [showCommenterUsernames, setShowCommenterUsernames] = useState(true);
  const [truncatePostContent, setTruncatePostContent] = useState(false);
  const [truncateCommentContent, setTruncateCommentContent] = useState(false);
  const [truncationLength, setTruncationLength] = useState(300);

  const [voteStates, setVoteStates] = useState<Record<string, 'up' | 'down' | null>>({});
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});
  const previewElementRef = useRef<HTMLDivElement>(null);

  // Memoized Reddit data that recalculates when comment depth changes
  const memoizedRedditData = useMemo(() => {
    if (!rawRedditData || urlType !== 'comment') {
      return rawRedditData;
    }

    // For comment URLs, we need to recalculate the comment tree based on the current comment depth
    if (rawRedditData.comments.length > 0 && originalComments && targetCommentId) {
      // Transform the original comment data
      const allComments = transformRedditComments(originalComments);

      // Rebuild the comment tree with the new depth using the proper buildCommentTree function
      const { comments: newCommentTree } = buildCommentTree(allComments, targetCommentId, commentDepth);

      return {
        ...rawRedditData,
        comments: newCommentTree
      };
    }

    return rawRedditData;
  }, [rawRedditData, urlType, commentDepth, originalComments, targetCommentId]);

  // Enhanced URL validation and parsing
  const parseAndValidateRedditUrl = (url: string): { isValid: boolean; type: 'post' | 'comment' | null; cleanUrl: string } => {
    try {
      const parsed = new URL(url);

      // Check if it's a reddit.com URL
      if (!parsed.hostname.match(/^(?:www\.)?reddit\.com$/)) {
        return { isValid: false, type: null, cleanUrl: url };
      }

      // Remove query parameters and hash, then remove trailing slashes
      const path = parsed.pathname.replace(/\/+$/, '');

      // Check for comment URLs first (more specific)
      // Format: /r/subreddit/comments/post_id/comment/comment_id
      const commentMatch = path.match(/\/r\/([^\/]+)\/comments\/([^\/]+)\/comment\/([^\/]+)\/?$/);
      if (commentMatch) {
        return { isValid: true, type: 'comment', cleanUrl: path };
      }

      // Check for post URLs (more specific, ensure it has at least 3 path parts after /comments/)
      // Format: /r/subreddit/comments/post_id/title
      const postMatch = path.match(/\/r\/([^\/]+)\/comments\/([^\/]+)\/([^\/]+)\/?$/);
      if (postMatch && !path.includes('/comment/')) {
        console.log('Matched post URL:', postMatch);
        return { isValid: true, type: 'post', cleanUrl: path };
      }

      return { isValid: false, type: null, cleanUrl: url };
    } catch {
      return { isValid: false, type: null, cleanUrl: url };
    }
  };

  // Validate URL on change
  useEffect(() => {
    const result = parseAndValidateRedditUrl(url);
    setIsValidUrl(result.isValid);
    setUrlType(result.type);
    setError(null);
  }, [url]);

  const fetchRedditContent = async () => {
    if (!isValidUrl || !urlType) return;

    setIsLoading(true);
    setError(null);

    try {
      const urlResult = parseAndValidateRedditUrl(url);

      if (urlType === 'comment') {
        // For comment URLs, we need to fetch and store the raw Reddit API data
        const commentMatch = urlResult.cleanUrl.match(/\/r\/([^\/]+)\/comments\/([^\/]+)\/comment\/([^\/]+)\/?$/);
        if (commentMatch) {
          const [, subreddit, postId, commentId] = commentMatch;
          const apiUrl = `https://www.reddit.com/r/${subreddit}/comments/${postId}/comment/${commentId}.json`;

          // Store the target comment ID for later use in memoization
          setTargetCommentId(commentId);

          // Fetch the raw Reddit API data
          const response = await fetch(`/api/reddit?url=${encodeURIComponent(apiUrl)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch Reddit data');
          }

          const rawData = await response.json();

          // Store the raw comment data for later processing
          if (rawData.length === 1) {
            setOriginalComments(rawData[0].data.children);
          } else {
            setOriginalComments(rawData[1]?.data.children || []);
          }
        }
      }

      const data = await fetchRedditData(urlResult.cleanUrl, urlType, Infinity); // Fetch full thread first
      setRawRedditData(data);

      // Set max comment depth and default to showing all comments
      if (urlType === 'comment' && data.maxThreadDepth) {
        setMaxCommentDepth(data.maxThreadDepth);
        setCommentDepth(data.maxThreadDepth);
      }

      await updateDisplay();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setRawRedditData(null);
      setRedditData(null);
      setOriginalComments(null);
      setTargetCommentId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDisplay = useCallback(async () => {
    if (!rawRedditData) return;

    // Use the memoized data instead of refetching
    const processedData = memoizedRedditData;

    // Mark that we've generated at least once
    if (!hasGenerated && processedData) {
      setHasGenerated(true);
    }

    setRedditData(processedData);

    // Wait for the next tick to ensure components are rendered
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate screenshot
    if (previewElementRef.current) {
      try {
        const canvas = await html2canvas(previewElementRef.current, {
          backgroundColor: darkMode ? '#1a1a1b' : '#ffffff',
          allowTaint: true,
          useCORS: true,
          logging: false,
          scale: 1
        });

        setPreviewCanvas(canvas);
      } catch (err) {
        console.error('Failed to generate screenshot:', err);
        setError('Failed to generate screenshot');
      }
    }
  }, [memoizedRedditData, hasGenerated, darkMode, rawRedditData]);

  // Regenerate screenshot when display options change
  useEffect(() => {
    if (rawRedditData) {
      updateDisplay();
    }
  }, [darkMode, voteStates, savedStates, maxComments, commentDepth, rawRedditData, updateDisplay]);

  const updateVoteState = (id: string, vote: 'up' | 'down' | null) => {
    setVoteStates(prev => ({
      ...prev,
      [id]: vote
    }));
  };

  const toggleSavedState = (id: string) => {
    setSavedStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const saveImage = () => {
    if (!previewCanvas) return;

    const link = document.createElement('a');
    link.download = 'reddit-screenshot.png';
    link.href = previewCanvas.toDataURL('image/png');
    link.click();
  };

  const copyImage = async () => {
    if (!previewCanvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        previewCanvas.toBlob((b) => {
          if (b) resolve(b);
        });
      });

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
    } catch (err) {
      console.error('Failed to copy image:', err);
      setError('Failed to copy image to clipboard');
    }
  };

  return (
    <PageTransition>
      <div className={`container mx-auto px-4 my-8 ${!redditData ? 'max-w-3xl' : 'max-w-[1400px]'}`}>
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-phosphor-accent">
            {`// RedditShot`}
          </h1>
          <p className="text-phosphor-secondary opacity-80">
            Create beautiful screenshots of Reddit posts and comments.
          </p>
          <p className="text-phosphor-secondary opacity-60 text-sm">
            Just paste a Reddit URL and we&apos;ll do the rest
          </p>
        </div>

        <div className={`flex flex-col ${redditData ? 'lg:flex-row' : ''} gap-8`}>
          {/* Controls Section */}
          <div className={`flex flex-col gap-6 ${redditData ? 'lg:w-[400px] lg:flex-none lg:sticky lg:top-8 lg:h-fit' : ''}`}>
            {/* URL Input */}
            <div className="space-y-2">
              <label htmlFor="reddit-url" className="text-phosphor-primary text-sm font-medium">
                Reddit URL
              </label>
              <input
                id="reddit-url"
                type="url"
                className="w-full px-4 py-3 border border-phosphor-primary/30 rounded-lg bg-phosphor-primary/5 text-phosphor-primary placeholder-phosphor-secondary/50 transition-all hover:border-phosphor-primary/50 focus:outline-none focus:border-phosphor-primary"
                placeholder="https://reddit.com/r/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {urlType && (
                <p className="text-phosphor-secondary text-xs">
                  Detected: {urlType === 'post' ? 'Reddit Post' : 'Reddit Comment'}
                </p>
              )}
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="dark-mode" className="text-phosphor-primary text-sm font-medium">
                Dark Mode
              </label>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-phosphor-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-phosphor-primary focus:ring-offset-2"
                aria-pressed={darkMode}
              >
                <span className="sr-only">Toggle dark mode</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Comment Depth Slider - only show for comment URLs after first generation */}
            {urlType === 'comment' && hasGenerated && maxCommentDepth > 1 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="comment-depth" className="text-phosphor-primary text-sm font-medium">
                    Comment Context
                  </label>
                  <span className="text-phosphor-accent text-sm font-medium">
                    {commentDepth} {commentDepth === 1 ? 'comment' : 'comments'}
                  </span>
                </div>
                <input
                  type="range"
                  id="comment-depth"
                  min="1"
                  max={maxCommentDepth}
                  value={commentDepth}
                  onChange={(e) => setCommentDepth(Number(e.target.value))}
                  className="w-full h-2 bg-phosphor-primary/20 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, var(--phosphor-primary) 0%, var(--phosphor-primary) ${((commentDepth - 1) / (maxCommentDepth - 1)) * 100}%, var(--phosphor-primary/20) ${((commentDepth - 1) / (maxCommentDepth - 1)) * 100}%, var(--phosphor-primary/20) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-phosphor-secondary">
                  <span>1</span>
                  {maxCommentDepth >= 5 && <span>5</span>}
                  <span>{maxCommentDepth}</span>
                </div>
              </div>
            )}

            {/* Content Display Options - only show after first generation */}
            {hasGenerated && (
              <div className="space-y-3">
                <h3 className="text-phosphor-primary text-sm font-medium">Content Display</h3>

              {/* Show Poster Username */}
              <div className="flex items-center justify-between">
                <label htmlFor="show-poster-username" className="text-phosphor-primary text-sm">
                  Show Poster Username
                </label>
                <button
                  type="button"
                  onClick={() => setShowPosterUsername(!showPosterUsername)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-phosphor-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-phosphor-primary focus:ring-offset-2"
                  aria-pressed={showPosterUsername}
                >
                  <span className="sr-only">Toggle poster username</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showPosterUsername ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Show Commenter Usernames */}
              <div className="flex items-center justify-between">
                <label htmlFor="show-commenter-usernames" className="text-phosphor-primary text-sm">
                  Show Commenter Usernames
                </label>
                <button
                  type="button"
                  onClick={() => setShowCommenterUsernames(!showCommenterUsernames)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-phosphor-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-phosphor-primary focus:ring-offset-2"
                  aria-pressed={showCommenterUsernames}
                >
                  <span className="sr-only">Toggle commenter usernames</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showCommenterUsernames ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Truncate Post Content */}
              <div className="flex items-center justify-between">
                <label htmlFor="truncate-post-content" className="text-phosphor-primary text-sm">
                  Truncate Post Content
                </label>
                <button
                  type="button"
                  onClick={() => setTruncatePostContent(!truncatePostContent)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-phosphor-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-phosphor-primary focus:ring-offset-2"
                  aria-pressed={truncatePostContent}
                >
                  <span className="sr-only">Toggle post content truncation</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      truncatePostContent ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Truncate Comment Content */}
              <div className="flex items-center justify-between">
                <label htmlFor="truncate-comment-content" className="text-phosphor-primary text-sm">
                  Truncate Comment Content
                </label>
                <button
                  type="button"
                  onClick={() => setTruncateCommentContent(!truncateCommentContent)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-phosphor-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-phosphor-primary focus:ring-offset-2"
                  aria-pressed={truncateCommentContent}
                >
                  <span className="sr-only">Toggle comment content truncation</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      truncateCommentContent ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Truncation Length */}
              {(truncatePostContent || truncateCommentContent) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="truncation-length" className="text-phosphor-primary text-sm">
                      Truncation Length
                    </label>
                    <span className="text-phosphor-accent text-sm font-medium">
                      {truncationLength} characters
                    </span>
                  </div>
                  <input
                    type="range"
                    id="truncation-length"
                    min="50"
                    max="1000"
                    step="50"
                    value={truncationLength}
                    onChange={(e) => setTruncationLength(Number(e.target.value))}
                    className="w-full h-2 bg-phosphor-primary/20 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--phosphor-primary) 0%, var(--phosphor-primary) ${((truncationLength - 50) / 950) * 100}%, var(--phosphor-primary/20) ${((truncationLength - 50) / 950) * 100}%, var(--phosphor-primary/20) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-phosphor-secondary">
                    <span>50</span>
                    <span>500</span>
                    <span>1000</span>
                  </div>
                </div>
              )}
              </div>
            )}

            {/* Generate Button */}
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 ${
                !isValidUrl || isLoading
                  ? 'bg-phosphor-primary/20 text-phosphor-secondary/50 cursor-not-allowed'
                  : 'bg-phosphor-primary text-black hover:bg-phosphor-accent cursor-pointer'
              }`}
              disabled={!isValidUrl || isLoading}
              onClick={fetchRedditContent}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Generating...
                </span>
              ) : (
                'Generate Screenshot'
              )}
            </button>

            {previewCanvas && (
              /* Action Buttons */
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="px-4 py-3 rounded-lg font-medium bg-phosphor-primary text-black hover:bg-phosphor-accent transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  onClick={saveImage}
                >
                  <Download size={16} />
                  Save
                </button>
                <button
                  className="px-4 py-3 rounded-lg font-medium border border-phosphor-primary/30 text-phosphor-primary hover:bg-phosphor-primary/10 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  onClick={copyImage}
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {redditData && (
            <div className="lg:w-1/2 lg:min-w-[600px]">
              <div
                ref={previewElementRef}
                data-screenshot-container="true"
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 overflow-hidden w-full lg:sticky lg:top-8"
                style={{
                  backgroundColor: darkMode ? '#1a1a1b' : '#ffffff',
                  borderColor: darkMode ? '#4B5563' : '#D1D5DB'
                }}
              >
                <Post
                  post={redditData.post}
                  darkMode={darkMode}
                  voteState={voteStates[redditData.post.id]}
                  onVote={(vote) => updateVoteState(redditData.post.id, vote)}
                  saved={savedStates[redditData.post.id]}
                  onSave={() => toggleSavedState(redditData.post.id)}
                  hasComments={redditData.comments.length > 0}
                  showPosterUsername={showPosterUsername}
                  truncatePostContent={truncatePostContent}
                  truncationLength={truncationLength}
                />
                {redditData.comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    darkMode={darkMode}
                    voteState={voteStates[comment.id]}
                    onVote={(vote) => updateVoteState(comment.id, vote)}
                    saved={savedStates[comment.id]}
                    onSave={() => toggleSavedState(comment.id)}
                    showCommenterUsernames={showCommenterUsernames}
                    truncateCommentContent={truncateCommentContent}
                    truncationLength={truncationLength}
                  />
                ))}
              </div>

              {/* Preview Canvas (hidden, used for screenshot generation) */}
              {previewCanvas && (
                <div className="mt-4 text-center">
                  <p className="text-phosphor-secondary text-sm">
                    Screenshot ready! Save or copy to clipboard.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}