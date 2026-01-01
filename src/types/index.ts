export type SectionType = 'HOME' | 'PROJECTS' | 'BLOG' | 'RESUME';

export interface Skill {
  name: string;
  level: number;
}

export interface Project {
  id: string;
  name: string;
  desc: string;
  stack: string[];
  status: 'LIVE' | 'BETA' | 'ARCHIVED' | 'DEV';
}

export interface BlogPost {
  date: string;
  title: string;
  readTime: string;
}

export interface BlogPostFrontmatter {
  title: string;
  description?: string;
  date: string;
  // Read time is now calculated during build
  readTime?: string;
  tags?: string[];
  published?: boolean;
}

export interface ProjectFrontmatter {
  id: string;
  name: string;
  description: string;
  status: 'LIVE' | 'BETA' | 'ARCHIVED' | 'DEV';
  repoUrl?: string;
  techStack: string[];
  tags?: string[];
  featured?: boolean;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  path: string;
  techStack: string[];
  featured?: boolean;
  date?: string;
}

export interface Experience {
  role: string;
  company: string;
  year: string;
  description?: string;
  achievements?: string[];
}


export type ContentType = 'blog' | 'project';

export interface RSSFeedItem {
  title: string;
  link: string;
  description?: string;
  content?: string;
  pubDate?: Date | string;
  guid?: string;
  author?: string;
  category?: string[];
}

export interface RSSFeedOptions {
  title: string;
  description: string;
  link: string;
  items: RSSFeedItem[];
  language?: string;
  lastBuildDate?: Date | string;
}