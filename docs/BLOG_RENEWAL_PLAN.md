# SuriBlog Renewal Plan

## Purpose

SuriBlog will move from a general developer blog into a premium personal brand media site about building AI products in public.

The renewed blog should document:

- MomentTune product and startup journey
- one-person startup execution and MVP building
- AI coding tools such as Claude Code and Codex
- AI agents and workflow automation
- product planning, UX, and UI decisions
- blog growth, SEO, monetization, and publishing experiments

## Target Readers

- Solo founders and indie hackers building MVPs.
- Product builders using AI coding tools.
- Designers and planners interested in AI-assisted product development.
- Developers curious about real AI automation workflows.
- Readers following MomentTune as a public build log.
- Future customers, collaborators, sponsors, and digital product buyers.

## Current State

The current project is a Next.js 15 App Router blog with React 19, TypeScript, Material UI, Prisma, and PostgreSQL.

Posts are stored in the database through Prisma models and exposed through API routes such as `/api/posts` and `/api/posts/slug/[slug]`. The homepage is a client component that fetches posts from `/api/posts`, then filters published posts in the browser. Post detail pages fetch post data client-side by slug.

The current public positioning is still closer to a general tech blog. The homepage copy, categories, metadata, and footer do not yet communicate "Building AI Products in Public" or MomentTune as the main narrative.

Known SEO gaps from the live site and repository:

- Global metadata in `src/app/layout.tsx` uses `Suri Blog` and `A modern blog built with Clean Architecture`.
- `src/app/sitemap.ts` uses `NEXT_PUBLIC_SITE_URL` or `https://localhost:3000` and does not include post URLs yet.
- `public/robots.txt` points to `https://your-domain.com/sitemap.xml`.
- Post pages do not currently define post-specific metadata, canonical URLs, Open Graph, Twitter Card, or JSON-LD.
- Current categories are `Tech Insights`, `Code Solutions`, and `Study Journal`.

## Goal Structure

Primary routes should evolve toward:

- `/`: editorial homepage and brand entry.
- `/posts`: article list, filters, and search.
- `/posts/[slug]`: article detail with premium reading experience.
- `/categories/[slug]`: category hub pages for SEO.
- `/momenttune`: official MomentTune project and build log hub.
- `/about`: personal brand story and credibility.
- `/archives`: preserved archive of older content.
- `/contact`: contact and collaboration entry.
- `/rss.xml`: RSS feed.
- `/sitemap.xml`: complete sitemap with static pages, categories, and published posts.

Existing routes such as `/posts/[slug]`, `/about`, `/projects`, `/archives`, `/contact`, and `/write` must not be broken during renewal.

## Roadmap

### Phase 1: Foundation and Safety

Scope:

- Define final route map and URL preservation rules.
- Decide category migration from current categories to the renewed content architecture.
- Audit all published slugs before changing category or rendering logic.
- Fix crawler basics: `robots.txt`, sitemap base URL, and published post inclusion.
- Ensure public post APIs do not expose drafts unintentionally.

Expected files:

- `public/robots.txt`
- `src/app/sitemap.ts`
- `src/app/api/posts/route.ts`
- `src/infrastructure/api/posts.ts`
- `src/repositories/PrismaPostRepository/index.ts`
- `src/shared/constants/categories.ts`

Completion criteria:

- Production sitemap uses the real site URL.
- Published posts appear in the sitemap.
- Draft or unpublished posts are not exposed by public list endpoints by default.
- Existing published post slugs still resolve.

Testing:

- `npm run type-check`
- `npm run lint`
- `npm run build`
- Verify `/robots.txt`, `/sitemap.xml`, `/api/posts`, and selected `/posts/[slug]` locally.

### Phase 2: SEO Metadata Layer

Scope:

- Add site-wide `metadataBase`.
- Add page-specific metadata for core static pages.
- Add post-specific metadata for `/posts/[slug]`.
- Add canonical URL rules.
- Add Open Graph and Twitter Card metadata.
- Add JSON-LD for `WebSite`, `Person`, `BlogPosting`, `BreadcrumbList`, and MomentTune project pages.

Expected files:

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/posts/[slug]/page.tsx`
- `src/app/about/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/archives/page.tsx`
- `src/app/contact/page.tsx`
- possible SEO helper files under `src/lib` or `src/config`

Completion criteria:

- Each public page has a unique title and description.
- Each post uses its title, description or excerpt, published date, updated date, and canonical URL.
- Structured data validates conceptually against the page type.
- No old placeholder domain remains.

Testing:

- `npm run type-check`
- `npm run lint`
- `npm run build`
- Inspect generated HTML for selected pages.

### Phase 3: Content Architecture Migration

Scope:

- Introduce renewed categories: MomentTune, Startup, AI Automation, Product & UX, Build Log, Blog Growth.
- Map old categories to either archive labels or new categories.
- Design how `series`, `description`, `thumbnail`, and `draft` relate to the current Prisma model.
- Preserve old slugs and published dates unless a specific redirect is planned.

Expected files:

- `src/shared/constants/categories.ts`
- `src/entities/Post/index.ts`
- `prisma/schema.prisma`
- `prisma/migrations/*`
- `src/repositories/PrismaPostRepository/index.ts`
- `src/components/MarkdownEditor.tsx`
- `src/app/write/page.tsx`

Completion criteria:

- Existing posts remain readable.
- New posts can be classified by the renewed category system.
- Draft semantics are clear and consistent with `isPublished`.
- Any schema change has a migration and rollback path.

Testing:

- `npm run type-check`
- `npm run lint`
- `npm run build`
- Focused create/edit/read checks for posts if admin flows are changed.

### Phase 4: Editorial Redesign

Scope:

- Redesign homepage around "Building AI Products in Public."
- Add current mission section for MomentTune progress.
- Create featured article cards and visual journey timeline.
- Improve article list, article detail, category pages, about page, and MomentTune project page.
- Keep the reading experience content-first, calm, premium, and mobile-first.

Expected files:

- `src/app/page.tsx`
- `src/app/posts/[slug]/page.tsx`
- `src/app/about/page.tsx`
- `src/app/projects/page.tsx` or new `src/app/momenttune/page.tsx`
- `src/components/*`
- `src/styles/*`
- `src/config/designTokens.ts`

Completion criteria:

- Homepage immediately communicates the new positioning.
- Article detail has comfortable reading width and hierarchy.
- Mobile, tablet, and desktop layouts are reviewed.
- Existing links still work.

Testing:

- `npm run type-check`
- `npm run lint`
- `npm run build`
- Manual checks on mobile, tablet, and desktop widths.

### Phase 5: Growth and Monetization

Scope:

- Add newsletter signup.
- Add RSS if not already exposed as a route.
- Add related posts, topic hubs, and internal links.
- Prepare future affiliate disclosure and ad placement components.
- Add analytics events only after privacy and consent decisions are made.

Expected files:

- `src/components/RSSFeed.tsx`
- new route for RSS if needed
- newsletter component files
- article detail and category page components
- config files for disclosure or CTA copy

Completion criteria:

- Readers have a clear next action after reading.
- Internal links support SEO topic clusters.
- Monetization surfaces do not degrade the reading experience.

Testing:

- `npm run type-check`
- `npm run lint`
- `npm run build`
- Verify forms, links, RSS output, and article CTA behavior.

## URL and Content Migration Strategy

- Keep existing `/posts/[slug]` URLs.
- Do not rename slugs during visual redesign.
- If a slug must change later, add a redirect before publishing the change.
- Preserve `publishedAt` for historical posts.
- Use `updatedAt` only for meaningful revisions.
- Keep older React, frontend, and portfolio posts available, but consider grouping them under `/archives` or a legacy category view.
- Map old categories conservatively:
  - `Study Journal` can become `Build Log` or remain archived.
  - `Tech Insights` can map to `AI Automation`, `Product & UX`, or archive depending on each post.
  - `Code Solutions` can map to `Build Log` or archive depending on relevance.
- Add MomentTune and AI-focused content without deleting existing content.

## Risks

- Changing categories without redirects or archive logic can break filters and internal links.
- Moving from client-side post rendering to server metadata can expose missing data assumptions.
- Prisma schema changes can require careful migration and seed updates.
- Sitemap or robots mistakes can delay SEO recovery.
- Draft handling is currently split between API response and frontend filtering; this can leak unpublished content.
- Broad UI rewrites can unintentionally break admin writing flows.

## Rollback

- Keep each phase in a separate commit or pull request.
- For visual changes, preserve the old route structure until the replacement is verified.
- For schema changes, create Prisma migrations and document rollback SQL or restore steps.
- For content changes, export or back up database content before migration.
- For SEO changes, verify generated HTML and sitemap locally before deployment.
- If a deployment fails, roll back through Vercel to the previous successful deployment and revert the phase commit.
