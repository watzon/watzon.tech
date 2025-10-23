'use client';

import { motion } from 'framer-motion';
import { SiGithub, SiBluesky } from '@icons-pack/react-simple-icons';
import { Linkedin } from 'lucide-react';
import { Code2 } from 'lucide-react';
import { FRONTEND_SKILLS, BACKEND_SKILLS } from '@/constants';
import TerminalButton from '@/components/ui/TerminalButton';

const glitchText = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.03,
    },
  }),
  blink: {
    opacity: [1, 0, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
    },
  },
};

export default function HomeSection() {
  const title = "HELLO WORLD_";

  return (
    <div className="flex flex-col justify-center h-full space-y-8">
      <div>
        <div className="inline-block px-2 py-1 mb-4 text-xs font-bold text-black bg-phosphor-primary">
          AVAILABLE FOR HIRE
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
          {title.split('').map((char, i) => {
            const isUnderscore = char === '_';
            return (
              <motion.span
                key={i}
                custom={i}
                variants={glitchText}
                initial="hidden"
                animate={isUnderscore ? ["visible", "blink"] : "visible"}
              >
                {char}
              </motion.span>
            );
          })}
        </h2>
        <p className="text-xl md:text-2xl opacity-80 max-w-2xl leading-relaxed">
          I&apos;m <span className="font-bold text-phosphor-accent">Chris Watson (watzon)</span>. A seasoned software engineer with over <span className="border-b-2 border-phosphor-primary/50">15 years</span> of experience building robust, distributed systems and scalable architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 md:mt-8">
        {/* Front-End Skills */}
        <div className="p-6 border border-phosphor-primary/20 bg-phosphor-primary/5 relative overflow-hidden">
          {/* Decorative corner markers */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-phosphor-primary"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-phosphor-primary"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-phosphor-primary"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-phosphor-primary"></div>

          <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
            <Code2 size={20} /> FRONTEND_STACK.json
          </h3>
          <ul className="space-y-2">
            {FRONTEND_SKILLS.map(skill => (
               <li key={skill.name} className="flex items-center gap-4">
                 <span className="w-24 text-sm opacity-70 text-right">{skill.name}</span>
                 <div className="flex-1 h-2 bg-phosphor-primary/20 border border-phosphor-primary/20">
                   <motion.div
                     initial={{ width: 0 }}
                     animate={{ width: `${skill.level}%` }}
                     transition={{ delay: 0.5, duration: 1 }}
                     className="h-full bg-phosphor-primary"
                   />
                 </div>
               </li>
            ))}
          </ul>
        </div>

        {/* Back-End Skills */}
        <div className="p-6 border border-phosphor-primary/20 bg-phosphor-primary/5 relative overflow-hidden">
          {/* Decorative corner markers */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-phosphor-primary"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-phosphor-primary"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-phosphor-primary"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-phosphor-primary"></div>

          <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
            <Code2 size={20} /> BACKEND_STACK.json
          </h3>
          <ul className="space-y-2">
            {BACKEND_SKILLS.map(skill => (
               <li key={skill.name} className="flex items-center gap-4">
                 <span className="w-24 text-sm opacity-70 text-right">{skill.name}</span>
                 <div className="flex-1 h-2 bg-phosphor-primary/20 border border-phosphor-primary/20">
                   <motion.div
                     initial={{ width: 0 }}
                     animate={{ width: `${skill.level}%` }}
                     transition={{ delay: 0.7, duration: 1 }}
                     className="h-full bg-phosphor-primary"
                   />
                 </div>
               </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Philosophy and Links Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-2 md:mt-8">
        <div className="flex flex-col justify-between">
           <p className="text-sm opacity-70 leading-relaxed">
             My philosophy is simple: write clean, maintainable code that solves real problems. Whether it&apos;s low-level system programming in <strong className="text-phosphor-accent">Rust</strong>, web development with <strong className="text-phosphor-accent">React</strong>, or rapid API development in <strong className="text-phosphor-accent">Go</strong>, I bring deep expertise and a pragmatic approach.
           </p>
        </div>
        <div className="flex items-center justify-start lg:justify-end">
           <div className="flex gap-4">
              <TerminalButton
                icon={<SiGithub size={18}/>}
                label="GITHUB"
                onClick={() => window.open('https://github.com/watzon', '_blank')}
              />
              <TerminalButton
                icon={<Linkedin size={18}/>}
                label="LINKEDIN"
                onClick={() => window.open('https://linkedin.com/in/watzon1993', '_blank')}
              />
              <TerminalButton
                icon={<SiBluesky size={18}/>}
                label="BLUESKY"
                onClick={() => window.open('https://bsky.app/profile/watzon.tech', '_blank')}
              />
           </div>
        </div>
      </div>
    </div>
  );
}