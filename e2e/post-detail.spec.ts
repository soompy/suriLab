import { expect, test as base } from '@playwright/test'

const publishedSlug = 'momenttune-week-3-test'
const relatedSlug = 'momenttune-related-e2e'
const draftLikeSlug = 'draft-e2e-fixture'

const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const consoleErrors: string[] = []

      page.on('console', (message) => {
        const text = message.text()

        if (message.type() === 'error' && !text.includes('server responded with a status of 404')) {
          consoleErrors.push(text)
        }
      })
      page.on('pageerror', (error) => {
        consoleErrors.push(error.message)
      })

      await use(consoleErrors)
      expect(consoleErrors).toEqual([])
    },
    { auto: true },
  ],
})

test.describe('post detail page', () => {
  test('renders the homepage', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /실험하고 만들고\s*기록합니다/ })).toBeVisible()
    await expect(page.getByRole('button', { name: '글 읽기' })).toBeVisible()
  })

  test('renders a published markdown post with metadata and related surfaces', async ({ page }) => {
    await page.goto(`/posts/${publishedSlug}`)

    await expect(page.getByRole('heading', { level: 1, name: '블로그 글 발행 테스트' })).toBeVisible()
    await expect(page.getByText('MomentTune 테스트 글을 통해 Markdown 기반 콘텐츠 작성')).toBeVisible()
    await expect(page.getByText('2026년 7월 12일')).toBeVisible()
    await expect(page.getByRole('link', { name: 'MomentTune' }).first()).toBeVisible()
    await expect(page.getByText('1분 읽기')).toBeVisible()
    await expect(page.getByRole('heading', { name: '시작 계기' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '검증 목록' })).toBeVisible()
    await expect(page.getByText('Markdown 목록 렌더링')).toBeVisible()
    await expect(page.getByRole('link', { name: 'MomentTune 섹션으로 이동' })).toHaveAttribute('href', '/momenttune')
    await expect(page.getByRole('heading', { name: '이어서 읽기' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '작성자 정보' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '관련 글', exact: true })).toBeVisible()
    await expect(page.locator(`a[href="/posts/${relatedSlug}"]`).last()).toHaveAttribute(
      'href',
      `/posts/${relatedSlug}`
    )
    await expect(page.getByRole('heading', { name: '댓글' })).toHaveCount(0)
    await expect(page.getByLabel('좋아요')).toHaveCount(0)
    await expect(page).toHaveTitle(/블로그 글 발행 테스트 \| SuriBlog/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /MomentTune 테스트 글을 통해 Markdown 기반 콘텐츠 작성/
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/posts\/momenttune-week-3-test$/
    )
  })

  test('navigates through related and adjacent post links', async ({ page }) => {
    await page.goto(`/posts/${publishedSlug}`)

    await page.locator(`a[href="/posts/${relatedSlug}"]`).last().click()
    await expect(page).toHaveURL(new RegExp(`/posts/${relatedSlug}$`))
    await expect(page.getByRole('heading', { level: 1, name: 'MomentTune 관련 글 테스트' })).toBeVisible()

    await page.locator(`a[href="/posts/${publishedSlug}"]`).first().click()
    await expect(page).toHaveURL(new RegExp(`/posts/${publishedSlug}$`))
    await expect(page.getByRole('heading', { level: 1, name: '블로그 글 발행 테스트' })).toBeVisible()
  })

  test('renders core post content on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/posts/${publishedSlug}`)

    await expect(page.getByRole('heading', { level: 1, name: '블로그 글 발행 테스트' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '검증 목록' })).toBeVisible()
  })

  test('does not expose unpublished or missing posts', async ({ page }) => {
    const response = await page.goto(`/posts/${draftLikeSlug}`)

    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: /404|not found/i })).toBeVisible()
  })
})
