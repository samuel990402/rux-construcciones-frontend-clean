## Purpose

This file gives targeted, repository-specific guidance for AI coding assistants working on this React + Tailwind project so they can be productive immediately.

## Quickstart

- **Install**: `yarn install` (project uses Yarn v1 by default). NPM: `npm install`.
- **Start (dev)**: `yarn start` — runs `craco start`.
- **Build**: `yarn build` — runs `craco build`.
- **Test**: `yarn test` — runs `craco test`.
- **PowerShell env example**: `$env:DISABLE_HOT_RELOAD='true'; yarn start` (sets env then runs start).

## High-level Architecture

- **Framework**: React SPA using `react-router-dom` (routes declared in `src/App.js`).
- **Styling**: Tailwind CSS with `tailwind.config.js` and `tailwindcss-animate` plugin.
- **Build tooling**: CRACO (`@craco/craco`) with `craco.config.js` providing a webpack alias and optional dev plugins.
- **Path alias**: `@` is aliased to `src` (see `craco.config.js`). Use `@/...` imports inside code.

## Important Files & Directories

- `src/` : application source.
- `src/pages/` : page-level components (e.g. `Home.jsx`, `ProjectsPage.jsx`).
- `src/components/` : shared UI (header/footer/hero/etc.).
- `src/components/ui/` : primitive UI wrappers (Radix + Tailwind patterns). Treat these as the design-system primitives.
- `src/hooks/` : custom hooks (e.g. `use-toast.js`).
- `src/lib/utils.js` : small helpers used across the app.
- `src/assets/` : static assets (images under `Proyectos/` and `Qr/`). Prefer relative or `@` imports rather than absolute OS paths.
- `craco.config.js` : webpack alias + dev flags (see section below).

## Project-specific Conventions & Patterns

- Use the `@` alias for imports from `src`, for example: `import App from '@/App'`.
- UI primitives live under `src/components/ui/` — when adding components, prefer composing these primitives to keep visual consistency.
- Files use `.jsx` extension for React components — follow existing naming (PascalCase for components and pages).
- Avoid absolute OS-specific import paths (e.g. `D:/...`). Replace with relative or alias imports; example for `ProjectsPage.jsx` images:

  ```js
  // Bad — absolute Windows path
  import proyecto1 from 'D:/10. Pagina web/rux-construcciones/src/assets/Proyectos/Encinos H.png'

  // Good — use alias
  import proyecto1 from '@/assets/Proyectos/Encinos H.png'
  ```

## Integration Points & Env Flags

- `backend/` exists at repo root but is currently empty — look here for future server integration.
- `craco.config.js` reads these env vars to toggle features:
  - `DISABLE_HOT_RELOAD=true` — disables webpack HMR/watch.
  - `REACT_APP_ENABLE_VISUAL_EDITS=true` — loads visual-edits plugins (babel + dev server setup).
  - `ENABLE_HEALTH_CHECK=true` — enables a webpack health-check plugin and dev endpoints.

## Typical Tasks & Where to Look

- Add a new route: update `src/App.js` and add a page under `src/pages/`.
- Add a new design primitive or utility: place it in `src/components/ui/` or `src/lib/` respectively.
- Update global styles or Tailwind tokens: edit `tailwind.config.js` and `src/index.css`.

## Tests & Linting

- The repo uses the `craco` wrappers for `test` and build scripts. There is no dedicated test folder yet — add tests alongside modules where helpful.

## Examples the bot should follow

- When editing UI, prefer small composable components in `src/components/ui/`, and reuse `clsx` and `class-variance-authority` patterns found in the codebase.
- When searching for behavior, inspect `src/pages/ProjectsPage.jsx` for an example of filtering, `useMemo` usage, and `framer-motion` animation patterns.

## When unsure — sanity checks the bot should perform

- If a file references an absolute filesystem path (Windows-style), propose replacing it with `@/assets/...` and check the image exists under `src/assets/`.
- Confirm `package.json` scripts use `craco` and advise using `yarn` by default because of the locked `packageManager` field.

---

If anything here is unclear or you'd like additional examples (e.g., preferred PR description template or test examples), tell me which areas to expand.
