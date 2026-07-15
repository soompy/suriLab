const { ContentIdeaProvider } = require('./base-provider')
const { slugify, today } = require('../utils')

const IDEA_TITLES = [
  'AI Agent를 실제 프로젝트에 붙이기 전에 정해야 할 운영 규칙',
  'Claude Code로 MVP 기능을 쪼개 만들 때 남겨야 할 기록',
  'Codex와 함께 블로그 SEO 구조를 점검하며 배운 것',
  'Claude를 동료처럼 쓰기 위해 만든 질문 리스트',
  '바이브코딩으로 빠르게 만들수록 더 중요해지는 검수 루틴',
  '1인 창업자가 MVP 검증 전에 정해야 하는 최소 지표',
  '프로젝트 빌더 관점에서 AI 도구를 고르는 기준',
  'MomentTune 3주차에 제품 방향을 다시 정리한 이유',
  'AI 직원을 운영할 때 사람에게 남겨야 하는 마지막 판단',
  '블로그 자동화 파이프라인을 만들며 정한 발행 안전장치',
]

class MockContentIdeaProvider extends ContentIdeaProvider {
  async generateIdeas({ topics, count = 10 }) {
    const createdAt = new Date().toISOString()

    return IDEA_TITLES.slice(0, count).map((title, index) => {
      const topic = topics[index % topics.length]
      const slug = slugify(title) || `content-idea-${index + 1}`

      return {
        id: `idea-${today().replace(/-/g, '')}-${String(index + 1).padStart(2, '0')}`,
        title,
        slug,
        topic: topic.name,
        targetKeyword: topic.seedKeywords[0],
        searchIntent: '실제 프로젝트에 AI 도구를 적용하려는 독자가 실행 방법과 판단 기준을 찾는다.',
        readerProblem: 'AI 도구 사용법은 많지만 실제 제품 제작 과정에서 어디까지 맡기고 어떻게 검수해야 할지 모른다.',
        uniqueExperienceAngle: 'MomentTune과 SuriBlog 자동화 작업에서 직접 겪은 판단, 실패, 수정 과정을 연결한다.',
        recommendedOutline: [
          '문제 상황',
          '왜 이 작업을 시작했는지',
          '실제 사용한 방법',
          '시행착오',
          '결과',
          '독자가 적용하는 방법',
          '관련 글',
          'CTA',
        ],
        relatedPosts: ['momenttune-week-3-test'],
        monetizationPath: topic.monetizationPotential === 'high'
          ? '향후 AI workflow 템플릿, 디지털 상품, 컨설팅형 서비스로 확장 가능'
          : '뉴스레터 구독과 개인 브랜드 신뢰 구축에 기여',
        status: 'idea',
        createdAt,
      }
    })
  }
}

module.exports = {
  MockContentIdeaProvider,
}

