import PageTransition from '@/components/layout/PageTransition';
import { getAllProjects } from '@/lib/content';
import Link from 'next/link';
import { ExternalLink, Star, Github } from 'lucide-react';

// This is a server component that fetches projects
export default async function ProjectsPage() {
  const projects = await getAllProjects();

  // Status color function removed since we no longer display status badges

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-phosphor-accent">
            {'// PROJECTS'}
          </h1>
          <p className="text-phosphor-secondary opacity-80">
            A selection of open-source contributions and personal projects
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center space-y-2 max-w-4xl">
            <p className="text-sm text-phosphor-secondary opacity-60">
              No projects found. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="bg-phosphor-primary/20 border border-phosphor-secondary/50 rounded p-6 hover:border-phosphor-secondary/50 transition-all duration-300 group relative"
              >
                {project.frontmatter.featured && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 text-xs font-bold bg-phosphor-primary/20 text-phosphor-accent border border-phosphor-primary/30 rounded">
                    <Star size={12} />
                    FEATURED
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-phosphor-accent mb-2 group-hover:text-phosphor-primary transition-colors">
                    {project.frontmatter.repoUrl ? (
                      <Link
                        href={project.frontmatter.repoUrl}
                        className="hover:underline"
                        target="_blank"
                      >
                        {project.frontmatter.name}
                      </Link>
                    ) : (
                      project.frontmatter.name
                    )}
                  </h3>
                  <p className="text-phosphor-secondary opacity-80 text-sm">
                    {project.frontmatter.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.frontmatter.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-phosphor-primary/30 text-phosphor-primary rounded border border-phosphor-secondary/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

  
                <div className="flex justify-between items-center">
                  <div className="text-xs opacity-40">
                    ID: {project.frontmatter.id}
                  </div>
                  {project.frontmatter.repoUrl ? (
                    <Link
                      href={project.frontmatter.repoUrl}
                      className="flex items-center gap-2 text-sm font-bold hover:text-phosphor-accent"
                      target="_blank"
                    >
                      <Github size={16} />
                      VIEW_REPO
                      <ExternalLink size={14} />
                    </Link>
                  ) : (
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center gap-2 text-sm font-bold hover:text-phosphor-accent"
                    >
                      LEARN_MORE
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-sm text-phosphor-secondary opacity-60">
            <Link href="/experiments" className="hover:text-phosphor-accent underline">
              Check out my experiments →
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}