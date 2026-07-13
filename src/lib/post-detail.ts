import { prisma } from '@/lib/prisma'
import { getPublishedContentPostById, getPublishedContentPostBySlug, getPublishedContentPosts } from '@/lib/content'
import type { PostEntity } from '@/entities/Post'

type DatabasePost = Awaited<ReturnType<typeof prisma.post.findFirst>> & {
  tags?: { name: string }[]
  category?: { name: string }
}

const includePostRelations = {
  tags: true,
  category: true,
  author: true,
} as const

function mapDatabasePostToEntity(post: NonNullable<DatabasePost>): PostEntity {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    description: post.excerpt,
    series: post.series,
    thumbnail: post.thumbnail,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    tags: post.tags?.map((tag) => tag.name) || [],
    category: post.category?.name || '',
    authorId: post.authorId,
    readTime: post.readTime || undefined,
    views: post.views,
    featured: post.featured,
    isPublished: post.isPublished,
    draft: !post.isPublished,
    source: 'database',
  }
}

export function getPostDescription(post: Pick<PostEntity, 'excerpt' | 'content'> | null) {
  if (!post) return ''

  return post.excerpt || post.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
}

export async function getPublishedPostBySlug(slug: string): Promise<PostEntity | null> {
  let databasePost: DatabasePost | null = null

  try {
    databasePost = await prisma.post.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: includePostRelations,
    })
  } catch (error) {
    console.warn('Database post lookup failed; falling back to content posts.', error)
  }

  if (databasePost) {
    return mapDatabasePostToEntity(databasePost)
  }

  return getPublishedContentPostBySlug(slug)
}

export async function getPublishedPostById(id: string): Promise<PostEntity | null> {
  if (id.startsWith('content:')) {
    return getPublishedContentPostById(id)
  }

  let databasePost: DatabasePost | null = null

  try {
    databasePost = await prisma.post.findFirst({
      where: {
        id,
        isPublished: true,
      },
      include: includePostRelations,
    })
  } catch (error) {
    console.warn('Database post lookup failed; falling back to content posts.', error)
  }

  return databasePost ? mapDatabasePostToEntity(databasePost) : null
}

export async function getAllPublishedPostsForDetail(): Promise<PostEntity[]> {
  let databasePosts: NonNullable<DatabasePost>[] = []

  try {
    databasePosts = await prisma.post.findMany({
      where: { isPublished: true },
      include: includePostRelations,
      orderBy: { publishedAt: 'desc' },
    })
  } catch (error) {
    console.warn('Database post list lookup failed; falling back to content posts.', error)
  }

  return [...databasePosts.map(mapDatabasePostToEntity), ...getPublishedContentPosts()]
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

export async function getRelatedPosts(post: PostEntity, limit = 3): Promise<PostEntity[]> {
  const explicitRelatedSlugs = post.relatedPosts || []
  const allPosts = await getAllPublishedPostsForDetail()

  return allPosts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag)).length
      const sameSeries = post.series && candidate.series === post.series ? 2 : 0
      const sameCategory = candidate.category === post.category ? 1 : 0
      const explicit = explicitRelatedSlugs.includes(candidate.slug) ? 10 : 0

      return {
        post: candidate,
        score: explicit + sharedTags + sameSeries + sameCategory,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}

export async function getAdjacentPosts(post: PostEntity) {
  const allPosts = await getAllPublishedPostsForDetail()
  const currentIndex = allPosts.findIndex((candidate) => candidate.id === post.id)

  return {
    previous: currentIndex >= 0 ? allPosts[currentIndex + 1] || null : null,
    next: currentIndex > 0 ? allPosts[currentIndex - 1] || null : null,
  }
}

export function getPublishedPostByIdSync(id: string) {
  return getPublishedContentPostById(id)
}
