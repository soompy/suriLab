import type { PostEntity } from '@/entities/Post'
import { prisma } from '@/lib/prisma'
import {
  getPublishedContentPostById,
  getPublishedContentPostBySlug,
  getPublishedContentPosts,
} from '@/lib/content'
import {
  getAdjacentPosts,
  getAllPublishedPostsForDetail,
  getPostDescription,
  getPublishedPostById,
  getPublishedPostBySlug,
  getRelatedPosts,
} from '../post-detail'

const contentPosts: PostEntity[] = [
  {
    id: 'content:content-post',
    title: 'Content Post',
    content: '## Content Heading\n\nContent body',
    excerpt: 'Content excerpt',
    description: 'Content excerpt',
    slug: 'content-post',
    publishedAt: new Date('2026-01-04'),
    updatedAt: new Date('2026-01-04'),
    tags: ['AI Workflow'],
    category: 'AI Workflow',
    authorId: 'content',
    readTime: 1,
    views: 0,
    featured: false,
    isPublished: true,
    draft: false,
    source: 'content',
    relatedPosts: ['related-explicit'],
  },
]

jest.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

jest.mock('@/lib/content', () => ({
  getPublishedContentPostBySlug: jest.fn(),
  getPublishedContentPostById: jest.fn(),
  getPublishedContentPosts: jest.fn(),
}))

const prismaMock = jest.mocked(prisma)
const getPublishedContentPostBySlugMock = jest.mocked(getPublishedContentPostBySlug)
const getPublishedContentPostByIdMock = jest.mocked(getPublishedContentPostById)
const getPublishedContentPostsMock = jest.mocked(getPublishedContentPosts)

function databasePost(overrides: Record<string, unknown> = {}) {
  return {
    id: 'db-post',
    title: 'Database Post',
    content: '<p>Database body</p>',
    excerpt: 'Database excerpt',
    series: null,
    thumbnail: null,
    slug: 'database-post',
    publishedAt: new Date('2026-01-03'),
    updatedAt: new Date('2026-01-03'),
    readTime: 2,
    views: 12,
    featured: false,
    isPublished: true,
    category: { name: 'MomentTune' },
    tags: [{ name: 'MomentTune' }, { name: 'Build Log' }],
    author: { id: 'author', name: 'Suri', email: 'suri@example.com' },
    authorId: 'author',
    ...overrides,
  }
}

function entity(overrides: Partial<PostEntity> = {}): PostEntity {
  return {
    id: 'base',
    title: 'Base',
    content: 'Base content',
    excerpt: 'Base excerpt',
    slug: 'base',
    publishedAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    tags: ['MomentTune'],
    category: 'MomentTune',
    authorId: 'author',
    readTime: 1,
    views: 0,
    featured: false,
    isPublished: true,
    draft: false,
    source: 'database',
    ...overrides,
  }
}

describe('post-detail data helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getPublishedContentPostBySlugMock.mockImplementation((slug) => (
      contentPosts.find((post) => post.slug === slug) || null
    ))
    getPublishedContentPostByIdMock.mockImplementation((id) => (
      contentPosts.find((post) => post.id === id) || null
    ))
    getPublishedContentPostsMock.mockReturnValue(contentPosts)
  })

  it('returns an existing published database post by slug', async () => {
    prismaMock.post.findFirst.mockResolvedValueOnce(databasePost())

    await expect(getPublishedPostBySlug('database-post')).resolves.toMatchObject({
      id: 'db-post',
      slug: 'database-post',
      category: 'MomentTune',
      tags: ['MomentTune', 'Build Log'],
      isPublished: true,
    })
    expect(prismaMock.post.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { slug: 'database-post', isPublished: true },
    }))
  })

  it('returns null for a missing slug', async () => {
    prismaMock.post.findFirst.mockResolvedValueOnce(null)

    await expect(getPublishedPostBySlug('missing')).resolves.toBeNull()
  })

  it('excludes drafts from public slug lookup through the query predicate', async () => {
    prismaMock.post.findFirst.mockResolvedValueOnce(null)

    await getPublishedPostBySlug('draft-post')

    expect(prismaMock.post.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { slug: 'draft-post', isPublished: true },
    }))
  })

  it('returns a published content post by slug', async () => {
    prismaMock.post.findFirst.mockResolvedValueOnce(null)

    await expect(getPublishedPostBySlug('content-post')).resolves.toMatchObject({
      id: 'content:content-post',
      source: 'content',
      isPublished: true,
    })
  })

  it('returns a published content post by id', async () => {
    await expect(getPublishedPostById('content:content-post')).resolves.toMatchObject({
      slug: 'content-post',
    })
  })

  it('falls back from excerpt to stripped content for descriptions', () => {
    expect(getPostDescription(entity({ excerpt: '', content: '<h2>Hello</h2>   world' }))).toBe('Hello world')
  })

  it('sorts published database and content posts by published date', async () => {
    prismaMock.post.findMany.mockResolvedValueOnce([
      databasePost({ id: 'older', slug: 'older', publishedAt: new Date('2026-01-02') }),
      databasePost({ id: 'newer', slug: 'newer', publishedAt: new Date('2026-01-05') }),
    ])

    await expect(getAllPublishedPostsForDetail()).resolves.toMatchObject([
      { slug: 'newer' },
      { slug: 'content-post' },
      { slug: 'older' },
    ])
  })

  it('scores explicit, shared tag, same series, and same category related posts', async () => {
    const current = entity({
      id: 'current',
      slug: 'current',
      tags: ['AI Workflow', 'Build Log'],
      category: 'MomentTune',
      series: 'launch',
      relatedPosts: ['related-explicit'],
    })
    prismaMock.post.findMany.mockResolvedValueOnce([
      databasePost({
        id: 'current',
        slug: 'current',
        tags: [{ name: 'AI Workflow' }, { name: 'Build Log' }],
        category: { name: 'MomentTune' },
        series: 'launch',
      }),
      databasePost({
        id: 'explicit',
        slug: 'related-explicit',
        tags: [{ name: 'Other' }],
        category: { name: 'Other' },
      }),
      databasePost({
        id: 'same-series',
        slug: 'same-series',
        tags: [{ name: 'AI Workflow' }],
        category: { name: 'MomentTune' },
        series: 'launch',
      }),
    ])

    await expect(getRelatedPosts(current)).resolves.toMatchObject([
      { slug: 'related-explicit' },
      { slug: 'same-series' },
      { slug: 'content-post' },
    ])
  })

  it('computes previous and next posts from published sort order', async () => {
    const current = entity({ id: 'middle', slug: 'middle', publishedAt: new Date('2026-01-03') })
    prismaMock.post.findMany.mockResolvedValueOnce([
      databasePost({ id: 'newer', slug: 'newer', publishedAt: new Date('2026-01-05') }),
      databasePost({ id: 'middle', slug: 'middle', publishedAt: new Date('2026-01-03') }),
      databasePost({ id: 'older', slug: 'older', publishedAt: new Date('2026-01-01') }),
    ])

    await expect(getAdjacentPosts(current)).resolves.toMatchObject({
      previous: { slug: 'older' },
      next: { slug: 'content-post' },
    })
  })
})
