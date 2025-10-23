# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**IMPORTANT: Never run the development server or build the project without explicit approval. The dev server runs in the background automatically. All changes should be typechecked and linted only.**

**Code Quality:**
- `npm run lint` - Run ESLint for code quality checks (use this frequently)
- TypeScript type checking - Ensure all changes compile without errors

**Restricted Commands (DO NOT USE without explicit approval):**
- `npm run dev` - ⚠️ Development server (runs automatically in background)
- `npm run build` - ⚠️ Build production application
- `npm run start` - ⚠️ Start production server

**Key Development Notes:**
- Dev server runs in background via system processes
- Focus on type checking and linting during development
- No test framework is currently configured

## Architecture Overview

This is a **terminal-style personal portfolio website** built with Next.js 15 and React 19. The unique design mimics a computer terminal interface with CRT effects and sophisticated animations.

**Core Technologies:**
- **Next.js 15** with App Router architecture
- **React 19** with modern hooks and patterns
- **TypeScript** with strict type checking and path aliases (`@/*` → `./src/*`)
- **Tailwind CSS v4** for styling with PostCSS
- **Framer Motion** for animations and page transitions
- **Lucide React** for consistent iconography
- **WebGL** for CRT shader effects

## Project Structure

**Key Directories:**
- `/src/app/` - Next.js App Router pages (page.tsx, layout.tsx, route pages)
- `/src/components/layout/` - Core layout components (AppLayout, Navigation, StatusBar, CRTShader)
- `/src/components/sections/` - Page content sections (HomeSection, ContactSection, etc.)
- `/src/components/ui/` - Reusable UI components (TerminalButton, PhosphorColorPicker, etc.)
- `/src/hooks/` - Custom React hooks (useBootState, useSystemStats)
- `/src/types/` - TypeScript type definitions
- `/src/constants/` - Application data and constants
- `/src/data/` - SQLite database files (future backend integration)
- `/src/contexts/` - React contexts (PhosphorContext for color theming)

**Entry Points:**
- `/src/app/page.tsx` - Homepage with HomeSection component
- `/src/app/layout.tsx` - Root layout with global styles and fonts
- `/src/components/layout/AppLayout.tsx` - Main application wrapper with terminal UI

## Key Architectural Patterns

**Terminal Design System:**
- Dynamic phosphor color system (Green, Cyan, Yellow, White) on dark background
- Monospace typography throughout (`font-mono`)
- CRT visual effects with WebGL shaders (scanlines, noise, flicker)
- Terminal-style status bar with simulated system stats and color picker
- Real-time color switching with persistent user preferences

**Component Architecture:**
- Layout components separated from content sections
- Page transitions using Framer Motion for consistent animations
- Progressive enhancement with boot sequence on first visit
- CRT shader toggle for user preference

**State Management:**
- Custom hooks for boot sequence state (`useBootState`)
- Phosphor color context for dynamic theming (`PhosphorProvider`, `usePhosphorColor`)
- System simulation with realistic CPU/memory patterns
- localStorage caching for boot state and color preferences

**Animation Patterns:**
- Micro-interactions on navigation and buttons
- Progressive loading animations for skills and text
- Sophisticated page transitions between sections
- WebGL fragment shader for authentic CRT effects

## Development Guidelines

**Code Quality Workflow:**
- Always run `npm run lint` after making changes
- Ensure TypeScript compilation succeeds before considering changes complete
- Use IDE diagnostics to catch type errors early
- Focus on maintaining the terminal aesthetic and performance

**Styling Conventions:**
- Use Tailwind utility classes for all styling
- **NEVER hardcode colors** (almost never use green-XXX, red-XXX, blue-XXX classes directly)
- **ALWAYS use dynamic phosphor colors** for terminal UI elements
- CSS variables defined in `globals.css` for theming
- Custom animations for CRT effects and flicker

## Dynamic Phosphor Color System

This project features a comprehensive dynamic color system that allows users to switch between different phosphor colors (Green, Cyan, Yellow, White) while maintaining the terminal aesthetic.

### **When to Use Dynamic Phosphor Colors (ALWAYS)**

**✅ ALWAYS use phosphor colors for:**
- All terminal UI elements (buttons, borders, text, backgrounds)
- Interactive states (hover, focus, active)
- Progress bars, indicators, and status elements
- Navigation elements and form inputs
- Any visual element that should respond to theme changes

**❌ NEVER hardcode colors for:**
- Terminal UI elements (use phosphor system instead)
- Interactive components (use phosphor system instead)
- Anything that should change with the theme (use phosphor system instead)

### **How to Use Dynamic Phosphor Colors**

**Available Phosphor CSS Variables:**
```css
--phosphor-primary    /* Main terminal color (replaces green-500) */
--phosphor-secondary  /* Darker variant (replaces green-600/700) */
--phosphor-accent     /* Lighter variant (replaces green-300/400) */
--phosphor-glow       /* Subtle glow effect */
--phosphor-text       /* Primary text color */
```

**Tailwind Classes to Use:**
- `text-phosphor-primary` - Main terminal text
- `text-phosphor-secondary` - Secondary/darker text
- `text-phosphor-accent` - Light/accent text
- `bg-phosphor-primary/10` - Backgrounds with opacity
- `border-phosphor-primary/30` - Borders with opacity
- `hover:bg-phosphor-primary/10` - Hover states
- `focus:border-phosphor-primary` - Focus states

### **Examples**

**✅ CORRECT:**
```tsx
<button className="bg-phosphor-primary/20 border border-phosphor-primary/30 hover:bg-phosphor-primary/10">
  Terminal Button
</button>

<span className="text-phosphor-accent">Important text</span>
<div className="border-phosphor-secondary/50">Subtle border</div>
```

**❌ INCORRECT:**
```tsx
<button className="bg-green-500/20 border border-green-500/30 hover:bg-green-500/10">
  Terminal Button
</button>

<span className="text-green-300">Important text</span>
<div className="border-green-700/50">Subtle border</div>
```

### **When to Hardcode Colors (Rare Exceptions)**

**✅ OK to hardcode:**
- True black/white for pure contrast
- Semantic colors (red for errors, orange for warnings) - use sparingly
- Specific brand colors that should never change
- External service colors (social media icons, etc.)

**❌ NEVER hardcode:**
- Any green shades for terminal aesthetic
- Colors that should respond to theme changes
- Interactive element colors
- Terminal UI colors

### **Context Integration**

Components can access the current phosphor color through context:
```tsx
import { usePhosphorColor } from '@/contexts/PhosphorContext';

function MyComponent() {
  const { phosphorColor, colorConfig } = usePhosphorColor();
  // phosphorColor: 'green' | 'cyan' | 'yellow' | 'white'
  // colorConfig: { primary: string, secondary: string, ... }
}
```

This ensures the entire terminal interface responds dynamically to user color preferences while maintaining the authentic CRT monitor aesthetic.

**TypeScript Usage:**
- Strict type checking enabled
- Path aliases configured with `@/` prefix
- All components properly typed with interfaces
- Type definitions in `/src/types/` directory

**Performance Considerations:**
- Turbopack enabled for development and builds
- Optimized animations with Framer Motion
- Efficient re-renders with proper React patterns
- WebGL shader can be toggled for performance

**Content Management:**
- All content statically defined in constants
- No external API dependencies
- Easy maintenance through data-driven components
- SQLite files suggest future CMS integration

## Configuration Files

**Build Configuration:**
- `next.config.ts` - Minimal Next.js configuration using defaults
- `tsconfig.json` - TypeScript with strict mode and path aliases
- `eslint.config.mjs` - Modern flat ESLint config with Next.js rules
- `postcss.config.mjs` - PostCSS with Tailwind CSS plugin

**Dependencies:**
- Core: Next.js 15, React 19, TypeScript
- UI: Framer Motion, Lucide React
- Styling: Tailwind CSS v4, PostCSS
- Development: ESLint with Next.js configuration