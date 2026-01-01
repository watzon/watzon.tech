import { generateRSSFeed, getSiteURL } from '@/lib/rss';
import { getAllBlogPosts } from '@/lib/content';
import type { RSSFeedItem } from '@/types';

/**
 * Blog RSS Route Handler
 *
 * This route generates an RSS feed specifically for blog posts.
 * Uses 'force-static' runtime to ensure the feed is built statically on Vercel.
 *
 * RSS 2.0 specification: https://www.rssboard.org/rss-specification
 */
export const runtime = 'nodejs';
export const dynamic = 'force-static';

export async function GET() {
  const siteUrl = getSiteURL();
  const blogPosts = await getAllBlogPosts();

  const items: RSSFeedItem[] = blogPosts.map((post) => ({
    title: post.frontmatter.title,
    link: `${siteUrl}/blog/${post.slug}`,
    description: post.frontmatter.description,
    pubDate: post.frontmatter.date,
    guid: `${siteUrl}/blog/${post.slug}`,
    category: post.frontmatter.tags,
  }));

  const feed = generateRSSFeed({
    title: 'watzon.tech - Blog',
    description: 'Technical thoughts and engineering insights from watzon',
    link: `${siteUrl}/blog/rss.xml`,
    items,
    language: 'en-us',
  });

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
