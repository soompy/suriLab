# Testing Harness

This project uses Jest with Testing Library for unit/component coverage and Playwright for browser E2E checks.

## Commands

- `npm run test:unit`: runs focused non-DOM unit tests.
- `npm run test:components`: runs React component tests under `src/components/__tests__`.
- `npm run test:ci`: runs the full Jest suite serially for stable CI output.
- `npm run test:e2e`: starts the Next.js dev server on port `3100` and runs Playwright.
- `npm run test:all`: runs type check, lint, content validation, Jest, build, and E2E in sequence.

## Jest Harness

Jest is configured through `next/jest` in `jest.config.js`. The shared setup in `jest.setup.js` provides browser API shims, stable `next/navigation` mocks, and `next/image`/`next/link` test doubles for App Router components.

Use `src/test/test-utils.tsx` for component tests that need the app theme providers or navigation state.

## Playwright Harness

The Playwright config lives in `playwright.config.ts`. By default it starts `npm run dev -- --hostname 127.0.0.1 --port 3100`.

Set `PLAYWRIGHT_BASE_URL` to run the same tests against an already running local or deployed app:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e
```

The E2E tests fail on browser console errors and uncaught page errors. The initial coverage checks the published markdown post detail route and verifies that missing or unpublished detail routes return a 404.

Install Playwright browsers before first E2E execution when the local machine does not already have them:

```sh
npx playwright install chromium
```
