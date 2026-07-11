# SEO Checklist

This checklist is based on the current Next.js App Router, Prisma, and database-backed post structure.

## Technical SEO

### Site Identity

- Set the production site URL in configuration and environment variables.
- Remove placeholder domains such as `https://your-domain.com` and `https://yourdomain.com`.
- Ensure `metadataBase` is configured in `src/app/layout.tsx`.
- Keep `<html lang="ko">` unless the site language strategy changes.

### Metadata

- Add unique title and description for every public route.
- Use post-specific metadata for `/posts/[slug]`.
- Use the post title, description or excerpt, category, published date, and updated date in metadata.
- Avoid repeating the global `Suri Blog` title on all pages.
- Keep metadata aligned with the new positioning: building AI products in public.

### Canonical URLs

- Define canonical URLs for:
  - homepage
  - post detail pages
  - category pages
  - about page
  - MomentTune page
  - archives
- Use one canonical host, currently expected to be `https://suri-blog.vercel.app` until a custom domain is configured.
- Avoid canonical URLs that point to localhost, preview domains, or placeholder domains.

### Sitemap

- Update `src/app/sitemap.ts`.
- Use the production base URL.
- Include static public pages.
- Include only published posts.
- Include future category pages once they exist.
- Use `updatedAt` or meaningful content modification dates for posts.
- Exclude `/admin`, `/api`, `/write`, drafts, and private routes.

### Robots

- Update `public/robots.txt`.
- Point `Sitemap:` to the real sitemap URL.
- Keep admin, API, and write routes disallowed.
- Confirm public routes such as `/posts`, `/about`, `/archives`, category pages, and MomentTune pages are crawlable.

### Open Graph

- Add Open Graph metadata for:
  - homepage
  - article pages
  - category pages
  - MomentTune page
  - about page
- Use a meaningful title, description, URL, site name, and image.
- Add a default OG image if a post thumbnail is not available.
- Avoid dark, generic, or purely decorative images for article previews.

### Twitter Card

- Use `summary_large_image` for posts and major pages.
- Use the same title and description strategy as Open Graph.
- Provide a fallback image for posts without thumbnails.

### JSON-LD

- Add `WebSite` structured data for the site.
- Add `Person` structured data for the author and personal brand.
- Add `BlogPosting` structured data for article pages.
- Add `BreadcrumbList` structured data for posts and category pages.
- Add project-oriented structured data for the MomentTune page when the page exists.
- Use published and modified dates from post data.

### URL and Indexing Hygiene

- Keep published post slugs stable.
- Add redirects before changing any published URL.
- Ensure unknown post slugs return a real 404 page.
- Ensure drafts do not return public indexable pages.
- Exclude draft and admin data from public APIs by default.
- Avoid duplicate category URLs with inconsistent capitalization.

### Performance

- Prefer server-rendered metadata and content where practical.
- Reduce unnecessary client-side JavaScript for static article reading.
- Optimize thumbnails and article images.
- Use stable image dimensions to prevent layout shift.
- Keep font loading intentional and minimal.
- Run local build before deployment.

### Accessibility

- Use one clear `h1` per page.
- Keep heading hierarchy logical.
- Ensure navigation, filters, and buttons are keyboard accessible.
- Add alt text for content images and thumbnails.
- Maintain visible focus states.
- Meet contrast requirements for text, tags, and buttons.

### Mobile

- Validate homepage, article list, article detail, category pages, and admin write flow on mobile widths.
- Avoid horizontal overflow in article cards, tags, code blocks, and tab lists.
- Keep readable line length and font sizes on mobile.
- Ensure tap targets are large enough.

## Content SEO

### Positioning

- Make the homepage communicate "Building AI Products in Public" immediately.
- Make MomentTune visible as a primary project, not a hidden portfolio item.
- Align page titles and descriptions with AI product building, solo startup, automation, and product design.

### Topic Architecture

- Use the renewed top-level categories:
  - MomentTune
  - Startup
  - AI Automation
  - Product & UX
  - Build Log
  - Blog Growth
- Build category hub pages once enough content exists.
- Use internal links from posts to category hubs and related series.
- Preserve older posts but avoid letting legacy frontend categories dominate the homepage.

### Article Metadata

- Every published post should have:
  - clear title
  - stable slug
  - category
  - tags
  - description or excerpt
  - published date
  - updated date
  - draft or published status
  - thumbnail or default OG image strategy
  - optional series

### Search Intent

- Define the target reader and search intent before writing.
- Use titles that match real reader questions or goals.
- Put the main topic in the title, introduction, and first meaningful heading.
- Avoid vague titles that only make sense to the author.
- Write descriptions that can work as search snippets.

### Reading Experience

- Keep intros direct and specific.
- Use headings that help scanning.
- Keep paragraphs short enough for mobile reading.
- Use code blocks only when they serve the article.
- Add summaries, decisions, or takeaways for long build logs.

### Internal Linking

- Link MomentTune build logs to the MomentTune project page.
- Link related AI automation posts to each other.
- Link startup experiments to broader Startup category pages.
- Link older relevant React or Next.js posts only when they support the current article.
- Add related posts at the end of article pages.

### Images

- Use meaningful thumbnails for featured and article cards.
- Add descriptive alt text.
- Prefer images that show product state, UI decisions, diagrams, or real artifacts.
- Use a default category image only when no better article image exists.

### Freshness

- Use `updatedAt` for meaningful updates, not cosmetic edits.
- Add a short update note when an old post is substantially revised.
- Review high-value SEO posts periodically for outdated tooling or links.

### Monetization Readiness

- Add affiliate disclosure before affiliate links are introduced.
- Keep newsletter signup contextual and unobtrusive.
- Add product or service CTAs only where relevant.
- Avoid ad placements that interrupt article comprehension.
- Track which topics lead to subscribers, product interest, or conversions.

## Pre-Publish Checklist

- Title is specific and searchable.
- Description is written and not duplicated.
- Category is one of the renewed top-level categories.
- Tags are normalized and useful.
- Slug is stable and readable.
- Draft status is correct.
- Thumbnail or fallback OG image is available.
- Internal links are added where useful.
- Mobile layout has no horizontal overflow.
- Post appears or does not appear in sitemap according to published state.
- Public API behavior matches the intended published state.
