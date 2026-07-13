import { notFound } from 'next/navigation'
import EditorialCollectionPage from '@/components/EditorialCollectionPage'
import type { PostEntity } from '@/entities/Post'
import { getPosts } from '@/infrastructure/api/posts'
import { prisma } from '@/lib/prisma'
import { findNameBySlug } from '@/lib/taxonomy'
import { getPublishedContentPosts } from '@/lib/content'

export const revalidate = 300

type TagPageProps = {
  params: Promise<{ slug: string }>
}

async function getTagName(slug: string) {
  const tags = await prisma.tag.findMany({
    select: { name: true },
    orderBy: { name: 'asc' },
  })
  const contentTags = getPublishedContentPosts().flatMap((post) => post.tags)

  return findNameBySlug([
    ...tags.map((tag) => tag.name),
    ...contentTags,
  ], slug)
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const tagName = await getTagName(slug)

  if (!tagName) {
    notFound()
  }

  let initialPosts: PostEntity[] = []
  let initialError: string | null = null

  try {
    const result = await getPosts(
      { tags: [tagName], isPublished: true },
      { field: 'publishedAt', order: 'desc' },
      { page: 1, limit: 200 }
    )
    initialPosts = result.posts.map((post) => ({ ...post, content: '' }))
  } catch (error) {
    console.error('Failed to load tag posts:', error)
    initialError = '태그 글 목록을 불러오지 못했습니다.'
  }

  return (
    <EditorialCollectionPage
      eyebrow="Tag"
      title={`#${tagName}`}
      description={`#${tagName} 태그가 달린 글을 모았습니다.`}
      heroLabel="Tag archive"
      emptyTitle="이 태그에 발행된 글이 없습니다."
      emptyDescription="새 글이 발행되면 이곳에 자동으로 표시됩니다."
      focusItems={[
        '같은 키워드로 연결된 글을 이어서 탐색할 수 있습니다.',
        '발행된 글만 노출하며 초안은 포함하지 않습니다.',
        '세부 주제별 검색 유입을 위한 태그 허브입니다.',
      ]}
      initialPosts={initialPosts}
      initialError={initialError}
    />
  )
}
