/**
 * Date formatting utilities for blog posts
 * Provides consistent date formatting across the entire application
 */

export interface DateFormatOptions {
  format?: 'full' | 'medium' | 'short' | 'relative';
  includeTime?: boolean;
  locale?: string;
}

/**
 * Format a date string into a human-readable format
 * @param dateString - ISO date string or Date object
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  options: DateFormatOptions = {}
): string {
  const {
    format = 'medium',
    includeTime = false,
    locale = 'en-US'
  } = options;

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  switch (format) {
    case 'full':
      return date.toLocaleString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: includeTime ? '2-digit' : undefined,
        minute: includeTime ? '2-digit' : undefined,
        timeZoneName: includeTime ? 'short' : undefined
      });

    case 'medium':
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

    case 'short':
      return date.toLocaleDateString(locale, {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric'
      });

    case 'relative':
      return getRelativeTime(date, locale);

    default:
      return date.toLocaleDateString(locale);
  }
}

/**
 * Get relative time string (e.g., "2 days ago", "3 weeks ago")
 * @param date - Date object
 * @param locale - Locale string
 * @returns Relative time string
 */
function getRelativeTime(date: Date, locale: string = 'en-US'): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Handle future dates
  if (diffInSeconds < 0) {
    const futureDiff = Math.abs(diffInSeconds);
    if (futureDiff < 60) return 'in a moment';
    if (futureDiff < 3600) return `in ${Math.floor(futureDiff / 60)} minutes`;
    if (futureDiff < 86400) return `in ${Math.floor(futureDiff / 3600)} hours`;
    if (futureDiff < 2592000) return `in ${Math.floor(futureDiff / 86400)} days`;
    return formatDate(date, { format: 'medium', locale });
  }

  // Past dates
  if (diffInSeconds < 10) return 'just now';
  if (diffInSeconds < 60) return 'a minute ago';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return days === 1 ? 'yesterday' : `${days} days ago`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return months === 1 ? 'a month ago' : `${months} months ago`;
  }

  const years = Math.floor(diffInSeconds / 31536000);
  return years === 1 ? 'a year ago' : `${years} years ago`;
}

/**
 * Format date for blog post display (medium format by default)
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatBlogDate(dateString: string): string {
  return formatDate(dateString, { format: 'medium' });
}

/**
 * Format date for blog post with relative time
 * @param dateString - ISO date string
 * @returns Object with both formatted and relative dates
 */
export function formatBlogDateWithRelative(dateString: string): {
  formatted: string;
  relative: string;
  title: string;
} {
  return {
    formatted: formatBlogDate(dateString),
    relative: formatDate(dateString, { format: 'relative' }),
    title: formatDate(dateString, { format: 'full', includeTime: true })
  };
}

/**
 * Parse date string safely
 * @param dateString - ISO date string
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Sort blog posts by date (newest first)
 * @param posts - Array of posts with date field
 * @returns Sorted array
 */
export function sortPostsByDate<T extends { frontmatter: { date: string } }>(
  posts: T[]
): T[] {
  return [...posts].sort((a, b) => {
    const dateA = parseDate(a.frontmatter.date);
    const dateB = parseDate(b.frontmatter.date);

    if (!dateA || !dateB) return 0;

    return dateB.getTime() - dateA.getTime();
  });
}