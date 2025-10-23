import PageTransition from '@/components/layout/PageTransition';
import { getAllBlogPosts } from '@/lib/content';
import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';
import { formatBlogDateWithRelative } from '@/lib/date-utils';

// This is a server component that fetches blog posts
export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-phosphor-accent">
            {`// BLOG`}
          </h1>
          <p className="text-phosphor-secondary opacity-80">
            Technical thoughts and engineering insights
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center space-y-2 max-w-4xl">
            <p className="text-sm text-phosphor-secondary opacity-60">
              No blog posts found. Check back soon for new content!
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-phosphor-primary/10 border border-phosphor-secondary/30 rounded p-6 hover:border-phosphor-secondary/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-phosphor-accent mb-2 group-hover:text-phosphor-primary transition-colors">
                      {post.frontmatter.title}
                    </h3>
                    {post.frontmatter.description && (
                      <p className="text-phosphor-text opacity-70 mb-4 line-clamp-2">
                        {post.frontmatter.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-phosphor-secondary opacity-60">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span
                          title={formatBlogDateWithRelative(post.frontmatter.date).title}
                          className="cursor-help"
                        >
                          {formatBlogDateWithRelative(post.frontmatter.date).formatted}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{post.frontmatter.readTime}</span>
                      </div>
                    </div>
                    {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <Tag size={14} className="text-phosphor-secondary" />
                        {post.frontmatter.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs border border-phosphor-primary/20 text-phosphor-accent"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-phosphor-secondary opacity-40 group-hover:opacity-80 transition-opacity ml-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}