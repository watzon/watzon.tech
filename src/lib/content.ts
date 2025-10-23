import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/ui/MDXComponents';
import { calculateReadTime } from '@/lib/read-time';
import { sortPostsByDate } from '@/lib/date-utils';
import type { BlogPostFrontmatter, ProjectFrontmatter } from '@/types';

const contentDirectory = path.join(process.cwd(), 'src/content');

export async function readFileContent(filePath: string): Promise<string> {
  try {
    const fullPath = path.join(contentDirectory, filePath);
    const fileContents = await fs.promises.readFile(fullPath, 'utf8');
    return fileContents;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

export async function getAllContentSlugs(type: 'blog' | 'projects'): Promise<string[]> {
  try {
    const postsDirectory = path.join(contentDirectory, type);

    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = await fs.promises.readdir(postsDirectory);

    return fileNames
      .filter(name => {
        const ext = path.extname(name);
        return ext === '.md' || ext === '.mdx';
      })
      .map(name => {
        const ext = path.extname(name);
        return name.replace(ext, '');
      });
  } catch (error) {
    console.error(`Error reading ${type} directory:`, error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const possibleExtensions = ['.mdx', '.md'];
    let content = '';
    let filePath = '';

    for (const ext of possibleExtensions) {
      const possiblePath = path.join('blog', `${slug}${ext}`);
      try {
        content = await readFileContent(possiblePath);
        filePath = possiblePath;
        break;
      } catch {
        // Try next extension
      }
    }

    if (!content) {
      throw new Error(`Blog post not found: ${slug}`);
    }

  const { content: mdxContent, frontmatter } = await compileMDX<BlogPostFrontmatter>({
      source: content,
      options: {
        parseFrontmatter: true,
      },
      components: mdxComponents,
    });

  // Add calculated read time to frontmatter for blog posts only
  const enhancedFrontmatter = {
    ...frontmatter,
  };

  // Only add read time for blog posts
  if (frontmatter.readTime === undefined) {
    enhancedFrontmatter.readTime = calculateReadTime(content).formatted;
  }

    return {
      content: mdxContent,
      frontmatter: enhancedFrontmatter,
      slug,
      filePath,
    };
  } catch (error) {
    console.error(`Error processing blog post ${slug}:`, error);
    throw error;
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const possibleExtensions = ['.mdx', '.md'];
    let content = '';
    let filePath = '';

    for (const ext of possibleExtensions) {
      const possiblePath = path.join('projects', `${slug}${ext}`);
      try {
        content = await readFileContent(possiblePath);
        filePath = possiblePath;
        break;
      } catch {
        // Try next extension
      }
    }

    if (!content) {
      throw new Error(`Project not found: ${slug}`);
    }

    const { content: mdxContent, frontmatter } = await compileMDX<ProjectFrontmatter>({
      source: content,
      options: {
        parseFrontmatter: true,
      },
      components: mdxComponents,
    });

    return {
      content: mdxContent,
      frontmatter,
      slug,
      filePath,
    };
  } catch (error) {
    console.error(`Error processing project ${slug}:`, error);
    throw error;
  }
}

export async function getAllBlogPosts() {
  const slugs = await getAllContentSlugs('blog');
  const posts = [];

  for (const slug of slugs) {
    try {
      const { frontmatter } = await getBlogPostBySlug(slug);

      // Only include published posts
      if (frontmatter.published === false) {
        continue;
      }

      posts.push({
        slug,
        frontmatter,
      });
    } catch (error) {
      console.error(`Error loading blog post ${slug}:`, error);
    }
  }

  // Sort by date (newest first) using improved date sorting
  return sortPostsByDate(posts);
}

export async function getAllProjects() {
  const slugs = await getAllContentSlugs('projects');
  const projects = [];

  for (const slug of slugs) {
    try {
      const { frontmatter } = await getProjectBySlug(slug);

      projects.push({
        slug,
        frontmatter,
      });
    } catch (error) {
      console.error(`Error loading project ${slug}:`, error);
    }
  }

  // Sort by featured status first, then by name
  return projects.sort((a, b) => {
    if (a.frontmatter.featured && !b.frontmatter.featured) return -1;
    if (!a.frontmatter.featured && b.frontmatter.featured) return 1;
    return a.frontmatter.name.localeCompare(b.frontmatter.name);
  });
}