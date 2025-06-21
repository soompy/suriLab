# SuriBlog 🌟

> **완전한 블로그 시스템 - 인증, 데이터베이스, 보안까지 모든 것이 갖춰진 실제 운영 가능한 블로그 플랫폼**

실제 운영 가능한 완전한 블로그 시스템입니다. Next.js 15, Prisma ORM, SQLite를 기반으로 구축되었으며, 관리자 인증부터 포스트 관리까지 모든 기능을 갖춘 실전 블로그 플랫폼입니다.

## ✨ 핵심 기능

- **🔐 완전한 인증 시스템**: 관리자 전용 글 작성 및 관리
- **💾 영구 데이터 저장**: Prisma ORM + SQLite/PostgreSQL 지원
- **🛡️ 강력한 보안**: 환경변수 기반 비밀번호 관리, Git 보안
- **📝 실시간 글 작성**: 마크다운 에디터 + 이미지 업로드
- **🎨 완전한 UI 시스템**: Material-UI 기반 반응형 디자인
- **📱 모바일 최적화**: 완벽한 반응형 레이아웃
- **🚀 프로덕션 준비**: 실제 서비스 가능한 안정성
- **⚡ 고성능**: Next.js 15 + React 19 최신 최적화

## 🛠️ 완전한 기술 스택

### **Frontend Framework**
- **React 19** - 최신 Server Components 및 Concurrent Features
- **Next.js 15** - App Router, Server Actions, 최신 최적화
- **TypeScript** - 100% 타입 안전성

### **Database & ORM**
- **Prisma ORM** - 타입 안전한 데이터베이스 클라이언트
- **SQLite** - 개발용 (PostgreSQL 마이그레이션 준비)
- **Database Migration** - 자동 스키마 관리

### **Authentication & Security**
- **환경변수 기반 인증** - 안전한 비밀번호 관리
- **localStorage 세션** - 24시간 자동 만료
- **Git 보안** - .env 파일 완전 보호

### **UI & Design System**
- **Material-UI (MUI)** - 완전한 컴포넌트 라이브러리
- **Emotion** - CSS-in-JS 스타일링
- **반응형 디자인** - 모바일 우선 접근

### **Content Management**
- **마크다운 에디터** - 실시간 미리보기
- **이미지 업로드** - Multer 기반 파일 처리
- **카테고리 & 태그** - 완전한 분류 시스템

### **Development & Production**
- **Clean Architecture** - 확장 가능한 코드 구조
- **API Routes** - RESTful 엔드포인트
- **빌드 최적화** - 프로덕션 준비 완료

## 🏗️ 프로젝트 구조

```
suriBlog/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/               # 🔌 REST API 엔드포인트
│   │   │   ├── posts/         # 포스트 CRUD, 조회수 관리
│   │   │   └── upload/        # 이미지 업로드 처리
│   │   ├── posts/[slug]/      # 📄 포스트 상세 페이지
│   │   ├── write/             # ✍️ 관리자 글 작성 (인증 필요)
│   │   ├── about/             # 👨‍💻 개인 소개 페이지
│   │   ├── projects/          # 💼 프로젝트 포트폴리오
│   │   ├── archives/          # 📚 포스트 아카이브
│   │   └── page.tsx           # 🏠 메인 페이지
│   ├── components/            # UI 컴포넌트
│   │   ├── LoginDialog.tsx    # 🔐 관리자 로그인 다이얼로그
│   │   ├── Header.tsx         # 🧭 네비게이션 바
│   │   ├── PostCard.tsx       # 📄 포스트 카드
│   │   └── PostGrid.tsx       # 📋 포스트 그리드
│   ├── config/                # 설정 파일
│   │   └── blog.ts           # 블로그 메타데이터 & 소유자 정보
│   ├── lib/                   # 핵심 라이브러리
│   │   ├── auth.ts           # 🔐 인증 서비스
│   │   └── prisma.ts         # 💾 데이터베이스 클라이언트
│   ├── repositories/          # 데이터 접근 계층
│   │   └── PrismaPostRepository/ # 포스트 저장소 구현
│   ├── usecases/             # 비즈니스 로직
│   │   └── SearchPosts/      # 포스트 검색 기능
│   └── entities/             # 도메인 엔티티
├── prisma/                   # 🗄️ 데이터베이스 스키마
│   ├── schema.prisma         # Prisma 스키마 정의
│   ├── migrations/           # 데이터베이스 마이그레이션
│   └── seed.ts              # 샘플 데이터 시드
├── .env                     # 🔒 환경변수 (Git 제외)
├── .gitignore               # 🛡️ Git 보안 설정
└── package.json             # 프로젝트 의존성
```

## 🚀 빠른 시작

### 📋 환경 요구사항
- **Node.js** 18.0+ (최신 LTS 권장)
- **npm** 9.0+ 또는 **yarn** 1.22+
- **Git** 2.30+

### ⚡ 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/soompy/suriLab.git
cd suriBlog

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.example .env
# .env 파일에서 BLOG_ADMIN_PASSWORD 설정

# 4. 데이터베이스 설정
npm run db:generate  # Prisma 클라이언트 생성
npm run db:push      # 데이터베이스 스키마 적용
npm run db:seed      # 샘플 데이터 추가

# 5. 개발 서버 실행
npm run dev

# 6. 브라우저에서 확인
# 🌐 http://localhost:3000
# ✍️ 글 작성: http://localhost:3000/write (관리자 인증 필요)
```

### 🛠️ 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 🔥 개발 서버 실행 (Hot Reload) |
| `npm run build` | 🏗️ 프로덕션 빌드 |
| `npm run start` | 🚀 프로덕션 서버 실행 |
| `npm run db:generate` | 📦 Prisma 클라이언트 생성 |
| `npm run db:push` | 🔄 데이터베이스 스키마 동기화 |
| `npm run db:seed` | 🌱 샘플 데이터 시딩 |
| `npm run db:studio` | 🎛️ Prisma Studio 실행 |
| `npm run db:reset` | 🔄 데이터베이스 초기화 |

### 🌍 배포

```bash
# Vercel (권장)
npm install -g vercel
vercel

# 또는 다른 플랫폼
npm run build
npm run start
```

## 🎨 디자인 시스템

### 🎭 컬러 팔레트
| 색상 | Light Mode | Dark Mode | 용도 |
|------|------------|-----------|------|
| **Primary** | `rgb(25, 31, 40)` | `rgb(144, 202, 249)` | 브랜드 색상 |
| **Secondary** | `rgb(107, 114, 128)` | `rgb(158, 158, 158)` | 보조 텍스트 |
| **Background** | `#ffffff` | `rgb(18, 18, 18)` | 페이지 배경 |
| **Surface** | `#fafafa` | `rgb(33, 33, 33)` | 카드 배경 |
| **Text Primary** | `rgba(0, 0, 0, 0.87)` | `rgba(255, 255, 255, 0.87)` | 주요 텍스트 |

### ✍️ 타이포그래피
- **Font Family**: `system-ui, -apple-system, "Segoe UI", Roboto`
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Font Sizes**: 14px - 48px (반응형 스케일링)

### 📐 레이아웃 시스템
- **Max Width**: `1300px` (전체 컨테이너)
- **Grid System**: CSS Grid 기반 반응형 레이아웃
- **Spacing**: Material-UI 8px 기반 간격 시스템
- **Border Radius**: `8px` (카드), `4px` (버튼)

## 📱 반응형 브레이크포인트

| 기기 | 화면 크기 | 레이아웃 | 그리드 |
|------|-----------|----------|--------|
| **📱 Mobile** | `< 768px` | 1열, 햄버거 메뉴 | 1열 |
| **📟 Tablet** | `768px - 1024px` | 2열 레이아웃 | 2열 |
| **💻 Desktop** | `1024px - 1440px` | 3열 레이아웃 | 3열 |
| **🖥️ Large** | `> 1440px` | 4열 레이아웃 | 4열 |

## 🎯 페이지별 주요 기능

### 🏠 **메인 페이지**
- 히어로 섹션 + 최신 포스트 그리드
- 반응형 카드 레이아웃
- 무한 스크롤 대응

### 👨‍💻 **About 페이지**
- 개인 프로필 및 경력 소개
- 기술 스택 시각화
- 반응형 프로필 레이아웃

### 💼 **Projects 페이지**
- 프로젝트 포트폴리오 갤러리
- 페이지네이션 (5개씩)
- 프로젝트 상세 정보 및 링크

### 📧 **Contact 페이지**
- 직접 연락 폼 (mailto 연동)
- 소셜 미디어 링크
- 이메일 클립보드 복사

### 📚 **Archives 페이지**
- 전체 포스트 아카이브
- 실시간 검색 및 필터링
- 연도별/카테고리별 정리

### ✍️ **Write 페이지**
- 마크다운 기반 에디터
- 실시간 통계 (단어수, 읽기시간)
- 태그 시스템 및 발행 설정

## ✅ 완성된 기능들

### 🎯 **Core Features (완료)**
- [x] ✅ **완전한 인증 시스템** - 관리자 전용 글 작성
- [x] ✅ **영구 데이터 저장** - Prisma + SQLite 완전 구현
- [x] ✅ **보안 시스템** - 환경변수 기반 + Git 보안
- [x] ✅ **실제 블로그 CRUD** - 포스트 생성/수정/삭제/조회
- [x] ✅ **마크다운 에디터** - 실시간 글 작성 도구
- [x] ✅ **이미지 업로드** - 파일 업로드 시스템
- [x] ✅ **반응형 UI** - Material-UI 완전 구현
- [x] ✅ **카테고리 & 태그** - 완전한 분류 시스템

### 🚀 **Advanced Features (완료)**
- [x] ✅ **작성자 정보 시스템** - 실제 작성자 표시
- [x] ✅ **포스트 상세 페이지** - 완전한 렌더링
- [x] ✅ **검색 기능** - 포스트 검색 UseCase
- [x] ✅ **API 엔드포인트** - RESTful API 완성
- [x] ✅ **Clean Architecture** - 확장 가능한 구조

## 🔮 향후 확장 계획

### 🎨 **Phase 1: UI/UX 강화**
- [ ] 📊 대시보드 관리 페이지
- [ ] 🎨 테마 커스터마이징
- [ ] 🌙 다크모드 토글
- [ ] 📱 PWA 지원

### 🚀 **Phase 2: 고급 기능**
- [ ] 📈 포스트 통계 및 분석
- [ ] 🔍 고급 검색 (Algolia)
- [ ] 📡 RSS 피드 생성
- [ ] 💬 댓글 시스템

### ⚡ **Phase 3: 성능 최적화**
- [ ] 🌐 CDN 연동
- [ ] ⚡ 이미지 최적화
- [ ] 🔧 캐싱 시스템
- [ ] 📊 성능 모니터링

## 🤝 기여하기

우리는 모든 형태의 기여를 환영합니다! 🎉

### 🐛 **버그 리포트**
```bash
# 이슈 생성 시 포함할 정보
- 운영체제 및 브라우저 버전
- 재현 단계
- 예상 동작 vs 실제 동작
- 스크린샷 (가능한 경우)
```

### 🔧 **개발 기여**
```bash
# 1. 포크 및 클론
git clone https://github.com/[your-username]/suriLab.git

# 2. 기능 브랜치 생성
git checkout -b feature/amazing-feature

# 3. 변경사항 커밋
git commit -m 'feat: Add some amazing feature'

# 4. 푸시 후 PR 생성
git push origin feature/amazing-feature
```

### 📝 **커밋 컨벤션**
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 업데이트
- `style`: 코드 스타일 변경
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스 등 기타 변경

## 🙏 스페셜 띵스

### 🎨 **영감을 받은 프로젝트들**
- [Next.js](https://nextjs.org) - 프레임워크 기반
- [Material-UI](https://mui.com) - 디자인 시스템
- [Vercel](https://vercel.com) - 배포 플랫폼

### 🔧 **사용된 오픈소스**
모든 의존성은 `package.json`에서 확인할 수 있습니다.

## 📄 라이선스

이 프로젝트는 [ISC License](LICENSE)로 배포됩니다.

## 👨‍💻 개발자 정보

**🌟 이수민 (SuriBlog Creator)**

- **GitHub**: [@soompy](https://github.com/soompy)
- **Email**: yzsumin@naver.com
- **Portfolio**: [SuriBlog](https://github.com/soompy/suriLab)

### 📞 **연락처**
- 🐙 GitHub: [@soompy](https://github.com/soompy)
- 💼 LinkedIn: [프로필 보기](https://buly.kr/1c8Bcxw)
- 📧 Email: yzsumin@naver.com

### 🎯 **전문 분야**
- **Full-Stack Development**: React, Next.js, Node.js
- **Database Design**: Prisma ORM, SQL
- **Authentication & Security**: 보안 시스템 설계
- **Modern Web Architecture**: Clean Architecture, TypeScript

---

### 💝 **프로젝트가 도움이 되셨나요?**

⭐ **스타를 눌러주세요!** 여러분의 스타가 개발자에게 큰 힘이 됩니다.

🐛 **버그를 발견하셨나요?** [이슈 생성](https://github.com/soompy/suriLab/issues)으로 알려주세요.

💡 **새로운 아이디어가 있으신가요?** [디스커션](https://github.com/soompy/suriLab/discussions)에서 공유해주세요.

---

<div align="center">

**🚀 완전한 블로그 시스템 - 실제 운영 가능한 프로덕션 레벨**

Made with ❤️ by [이수민](https://github.com/soompy)

**⭐ Star this repo if you found it helpful!**

</div>