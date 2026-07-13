# Content Workflow

SuriBlog는 기존 DB 기반 글 작성 기능을 유지하면서, `content` 디렉터리의 Markdown 글을 함께 읽을 수 있다. Markdown 글은 AI가 초안을 만들고 사람이 검수한 뒤 `status: published`로 바꿔 발행하는 흐름을 기준으로 설계한다.

## Directory Structure

```text
content/
  momenttune/
  ai-workflow/
  startup/
  career/
templates/
  blog-post-template.md
```

## Front Matter Schema

모든 Markdown 글은 아래 필드를 front matter에 포함해야 한다.

```yaml
---
title: "글 제목"
description: "검색 결과와 공유 카드에 사용할 50-160자 설명"
date: "2026-07-12"
updated: "2026-07-12"
category: "MomentTune"
tags:
  - "MomentTune"
  - "AI Workflow"
slug: "example-post-slug"
status: "draft"
featured: false
relatedPosts:
  - "related-post-slug"
---
```

허용 상태:

- `idea`: 아이디어 메모
- `draft`: AI 초안 또는 작성 중
- `review`: 사람이 검수 중
- `published`: 공개 발행

허용 카테고리:

- `MomentTune`
- `AI Workflow`
- `Startup`
- `Career`

`published` 상태인 글만 블로그 글 목록, 상세 페이지, sitemap, RSS에 포함된다.

## 새 글 생성 방법

1. `templates/blog-post-template.md`를 복사한다.
2. 주제에 맞는 폴더에 저장한다.
   - MomentTune 제작기: `content/momenttune/my-post.md`
   - AI 도구 워크플로우: `content/ai-workflow/my-post.md`
   - 창업/MVP 실험: `content/startup/my-post.md`
   - 커리어/성장 기록: `content/career/my-post.md`
3. `slug`는 기존 글 URL과 겹치지 않게 영문 소문자와 하이픈을 사용한다.
4. 초안 상태에서는 `status: draft` 또는 `status: review`를 유지한다.

## 초안 검수 방법

검수 전 아래 명령을 실행한다.

```bash
npm run content:validate
```

검수 기준:

- 필수 front matter가 모두 있는가
- 제목과 본문이 비어 있지 않은가
- `description`이 너무 길지 않은가
- `slug`가 중복되지 않는가
- `tags`가 하나 이상 있는가
- 아직 검수 중인 글이 `published`로 되어 있지 않은가

## 발행 상태 변경 방법

검수가 끝난 글만 아래처럼 변경한다.

```yaml
status: "published"
```

발행 전에는 `updated` 날짜를 마지막 검수 날짜로 갱신한다.

```yaml
updated: "2026-07-12"
```

## 이미지 추가 방법

공개 이미지는 `public/images` 아래에 저장하고 Markdown 본문에서 절대 경로로 참조한다.

```markdown
![MomentTune 화면](/images/momenttune/example.png)
```

이미지 규칙:

- 의미 있는 `alt` 텍스트를 작성한다.
- 파일명은 영문 소문자와 하이픈을 사용한다.
- 원본이 너무 크면 업로드 전에 압축한다.
- 비공개 화면, API 키, 사용자 정보가 보이지 않는지 확인한다.

## 내부 링크 연결 방법

본문에서는 기존 공개 URL을 직접 연결한다.

```markdown
[React useEffect 정리](/posts/react-useeffect)
```

글 하단 관련 글 추천을 명시하려면 `relatedPosts`에 slug를 추가한다.

```yaml
relatedPosts:
  - "react-useeffect"
  - "2025-safepay-1"
```

관련 글 영역은 `relatedPosts`, 같은 카테고리, 공통 태그를 기준으로 자동 추천된다.

## SEO 점검 방법

발행 전 체크리스트:

- `title`이 검색 의도를 포함하는가
- `description`이 50-160자 범위인가
- `slug`가 짧고 의미 있는가
- `category`와 `tags`가 실제 주제와 맞는가
- 본문에 내부 링크가 1개 이상 있는가
- 이미지에 대체 텍스트가 있는가
- `npm run content:validate`가 통과하는가

발행 후 확인:

- `/posts/{slug}` 상세 페이지가 열리는가
- `/sitemap.xml`에 published 글만 포함되는가
- `/rss.xml`에 published 글만 포함되는가
- 공유 미리보기에서 Open Graph와 Twitter Card 정보가 자연스럽게 보이는가

## Automation Notes

추후 GitHub Actions 또는 외부 자동화 도구를 연결할 때는 아래 순서를 권장한다.

1. AI가 `status: draft`로 Markdown 초안을 생성한다.
2. `npm run content:validate`를 CI에서 실행한다.
3. 사람이 PR에서 본문, SEO, 내부 링크를 검수한다.
4. 승인 후 `status: published`로 변경한다.
5. `master` 병합 후 Vercel 배포로 공개한다.
