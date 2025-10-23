import PageTransition from '@/components/layout/PageTransition';
import { EXPERIMENTS } from '@/constants/experiments';
import Link from 'next/link';
import { ExternalLink, Play, Code } from 'lucide-react';

export default function ExperimentsPage() {
  const featuredExperiments = EXPERIMENTS.filter(exp => exp.featured);
  const allExperiments = EXPERIMENTS;

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-phosphor-accent">
            {`// EXPERIMENTS`}
          </h1>
          <p className="text-phosphor-secondary opacity-80">
            Interactive experiments and technical prototypes built right into this site
          </p>
        </div>

        {/* Featured Experiments */}
        {featuredExperiments.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-phosphor-primary">
              Featured Experiments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
              {featuredExperiments.map((experiment) => (
                <Link
                  key={experiment.id}
                  href={experiment.path}
                  className="group block bg-phosphor-primary/10 border border-phosphor-secondary/30 rounded p-6 hover:border-phosphor-secondary/50 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 px-2 py-1 text-xs font-bold bg-phosphor-primary/20 text-phosphor-accent border border-phosphor-primary/30 rounded">
                    FEATURED
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-phosphor-accent group-hover:text-phosphor-primary transition-colors">
                      {experiment.name}
                    </h3>
                    <p className="text-phosphor-secondary opacity-80 text-sm">
                      {experiment.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {experiment.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs border border-phosphor-primary/20 text-phosphor-accent"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs opacity-40">
                        ID: {experiment.id}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-phosphor-accent">
                        <Play size={16} />
                        TRY IT
                        <ExternalLink size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Experiments */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-phosphor-primary">
            All Experiments
          </h2>
          <div className="grid gap-6 max-w-6xl">
            {allExperiments.map((experiment) => (
              <div
                key={experiment.id}
                className="bg-phosphor-primary/5 border border-phosphor-primary/20 rounded p-6 hover:bg-phosphor-primary/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-phosphor-accent mb-2">
                      {experiment.name}
                    </h3>
                    <p className="text-phosphor-secondary opacity-80 text-sm mb-4">
                      {experiment.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {experiment.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs border border-phosphor-primary/20 text-phosphor-accent"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={experiment.path}
                    className="flex items-center gap-2 text-sm font-bold hover:text-phosphor-accent ml-4"
                  >
                    <Play size={16} />
                    TRY IT
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create New Experiment CTA */}
        <div className="text-center space-y-4 bg-phosphor-primary/5 border border-phosphor-primary/20 rounded p-8">
          <Code className="w-12 h-12 mx-auto mb-4 text-phosphor-accent" />
          <h3 className="text-xl font-bold text-phosphor-primary mb-2">
            Want to experiment?
          </h3>
          <p className="text-phosphor-secondary opacity-80 mb-4 max-w-md mx-auto">
            These experiments showcase various web technologies and interaction patterns.
            Each one is a self-contained exploration of a specific concept or technique.
          </p>
          <div className="text-sm text-phosphor-secondary opacity-60">
            More experiments coming soon! Check back for new interactive demos.
          </div>
        </div>
      </div>
    </PageTransition>
  );
}