# Branch Strategy

This strategy is designed for the SuriBlog renewal work while keeping the live blog stable.

## Goals

- Keep the deployed blog stable while renewal work progresses.
- Make each change small enough to review and roll back.
- Protect existing URLs, published content, and SEO-critical behavior.
- Separate documentation, SEO, design, content migration, and implementation work.
- Avoid mixing broad redesign work with security, database, or deployment changes.

## Branch Roles

### `main`

Stable production branch.

Rules:

- Only merge reviewed and verified work.
- Keep deployable at all times.
- Do not commit experiments directly.
- Do not commit `.env`, secrets, local build output, or generated cache files.
- Use this branch as the source of truth for production hotfixes.

### `renew/blog-v2`

Renewal integration branch.

Purpose:

- Collect approved SuriBlog renewal work before it is merged to `main`.
- Coordinate design system, SEO, content architecture, and page redesign work.
- Keep work staged in coherent phases instead of one large rewrite.

Rules:

- Merge feature branches into this branch first.
- Keep it buildable after each meaningful merge.
- Rebase or merge from `main` regularly if production hotfixes happen.
- Do not use it for unrelated experiments.

### Short-Lived Work Branches

Create short-lived branches from `renew/blog-v2` for each clear task.

Recommended naming:

- `docs/<topic>`
- `seo/<topic>`
- `content/<topic>`
- `design/<topic>`
- `feature/<topic>`
- `fix/<topic>`
- `chore/<topic>`

Examples:

- `docs/renewal-plan`
- `seo/sitemap-metadata`
- `content/category-taxonomy`
- `design/homepage-editorial`
- `feature/momenttune-page`
- `fix/draft-post-exposure`
- `chore/ignore-next-build-output`

## Recommended Flow

1. Start from the renewal integration branch.

```bash
git switch renew/blog-v2
```

2. Create a focused work branch.

```bash
git switch -c seo/sitemap-metadata
```

3. Make one clear unit of change.

Examples of good units:

- Add SEO checklist documentation.
- Fix `robots.txt` and sitemap base URL.
- Add post-specific metadata.
- Add category taxonomy constants.
- Build the MomentTune page shell.

Examples of changes that are too broad:

- Redesign every page and migrate the database in one branch.
- Replace MUI and change the content model in one branch.
- Change routing, SEO, and admin writing behavior together.

4. Verify the change.

For code changes, run:

```bash
npm run type-check
npm run lint
npm run build
```

For behavior changes with tests, also run:

```bash
npm run test
```

For documentation-only changes, at minimum run:

```bash
git diff --check
```

5. Merge the work branch into `renew/blog-v2`.

6. Merge `renew/blog-v2` into `main` only after a phase is complete and verified.

## Phase Branch Plan

Use the renewal plan phases as merge checkpoints.

| Phase | Integration Target | Example Work Branches |
| --- | --- | --- |
| Documentation | `renew/blog-v2` | `docs/renewal-plan`, `docs/branch-strategy` |
| SEO Foundation | `renew/blog-v2` | `seo/robots-sitemap`, `seo/post-metadata` |
| Content Architecture | `renew/blog-v2` | `content/category-taxonomy`, `content/post-metadata-model` |
| Editorial Redesign | `renew/blog-v2` | `design/homepage-editorial`, `design/article-detail`, `feature/momenttune-page` |
| Growth Features | `renew/blog-v2` | `feature/newsletter`, `feature/rss`, `feature/related-posts` |
| Production Hardening | `main` through PR | `fix/draft-exposure`, `chore/remove-next-tracking`, `fix/auth-logging` |

## Commit Guidelines

Use concise, scoped commit messages.

Recommended prefixes:

- `docs:` documentation only
- `seo:` metadata, sitemap, robots, structured data
- `content:` taxonomy, post fields, editorial structure
- `design:` visual and layout changes
- `feature:` new user-facing functionality
- `fix:` bug or security-related fix
- `chore:` maintenance, config, cleanup
- `test:` tests only

Examples:

```bash
docs: add renewal planning documents
seo: add published posts to sitemap
content: define renewed blog categories
design: redesign homepage hero and mission section
fix: hide unpublished posts from public API
chore: stop tracking next build output
```

## Pull Request Rules

Each PR should include:

- Purpose of the change.
- Changed files summary.
- Screenshots for visual changes.
- SEO impact for public route changes.
- Migration notes for data or URL changes.
- Verification commands and results.
- Rollback notes for risky changes.

Do not merge if:

- TypeScript, lint, or build fails.
- Existing published post URLs break.
- Draft content becomes publicly visible.
- Placeholder domains or secrets are introduced.
- Mobile layout has obvious horizontal overflow.

## Release Strategy

### Documentation Releases

Documentation branches can merge into `renew/blog-v2` quickly after review.

### SEO and Security Releases

SEO and security fixes can be promoted to `main` before the full redesign if they reduce production risk.

Recommended candidates:

- Correct `robots.txt`.
- Correct sitemap base URL.
- Exclude drafts from public APIs.
- Add post-specific metadata.
- Remove tracked build output.
- Remove insecure auth fallbacks.

### Redesign Releases

Redesign should be released by route or surface, not as one giant switch.

Recommended order:

1. SEO and content model safety.
2. Homepage redesign.
3. Article detail redesign.
4. Article list and category pages.
5. MomentTune project page.
6. Newsletter and growth surfaces.

## Hotfix Flow

Use hotfix branches from `main` for urgent production issues.

```bash
git switch main
git switch -c fix/<issue-name>
```

After the fix is merged into `main`, merge or cherry-pick it back into `renew/blog-v2`.

Hotfix examples:

- Broken production route.
- Exposed draft content.
- Incorrect robots or sitemap blocking indexing.
- Authentication issue.
- Deployment failure.

## Security Rules

- Never commit `.env`, `.env.local`, production database URLs, API keys, JWT secrets, admin passwords, or mail app passwords.
- Prefer GitHub or Vercel secrets for deployment configuration.
- Review staged files with `git diff --cached` before every commit.
- Do not use `git add .` when security-sensitive files may exist.
- Prefer explicit staging:

```bash
git add AGENTS.md docs/BLOG_RENEWAL_PLAN.md docs/CONTENT_ARCHITECTURE.md docs/SEO_CHECKLIST.md docs/BRANCH_STRATEGY.md
```

## Current Recommendation

The current branch `renew/blog-v2` is appropriate as the renewal integration branch.

Recommended next commit:

```bash
git add AGENTS.md docs/BLOG_RENEWAL_PLAN.md docs/CONTENT_ARCHITECTURE.md docs/SEO_CHECKLIST.md docs/BRANCH_STRATEGY.md
git commit -m "docs: add blog renewal planning docs"
```

Before committing, verify:

```bash
git status --short
git diff --cached --name-only
git diff --cached
```
