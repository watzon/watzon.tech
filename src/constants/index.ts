import { Skill, Project, BlogPost, Experience } from '@/types';

export const SECTIONS = ['HOME', 'PROJECTS', 'BLOG', 'EXPERIMENTS', 'RESUME'] as const;

export const FRONTEND_SKILLS: Skill[] = [
  { name: 'TypeScript', level: 95 },
  { name: 'React.js', level: 65 },
  { name: 'Vue.js', level: 90 },
  { name: 'Tailwind CSS', level: 97 },
];

export const BACKEND_SKILLS: Skill[] = [
  { name: 'Node.js', level: 90 },
  { name: 'Crystal', level: 97},
  { name: 'Go', level: 85 },
  { name: 'TypeScript', level: 95 },
  { name: 'Python', level: 80 },
  { name: 'Rust', level: 60 },
];

export const DEVOPS_SKILLS: Skill[] = [
  { name: 'Docker', level: 85 },
  { name: 'Kubernetes', level: 70 },
  { name: 'AWS', level: 80 },
  { name: 'CI/CD', level: 85 },
  { name: 'GitHub Actions', level: 90 },
  { name: 'Terraform', level: 75 },
  { name: 'Monitoring', level: 80 },
];

export const SKILLS: Skill[] = [...FRONTEND_SKILLS, ...BACKEND_SKILLS, ...DEVOPS_SKILLS];

export const PROJECTS: Project[] = [
  {
    id: 'PROJ-001',
    name: 'HyperGrid',
    desc: 'Distributed computing protocol written in Rust. Handles 1M+ concurrent connections with <5ms latency. Built for high-frequency trading systems requiring sub-millisecond response times.',
    stack: ['Rust', 'gRPC', 'Tokio', 'WebAssembly', 'ZeroMQ'],
    status: 'LIVE',
  },
  {
    id: 'PROJ-002',
    name: 'NeuralNet-Go',
    desc: 'Lightweight neural network implementation in pure Go with no external dependencies. Features backpropagation, convolutional layers, and support for model serialization. Used by 5K+ developers for ML prototyping.',
    stack: ['Go', 'Math', 'CUDA', 'Protocol Buffers'],
    status: 'ARCHIVED',
  },
  {
    id: 'PROJ-003',
    name: 'SynthwaveUI',
    desc: 'React component library focusing on retro-futuristic aesthetics and accessibility. 50+ components with full TypeScript support, dark mode, and comprehensive documentation. 10K+ weekly npm downloads.',
    stack: ['React', 'TypeScript', 'Tailwind', 'Storybook', 'Rollup'],
    status: 'LIVE',
  },
  {
    id: 'PROJ-004',
    name: 'CipherFlow',
    desc: 'End-to-end encrypted messaging platform using Signal Protocol. Supports group chats, file sharing, and message expiration. Built for privacy-conscious organizations with zero-knowledge architecture.',
    stack: ['TypeScript', 'WebRTC', 'Signal Protocol', 'PostgreSQL', 'Docker'],
    status: 'BETA',
  },
  {
    id: 'PROJ-005',
    name: 'QuantumDB',
    desc: 'Distributed key-value store with quantum-resistant encryption. Features automatic sharding, consensus algorithms, and Byzantine fault tolerance. Designed for critical infrastructure applications.',
    stack: ['Go', 'Rust', 'LevelDB', 'Raft', 'Libsodium'],
    status: 'DEV',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    date: '2024-10-15',
    title: 'Building a 1M+ Concurrent Connection Server in Rust',
    readTime: '12 min read'
  },
  {
    date: '2024-09-28',
    title: 'TypeScript Performance Patterns for High-Traffic Applications',
    readTime: '10 min read'
  },
  {
    date: '2024-08-12',
    title: 'From Monolith to Microservices: A 600% Performance Journey',
    readTime: '15 min read'
  },
  {
    date: '2024-07-03',
    title: 'Quantum-Resistant Encryption in Distributed Systems',
    readTime: '18 min read'
  },
  {
    date: '2024-06-20',
    title: 'Real-Time Data Synchronization with WebSockets and TypeScript',
    readTime: '8 min read'
  },
  {
    date: '2024-05-08',
    title: 'Building Terminal UIs with Modern Web Technologies',
    readTime: '6 min read'
  },
];

export const EXP: Experience[] = [
  {
    role: 'Owner, Founder, CEO',
    company: 'Watson Ventures LLC',
    year: '2025 - Current',
    description: 'Founded umbrella company for personal ventures including Butterbase, a comprehensive ERP solution for home and cottage bakers built with TypeScript and Vue.js.',
    achievements: [
      'Developed Butterbase (butterbase.app), a complete bakery management platform featuring inventory tracking, recipe costing, customer CRM, and order management',
      'Built scalable TypeScript-based architecture serving ingredient cost calculations, profit margins, and automated invoicing for baking businesses',
      'Implemented Vue.js frontend with real-time inventory updates, professional invoice generation, and customer management workflows'
    ]
  },
  {
    role: 'Full Stack Software Engineer',
    company: 'Ama Multimedia LLC',
    year: '2022-12 - 2024-03',
    description: 'Led frontend and backend development using TypeScript, Node.js, and Go for high-traffic streaming platforms serving 1M+ monthly active users.',
    achievements: [
      'Architected and implemented a TypeScript/Vue.js component library used across 5 product lines, reducing development time by 40%',
      'Led migration from monolithic to microservices architecture using TypeScript and Node.js, improving deployment frequency by 300%',
      'Optimized build pipeline using TypeScript and Webpack, reducing build times from 15 minutes to 7 minutes'
    ]
  },
  {
    role: 'Full Stack Software Engineer',
    company: 'Impartner Software',
    year: '2022-02 - 2022-11',
    description: 'Developed and maintained enterprise PRM solutions using TypeScript, React, and Node.js, supporting 200+ enterprise clients.',
    achievements: [
      'Built scalable microservices using TypeScript and Node.js, handling 500K+ daily API requests',
      'Developed real-time data synchronization system using TypeScript and WebSockets, reducing sync times by 60%',
      'Implemented automated testing suite with Jest and TypeScript, achieving 85% code coverage'
    ]
  },
  {
    role: 'Full Stack Software Engineer',
    company: 'Purple',
    year: '2021-11 - 2022-02',
    description: 'Enhanced e-commerce platform serving $500M+ annual revenue using TypeScript, React, and Node.js.',
    achievements: [
      'Engineered AWS Lambda functions using TypeScript, processing 1M+ daily advertising events',
      'Reduced page load time from 8s to 2s through TypeScript-based server-side optimizations',
      'Implemented A/B testing framework using TypeScript, leading to 15% conversion rate improvement'
    ]
  },
  {
    role: 'Lead Software Engineer',
    company: 'TruVision Health',
    year: '2020-08 - 2021-10',
    description: 'Led 8-person engineering team, focusing on TypeScript and Node.js development for e-commerce platform.',
    achievements: [
      'Spearheaded site optimization using TypeScript and React, improving load times by 600%',
      'Established TypeScript coding standards and review processes, reducing bug reports by 40%',
      'Implemented CI/CD pipeline using GitHub Actions and TypeScript, reducing deployment time by 70%'
    ]
  },
  {
    role: 'Senior Software Engineer',
    company: 'NeuraLegion',
    year: '2018-08 - 2019-11',
    description: 'Developed security testing automation tools using TypeScript and Node.js for enterprise clients.',
    achievements: [
      'Built browser automation engine using TypeScript and Puppeteer, improving scan speed by 50%',
      'Developed vulnerability detection algorithms using TypeScript, identifying 30% more security issues',
      'Created REST API using TypeScript and Express.js, handling 100K+ daily requests'
    ]
  },
];