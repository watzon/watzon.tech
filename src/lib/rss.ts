import type { RSSFeedOptions } from '@/types';

const SITE_URL = 'https://watzon.tech';

/**
 * Format a Date object to RFC 822 format for RSS feeds
 */
export function formatRSSDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toUTCString();
}

/**
 * Escape XML special characters to prevent invalid XML
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Strip HTML tags and convert markdown-like content to plain text for RSS descriptions
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();
}

/**
 * Truncate text to a maximum length, preserving word boundaries
 */
function truncateText(text: string, maxLength: number = 500): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Generate RSS 2.0 XML feed
 */
export function generateRSSFeed(options: RSSFeedOptions): string {
  const {
    title,
    description,
    link,
    items,
    language = 'en-us',
    lastBuildDate = new Date(),
  } = options;

  const itemsXml = items
    .map((item) => {
      const itemParts: string[] = [];

      itemParts.push(`        <title>${escapeXml(item.title)}</title>`);

      if (item.link) {
        itemParts.push(`        <link>${escapeXml(item.link)}</link>`);
      }

      if (item.description) {
        const plainDescription = stripHtml(item.description);
        itemParts.push(
          `        <description>${escapeXml(truncateText(plainDescription, 500))}</description>`
        );
      }

      if (item.content) {
        const htmlContent = item.content;
        itemParts.push(`        <content:encoded><![CDATA[${htmlContent}]]></content:encoded>`);
      }

      if (item.pubDate) {
        itemParts.push(`        <pubDate>${formatRSSDate(item.pubDate)}</pubDate>`);
      }

      if (item.guid) {
        const isPermalink = item.link === item.guid;
        itemParts.push(
          `        <guid${isPermalink ? ' isPermaLink="true"' : ''}>${escapeXml(item.guid)}</guid>`
        );
      } else if (item.link) {
        itemParts.push(`        <guid isPermaLink="true">${escapeXml(item.link)}</guid>`);
      }

      if (item.author) {
        itemParts.push(`        <author>${escapeXml(item.author)}</author>`);
      }

      if (item.category && item.category.length > 0) {
        item.category.forEach((cat) => {
          itemParts.push(`        <category>${escapeXml(cat)}</category>`);
        });
      }

      return `    <item>
${itemParts.join('\n')}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(link)}</link>
    <atom:link href="${escapeXml(link)}" rel="self" type="application/rss+xml" />
    <language>${language}</language>
    <lastBuildDate>${formatRSSDate(lastBuildDate)}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;
}

/**
 * Get site URL for RSS feed generation
 */
export function getSiteURL(): string {
  // In production, use the actual domain
  // In development, you might want to use a different URL
  return process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
}
