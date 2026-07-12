import EditorialCollectionPage from '@/components/EditorialCollectionPage'
import type { PostEntity } from '@/entities/Post'
import { getPosts } from '@/infrastructure/api/posts'

export const revalidate = 300

export default async function ArticlesPage() {
  let initialPosts: PostEntity[] = []
  let initialError: string | null = null

  try {
    const result = await getPosts(
      { isPublished: true },
      { field: 'publishedAt', order: 'desc' },
      { page: 1, limit: 200 }
    )
    initialPosts = result.posts.map((post) => ({
      ...post,
      content: ''
    }))
  } catch (error) {
    console.error('Failed to load initial articles:', error)
    initialError = '데이터베이스에 연결하지 못해 글 목록을 불러올 수 없습니다.'
  }

  return (
    <EditorialCollectionPage
      eyebrow="Editorial Index"
      title="Articles"
      description="MomentTune 제작기, AI 자동화, 1인 창업, 제품 기획과 블로그 성장 실험을 한 곳에서 읽는 전체 글 목록입니다."
      heroLabel="All essays"
      emptyTitle="아직 발행된 글이 없습니다."
      emptyDescription="새 글이 발행되면 이곳에 전체 글 목록이 표시됩니다."
      focusItems={[
        '검색 유입을 고려한 문제 해결형 글과 제작기를 함께 쌓습니다.',
        '카테고리보다 읽는 흐름을 우선하는 매거진형 인덱스입니다.',
        '향후 뉴스레터, 리소스, 디지털 상품으로 확장할 수 있는 콘텐츠 허브입니다.'
      ]}
      initialPosts={initialPosts}
      initialError={initialError}
    />
  )
}
