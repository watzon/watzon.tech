import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(true),
    image: z.string().optional(),
  }),
});

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/experiments' }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    featured: z.boolean().default(false),
    date: z.coerce.date(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string(),
    tech: z.array(z.string()),
    image: z.string(),
    number: z.string(),
    color: z.string(),
    featured: z.boolean().default(false),
    stars: z.string().optional(),
  }),
});

export const collections = { blog, experiments, projects };
