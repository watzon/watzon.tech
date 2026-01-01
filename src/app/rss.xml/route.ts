import { generateRSSFeed, getSiteURL } from '@/lib/rss';
import { getAllBlogPosts } from '@/lib/content';
import { PROJECTS_DATA } from '@/data/projects';
import { EXPERIMENTS } from '@/constants/experiments';
import type { RSSFeedItem } from '@/types';

/**
 * RSS Route Handler
 *
 * This route generates a combined RSS feed with blog posts, projects, and experiments.
 * It uses the 'force-static' runtime to ensure the feed is built statically on Vercel.
 *
 * RSS 2.0 specification: https://www.rssboard.org/rss-specification
 */
export const runtime = 'nodejs';
export const dynamic = 'force-static';

export async function GET() {
  const siteUrl = getSiteURL();
  const items: RSSFeedItem[] = [];

  // Add blog posts
  const blogPosts = await getAllBlogPosts();
  for (const post of blogPosts) {
    items.push({
      title: post.frontmatter.title,
      link: `${siteUrl}/blog/${post.slug}`,
      description: post.frontmatter.description,
      pubDate: post.frontmatter.date,
      category: post.frontmatter.tags,
    });
  }

  // Add projects
  for (const project of PROJECTS_DATA) {
    items.push({
      title: `Project: ${project.name}`,
      link: project.repoUrl || `${siteUrl}/projects#${project.id.toLowerCase()}`,
      description: project.longDescription || project.description,
      category: [...project.techStack, ...project.tags],
    });
  }

  // Add experiments
  for (const experiment of EXPERIMENTS) {
    items.push({
      title: `Experiment: ${experiment.name}`,
      link: `${siteUrl}${experiment.path}`,
      description: experiment.description,
      category: experiment.techStack,
      pubDate: experiment.date,
    });
  }

  // Sort by publication date (newest first), items without dates go last
  items.sort((a, b) => {
    if (!a.pubDate && !b.pubDate) return 0;
    if (!a.pubDate) return 1;
    if (!b.pubDate) return -1;
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  const feed = generateRSSFeed({
    title: 'watzon.tech - All Content',
    description: 'Personal portfolio and technical blog of watzon. Blog posts, projects, and experiments.',
    link: `${siteUrl}/rss.xml`,
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
