# 🚀 Suri Blog - 현대적 개발자 블로그

[![Vercel Deploy](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://suri-blog-suris-projects.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)

> **함께 성장하는 개발자 커뮤니티**를 만들어가는 현대적 블로그 플랫폼

## 🌟 주요 특징

### ✨ 핵심 기능
- 🎨 **Velog 수준 마크다운 에디터** - 실시간 미리보기, 코드 하이라이팅
- 💬 **완전한 댓글 시스템** - 실시간 댓글 작성/수정/삭제
- ❤️ **IP 기반 좋아요 기능** - 중복 방지, 애니메이션 효과
- 🏷️ **카테고리 & 태그 시스템** - 체계적인 콘텐츠 분류
- 🌙 **다크모드 완전 지원** - 전체 사이트 테마 전환
- 📱 **완전 반응형 디자인** - 모바일 퍼스트 접근

### 🔧 기술적 특징
- ⚡ **Next.js 15** - 최신 App Router 및 서버 컴포넌트
- 🎯 **Clean Architecture** - 확장 가능한 아키텍처 설계
- 🛡️ **TypeScript 100%** - 완전한 타입 안전성
- 🗄️ **Prisma ORM** - 타입 안전 데이터베이스 액세스
- 🎨 **Material-UI** - 현대적 컴포넌트 라이브러리

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 로컬 설정

```bash
# 저장소 클론
git clone https://github.com/soompy/suriLab.git
cd suriLab

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에서 필요한 값들 설정

# 데이터베이스 초기화
npm run db:migrate
npm run db:seed

# 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📦 프로젝트 구조

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API 라우트
│   ├── posts/             # 게시글 페이지
│   └── write/             # 글 작성 페이지
├── components/            # UI 컴포넌트
│   ├── CommentSection.tsx # 댓글 시스템
│   ├── LikeButton.tsx     # 좋아요 버튼
│   └── ...
├── entities/              # 도메인 엔티티
├── usecases/             # 비즈니스 로직
├── repositories/         # 데이터 액세스
└── infrastructure/       # 외부 인터페이스
```

## 🗄️ 데이터베이스 스키마

### 핵심 모델
```prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  content     String
  slug        String   @unique
  comments    Comment[]
  likes       Like[]
  // ... 기타 필드
}

model Comment {
  id          String   @id @default(cuid())
  content     String
  authorName  String
  authorEmail String?
  post        Post     @relation(fields: [postId], references: [id])
  postId      String
}

model Like {
  id        String   @id @default(cuid())
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  ipAddress String
  @@unique([postId, ipAddress])
}
```

## 🌐 배포 정보

### Production
- **URL**: https://suri-blog-suris-projects.vercel.app
- **플랫폼**: Vercel
- **자동 배포**: GitHub 연동

### 환경 변수
```env
DATABASE_URL=              # 데이터베이스 연결 문자열
BLOG_ADMIN_PASSWORD=       # 관리자 비밀번호
EMAIL_USER=               # 이메일 사용자
EMAIL_PASS=               # 이메일 앱 비밀번호
```

## 📊 API 엔드포인트

### 게시글 API
- `GET /api/posts` - 게시글 목록 조회
- `POST /api/posts` - 새 게시글 작성
- `GET /api/posts/[id]` - 특정 게시글 조회
- `PUT /api/posts/[id]` - 게시글 수정
- `DELETE /api/posts/[id]` - 게시글 삭제

### 댓글 API
- `GET /api/posts/[id]/comments` - 댓글 목록 조회
- `POST /api/posts/[id]/comments` - 댓글 작성
- `PUT /api/comments/[id]` - 댓글 수정
- `DELETE /api/comments/[id]` - 댓글 삭제

### 좋아요 API
- `GET /api/posts/[id]/likes` - 좋아요 수 조회
- `POST /api/posts/[id]/likes` - 좋아요 토글

## 🛠️ 사용 가능한 스크립트

```bash
# 개발
npm run dev              # 개발 서버 시작
npm run build            # 프로덕션 빌드
npm run start            # 프로덕션 서버 시작

# 데이터베이스
npm run db:migrate       # 마이그레이션 실행
npm run db:seed          # 시드 데이터 생성
npm run db:studio        # Prisma Studio 실행
npm run db:reset         # 데이터베이스 리셋

# 코드 품질
npm run lint             # ESLint 실행
npm run type-check       # TypeScript 타입 체크
npm run test             # 테스트 실행
```

## 🔄 PostgreSQL 마이그레이션

현재 메모리 데이터베이스를 사용 중입니다. 영구 저장을 위해서는:

1. 📖 **[PostgreSQL 마이그레이션 가이드](./POSTGRESQL_MIGRATION_GUIDE.md)** 참조
2. Neon PostgreSQL 무료 계정 생성
3. 환경 변수 업데이트
4. 스키마 마이그레이션 실행

## 📝 문서

- 📋 **[배포 현황](./DEPLOYMENT_STATUS.md)** - 현재 배포 상태 및 기능 목록
- 📖 **[기능 변경 로그](./FEATURE_CHANGELOG.md)** - 상세 버전 히스토리
- 🗄️ **[PostgreSQL 마이그레이션 가이드](./POSTGRESQL_MIGRATION_GUIDE.md)** - 데이터베이스 전환 방법

## 🎯 향후 계획

### v1.4.0 - 데이터 영속성
- [ ] PostgreSQL 완전 전환
- [ ] 백업 시스템 구축
- [ ] 데이터 마이그레이션 완료

### v1.5.0 - 추가 기능
- [ ] 고급 검색 기능
- [ ] RSS 피드 생성
- [ ] 소셜 미디어 공유
- [ ] 방문자 통계

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👨‍💻 개발자

**이수민 (Soomin Lee)**
- GitHub: [@soompy](https://github.com/soompy)
- Email: yzsumin@naver.com
- Blog: https://suri-blog-suris-projects.vercel.app

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!

<p align="center">
  <strong>함께 성장하는 개발자 커뮤니티</strong><br>
  무언가를 만들지 않으면 손이 근질거리는 개발자의 블로그
</p>

