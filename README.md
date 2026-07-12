# SuriBlog

SuriBlog는 MomentTune 제작기, AI 자동화, AI 코딩 도구, 1인 프로젝트 빌드 과정을 기록하는 개인 브랜드 블로그입니다.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Material UI
- Prisma ORM
- PostgreSQL
- Vercel

## Features

- Database-backed post publishing through the admin editor
- Published/draft post handling
- Category, tag, series, thumbnail, description, published/updated date fields
- Article detail page with table of contents
- Related posts
- Previous and next post navigation
- Category archive pages: `/categories/[slug]`
- Tag archive pages: `/tags/[slug]`
- Breadcrumb UI and BreadcrumbList JSON-LD
- BlogPosting JSON-LD
- Canonical URLs
- Open Graph and Twitter Card metadata
- Dynamic sitemap: `/sitemap.xml`
- Dynamic RSS feed: `/rss.xml`
- Robots rules: `/robots.txt`
- Google Search Console verification metadata
- GA4 support through `NEXT_PUBLIC_GA_ID`

## Routes

- `/`: homepage
- `/articles`: all published articles
- `/posts/[slug]`: article detail
- `/categories/[slug]`: category archive
- `/tags/[slug]`: tag archive
- `/momenttune`: MomentTune project page
- `/build-log`: build log page
- `/about`: author profile
- `/admin`: private admin entry
- `/rss.xml`: RSS feed
- `/sitemap.xml`: sitemap
- `/robots.txt`: robots rules

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Use `.env.local` for local secrets. Do not commit real environment values.

## Environment Variables

Use real values only in Vercel Environment Variables or local `.env.local`.

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
BLOG_ADMIN_PASSWORD=your-secure-admin-password
JWT_SECRET=your-long-random-jwt-secret
NEXT_PUBLIC_SITE_URL=https://suri-blog.vercel.app
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=google-site-verification-token
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password
```

Security rules:

- Do not commit `.env`, `.env.local`, database URLs, passwords, tokens, or private keys.
- `.env.example` and documentation must contain placeholders only.
- If a secret is ever committed, rotate it immediately in the external provider.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
npm run test
npm run db:migrate
npm run db:seed
npm run db:studio
npm run vercel-build
```

## Project Structure

```text
src/app                 App Router pages, layouts, route handlers
src/components          UI components and blog surfaces
src/entities            Post domain types
src/usecases            Application use cases
src/repositories        Repository interfaces and Prisma implementation
src/infrastructure      API handler orchestration
src/lib                 SEO, auth, Prisma, taxonomy, and shared server utilities
src/shared              Shared constants
prisma                  Prisma schema, migrations, seed data
docs                    Renewal, SEO, deployment, and architecture docs
```

## Content And SEO Flow

1. Create or edit a post in `/admin`.
2. Publish the post.
3. The post appears automatically in `/articles`, category pages, tag pages, sitemap, and RSS.
4. The article detail page renders metadata, BlogPosting JSON-LD, BreadcrumbList JSON-LD, table of contents, related posts, and previous/next links.

## Verification Checklist

Run before pushing code changes:

```bash
npm run type-check
npm run lint
npm run build
```

After deployment, verify:

- `/rss.xml` returns published posts.
- `/sitemap.xml` includes posts, category pages, and tag pages.
- `/robots.txt` allows public content and blocks admin/API/write routes.
- GA4 appears only when `NEXT_PUBLIC_GA_ID` exists.
- Admin login works with the rotated `BLOG_ADMIN_PASSWORD`.

