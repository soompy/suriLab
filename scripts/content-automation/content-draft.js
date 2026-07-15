#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const {
  QUEUE_ROOT,
  ensureDir,
  findIdeaById,
  parseArgs,
  stringifyFrontMatter,
  today,
} = require('./utils')

function inferCategory(idea) {
  const topicToCategory = {
    'AI Agent 구축기': 'AI Workflow',
    'Claude Code 활용': 'AI Workflow',
    'Codex 활용': 'AI Workflow',
    'Claude Cowork': 'AI Workflow',
    '바이브코딩': 'AI Workflow',
    '1인 창업': 'Startup',
    '프로젝트 빌더': 'Career',
    'MomentTune 개발기': 'MomentTune',
    'AI 직원 운영': 'AI Workflow',
    'AI 프로젝트 문서화': 'AI Workflow',
    'UX 설계': 'MomentTune',
    'MVP 제작': 'Startup',
    '블로그 자동화': 'AI Workflow',
  }

  return topicToCategory[idea.topic] || 'Startup'
}

function createDraftBody(idea) {
  return `# ${idea.title}

## 문제 상황

${idea.readerProblem}

[작성자 경험 입력 필요]
- 실제로 이 기능을 사용한 상황
- 예상과 달랐던 점
- 사용한 비용 또는 시간
- 실패하거나 수정한 부분
- 최종 결과

## 왜 이 작업을 시작했는지

${idea.uniqueExperienceAngle}

## 실제 사용한 방법

1. [작성자 경험 입력 필요] 실제로 사용한 도구와 설정을 적는다.
2. [작성자 경험 입력 필요] 어떤 순서로 작업했는지 적는다.
3. [작성자 경험 입력 필요] 사람이 검수한 기준을 적는다.

## 시행착오

[작성자 경험 입력 필요]

## 결과

[작성자 경험 입력 필요]

## 독자가 적용하는 방법

1. 자신의 프로젝트에서 반복되는 작업을 하나 고른다.
2. AI에게 맡길 부분과 사람이 판단할 부분을 나눈다.
3. 초안, 검수, 발행 단계를 분리한다.
4. 작은 결과를 기록하고 다음 실험으로 연결한다.

## 관련 글

${idea.relatedPosts.map((slug) => `- [관련 글](/posts/${slug})`).join('\n')}

## CTA

MomentTune과 AI workflow 제작 과정을 계속 기록합니다. 비슷한 실험을 하고 있다면 이 글을 참고해 자신의 작업 흐름으로 바꿔보세요.
`
}

function main() {
  const args = parseArgs()
  if (!args.id) {
    throw new Error('Missing required argument: --id=<idea-id>')
  }

  const result = findIdeaById(args.id)
  if (!result) {
    throw new Error(`Idea not found: ${args.id}`)
  }

  const { idea } = result
  const draftsDir = path.join(QUEUE_ROOT, 'drafts')
  ensureDir(draftsDir)

  const draftFile = path.join(draftsDir, `${idea.slug}.md`)
  if (fs.existsSync(draftFile)) {
    throw new Error(`Draft already exists: ${path.relative(process.cwd(), draftFile)}`)
  }

  const category = inferCategory(idea)
  const frontMatter = {
    title: idea.title,
    slug: idea.slug,
    description: `${idea.readerProblem}`.slice(0, 155),
    date: today(),
    updated: today(),
    category,
    tags: [idea.topic, idea.targetKeyword, 'AI Workflow'].filter(Boolean),
    status: 'draft',
    featured: false,
    relatedPosts: idea.relatedPosts || [],
    sourceIdeaId: idea.id,
    reviewed: false,
  }

  fs.writeFileSync(draftFile, stringifyFrontMatter(frontMatter, createDraftBody(idea)), 'utf8')
  console.log(`Draft created: ${path.relative(process.cwd(), draftFile)}`)
  console.log('Status: draft. Human review is required before publishing.')
}

main()

