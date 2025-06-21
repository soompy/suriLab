# SuriBlog 🌟

> **2025년 최신 기술 스택으로 구축된 현대적인 개인 블로그 플랫폼**

모던하고 미니멀한 디자인의 개인 블로그입니다. Next.js 15와 Material-UI v7을 기반으로 구축되었으며, 깔끔하고 프로페셔널한 UI/UX를 제공합니다.

## ✨ 주요 특징

- **🎨 Modern Design**: 미니멀하고 세련된 프로페셔널 디자인
- **📱 Fully Responsive**: 모바일부터 데스크톱까지 완벽한 반응형 레이아웃
- **🚀 Cutting-edge Performance**: Next.js 15 App Router + React 19 최적화
- **🎯 Material-UI v7**: 최신 디자인 시스템과 완벽한 접근성
- **🌙 Dark Mode**: 완전한 다크모드 지원
- **⚡ Full TypeScript**: 100% 타입 안전성 보장
- **🔍 Advanced Search**: 실시간 검색 및 필터링
- **📝 Rich Editor**: 마크다운 기반 글 작성 도구
- **📊 Analytics Ready**: 통계 및 분석 기능 내장

## 🛠️ 2025 최신 기술 스택

### **Core Framework**
- **React 19.1.0** - 최신 React 기능 (Server Components, Concurrent Features)
- **Next.js 15.3.3** - App Router, Server Actions, 최신 최적화
- **TypeScript 5.8.3** - 최신 타입 시스템

### **UI & Styling**
- **Material-UI v7.1.1** - 2025년 최신 디자인 시스템
- **Emotion 11.14.0** - 고성능 CSS-in-JS
- **TailwindCSS 4.x** - 유틸리티 우선 CSS

### **State Management & Data**
- **Zustand 5.0.5** - 경량화된 상태 관리
- **TanStack Query 5.80.7** - 서버 상태 관리 및 캐싱
- **React Hook Form** - 폼 상태 관리

### **Content & Markdown**
- **React Markdown 10.1.0** - 마크다운 렌더링
- **Remark GFM 4.0.1** - GitHub Flavored Markdown
- **Prism React Renderer 2.4.1** - 코드 하이라이팅

### **Development & Testing**
- **ESLint 9.29.0** - 최신 Flat Config
- **Jest 30.0.0** - 테스트 프레임워크
- **Testing Library** - React 컴포넌트 테스트

## 🏗️ 프로젝트 구조

```
suriBlog/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── page.tsx           # 🏠 메인 페이지 (블로그 홈)
│   │   ├── about/             # 👨‍💻 개인 소개 페이지
│   │   ├── projects/          # 💼 프로젝트 포트폴리오 (페이지네이션)
│   │   ├── contact/           # 📧 연락처 & 소셜 미디어
│   │   ├── archives/          # 📚 블로그 아카이브 (검색/필터)
│   │   ├── write/             # ✍️ 블로그 글 작성 도구
│   │   ├── layout.tsx         # 전역 레이아웃
│   │   └── globals.css        # 전역 스타일
│   ├── components/            # 재사용 가능한 React 컴포넌트
│   │   ├── Header.tsx         # 🧭 반응형 네비게이션 (다크모드 토글)
│   │   ├── Footer.tsx         # 🦶 하단 푸터
│   │   ├── HeroSection.tsx    # 🎯 메인 히어로 섹션
│   │   ├── PostGrid.tsx       # 📋 포스트 그리드 레이아웃
│   │   ├── PostCard.tsx       # 📄 개별 포스트 카드
│   │   ├── Logo.tsx           # 🎨 브랜드 로고
│   │   ├── MuiThemeProvider.tsx # 🎨 MUI 테마 컨텍스트
│   │   └── ThemeContext.tsx   # 🌙 다크모드 컨텍스트
│   ├── hooks/                 # 커스텀 React 훅
│   ├── types/                 # TypeScript 타입 정의
│   └── utils/                 # 유틸리티 함수들
├── public/                    # 정적 파일들
│   ├── images/               # 이미지 에셋
│   └── icons/                # 아이콘 파일들
├── package.json              # 프로젝트 설정 및 의존성
├── tsconfig.json             # TypeScript 설정
├── next.config.js            # Next.js 설정
└── README.md                 # 프로젝트 문서
```

## 🚀 빠른 시작

### 📋 환경 요구사항
- **Node.js** 22.0+ (최신 LTS 권장)
- **npm** 10.0+ 또는 **yarn** 4.0+
- **Git** 2.40+

### ⚡ 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/soompy/suriLab.git
cd suriBlog

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# 🌐 http://localhost:3000
```

### 🛠️ 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 🔥 개발 서버 실행 (Hot Reload) |
| `npm run build` | 🏗️ 프로덕션 빌드 |
| `npm run start` | 🚀 프로덕션 서버 실행 |
| `npm run lint` | 🔍 ESLint 코드 검사 |
| `npm run type-check` | ✅ TypeScript 타입 검사 |
| `npm run test` | 🧪 Jest 테스트 실행 |
| `npm run test:watch` | 👀 Jest 워치 모드 |

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

## 🔮 로드맵 & 향후 계획

### 🎯 **Phase 1: 핵심 기능 완성** (2025 Q1)
- [x] ✅ 다크모드 완전 구현
- [x] ✅ 반응형 레이아웃 최적화
- [x] ✅ 페이지네이션 시스템
- [x] ✅ 검색 및 필터링 기능
- [ ] 🔄 실제 블로그 포스트 CRUD 기능
- [ ] 🔄 마크다운 에디터 고도화

### 🚀 **Phase 2: 고급 기능** (2025 Q2)
- [ ] 📊 댓글 시스템 (Disqus/Utterances 연동)
- [ ] 🔍 전문 검색 엔진 (Algolia/ElasticSearch)
- [ ] 📡 RSS/Atom 피드 생성
- [ ] 🎨 테마 커스터마이징
- [ ] 📈 Google Analytics 통합

### ⚡ **Phase 3: 성능 & PWA** (2025 Q3)
- [ ] 🌐 PWA (Progressive Web App) 지원
- [ ] ⚡ 이미지 최적화 및 CDN 연동
- [ ] 🔧 Service Worker 캐싱
- [ ] 📱 오프라인 읽기 지원
- [ ] 🚀 Core Web Vitals 100점 달성

### 🎨 **Phase 4: 확장 기능** (2025 Q4)
- [ ] 🤖 AI 기반 포스트 추천
- [ ] 🔗 소셜 미디어 자동 공유
- [ ] 📧 뉴스레터 구독 시스템
- [ ] 🏷️ 고급 태그 시스템
- [ ] 🌍 다국어 지원 (i18n)

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

**🌟 SuriBlog Development Team**

- **Main Developer**: [@soompy](https://github.com/soompy)
- **Email**: yzsumin@naver.com
- **Portfolio**: [SuriBlog Projects](https://your-domain.com/projects)

### 📞 **연락처**
- 🐙 GitHub: [@soompy](https://github.com/soompy)
- 💼 LinkedIn: [프로필 보기](https://buly.kr/1c8Bcxw)
- 📧 Email: yzsumin@naver.com

---

### 💝 **프로젝트가 도움이 되셨나요?**

⭐ **스타를 눌러주세요!** 여러분의 스타가 개발자에게 큰 힘이 됩니다.

🐛 **버그를 발견하셨나요?** [이슈 생성](https://github.com/soompy/suriLab/issues)으로 알려주세요.

💡 **새로운 아이디어가 있으신가요?** [디스커션](https://github.com/soompy/suriLab/discussions)에서 공유해주세요.

---

<div align="center">

**🚀 2025년 최신 기술로 구축된 모던 블로그 플랫폼**

Made with ❤️ by [SuriBlog Team](https://github.com/soompy)

</div>