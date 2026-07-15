#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const {
  QUEUE_ROOT,
  ensureDir,
  parseArgs,
  parseFrontMatter,
  relativePath,
} = require('./utils')

function main() {
  const args = parseArgs()
  if (!args.file) {
    throw new Error('Missing required argument: --file=<published-post>')
  }

  const postFile = path.resolve(String(args.file))
  const markdown = fs.readFileSync(postFile, 'utf8')
  const { frontMatter, body } = parseFrontMatter(markdown)
  const reviewedDir = path.join(QUEUE_ROOT, 'reviewed')
  ensureDir(reviewedDir)

  if (frontMatter.status !== 'published') {
    throw new Error('SNS conversion expects a published post file.')
  }

  const linkPlaceholder = `[블로그 링크: /posts/${frontMatter.slug}]`
  const summary = String(frontMatter.description || '').trim()
  const threads = `# Threads Drafts

## Thread 1
${frontMatter.title}

이번 글은 ${frontMatter.category} 관점에서 ${summary}

${linkPlaceholder}

## Thread 2
AI 도구를 쓸 때 중요한 건 자동화 자체보다 검수 가능한 흐름을 만드는 일이라고 느꼈습니다.

글에서 실제 작업 흐름과 다음에 적용할 체크리스트를 정리했습니다.

${linkPlaceholder}
`

  const carousel = `# Instagram Carousel Outline

1. 표지: ${frontMatter.title}
2. 문제: 왜 이 주제가 필요한가
3. 맥락: MomentTune 또는 SuriBlog 작업과의 연결
4. 방법: 실제 적용 단계
5. 검수: 사람이 확인해야 할 부분
6. 결과: 확인된 변화와 아직 남은 과제
7. CTA: 더 자세한 내용은 블로그에서 보기 ${linkPlaceholder}
`

  const reels = `# Instagram Reels 30s Script

0-5초: AI 도구로 글과 제품을 만들 때 바로 발행하지 않는 이유
5-12초: 초안, 검수, 발행 단계를 분리하는 장면
12-22초: ${frontMatter.title}에서 다룬 핵심 흐름 소개
22-30초: 실제 템플릿과 체크리스트는 블로그에서 확인 ${linkPlaceholder}
`

  const linkedin = `# LinkedIn Post

${frontMatter.title}

${summary}

이번 글에서는 자동화가 사람의 판단을 대체하는 방식이 아니라, 검수 가능한 작업 흐름을 만드는 방식으로 어떻게 쓰일 수 있는지 정리했습니다.

핵심은 세 가지입니다.

1. 초안은 자동화하되 즉시 발행하지 않기
2. 작성자 경험과 출처를 검수 단계에서 채우기
3. 블로그, RSS, SNS 변환까지 한 흐름으로 관리하기

${linkPlaceholder}
`

  const baseName = `${frontMatter.slug}-social`
  const outputs = [
    [`${baseName}-threads.md`, threads],
    [`${baseName}-instagram-carousel.md`, carousel],
    [`${baseName}-instagram-reels.md`, reels],
    [`${baseName}-linkedin.md`, linkedin],
  ]

  for (const [fileName, content] of outputs) {
    fs.writeFileSync(path.join(reviewedDir, fileName), content, 'utf8')
  }

  console.log(`Social drafts created in ${relativePath(reviewedDir)}.`)
  console.log(`Source body length: ${body.length} characters.`)
}

main()
