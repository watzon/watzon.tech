'use client';

import { motion } from 'framer-motion';
import { Cpu, ExternalLink, Star, Github } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import { PROJECTS_DATA } from '@/data/projects';
import type { ProjectFrontmatter } from '@/types';

// This will be a server component that fetches projects
interface ProjectsSectionProps {
  projects: Array<{
    slug: string;
    frontmatter: ProjectFrontmatter;
  }>;
}

// Status color function removed since we no longer display status badges

const getProjectStats = (projectId: string) => {
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  return project?.githubStats;
};

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  // Show only featured projects on homepage, limit to 3
  const featuredProjects = projects
    .filter(p => p.frontmatter.featured !== false)
    .slice(0, 3);

  return (
    <div>
      <SectionHeader title="ACTIVE_PROJECTS" icon={<Cpu />} />
      <div className="grid grid-cols-1 gap-6">
        {featuredProjects.map((project, i) => {
          const stats = getProjectStats(project.frontmatter.id);
          return (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative border border-phosphor-primary/20 bg-neutral-900/50 p-6 hover:bg-phosphor-primary/10 transition-colors"
          >
             {project.frontmatter.featured && (
               <div className="absolute top-0 right-0 px-2 py-1 text-xs font-bold bg-phosphor-primary/20 text-phosphor-accent border-l border-b border-phosphor-primary/30 flex items-center gap-1">
                 <Star size={12} />
                 FEATURED
               </div>
             )}

             {/* GitHub Stats */}
             {stats && (
               <div className="flex items-center gap-4 text-xs opacity-60 mb-2">
                 <div className="flex items-center gap-1">
                   <Github size={12} />
                   <span>{stats.language}</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <Star size={12} />
                   <span>{stats.stars}</span>
                 </div>
                 {stats.forks > 0 && (
                   <div className="flex items-center gap-1">
                     <ExternalLink size={12} />
                     <span>{stats.forks}</span>
                   </div>
                 )}
               </div>
             )}

             <h3 className="text-2xl font-bold mb-3 group-hover:text-phosphor-accent">
               <Link
                 href={project.frontmatter.repoUrl || `/projects/${project.slug}`}
                 className="hover:underline"
                 target={project.frontmatter.repoUrl ? "_blank" : "_self"}
               >
                 {project.frontmatter.name}
               </Link>
             </h3>
             <p className="opacity-80 mb-6 max-w-2xl">{project.frontmatter.description}</p>
             <div className="flex flex-wrap gap-2 mb-6">
               {project.frontmatter.techStack.map(tech => (
                 <span key={tech} className="px-2 py-1 text-xs border border-phosphor-primary/30 text-phosphor-accent">
                   {tech}
                 </span>
               ))}
             </div>
             <div className="flex justify-end">
               <Link
                 href={project.frontmatter.repoUrl || `/projects/${project.slug}`}
                 className="flex items-center gap-2 text-sm font-bold hover:text-phosphor-accent"
                 target={project.frontmatter.repoUrl ? "_blank" : "_self"}
               >
                 {project.frontmatter.repoUrl ? 'VIEW_REPO' : 'LEARN_MORE'}
                 <ExternalLink size={16} />
               </Link>
             </div>
          </motion.div>
          );
        })}
      </div>
      <div className="mt-8 text-center">
        <Link href="/projects">
          <button className="px-6 py-2 border border-phosphor-primary/50 hover:bg-phosphor-primary hover:text-black transition-colors text-sm font-bold">
            VIEW ALL PROJECTS
          </button>
        </Link>
      </div>
    </div>
  );
}