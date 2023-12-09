import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

const projects = defineCollection({
	schema: z.object({
		name: z.string(),
		description: z.string(),
		url: z.string(),
		pubDate: z.coerce.date(),
		heroImage: z.string().optional(),
		tags: z.array(z.string()).optional(),
		featured: z.boolean().optional(),
		linkOnly: z.boolean().optional(),
	}),
});

export const collections = { posts, projects };
