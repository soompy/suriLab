import { absoluteUrl, createPageMetadata } from '../seo'

describe('SEO helpers', () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com/'
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl
  })

  it('creates absolute URLs without duplicate slashes', () => {
    expect(absoluteUrl('/posts/test-post')).toBe('https://example.com/posts/test-post')
  })

  it('adds canonical URL and description metadata', () => {
    const metadata = createPageMetadata({
      title: 'Post title',
      description: 'Post description',
      path: '/posts/test-post',
      type: 'article',
    })

    expect(metadata.description).toBe('Post description')
    expect(metadata.alternates?.canonical).toBe('https://example.com/posts/test-post')
    expect(metadata.openGraph?.type).toBe('article')
  })
})
