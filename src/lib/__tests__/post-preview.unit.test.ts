import type { PostEntity } from '@/entities/Post'
import { toPostListPreviewResponse, toPostPreview } from '@/lib/post-preview'

const basePost: PostEntity = {
  id: 'post-1',
  title: 'Preview post',
  content: 'Full content should not be embedded in list pages.',
  excerpt: 'Short excerpt',
  description: 'Short excerpt',
  thumbnail: 'data:image/png;base64,abc123',
  slug: 'preview-post',
  publishedAt: new Date('2026-08-22T00:00:00.000Z'),
  updatedAt: new Date('2026-08-22T00:00:00.000Z'),
  tags: ['SEO'],
  category: 'AI Workflow',
  authorId: 'owner-soomin',
  isPublished: true,
}

describe('post preview helpers', () => {
  it('removes content and inline thumbnails from list previews', () => {
    const preview = toPostPreview(basePost)

    expect(preview.content).toBe('')
    expect(preview.thumbnail).toBeNull()
  })

  it('keeps regular thumbnail URLs in list previews', () => {
    const preview = toPostPreview({
      ...basePost,
      thumbnail: '/images/profile.jpg',
    })

    expect(preview.thumbnail).toBe('/images/profile.jpg')
  })

  it('sanitizes posts inside list responses', () => {
    const response = toPostListPreviewResponse({
      posts: [basePost],
      total: 1,
      page: 1,
      totalPages: 1,
    })

    expect(response.posts[0].content).toBe('')
    expect(response.posts[0].thumbnail).toBeNull()
    expect(response.total).toBe(1)
  })
})
