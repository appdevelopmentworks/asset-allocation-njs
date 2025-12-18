# Repository Guidelines

## Project Structure & Module Organization

- `src/app/` contains Next.js App Router routes and layout files; subfolders such as `(dashboard)` host dashboard pages.
- `src/components/` stores reusable UI, chart, form, and provider components (e.g., `charts/`, `forms/`, `providers/`).
- `src/lib/` holds domain logic, hooks, constants, and local-storage helpers (`lib/storage/local-storage.ts`).
- `src/lib/utils/portfolio.ts` provides normalization helpers used by the portfolio provider and optimization API when handling user-supplied data.
- `public/images/` is the source of branding assets; `asset-allocation.png` drives favicons and social cards.
- Documentation lives in `docs/`, while Prisma schemas remain under `prisma/` for future DB integration.

## Build, Test, and Development Commands

- `pnpm dev` – start the Next.js development server at <http://localhost:3000>.
- `pnpm build` – create a production build (required before deployment to Vercel or Netlify).
- `pnpm lint` – run ESLint with the repository configuration.
- `pnpm test` / `pnpm test:e2e` – reserved for Jest/Playwright suites (add tests before invoking).

## Coding Style & Naming Conventions

- TypeScript + React with functional components; prefer named exports.
- Use 2-space indentation and trailing commas where Prettier enforces them (`.prettierrc`).
- Follow camelCase for variables/functions, PascalCase for components, SCREAMING_SNAKE_CASE for constants.
- Run `pnpm lint` and rely on Prettier + ESLint autofix before committing.

## Testing Guidelines

- Jest + React Testing Library for unit/integration tests; Playwright for E2E (see `package.json` scripts).
- Mirror component filenames (e.g., `MyComponent.test.tsx`) inside `src/tests/` or beside the component.
- `src/tests/unit/api/optimization-route.test.ts` validates `/api/optimization` (GET/POST) behavior, while `src/tests/unit/app/dashboard/portfolio-page.test.tsx` covers the dashboard’s optimization UI flow end to end.
- Target ≥80% coverage once suites are in place; update or create mocks for Yahoo Finance calls where needed.
- Keep TODO.md (最新タスク) と docs/PROGRESS.md を参照して優先度を同期させること。

## Commit & Pull Request Guidelines

- Write commit subjects in the imperative mood (e.g., “Add portfolio editor validation”).
- Keep commits focused; separate UI, logic, and tooling changes when possible.
- Pull requests should describe user-facing changes, include screenshots for UI tweaks, and reference relevant docs/tasks.
- Confirm `pnpm lint` and (when available) test suites pass before requesting review.

## Security & Configuration Tips

- The app currently persists data in `localStorage`; avoid storing sensitive credentials.
- When adding external APIs, gate secrets via environment variables and document them in `docs/`.
