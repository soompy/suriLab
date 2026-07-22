# 콘텐츠 자동화 파이프라인 활용법

이 문서는 SuriBlog의 콘텐츠 자동화 파이프라인을 사용해 글 아이디어를 만들고, 초안을 생성하고, 사람이 검수한 뒤 발행하는 방법을 정리한다.

## 핵심 원칙

- 자동화는 초안 생성과 검수 보조까지만 담당한다.
- 글은 자동 발행되지 않는다.
- 초안은 기본적으로 `status: draft`, `reviewed: false` 상태로 생성된다.
- `[작성자 경험 입력 필요]`가 남아 있으면 발행할 수 없다.
- 실제 경험, 실패, 비용, 시간, 결과는 사람이 직접 채운다.
- 자동 git push, 자동 배포는 하지 않는다.

## 전체 흐름

```text
아이디어 생성
→ 초안 생성
→ 작성자 경험 입력
→ 검수
→ 발행 반영
→ 로컬 확인
→ 커밋 / 푸쉬 / 배포
```

## 주요 폴더

```text
automation/config/
```

콘텐츠 자동화 설정 파일이 있다.

- `topics.json`: 핵심 콘텐츠 주제
- `sources.json`: 향후 리서치 소스 후보

```text
automation/queue/ideas/
```

아이디어 JSON이 생성되는 곳이다.

```text
automation/queue/drafts/
```

Markdown 초안이 생성되는 곳이다. 이 파일들은 아직 블로그에 노출되지 않는다.

```text
automation/reports/
```

검수 결과 JSON/Markdown 리포트가 생성되는 곳이다.

```text
automation/queue/reviewed/
```

SNS 변환 결과가 생성되는 곳이다.

```text
content/
```

실제 블로그에 노출되는 Markdown 콘텐츠가 들어가는 곳이다. `content` 폴더로 publish된 글 중 `status: published`인 글만 블로그에 노출된다.

## 1. 아이디어 생성

```bash
npm run content:ideas
```

실행 결과:

```text
automation/queue/ideas/
```

아이디어 파일 예:

```text
automation/queue/ideas/idea-20260715-01.json
```

아이디어 파일에는 제목, 키워드, 검색 의도, 독자의 문제, 목차, 수익화 연결 가능성 등이 들어간다.

## 2. 초안 생성

아이디어 파일에서 `id` 값을 확인한다.

```json
{
  "id": "idea-20260715-01"
}
```

초안 생성:

```bash
npm run content:draft -- --id=idea-20260715-01
```

실행 결과:

```text
automation/queue/drafts/
```

초안은 반드시 아래 상태로 생성된다.

```yaml
status: "draft"
reviewed: false
```

## 3. 작성자 경험 입력

초안에는 아래 placeholder가 포함된다.

```text
[작성자 경험 입력 필요]
```

이 부분은 사람이 직접 채워야 한다.

반드시 입력할 내용:

- 실제로 이 기능을 사용한 상황
- 예상과 달랐던 점
- 사용한 비용 또는 시간
- 실패하거나 수정한 부분
- 최종 결과

AI가 이 내용을 임의로 만들어내면 안 된다.

## 4. 초안 검수

```bash
npm run content:review -- --file=automation/queue/drafts/파일명.md
```

예:

```bash
npm run content:review -- --file=automation/queue/drafts/ai-agent-operations-before-building.md
```

검수 결과는 아래에 생성된다.

```text
automation/reports/
```

검수 항목:

- 제목 존재 여부
- description 존재 여부
- slug 유효성
- 기존 글과 slug 중복 여부
- 날짜 형식
- 필수 front matter
- 본문 최소 길이
- `[작성자 경험 입력 필요]` 잔존 여부
- 출처 없는 수치 표현
- 과장 표현
- 내부 링크 존재 여부
- CTA 존재 여부

`Publishable: no`가 나오면 아직 발행하면 안 된다.

## 5. 발행 반영

검수 결과가 통과되어 초안의 front matter가 아래처럼 되어 있어야 한다.

```yaml
reviewed: true
```

발행 반영:

```bash
npm run content:publish -- --file=automation/queue/drafts/파일명.md
```

실행 전 확인 프롬프트가 나온다.

```text
Publish ... ? (yes/no)
```

`yes`를 입력하면 해당 글이 기존 블로그 콘텐츠 폴더로 복사된다.

카테고리별 이동 위치:

```text
MomentTune   → content/momenttune/
AI Workflow  → content/ai-workflow/
Startup      → content/startup/
Career       → content/career/
```

publish 스크립트는 다음을 확인한다.

- `reviewed: true`인지 확인
- 기존 slug와 충돌하는지 확인
- `status`를 `published`로 변경
- `npm run content:validate` 실행
- `npm run build` 실행
- 실패 시 복사한 파일 롤백

자동 push나 자동 배포는 하지 않는다.

## 6. 로컬 확인

```bash
npm run dev
```

확인할 페이지:

```text
/articles
/posts/{slug}
/categories/{category}
/tags/{tag}
/sitemap.xml
/rss.xml
```

## 7. SNS 콘텐츠 생성

발행된 글을 기준으로 SNS 초안을 만들 수 있다.

```bash
npm run content:social -- --file=content/momenttune/파일명.md
```

생성 위치:

```text
automation/queue/reviewed/
```

생성되는 산출물:

- Threads 게시글 2개
- Instagram 카드뉴스 7장 구성안
- Instagram 릴스 30초 대본
- LinkedIn 게시글 1개

SNS 초안에는 블로그 링크 placeholder가 포함된다.

## 8. 개발 전용 큐 확인 페이지

개발 환경에서만 아래 페이지로 큐 상태를 확인할 수 있다.

```text
/admin/content-queue
```

운영 환경에서는 비활성화된다.

확인 가능한 항목:

- ideas 목록
- drafts 목록
- 검수 상태
- 파일명
- 생성일
- warning 개수
- published 여부

## 9. 신규 글 발행 예시

```bash
npm run content:ideas
```

```bash
npm run content:draft -- --id=idea-20260715-01
```

초안에서 `[작성자 경험 입력 필요]`를 직접 채운다.

```bash
npm run content:review -- --file=automation/queue/drafts/ai-agent.md
```

검수 통과 후:

```bash
npm run content:publish -- --file=automation/queue/drafts/ai-agent.md
```

로컬 확인:

```bash
npm run dev
```

최종 검증:

```bash
npm run content:validate
npm run lint
npm run type-check
npm run test -- --runInBand
npm run build
```

## 10. 보안 주의사항

- `.env` 파일은 커밋하지 않는다.
- 실제 API 키는 `.env.example`에 쓰지 않는다.
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`는 로컬 `.env` 또는 배포 환경변수에만 넣는다.
- 자동화 결과물에 DB URL, admin password, token이 들어가지 않았는지 확인한다.
- 검수 리포트나 초안에 민감 정보가 들어간 경우 발행하지 않는다.

## 11. 현재 자동화된 부분과 수동 작업

자동화된 부분:

- 아이디어 생성
- 초안 생성
- 검수 리포트 생성
- 발행 가능 여부 판단 보조
- SNS 초안 생성
- 개발 전용 큐 확인

사람이 해야 하는 부분:

- 실제 경험 입력
- 출처 확인
- 수치 검증
- 과장 표현 수정
- 최종 발행 판단
- 커밋, 푸쉬, 배포

