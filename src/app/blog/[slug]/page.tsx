import PageTransition from '@/components/layout/PageTransition';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { formatBlogDateWithRelative } from '@/lib/date-utils';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Server component to render individual blog post
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // In Next.js 15 App Router, params must be awaited when accessing properties
  const { slug } = await Promise.resolve(params);

  try {
    const { content, frontmatter } = await getBlogPostBySlug(slug);

    return (
      <PageTransition>
        <article className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-phosphor-secondary hover:text-phosphor-accent transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-phosphor-primary">
                {frontmatter.title}
              </h1>

              {frontmatter.description && (
                <p className="text-xl text-phosphor-secondary opacity-80">
                  {frontmatter.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-phosphor-secondary opacity-60">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span
                    title={formatBlogDateWithRelative(frontmatter.date).title}
                    className="cursor-help"
                  >
                    {formatBlogDateWithRelative(frontmatter.date).formatted}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{frontmatter.readTime}</span>
                </div>
              </div>

              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm border border-phosphor-primary/20 text-phosphor-accent"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            {content}
          </div>

          {/* Footer */}
          <div className="border-t border-phosphor-primary/20 pt-8">
            <div className="text-center space-y-4">
              <p className="text-phosphor-secondary opacity-80">
                Thanks for reading! Found this article helpful?
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/blog"
                  className="px-4 py-2 border border-phosphor-primary/50 hover:bg-phosphor-primary/10 transition-colors text-sm font-bold"
                >
                  Read More Posts
                </Link>
              </div>
            </div>
          </div>
        </article>
      </PageTransition>
    );
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    notFound();
  }
}