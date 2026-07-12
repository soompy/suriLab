import { notFound } from 'next/navigation'
import EditorialCollectionPage from '@/components/EditorialCollectionPage'
import type { PostEntity } from '@/entities/Post'
import { getPosts } from '@/infrastructure/api/posts'
import { prisma } from '@/lib/prisma'
import { findNameBySlug } from '@/lib/taxonomy'

export const revalidate = 300

type CategoryPageProps = {
  params: Promise<{ slug: string }>
}

async function getCategoryName(slug: string) {
  const categories = await prisma.category.findMany({
    select: { name: true },
    orderBy: { name: 'asc' },
  })

  return findNameBySlug(categories.map((category) => category.name), slug)
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const categoryName = await getCategoryName(slug)

  if (!categoryName) {
    notFound()
  }

  let initialPosts: PostEntity[] = []
  let initialError: string | null = null

  try {
    const result = await getPosts(
      { category: categoryName, isPublished: true },
      { field: 'publishedAt', order: 'desc' },
      { page: 1, limit: 200 }
    )
    initialPosts = result.posts.map((post) => ({ ...post, content: '' }))
  } catch (error) {
    console.error('Failed to load category posts:', error)
    initialError = '카테고리 글 목록을 불러오지 못했습니다.'
  }

  return (
    <EditorialCollectionPage
      eyebrow="Category"
      title={categoryName}
      description={`${categoryName} 주제로 발행된 글을 모았습니다.`}
      category={categoryName}
      heroLabel="Category archive"
      emptyTitle="이 카테고리에 발행된 글이 없습니다."
      emptyDescription="새 글이 발행되면 이곳에 자동으로 표시됩니다."
      focusItems={[
        '같은 주제의 제작기와 실험 기록을 이어서 읽을 수 있습니다.',
        '발행된 글만 노출하며 초안은 포함하지 않습니다.',
        '검색 유입과 내부 링크 흐름을 위한 카테고리 허브입니다.',
      ]}
      initialPosts={initialPosts}
      initialError={initialError}
    />
  )
}
