# AGENTS.md

Agent guide for working in `watzon-tech`.
All notes here are based on observed repo state.

## Project Overview
- Framework: Astro 5 (`astro`), React 19, TypeScript, Tailwind CSS 4.
- Package manager: npm (`package-lock.json` exists).
- Module format: ESM (`"type": "module"` in `package.json`).
- Repo shape: single package (no monorepo/workspace config found).

## Source of Truth
- Scripts: `package.json`
- TS settings: `tsconfig.json`
- Astro config: `astro.config.mjs`
- App code: `src/pages`, `src/layouts`, `src/components`, `src/styles`

## Verified Commands
Run from repository root.

### Install
```bash
npm install
```

### Dev
```bash
npm run dev
```
Equivalent:
```bash
./node_modules/.bin/astro dev
```

### Build
```bash
npm run build
```
Equivalent:
```bash
./node_modules/.bin/astro build
```

### Preview
```bash
npm run preview
```
Equivalent:
```bash
./node_modules/.bin/astro preview
```

### Generic Astro CLI
```bash
npm run astro -- <subcommand>
```
Examples:
```bash
npm run astro -- --help
npm run astro -- sync
```

## Lint / Format / Typecheck / Tests (Current State)
- No `lint` script in `package.json`.
- No `format` script in `package.json`.
- No `test` script in `package.json`.
- No test framework config files found (`vitest`, `jest`, `playwright`, etc.).
- No CI workflows found in `.github/workflows/`.
- TypeScript is configured, but no dedicated `typecheck` script exists.

## Typecheck Notes
Potential check path:
```bash
npm run astro -- check
```
On first use this may prompt to install `@astrojs/check`.
Optional explicit install:
```bash
npm i -D @astrojs/check typescript
```

## Single-Test Command (Explicit)
No test runner is configured, so there is no valid single-test command.
Do not fabricate one.

## Routing and File Conventions
- Astro file-based routing is in `src/pages`.
- Shared layout shell: `src/layouts/BaseLayout.astro`.
- Interactive UI components: `src/components/**/*.tsx`.
- Content collections: `src/content.config.ts` (plus `src/content/config.ts`).
- Global styling tokens/utilities: `src/styles/global.css`.

## Code Style (Observed, Not Tool-Enforced)
There is no repo-level ESLint/Prettier config. Match style in touched files.

### Imports
- Use ESM imports.
- Astro frontmatter often imports TSX components with extension.
- TS/TSX files use package imports like `react`, `lucide-react`.

### Naming
- Components: PascalCase (`ThemeToggle`, `MobileNav`, `Squarify`).
- Types/interfaces: PascalCase (`Theme`, `Box`, `DragState`).
- Variables/functions/hooks: camelCase.
- Constrained states use string unions (for example `"light" | "dark"`).

### TypeScript
- Keep explicit types near domain logic.
- Prefer interfaces/type aliases for structured data.
- Use `as const` + derived unions when practical.
- Avoid `any` and ignore/suppression comments.

### Error Handling
- Use early guard returns.
- Wrap fragile browser APIs (`clipboard`, `canvas`, etc.) with `try/catch`.
- Provide fallback behavior where feasible.
- Current pattern logs with `console.error` in UI components.

### React / Astro Patterns
- Functional React components + hooks.
- Mostly local component state; no global store framework detected.
- Astro frontmatter handles data loading/preprocessing.
- Content pages use `getCollection` and `render` from `astro:content`.

### Styling Patterns
- Global CSS variables for theme, spacing, and typography in `global.css`.
- Mixed approach: Tailwind utility classes + co-located `<style>` blocks.
- Preserve existing theme tokens and spacing rhythm.

## Content/Data Conventions
- Content schemas use `defineCollection` + `z.object`.
- Blog/experiments content is collection-driven.
- Keep schema updates compatible with existing content files.

## Dependency and Tooling Rules
- Prefer existing dependencies before adding new packages.
- Avoid introducing new tooling unless task requires it.
- If adding scripts later, use conventional names:
  - `lint`
  - `format`
  - `typecheck`
  - `test`
  - `test:watch`
  - `test:single`

## Cursor / Copilot Rules Check
Verified during creation of this file:
- No `.cursorrules` file.
- No `.cursor/rules/` directory.
- No `.github/copilot-instructions.md` file.

If those are added, merge their directives into this file.

## Agent Checklist
Before edits:
1. Read `package.json` scripts and target files.
2. Follow style in touched files.
3. Keep bugfixes minimal (no opportunistic refactors).

After edits:
1. Run `npm run build`.
2. If check tooling is installed, run `npm run astro -- check`.
3. Report missing lint/test setup instead of claiming it ran.

## Maintenance
Update this document immediately when scripts/tooling are added or changed.
