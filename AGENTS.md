# SuriBlog Agent Guide

이 저장소에서 작업하는 에이전트는 이 문서를 먼저 읽고, 요청 범위 안에서만 변경한다.

## Project Stack

- Framework: Next.js 15 App Router
- Runtime/UI: React 19, TypeScript, Material UI, Emotion
- Data: Prisma ORM with PostgreSQL through `DATABASE_URL`
- Content rendering: database-backed posts rendered through App Router pages and API routes
- Markdown: `react-markdown`, `remark-gfm`, `remark-breaks`, `rehype-highlight`, `rehype-raw`
- Tests: Jest with Testing Library
- Deployment target: Vercel, with `vercel-build` using Prisma generation and Next build

## Main Directories

- `src/app`: App Router pages, layouts, API routes, and sitemap generation.
- `src/components`: reusable UI components for layout, post cards, markdown, images, comments, theme, and blog surfaces.
- `src/entities`: TypeScript domain entities and DTO-like interfaces.
- `src/usecases`: application use cases for creating, reading, updating, deleting, and searching posts.
- `src/repositories`: repository interfaces and Prisma-backed implementations.
- `src/infrastructure`: API handler orchestration that connects routes to use cases and repositories.
- `src/lib`: Prisma client, auth, server auth helpers, and database initialization.
- `src/config`: blog-level configuration and design token configuration.
- `src/shared`: shared constants and types such as blog categories.
- `src/styles`: SCSS modules and global style resources used by pages and components.
- `prisma`: Prisma schema, migrations, seed script, and database deployment SQL.
- `public`: static assets and crawler files such as `robots.txt`.
- `docs`: planning, architecture, deployment, and technical documentation.
- `scripts`: migration, backup, restore, and category maintenance scripts.

## Commands

Use only commands that exist in `package.json`.

- Start development server: `npm run dev`
- Production build: `npm run build`
- Start built app: `npm run start`
- Lint: `npm run lint`
- Type check: `npm run type-check`
- Test: `npm run test`
- Watch tests: `npm run test:watch`
- Prisma migration: `npm run db:migrate`
- Prisma seed: `npm run db:seed`
- Prisma Studio: `npm run db:studio`
- Vercel build: `npm run vercel-build`

## Working Rules

- Before changing files, inspect the relevant files first. Do not edit from assumptions.
- Modify one clear unit of work at a time.
- Do not perform broad rewrites, package replacements, framework swaps, or design-system replacements unless explicitly requested.
- Preserve existing content, slugs, routes, and URLs unless the task specifically asks for a migration.
- Do not remove existing posts, comments, likes, categories, or tags without an explicit migration plan and approval.
- Do not commit environment variables, secrets, tokens, database URLs, admin passwords, or private keys.
- Keep TypeScript and lint errors out of the final state.
- After code changes, run `npm run build`, `npm run lint`, and `npm run type-check` when the environment allows it.
- For testable behavior changes, also run `npm run test` or a focused Jest test.
- Report the changed files and verification results after each task.
- For documentation-only tasks, report that no runtime verification was needed and run a lightweight diff check when useful.

## Completion Criteria

Every user-facing change should treat these as baseline requirements:

- SEO: page-specific metadata, canonical intent, crawler behavior, sitemap impact, and share previews considered.
- Accessibility: semantic HTML, keyboard access, visible focus, contrast, labels, and readable structure considered.
- Mobile responsiveness: mobile, tablet, and desktop layouts considered before completion.
- Content safety: existing URLs and published content remain reachable unless a planned redirect or migration is included.
