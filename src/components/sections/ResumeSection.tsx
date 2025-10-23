'use client';

import { motion } from 'framer-motion';
import { FileText, Mail, Github, ExternalLink, Linkedin, Award, BookOpen, Zap, Users, Code, Database, Cloud } from 'lucide-react';
import { EXP, FRONTEND_SKILLS, BACKEND_SKILLS, DEVOPS_SKILLS } from '@/constants';
import SectionHeader from '@/components/ui/SectionHeader';

export default function ResumeSection() {
  const skillCategories = [
    { title: 'Frontend Development', icon: <Code size={16} />, skills: FRONTEND_SKILLS.slice(0, 6) },
    { title: 'Backend Development', icon: <Database size={16} />, skills: BACKEND_SKILLS.slice(0, 6) },
    { title: 'Cloud & DevOps', icon: <Cloud size={16} />, skills: DEVOPS_SKILLS },
  ];

  return (
    <div>
      <SectionHeader title="EXPERIENCE_DUMP" icon={<FileText />} />

      {/* Header Section with Terminal Theme */}
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block"
        >
          <div className="px-4 py-2 bg-phosphor-primary/10 border border-phosphor-primary/30 rounded-t-lg">
            <span className="text-xs font-mono opacity-60">$ whoami</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-phosphor-primary px-6 py-4 bg-neutral-900/50 border-x border-phosphor-primary/30 font-mono"
          >
            &gt; CHRISTOPHER_WATSON
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-phosphor-secondary px-6 py-3 bg-neutral-900/50 border-x border-phosphor-primary/30 font-mono"
          >
            Full Stack Software Engineer • Salt Lake City, UT
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 text-sm opacity-80 px-6 py-4 bg-neutral-900/50 border border-phosphor-primary/30 rounded-b-lg font-mono"
          >
            <a href="mailto:chris@watzon.tech" className="flex items-center gap-1 hover:text-phosphor-accent transition-colors hover:bg-phosphor-primary/10 px-2 py-1 rounded">
              <Mail size={14} />
              chris@watzon.tech
            </a>
            <span className="text-phosphor-secondary">•</span>
            <a href="https://github.com/watzon" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-phosphor-accent transition-colors hover:bg-phosphor-primary/10 px-2 py-1 rounded">
              <Github size={14} />
              GitHub
            </a>
            <span className="text-phosphor-secondary">•</span>
            <a href="https://watzon.tech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-phosphor-accent transition-colors hover:bg-phosphor-primary/10 px-2 py-1 rounded">
              <ExternalLink size={14} />
              Portfolio
            </a>
            <span className="text-phosphor-secondary">•</span>
            <a href="https://linkedin.com/in/watzon1993" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-phosphor-accent transition-colors hover:bg-phosphor-primary/10 px-2 py-1 rounded">
              <Linkedin size={14} />
              LinkedIn
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Professional Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <div className="p-1 bg-gradient-to-r from-phosphor-primary/20 to-phosphor-secondary/20 rounded-lg">
          <div className="bg-neutral-900/80 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-phosphor-primary mb-4 flex items-center gap-2 font-mono">
              <span className="text-phosphor-secondary">$</span> cat professional_summary.md
            </h2>
            <div className="opacity-90 leading-relaxed font-mono text-sm">
              <p className="mb-3">
                <span className="text-phosphor-accent">Full Stack Software Engineer</span> with 10+ years of experience specializing in TypeScript and Go development.
                Expert in building scalable web applications, microservices, and developer tools.
              </p>
              <p className="mb-3">
                <span className="text-phosphor-accent">Proven track record:</span> 600% application performance improvements, 70% deployment time reduction,
                85% test coverage achievement, and 300% deployment frequency increases.
              </p>
              <p>
                <span className="text-phosphor-accent">Open source contributor</span> with multiple Go projects serving thousands of developers.
                Strong focus on code quality, testing, and comprehensive documentation.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: <Zap size={20} />, label: 'Performance', value: '600%', desc: 'Avg improvement' },
          { icon: <Users size={20} />, label: 'Team Lead', value: '8', desc: 'Engineers managed' },
          { icon: <Code size={20} />, label: 'Code Coverage', value: '85%', desc: 'Test coverage' },
          { icon: <Database size={20} />, label: 'API Volume', value: '1M+', desc: 'Daily requests' },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="p-4 border border-phosphor-secondary/30 bg-neutral-900/30 text-center"
          >
            <div className="flex justify-center text-phosphor-accent mb-2">{metric.icon}</div>
            <div className="text-2xl font-bold text-phosphor-primary font-mono">{metric.value}</div>
            <div className="text-xs opacity-80">{metric.label}</div>
            <div className="text-xs opacity-60">{metric.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Experience Timeline */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-phosphor-primary mb-8 flex items-center gap-2 font-mono">
          <span className="text-phosphor-secondary">$</span> grep -r &quot;experience&quot; /professional_history/
        </h2>
        <div className="relative border-l-2 border-phosphor-secondary/50 ml-3 md:ml-6 space-y-8 pb-12">
           {EXP.map((job, i) => (
               <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="relative pl-8 group"
               >
                   {/* Enhanced Timeline dot */}
                   <div className="absolute -left-[9px] top-1 w-4 h-4 bg-neutral-950 border-2 border-phosphor-primary rounded-full group-hover:scale-125 transition-transform" />
                   <div className="absolute -left-[7px] top-3 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[8px] border-t-phosphor-primary opacity-30 group-hover:opacity-60 transition-opacity" />

                   <div className="p-4 border border-phosphor-secondary/20 bg-neutral-900/20 rounded-lg group-hover:border-phosphor-primary/30 transition-colors">
                       <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                           <h3 className="text-xl font-bold text-phosphor-accent font-mono">{job.role}</h3>
                           <span className="text-sm font-bold px-3 py-1 bg-phosphor-secondary/20 border border-phosphor-secondary/50 rounded font-mono">
                               {job.year}
                           </span>
                       </div>
                       <div className="text-lg opacity-90 mb-3 font-mono text-phosphor-secondary">@ {job.company}</div>

                       {job.description && (
                         <p className="opacity-85 mb-4 leading-relaxed text-sm">{job.description}</p>
                       )}

                       {job.achievements && job.achievements.length > 0 && (
                         <div className="space-y-2">
                           <div className="text-xs font-mono text-phosphor-secondary uppercase tracking-wider">Key Achievements:</div>
                           <ul className="space-y-1">
                               {job.achievements.map((achievement, idx) => (
                                 <li key={idx} className="flex items-start gap-2 text-sm opacity-80">
                                   <span className="text-phosphor-accent mt-1">▸</span>
                                   <span>{achievement}</span>
                                 </li>
                               ))}
                           </ul>
                         </div>
                       )}
                   </div>
               </motion.div>
           ))}
        </div>
      </div>

      {/* Technical Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mb-12"
      >
        <div className="p-1 bg-gradient-to-r from-phosphor-primary/20 to-phosphor-secondary/20 rounded-lg">
          <div className="bg-neutral-900/80 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-phosphor-primary mb-6 flex items-center gap-2 font-mono">
              <span className="text-phosphor-secondary">$</span> ls -la /technical_skills/
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skillCategories.map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  className="border border-phosphor-secondary/30 bg-neutral-900/50 p-4"
                >
                  <h4 className="font-bold text-phosphor-accent mb-3 flex items-center gap-2 font-mono text-sm">
                    <span className="text-phosphor-primary">{category.icon}</span>
                    {category.title}
                  </h4>
                  <div className="space-y-2">
                    {category.skills.map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-xs font-mono opacity-80">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-neutral-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ delay: 1.2 + i * 0.1 + idx * 0.05, duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-phosphor-primary to-phosphor-accent"
                            />
                          </div>
                          <span className="text-xs opacity-60 font-mono w-8 text-right">{skill.level}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Core Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mb-12 p-6 border border-phosphor-secondary/30 bg-neutral-900/20"
      >
        <h2 className="text-xl font-bold text-phosphor-primary mb-6 flex items-center gap-2 font-mono">
          <span className="text-phosphor-secondary">$</span> cat core_technologies.txt
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            'TypeScript', 'Go', 'React.js', 'Vue.js', 'Node.js', 'PostgreSQL',
            'Docker', 'AWS', 'Redis', 'GraphQL', 'Webpack', 'Tailwind CSS'
          ].map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + i * 0.05 }}
              className="px-3 py-2 bg-phosphor-primary/10 border border-phosphor-primary/30 rounded font-mono text-center hover:bg-phosphor-primary/20 transition-colors"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Education & Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="p-6 border border-phosphor-secondary/30 bg-neutral-900/20">
          <h2 className="text-xl font-bold text-phosphor-primary mb-4 flex items-center gap-2 font-mono">
            <BookOpen size={18} />
            <span className="text-phosphor-secondary">$</span> cat education.md
          </h2>
          <div>
            <h4 className="text-lg font-bold text-phosphor-accent font-mono">Utah Valley University</h4>
            <p className="opacity-80 mb-2 font-mono text-sm">Computer Science • 2014-2015</p>
            <div className="text-xs opacity-60 font-mono">
              <div>Coursework:</div>
              <div>• Data Structures & Algorithms</div>
              <div>• Software Engineering</div>
              <div>• Computer Architecture</div>
            </div>
          </div>
        </div>

        <div className="p-6 border border-phosphor-secondary/30 bg-neutral-900/20">
          <h2 className="text-xl font-bold text-phosphor-primary mb-4 flex items-center gap-2 font-mono">
            <Award size={18} />
            <span className="text-phosphor-secondary">$</span> cat certifications.md
          </h2>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex items-center gap-2">
              <span className="text-phosphor-accent">▸</span>
              <span>AWS Certified Solutions Architect (2023)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-phosphor-accent">▸</span>
              <span>CKAD: Kubernetes App Developer (2021)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-phosphor-accent">▸</span>
              <span>GopherCon Speaker (2019)</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}