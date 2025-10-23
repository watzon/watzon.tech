export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'LIVE' | 'BETA' | 'ARCHIVED' | 'DEV';
  repoUrl: string;
  techStack: string[];
  tags: string[];
  featured: boolean;
  longDescription?: string;
  githubStats?: {
    stars: number;
    forks: number;
    language: string;
  };
  highlights?: string[];
  content?: string;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: "PROJ-001",
    name: "Cursor Linux Installer",
    description: "Enterprise-grade Linux installer for Cursor IDE with 166+ GitHub stars. Provides proper system integration, AppImage support, and seamless command-line execution.",
    longDescription: "A sophisticated Linux installer for Cursor IDE that brings enterprise-grade installation experience to Linux users. This project has become the primary installation method for developers using Cursor on Linux, with 166+ GitHub stars and active community contributions.",
    status: "LIVE",
    repoUrl: "https://github.com/watzon/cursor-linux-installer",
    techStack: ["Shell", "Bash", "Linux", "DevOps"],
    tags: ["cursor", "linux", "installer", "ide", "development-tools"],
    featured: true,
    githubStats: {
      stars: 166,
      forks: 20,
      language: "Shell"
    },
    highlights: [
      "Enterprise-grade installation with comprehensive error handling",
      "AppImage support with FUSE installation verification",
      "Architecture detection for optimal performance across systems",
      "Desktop file integration with proper icon handling",
      "Community-driven with 5+ contributors"
    ]
  },
  {
    id: "PROJ-002",
    name: "SQLC Gen Crystal",
    description: "Go-based SQL code generation tool that brings SQLC's type-safe query capabilities to Crystal language projects. Generates strongly-typed database access code.",
    longDescription: "A Go-based SQL code generation tool that bridges SQLC's powerful type generation capabilities with Crystal language projects. This tool enables type-safe SQL queries in Crystal by generating strongly-typed database access code from SQL files.",
    status: "LIVE",
    repoUrl: "https://github.com/watzon/sqlc-gen-crystal",
    techStack: ["Go", "Crystal", "SQL", "Code Generation"],
    tags: ["sqlc", "crystal", "sql", "code-generation", "type-safety", "database"],
    featured: true,
    githubStats: {
      stars: 3,
      forks: 0,
      language: "Go"
    },
    highlights: [
      "SQLC integration for Crystal with comprehensive type-safe query generation",
      "Cross-platform support built as a standalone Go binary",
      "Comprehensive CLI interface with robust argument parsing",
      "Artifact generation with built-in binary storage system",
      "Type safety preventing SQL injection vulnerabilities"
    ]
  },
  {
    id: "PROJ-003",
    name: "Magnetar",
    description: "High-performance BitTorrent parsing and manipulation library written in V. Features complete protocol implementation, magnet URI support, and CLI tools with zero-dependency architecture.",
    longDescription: "A high-performance BitTorrent parsing and manipulation library written in V, designed for speed and efficiency. This project demonstrates advanced systems programming capabilities with complete protocol implementation and memory-safe design.",
    status: "LIVE",
    repoUrl: "https://github.com/watzon/magnetar",
    techStack: ["V", "BitTorrent", "Systems Programming", "CLI"],
    tags: ["bittorrent", "v-language", "p2p", "file-sharing", "systems-programming"],
    featured: false,
    githubStats: {
      stars: 23,
      forks: 1,
      language: "V"
    },
    highlights: [
      "High-performance parsing optimized for large torrent files",
      "Complete BitTorrent v1/v2 specification implementation",
      "Magnet URI support with full generation and parsing",
      "Zero-dependency architecture leveraging V's built-in capabilities",
      "Memory-safe design with automatic memory management"
    ]
  },
  {
    id: "PROJ-004",
    name: "Obelisk",
    description: "Sophisticated Crystal syntax highlighting library inspired by Chroma with 15+ programming language support. Features advanced theming system with phosphor colors and high-performance libuv-based parsing.",
    longDescription: "A sophisticated Crystal syntax highlighting library inspired by Chroma, featuring extensive language support and flexible theming system. This project demonstrates expertise in text processing, language parsing, and performance optimization with native C extensions.",
    status: "LIVE",
    repoUrl: "https://github.com/watzon/obelisk",
    techStack: ["Crystal", "C", "Libuv", "Syntax Highlighting"],
    tags: ["syntax-highlighting", "crystal", "chroma", "developer-tools", "terminal"],
    featured: false,
    githubStats: {
      stars: 1,
      forks: 0,
      language: "Crystal"
    },
    highlights: [
      "15+ programming languages with complete syntax definitions",
      "Advanced theming system with phosphor color schemes",
      "High-performance highlighting using libuv for native speed",
      "Flexible API with multiple output formats (HTML, terminal, JSON)",
      "Terminal optimization specifically for CLI applications"
    ]
  },
  {
    id: "PROJ-005",
    name: "Three-MF",
    description: "Comprehensive TypeScript library for 3D Manufacturing Format (3MF) files. Provides complete parsing, WebGL integration with Three.js, and specialized support for Bambu Lab 3D printers.",
    longDescription: "A comprehensive TypeScript library for parsing and working with 3D Manufacturing Format (3MF) files, designed for modern web applications and 3D printing workflows. This project bridges the gap between industrial 3D manufacturing standards and web-based 3D visualization.",
    status: "LIVE",
    repoUrl: "https://github.com/watzon/three-mf",
    techStack: ["TypeScript", "Three.js", "WebGL", "3D Manufacturing"],
    tags: ["3d-printing", "threejs", "typescript", "3mf", "manufacturing", "webgl"],
    featured: false,
    githubStats: {
      stars: 2,
      forks: 0,
      language: "TypeScript"
    },
    highlights: [
      "Full 3MF specification compliance with complete parsing and generation",
      "Modern TypeScript API with strongly-typed interfaces",
      "WebGL integration with seamless Three.js support for 3D rendering",
      "Bambu Lab integration with specialized printer support",
      "Multi-format support including STL conversion"
    ]
  }
];