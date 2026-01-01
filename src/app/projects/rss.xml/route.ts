import { generateRSSFeed, getSiteURL } from '@/lib/rss';
import { PROJECTS_DATA } from '@/data/projects';
import type { RSSFeedItem } from '@/types';

/**
 * Projects RSS Route Handler
 *
 * This route generates an RSS feed specifically for projects.
 * Uses 'force-static' runtime to ensure the feed is built statically on Vercel.
 *
 * RSS 2.0 specification: https://www.rssboard.org/rss-specification
 */
export const runtime = 'nodejs';
export const dynamic = 'force-static';

export async function GET() {
  const siteUrl = getSiteURL();

  const items: RSSFeedItem[] = PROJECTS_DATA.map((project) => ({
    title: project.name,
    link: project.repoUrl || `${siteUrl}/projects#${project.id.toLowerCase()}`,
    description: project.longDescription || project.description,
    guid: project.repoUrl || `${siteUrl}/projects#${project.id.toLowerCase()}`,
    category: [...project.techStack, ...project.tags],
  }));

  const feed = generateRSSFeed({
    title: 'watzon.tech - Projects',
    description: 'Open source projects and development work by watzon',
    link: `${siteUrl}/projects/rss.xml`,
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
