'use client';

import type { RedditComment } from '../../lib/types/reddit';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { parseRedditMarkdown, truncateText } from '../../lib/utils/markdown';

interface CommentProps {
  comment: RedditComment;
  darkMode?: boolean;
  voteState?: 'up' | 'down' | null;
  onVote?: (vote: 'up' | 'down' | null) => void;
  saved?: boolean;
  onSave?: () => void;
  showCommenterUsernames?: boolean;
  truncateCommentContent?: boolean;
  truncationLength?: number;
}

export default function RedditComment({
  comment,
  darkMode = false,
  voteState,
  onVote,
  showCommenterUsernames = true,
  truncateCommentContent = false,
  truncationLength = 300
}: CommentProps) {
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

  // Process comment body to handle markdown formatting
  const processCommentBody = (body: string, darkMode: boolean = false): string => {
    return parseRedditMarkdown(body, darkMode);
  };

  return (
    <div
      className="border-l-2 border-r border-b p-4"
      style={{
        backgroundColor: darkMode ? '#1f1f1f' : '#ffffff',
        borderTopWidth: comment.depth === 0 ? '1px' : '0px',
        borderTopStyle: 'solid',
        borderTopColor: darkMode ? '#374151' : '#e5e7eb',
        borderRightColor: darkMode ? '#374151' : '#e5e7eb',
        borderBottomColor: darkMode ? '#374151' : '#e5e7eb',
        borderLeftColor: comment.depth > 0 ? (darkMode ? '#4b5563' : '#d1d5db') : (darkMode ? '#374151' : '#e5e7eb'),
        marginLeft: comment.depth > 0 ? `${comment.depth * 16}px` : '0'
      }}
    >
      {/* Comment Header */}
      <div className="flex items-center mb-2">
        {/* Author Avatar */}
        {showCommenterUsernames && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
            style={{
              backgroundColor: darkMode ? '#4b5563' : '#d1d5db'
            }}
          >
            <span
              className="text-xs font-medium"
              style={{
                color: darkMode ? '#d1d5db' : '#374151'
              }}
            >
              {comment.author[0].toUpperCase()}
            </span>
          </div>
        )}

        {/* Comment Meta */}
        <div className="flex items-center text-sm">
          {showCommenterUsernames && (
            <>
              <span
                className="font-medium"
                style={{
                  color: darkMode ? '#d1d5db' : '#111827'
                }}
              >
                {comment.author}
              </span>
              <span style={{ color: '#6b7280' }} className="mx-1">•</span>
            </>
          )}
          <span
            style={{
              color: darkMode ? '#9ca3af' : '#4b5563'
            }}
          >
            {formatTimeAgo(comment.created_utc)}
          </span>
        </div>
      </div>

      {/* Comment Body */}
      <div
        className="mb-3 text-sm prose prose-sm max-w-none"
        style={{
          color: darkMode ? '#d1d5db' : '#374151'
        }}
        dangerouslySetInnerHTML={{
          __html: processCommentBody(
            truncateCommentContent
              ? truncateText(comment.body, truncationLength)
              : comment.body,
            darkMode
          )
        }}
      />

      {/* Comment Actions */}
      <div className="flex items-center space-x-4">
        {/* Vote Section */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onVote?.(voteState === 'up' ? null : 'up')}
            className="p-0.5 rounded transition-colors"
            style={{
              color: voteState === 'up' ? '#f97316' : darkMode ? '#9ca3af' : '#6b7280'
            }}
          >
            <ArrowBigUp size={16} className={voteState === 'up' ? 'fill-current' : ''} />
          </button>

          <span
            className="font-medium text-xs min-w-[2rem] text-center"
            style={{
              color: voteState === 'up' ? '#f97316' : voteState === 'down' ? '#2563eb' : darkMode ? '#d1d5db' : '#374151'
            }}
          >
            {formatScore(comment.score)}
          </span>

          <button
            onClick={() => onVote?.(voteState === 'down' ? null : 'down')}
            className="p-0.5 rounded transition-colors"
            style={{
              color: voteState === 'down' ? '#2563eb' : darkMode ? '#9ca3af' : '#6b7280'
            }}
          >
            <ArrowBigDown size={16} className={voteState === 'down' ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Other Actions */}
        <button
          className="text-xs transition-colors"
          style={{
            color: darkMode ? '#9ca3af' : '#6b7280'
          }}
        >
          Reply
        </button>

        <button
          className="text-xs transition-colors"
          style={{
            color: darkMode ? '#9ca3af' : '#6b7280'
          }}
        >
          Share
        </button>

        <button
          className="text-xs transition-colors"
          style={{
            color: darkMode ? '#9ca3af' : '#6b7280'
          }}
        >
          Report
        </button>
      </div>
    </div>
  );
}