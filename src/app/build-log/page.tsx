import EditorialCollectionPage from '@/components/EditorialCollectionPage'
import { getPublishedContentPosts } from '@/lib/content'
import { toPostPreviews } from '@/lib/post-preview'

export const revalidate = 300

export default function BuildLogPage() {
  const initialPosts = getPublishedContentPosts()
    .filter((post) => post.category === 'Build Log')
  const previewPosts = toPostPreviews(initialPosts)

  return (
    <EditorialCollectionPage
      eyebrow="Making Notes"
      title="Build Log"
      description="Claude Code, Codex, AI 코딩 도구와 MVP 제작 과정을 실제 실행 기록 중심으로 정리합니다."
      category="Build Log"
      heroLabel="Shipping with AI tools"
      emptyTitle="Build Log 글을 준비 중입니다."
      emptyDescription="Build Log 카테고리 글이 발행되면 이곳에 모입니다."
      focusItems={[
        'AI 코딩 도구를 어떻게 사용했는지 결과보다 과정을 남깁니다.',
        '작은 MVP를 만들며 생긴 판단, 오류, 수정 과정을 재사용 가능한 기록으로 바꿉니다.',
        '실험과 회고를 함께 남겨 다음 제품 제작 속도를 높이는 데 초점을 둡니다.'
      ]}
      initialPosts={previewPosts}
    />
  )
}
