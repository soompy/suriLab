# 기능 변경 로그

## v1.3.0 - 댓글 및 좋아요 시스템 완성 (2025-06-23)

### ✨ 새로운 기능
- **댓글 시스템**: 방문자가 게시글에 댓글을 남길 수 있는 완전한 시스템
  - 댓글 작성 (이름, 이메일, 내용)
  - 댓글 수정/삭제 기능
  - 실시간 댓글 목록 업데이트
  - Material-UI 기반 현대적 디자인

- **좋아요 시스템**: IP 기반 좋아요 기능
  - 좋아요/좋아요 취소 토글
  - IP 기반 중복 방지
  - 하트 아이콘 애니메이션
  - 실시간 좋아요 수 표시

### 🗄️ 데이터베이스 스키마 추가
```prisma
model Comment {
  id          String   @id @default(cuid())
  content     String
  authorName  String
  authorEmail String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId      String
  @@map("comments")
}

model Like {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String
  ipAddress String
  @@unique([postId, ipAddress])
  @@map("likes")
}
```

### 🔧 API 엔드포인트 추가
- `GET/POST /api/posts/[id]/comments` - 댓글 조회/작성
- `PUT/DELETE /api/comments/[id]` - 댓글 수정/삭제  
- `GET/POST /api/posts/[id]/likes` - 좋아요 조회/토글

### 🎨 UI/UX 개선
- 댓글 섹션 컴포넌트 (`CommentSection.tsx`)
- 좋아요 버튼 컴포넌트 (`LikeButton.tsx`)
- 게시글 페이지에 댓글/좋아요 통합
- 다크모드 완전 지원

## v1.2.0 - Vercel 배포 최적화 (2025-06-23)

### 🚀 배포 환경 개선
- Vercel 프로덕션 배포 완료
- 환경 변수 보안 설정
- 빌드 스크립트 최적화
- Next.js 15 호환성 개선

### 🔧 기술적 개선사항
- API 라우트 Next.js 15 대응
- TypeScript 타입 호환성 수정
- Suspense 경계 설정
- 빌드 에러 해결

### 📱 성능 최적화
- 정적 페이지 생성 (17개 페이지)
- 번들 크기 최적화
- 이미지 최적화 시스템
- 로딩 성능 개선

## v1.1.0 - PostgreSQL 마이그레이션 준비 (2025-06-23)

### 🗄️ 데이터베이스 전환
- SQLite → PostgreSQL 마이그레이션 준비
- Neon PostgreSQL 무료 티어 지원
- 메모리 데이터베이스 임시 운영
- 마이그레이션 스크립트 작성

### 📖 문서화
- PostgreSQL 마이그레이션 가이드 작성
- 4단계 전환 프로세스 정리
- 무료 데이터베이스 서비스 비교
- 환경 변수 설정 가이드

### 🔄 데이터 호환성
- SQLite ↔ PostgreSQL 스키마 호환
- 데이터 마이그레이션 스크립트
- 백업 및 복구 프로세스
- 롤백 계획 수립

## v1.0.0 - 초기 블로그 시스템 (이전)

### 🎯 핵심 기능
- Next.js 15 + TypeScript 기반
- Velog 수준 마크다운 에디터
- 카테고리 및 태그 시스템
- 반응형 디자인 + 다크모드
- Clean Architecture 적용

### 🎨 디자인 시스템
- Material-UI 컴포넌트
- 파스텔 톤 색상 시스템
- 영문 웹폰트 적용
- 실시간 포스트 업데이트

### 🔧 기술 스택
- Frontend: Next.js 15, React 19, TypeScript
- Database: Prisma ORM + SQLite
- Styling: Material-UI + Tailwind CSS
- Deploy: Vercel

---

## 📋 다음 버전 계획

### v1.4.0 - 데이터 영속성 (예정)
- [ ] PostgreSQL 완전 전환
- [ ] 실제 사용자 데이터 마이그레이션
- [ ] 백업 시스템 구축

### v1.5.0 - 추가 기능 (검토 중)
- [ ] 게시글 검색 기능
- [ ] RSS 피드 생성
- [ ] 소셜 미디어 공유
- [ ] 방문자 통계

### v1.6.0 - 고급 기능 (장기)
- [ ] 사용자 인증 시스템
- [ ] 댓글 대댓글 기능
- [ ] 실시간 알림
- [ ] PWA 지원

---
*변경 로그는 [Semantic Versioning](https://semver.org/)을 따릅니다.*