# Content Architecture

## Editorial Position

SuriBlog is the public record of building AI products, especially MomentTune, while also documenting solo startup execution, AI automation, product decisions, and blog growth experiments.

The content system should support both narrative continuity and search-friendly topic hubs.

## Top-Level Categories

### MomentTune

Official project records for MomentTune.

Use for:

- product vision and strategy
- feature decisions
- roadmap updates
- launch notes
- user feedback and learnings
- metrics and business progress

Example tags:

- `MomentTune`
- `Music`
- `Emotion`
- `MVP`
- `Launch`
- `User Feedback`

### Startup

Solo founder execution, business decisions, MVP validation, and operating notes.

Use for:

- one-person startup process
- MVP scope decisions
- pricing experiments
- customer discovery
- market research
- founder reflections

Example tags:

- `Solo Founder`
- `MVP`
- `Validation`
- `Pricing`
- `Indie Hacking`
- `Business Model`

### AI Automation

Practical automation workflows using AI tools and agents.

Use for:

- workflow automation
- AI agent experiments
- prompt workflows
- no-code and low-code automation
- operations automation
- productivity systems

Example tags:

- `AI Agent`
- `Automation`
- `Workflow`
- `Prompting`
- `Claude`
- `Codex`

### Product & UX

Product planning, UX writing, UI decisions, design systems, and service design.

Use for:

- UX/UI design process
- product requirement decisions
- information architecture
- onboarding design
- design critique
- feature prioritization

Example tags:

- `UX`
- `UI`
- `Product Design`
- `Service Planning`
- `Design System`
- `User Research`

### Build Log

Chronological making-of records and implementation notes.

Use for:

- weekly build notes
- coding progress
- technical decision logs
- debugging records
- release preparation
- before-and-after implementation notes

Example tags:

- `Build in Public`
- `Week Note`
- `Next.js`
- `Prisma`
- `Refactor`
- `Release`

### Blog Growth

SEO, publishing, monetization, analytics, and content operation experiments.

Use for:

- SEO experiments
- content strategy
- AdSense preparation
- affiliate experiments
- newsletter growth
- digital product ideas

Example tags:

- `SEO`
- `Newsletter`
- `AdSense`
- `Affiliate`
- `Analytics`
- `Content Strategy`

## Post Fields

Each post should support the following editorial metadata.

| Field | Purpose | Current Mapping | Notes |
| --- | --- | --- | --- |
| `title` | Public article title | `Post.title` | Already exists. |
| `slug` | Stable URL segment | `Post.slug` | Must remain stable after publication. |
| `content` | Markdown article body | `Post.content` | Already exists. |
| `category` | One top-level category | `Post.category` through `Category` relation | Should migrate from current category names to the new taxonomy. |
| `tags` | Multiple specific topic labels | `Post.tags` through `Tag` relation | Use for tools, concepts, and subtopics. |
| `series` | Multi-post narrative grouping | Not currently modeled | Add later as a string field or relation if needed. |
| `publishedAt` | First publication date | `Post.publishedAt` | Preserve during migrations. |
| `updatedAt` | Last meaningful update date | `Post.updatedAt` | Already maintained by Prisma. |
| `description` | SEO and card summary | Currently closest to `Post.excerpt` | Prefer keeping `excerpt` as implementation field or aliasing it to description in UI. |
| `thumbnail` | Card and social preview image | Not currently modeled | Add later as optional field, or derive from default category artwork first. |
| `draft` | Editorial draft status | Inverse of `Post.isPublished` | Current DB uses `isPublished`; UI may expose `draft = !isPublished`. |
| `featured` | Homepage promotion | `Post.featured` | Already exists. |
| `readTime` | Reading time display | `Post.readTime` | Already exists. |

## Recommended Metadata Shape

Use this as the editorial contract even if the database keeps the current field names internally.

```ts
type BlogPostMeta = {
  title: string
  slug: string
  category: BlogCategory
  tags: string[]
  series?: string
  publishedAt: string
  updatedAt: string
  description: string
  thumbnail?: string
  draft: boolean
  featured?: boolean
  readTime?: number
}
```

## Category Slugs

Use stable, English URL slugs for category routes.

| Category | Slug |
| --- | --- |
| MomentTune | `momenttune` |
| Startup | `startup` |
| AI Automation | `ai-automation` |
| Product & UX | `product-ux` |
| Build Log | `build-log` |
| Blog Growth | `blog-growth` |

## Series Strategy

Series should represent a continuing narrative, not a topic tag.

Recommended starter series:

- `MomentTune 14-Week Build`
- `AI Coding Workflow`
- `Solo Founder MVP`
- `SuriBlog Renewal`
- `Blog Monetization Lab`

Rules:

- A post can belong to zero or one primary series at first.
- A series page can be added later if enough posts exist.
- Series names should remain stable once public.
- Series order can be derived from `publishedAt` until an explicit order field is needed.

## Tag Rules

- Tags should be specific and reusable.
- Avoid using the category name as the only tag.
- Prefer canonical forms such as `Codex`, `Claude Code`, `Next.js`, `MVP`, `SEO`.
- Keep Korean and English tag variants from duplicating the same meaning.
- Review tags monthly to merge near-duplicates.

## Draft and Publishing Rules

- Public list APIs should return published posts by default.
- Drafts should require admin authentication.
- Draft posts should not appear in sitemap, RSS, category pages, related posts, or public search.
- A post is public only when `isPublished === true`.
- In editorial UI, `draft` can be treated as `!isPublished`.

## Legacy Content Strategy

Existing React, frontend, and portfolio posts should be preserved.

Recommended handling:

- Keep old `/posts/[slug]` URLs.
- Reclassify relevant posts into `Build Log`, `Product & UX`, or `Blog Growth`.
- Move less relevant older posts into archive views instead of deleting them.
- Keep original publish dates.
- Add updated descriptions where old excerpts are too generic.
- Add redirects only if a URL must change.

## Content Templates

### MomentTune Build Log

- Context: what changed and why.
- Decision: what was chosen.
- Process: how it was built or tested.
- Result: what happened.
- Next: what will be tried next.

### AI Automation Essay

- Problem.
- Existing workflow.
- AI-assisted workflow.
- Tools and prompts used.
- Result and limitation.
- Reusable takeaway.

### Product & UX Note

- User problem.
- Product constraint.
- UX decision.
- Alternative considered.
- Final design or copy.
- Evidence or next test.

### Blog Growth Experiment

- Hypothesis.
- Setup.
- Metric.
- Result.
- Learning.
- Next experiment.
