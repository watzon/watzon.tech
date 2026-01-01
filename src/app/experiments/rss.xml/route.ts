import { generateRSSFeed, getSiteURL } from '@/lib/rss';
import { EXPERIMENTS } from '@/constants/experiments';
import type { RSSFeedItem } from '@/types';

/**
 * Experiments RSS Route Handler
 *
 * This route generates an RSS feed specifically for experiments.
 * Uses 'force-static' runtime to ensure the feed is built statically on Vercel.
 *
 * RSS 2.0 specification: https://www.rssboard.org/rss-specification
 */
export const runtime = 'nodejs';
export const dynamic = 'force-static';

export async function GET() {
  const siteUrl = getSiteURL();

  const items: RSSFeedItem[] = EXPERIMENTS.map((experiment) => ({
    title: experiment.name,
    link: `${siteUrl}${experiment.path}`,
    description: experiment.description,
    guid: `${siteUrl}${experiment.path}`,
    category: experiment.techStack,
    pubDate: experiment.date,
  }));

  const feed = generateRSSFeed({
    title: 'watzon.tech - Experiments',
    description: 'Experimental projects and prototypes by watzon',
    link: `${siteUrl}/experiments/rss.xml`,
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
