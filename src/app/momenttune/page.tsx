import EditorialCollectionPage from '@/components/EditorialCollectionPage'

export default function MomentTunePage() {
  return (
    <EditorialCollectionPage
      eyebrow="Product Journal"
      title="MomentTune"
      description="감정과 순간에 맞는 음악 경험을 제품으로 만들며 쌓는 공식 제작 기록입니다. 아이디어, MVP, 사용자 흐름, 출시 준비를 차분하게 추적합니다."
      category="MomentTune"
      heroLabel="Building MomentTune in public"
      emptyTitle="MomentTune 제작 기록을 준비 중입니다."
      emptyDescription="MomentTune 카테고리 글이 발행되면 이곳에 모입니다."
      focusItems={[
        '블로그 전체를 제품 홍보 사이트처럼 만들지 않고 제작 기록만 독립적으로 모읍니다.',
        '주차별 의사결정, 실험, 배운 점을 추적해 공식 로그 역할을 하게 합니다.',
        '나중에 서비스 런칭 페이지와 연결될 수 있는 신뢰 자산을 축적합니다.'
      ]}
    />
  )
}
