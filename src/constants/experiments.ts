import type { Experiment } from '@/types';

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'EXP-001',
    name: 'Squarify',
    description: 'Convert any image to a perfect square with custom backgrounds and watermarking.',
    path: '/experiments/squarify',
    techStack: ['Canvas API', 'Image Processing', 'React', 'TypeScript'],
    featured: true,
  },
  {
    id: 'EXP-002',
    name: 'RedditShot',
    description: 'Generate beautiful, shareable screenshots of Reddit posts and comments.',
    path: '/experiments/redditshot',
    techStack: ['Reddit API', 'Canvas API', 'React', 'TypeScript', 'html2canvas'],
    featured: true,
  },
];