/**
 * Convert Reddit image URLs to use our image proxy to avoid CORS issues
 */

export function getProxiedImageUrl(originalUrl: string | undefined | null): string | null {
  // Handle undefined/null URLs
  if (!originalUrl) {
    return null;
  }

  // If the URL is already proxied, return it as-is
  if (originalUrl.includes('/api/images?url=')) {
    return originalUrl;
  }

  // Fix HTML-encoded URLs (common when URLs come from JSON responses)
  const cleanUrl = originalUrl
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");

  // Otherwise, proxy it through our image API route
  const proxiedUrl = `/api/images?url=${encodeURIComponent(cleanUrl)}`;
  return proxiedUrl;
}

/**
 * Convert an array of Reddit image URLs to use our image proxy
 */
export function getProxiedImageUrls(urls: (string | undefined | null)[]): (string | null)[] {
  return urls.map(url => getProxiedImageUrl(url));
}