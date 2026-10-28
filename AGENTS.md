# Repository Guidelines

## Project Structure & Module Organization

This portfolio uses React 19, Vite 8, Tailwind CSS 4, and Framer Motion with JavaScript ES modules.

- `src/main.jsx` mounts the application; `src/App.jsx` composes the page.
- `src/features/hero/` contains the hero section and its visual components. Group new sections under `src/features/<feature>/`.
- `src/core/constants/theme.jsx` holds color and font constants; `src/shared/animations/variants.jsx` contains reusable animation definitions.
- `src/index.css` defines Tailwind imports, global styles, and CSS theme variables; `src/App.css` is available for application styles.
- `public/` holds logos, project images, and event photos. Reference these from root-relative URLs, preserving filename case (for example, `/Projects/FERMEST.png`).
- `dist/` is generated build output. No test directory currently exists.

## Build, Test, and Development Commands

Run commands from the repository root:

- `npm install` — install dependencies.
- `npm run dev` — start Vite with port 5173 configured.
- `npm run build` — create the production bundle in `dist/`.
- `npm run preview` — serve the production build locally after building.
- `npm run lint` — check JavaScript and JSX with ESLint, including React Hooks and React Refresh rules.

## Coding Style & Naming Conventions

Use two-space indentation, single-quoted JavaScript strings, and no JavaScript semicolons, matching existing files. Use PascalCase component names and filenames (`HeroSection.jsx`), camelCase helpers (`fadeUp`), and uppercase shared constants (`COLORS`). Prefer functional components and named exports in feature modules.

Reuse theme tokens and shared animation variants. Keep JavaScript theme constants and corresponding CSS variables consistent when changing the palette. ESLint is configured in `eslint.config.js`; no formatter is configured.

## Testing Guidelines

No automated test framework, test script, or coverage threshold is configured. For code changes, run lint and build, then manually check desktop and mobile layouts, images, links, and animations. Document failures and verification results in the pull request. If adding automated tests, establish a runner and naming convention in the same change.

## Commit & Pull Request Guidelines

Git history is unavailable in this checkout, so existing commit conventions cannot be verified. Use concise imperative subjects, such as `Fix hero layout on mobile`.

Keep pull requests focused. Describe the change, link relevant issues, report validation results, and include screenshots for visual changes. Exclude generated `dist/` files and `node_modules/`.
