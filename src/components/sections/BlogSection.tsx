'use client';

import { motion } from 'framer-motion';
import { BookType, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import type { BlogPostFrontmatter } from '@/types';
import { formatBlogDateWithRelative } from '@/lib/date-utils';

// This will be a server component that fetches blog posts
interface BlogSectionProps {
  posts: Array<{
    slug: string;
    frontmatter: BlogPostFrontmatter;
  }>;
}

export default function BlogSection({ posts }: BlogSectionProps) {
  return (
    <div>
       <SectionHeader title="DEV_LOGS" icon={<BookType />} />
       <div className="space-y-1">
          <div className="flex px-4 py-2 text-xs opacity-50 border-b border-phosphor-secondary/50">
              <div className="w-32">DATE</div>
              <div className="flex-1">TITLE</div>
              <div className="w-24 text-right">TIME</div>
              <div className="w-8"></div>
          </div>
          {posts.map((post, i) => (
            <motion.div
                key={post.slug}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col md:flex-row md:items-center px-4 py-4 border-b border-phosphor-secondary/20 hover:bg-phosphor-primary/10 transition-colors group"
            >
                <div className="w-32 text-sm opacity-60 font-bold">
                  <span
                    title={formatBlogDateWithRelative(post.frontmatter.date).title}
                    className="cursor-help"
                  >
                    {formatBlogDateWithRelative(post.frontmatter.date).formatted}
                  </span>
                </div>
                <div className="flex-1 text-lg font-bold group-hover:text-phosphor-accent">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.frontmatter.title}
                    </Link>
                </div>
                <div className="w-24 text-right text-xs opacity-50 mt-2 md:mt-0">[{post.frontmatter.readTime}]</div>
                <div className="w-8 flex justify-end mt-2 md:mt-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4 text-phosphor-accent" />
                  </Link>
                </div>
            </motion.div>
          ))}
       </div>
       <div className="mt-8 text-center">
         <Link href="/blog">
           <button className="px-6 py-2 border border-phosphor-primary/50 hover:bg-phosphor-primary hover:text-black transition-colors text-sm font-bold">
             VIEW ALL POSTS
           </button>
         </Link>
       </div>
    </div>
  );
}