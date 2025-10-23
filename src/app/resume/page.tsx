import PageTransition from '@/components/layout/PageTransition';
import { Mail, Github, ExternalLink, Linkedin } from 'lucide-react';

export default function ResumePage() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-8 font-mono text-sm">
        {/* Header */}
        <div className="space-y-6 border-b border-phosphor-primary/30 pb-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-phosphor-accent">
            CHRISTOPHER WATSON
          </h1>
          <div className="text-lg text-phosphor-primary font-medium">
            Full Stack Software Engineer • Salt Lake City, UT
          </div>
          <div className="flex flex-wrap gap-4 text-phosphor-secondary">
            <a href="mailto:chris@watzon.tech" className="flex items-center gap-2 hover:text-phosphor-accent transition-colors">
              <Mail size={16} />
              chris@watzon.tech
            </a>
            <a href="https://github.com/watzon" className="flex items-center gap-2 hover:text-phosphor-accent transition-colors">
              <Github size={16} />
              GitHub
            </a>
            <a href="https://watzon.tech/" className="flex items-center gap-2 hover:text-phosphor-accent transition-colors">
              <ExternalLink size={16} />
              Portfolio
            </a>
            <a href="https://linkedin.com/in/watzon1993" className="flex items-center gap-2 hover:text-phosphor-accent transition-colors">
              <Linkedin size={16} />
              LinkedIn
            </a>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-phosphor-accent tracking-tighter">
            {'// PROFESSIONAL SUMMARY'}
          </h2>
          <p className="text-phosphor-secondary leading-relaxed">
            Full Stack Software Engineer with 10+ years of experience specializing in TypeScript and Go development.
            Expert in building scalable web applications, microservices, and developer tools. Proven track record of
            improving application performance by up to 600% and reducing deployment times by 70%. Strong focus on code
            quality, testing, and documentation. Open source contributor with multiple Go projects serving thousands of developers.
          </p>
        </div>

        {/* Technical Skills */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-phosphor-accent tracking-tighter">
            {'// TECHNICAL SKILLS'}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-phosphor-primary">Programming Languages:</h3>
              <ul className="text-phosphor-secondary space-y-1">
                <li>• TypeScript (5+ years)</li>
                <li>• Go (3+ years)</li>
                <li>• JavaScript (10+ years)</li>
                <li>• Python (3+ years)</li>
                <li>• Ruby (3+ years)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-phosphor-primary">Frontend Development:</h3>
              <ul className="text-phosphor-secondary space-y-1">
                <li>• React.js</li>
                <li>• Vue.js</li>
                <li>• Svelte</li>
                <li>• Webpack</li>
                <li>• Tailwind CSS</li>
                <li>• HTML5/CSS3</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-phosphor-primary">Backend Development:</h3>
              <ul className="text-phosphor-secondary space-y-1">
                <li>• Node.js</li>
                <li>• Express.js</li>
                <li>• Go HTTP</li>
                <li>• Ruby on Rails</li>
                <li>• RESTful APIs</li>
                <li>• GraphQL</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-phosphor-primary">Cloud & DevOps:</h3>
              <ul className="text-phosphor-secondary space-y-1">
                <li>• AWS (EC2, Lambda, S3)</li>
                <li>• Docker</li>
                <li>• Kubernetes</li>
                <li>• CI/CD</li>
                <li>• GitHub Actions</li>
                <li>• Jenkins</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-phosphor-primary">Databases & Storage:</h3>
              <ul className="text-phosphor-secondary space-y-1">
                <li>• PostgreSQL</li>
                <li>• MongoDB</li>
                <li>• Redis</li>
                <li>• Elasticsearch</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Professional Experience */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-phosphor-accent tracking-tighter">
            {'// PROFESSIONAL EXPERIENCE'}
          </h2>

          <div className="space-y-8">
            {/* Watson Ventures */}
            <div className="border-l-2 border-phosphor-primary/30 pl-6 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-phosphor-accent">Owner, Founder, CEO</h3>
                <span className="text-phosphor-secondary opacity-70 text-sm">2025 - Current</span>
              </div>
              <div className="text-phosphor-primary font-medium">Watson Ventures LLC • Salt Lake City, UT</div>
              <p className="text-phosphor-secondary leading-relaxed">
                Founded umbrella company for personal ventures including Butterbase, a comprehensive ERP solution for home and cottage bakers built with TypeScript and Vue.js.
              </p>
              <ul className="text-phosphor-secondary space-y-2 list-disc list-inside">
                <li>Developed Butterbase (butterbase.app), a complete bakery management platform featuring inventory tracking, recipe costing, customer CRM, and order management</li>
                <li>Built scalable TypeScript-based architecture serving ingredient cost calculations, profit margins, and automated invoicing for baking businesses</li>
                <li>Implemented Vue.js frontend with real-time inventory updates, professional invoice generation, and customer management workflows</li>
              </ul>
            </div>

            {/* Ama Multimedia */}
            <div className="border-l-2 border-phosphor-primary/30 pl-6 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-phosphor-accent">Full Stack Software Engineer</h3>
                <span className="text-phosphor-secondary opacity-70 text-sm">2022-12 - 2024-03</span>
              </div>
              <div className="text-phosphor-primary font-medium">Ama Multimedia LLC • Remote</div>
              <p className="text-phosphor-secondary leading-relaxed">
                Led frontend and backend development using TypeScript, Node.js, and Go for high-traffic streaming platforms serving 1M+ monthly active users.
              </p>
              <ul className="text-phosphor-secondary space-y-2 list-disc list-inside">
                <li>Architected and implemented a TypeScript/Vue.js component library used across 5 product lines, reducing development time by 40%</li>
                <li>Led migration from monolithic to microservices architecture using TypeScript and Node.js, improving deployment frequency by 300%</li>
                <li>Optimized build pipeline using TypeScript and Webpack, reducing build times from 15 minutes to 7 minutes</li>
              </ul>
            </div>

            {/* Impartner Software */}
            <div className="border-l-2 border-phosphor-primary/30 pl-6 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-phosphor-accent">Full Stack Software Engineer</h3>
                <span className="text-phosphor-secondary opacity-70 text-sm">2022-02 - 2022-11</span>
              </div>
              <div className="text-phosphor-primary font-medium">Impartner Software • Lehi, UT</div>
              <p className="text-phosphor-secondary leading-relaxed">
                Developed and maintained enterprise PRM solutions using TypeScript, React, and Node.js, supporting 200+ enterprise clients.
              </p>
              <ul className="text-phosphor-secondary space-y-2 list-disc list-inside">
                <li>Built scalable microservices using TypeScript and Node.js, handling 500K+ daily API requests</li>
                <li>Developed real-time data synchronization system using TypeScript and WebSockets, reducing sync times by 60%</li>
                <li>Implemented automated testing suite with Jest and TypeScript, achieving 85% code coverage</li>
              </ul>
            </div>

            {/* Purple */}
            <div className="border-l-2 border-phosphor-primary/30 pl-6 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-phosphor-accent">Full Stack Software Engineer</h3>
                <span className="text-phosphor-secondary opacity-70 text-sm">2021-11 - 2022-02</span>
              </div>
              <div className="text-phosphor-primary font-medium">Purple • Lehi, UT</div>
              <p className="text-phosphor-secondary leading-relaxed">
                Enhanced e-commerce platform serving $500M+ annual revenue using TypeScript, React, and Node.js.
              </p>
              <ul className="text-phosphor-secondary space-y-2 list-disc list-inside">
                <li>Engineered AWS Lambda functions using TypeScript, processing 1M+ daily advertising events</li>
                <li>Reduced page load time from 8s to 2s through TypeScript-based server-side optimizations</li>
                <li>Implemented A/B testing framework using TypeScript, leading to 15% conversion rate improvement</li>
              </ul>
            </div>

            {/* TruVision Health */}
            <div className="border-l-2 border-phosphor-primary/30 pl-6 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-phosphor-accent">Lead Software Engineer</h3>
                <span className="text-phosphor-secondary opacity-70 text-sm">2020-08 - 2021-10</span>
              </div>
              <div className="text-phosphor-primary font-medium">TruVision Health • Draper, UT</div>
              <p className="text-phosphor-secondary leading-relaxed">
                Led 8-person engineering team, focusing on TypeScript and Node.js development for e-commerce platform.
              </p>
              <ul className="text-phosphor-secondary space-y-2 list-disc list-inside">
                <li>Spearheaded site optimization using TypeScript and React, improving load times by 600%</li>
                <li>Established TypeScript coding standards and review processes, reducing bug reports by 40%</li>
                <li>Implemented CI/CD pipeline using GitHub Actions and TypeScript, reducing deployment time by 70%</li>
              </ul>
            </div>

            {/* NeuraLegion */}
            <div className="border-l-2 border-phosphor-primary/30 pl-6 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-phosphor-accent">Senior Software Engineer</h3>
                <span className="text-phosphor-secondary opacity-70 text-sm">2018-08 - 2019-11</span>
              </div>
              <div className="text-phosphor-primary font-medium">NeuraLegion • Remote</div>
              <p className="text-phosphor-secondary leading-relaxed">
                Developed security testing automation tools using TypeScript and Node.js for enterprise clients.
              </p>
              <ul className="text-phosphor-secondary space-y-2 list-disc list-inside">
                <li>Built browser automation engine using TypeScript and Puppeteer, improving scan speed by 50%</li>
                <li>Developed vulnerability detection algorithms using TypeScript, identifying 30% more security issues</li>
                <li>Created REST API using TypeScript and Express.js, handling 100K+ daily requests</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notable Projects */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-phosphor-accent tracking-tighter">
            {'// NOTABLE PROJECTS'}
          </h2>

          <div className="space-y-6">
            <div className="bg-phosphor-primary/5 border border-phosphor-primary/20 rounded p-4 space-y-3">
              <div className="flex items-center gap-2">
                <a href="https://butterbase.app/" className="text-phosphor-accent font-bold hover:underline flex items-center gap-2">
                  Butterbase
                  <ExternalLink size={14} />
                </a>
              </div>
              <p className="text-phosphor-secondary leading-relaxed">
                Comprehensive ERP platform for home and cottage bakers featuring inventory tracking, recipe costing, customer management, and invoicing. Serves baking businesses with real-time cost calculations and profit margins.
              </p>
              <div className="text-phosphor-secondary opacity-70 text-sm">
                Technologies: TypeScript • Vue • Postgres • Redis • Docker • Fly.io
              </div>
            </div>

            <div className="bg-phosphor-primary/5 border border-phosphor-primary/20 rounded p-4 space-y-3">
              <div className="flex items-center gap-2">
                <a href="https://github.com/watzon/0x45" className="text-phosphor-accent font-bold hover:underline flex items-center gap-2">
                  0x45 File Sharing Platform
                  <ExternalLink size={14} />
                </a>
              </div>
              <p className="text-phosphor-secondary leading-relaxed">
                High-performance file sharing service built as a Go alternative to 0x0 (Python-based). Features concurrent processing, efficient memory management, and complete self-hostability for fast, reliable file sharing.
              </p>
              <div className="text-phosphor-secondary opacity-70 text-sm">
                Technologies: Go • Redis • PostgreSQL • Docker • AWS S3
              </div>
            </div>

            <div className="bg-phosphor-primary/5 border border-phosphor-primary/20 rounded p-4 space-y-3">
              <div className="flex items-center gap-2">
                <a href="https://github.com/watzon/goshot" className="text-phosphor-accent font-bold hover:underline flex items-center gap-2">
                  Goshot Code Screenshot Tool
                  <ExternalLink size={14} />
                </a>
              </div>
              <p className="text-phosphor-secondary leading-relaxed">
                CLI alternative to Carbon.now.sh for generating code screenshots. Provides better library utility than Silicon (Rust ecosystem) while maintaining similar functionality. Implemented in Go with focus on performance and memory efficiency.
              </p>
              <div className="text-phosphor-secondary opacity-70 text-sm">
                Technologies: Go • Image Processing
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-phosphor-accent tracking-tighter">
            {'// EDUCATION'}
          </h2>

          <div className="border-l-2 border-phosphor-primary/30 pl-6 space-y-2">
            <div className="text-lg font-bold text-phosphor-primary">Utah Valley University</div>
            <div className="text-phosphor-secondary">Computer Science • 2014-2015</div>
            <div className="text-phosphor-secondary opacity-70">
              Coursework: Data Structures, Algorithms, Software Engineering, Computer Architecture
            </div>
          </div>
        </div>

        </div>
    </PageTransition>
  );
}