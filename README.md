# SuriBlog

모던하고 미니멀한 디자인의 개인 블로그입니다. Next.js와 Material-UI를 기반으로 구축되었으며, Toss Feed에서 영감을 받은 깔끔하고 세련된 UI를 제공합니다.

## ✨ 주요 특징

- **🎨 Modern Design**: Toss Feed 스타일의 미니멀하고 깔끔한 디자인
- **📱 Responsive**: 모바일부터 데스크톱까지 완벽한 반응형 레이아웃
- **🚀 Fast Performance**: Next.js App Router 기반의 최적화된 성능
- **🎯 Material-UI**: 일관된 디자인 시스템과 접근성
- **🌙 Dark Mode Ready**: 다크모드 지원 준비
- **⚡ TypeScript**: 완전한 타입 안전성

## 🛠️ 기술 스택

### Frontend
- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Material-UI (MUI)** - React 컴포넌트 라이브러리
- **Emotion** - CSS-in-JS 스타일링
- **Tailwind CSS** - 유틸리티 CSS (보조적 사용)

### Development
- **ESLint** - 코드 품질 관리
- **Jest** - 테스트 프레임워크
- **Testing Library** - React 컴포넌트 테스트

## 🏗️ 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지
│   ├── about/             # About 페이지
│   ├── projects/          # Projects 페이지
│   ├── contact/           # Contact 페이지
│   ├── archives/          # Archives 페이지
│   ├── write/             # Write 페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── Header.tsx         # 네비게이션 헤더
│   ├── HeroSection.tsx    # 메인 히어로 섹션
│   ├── PostGrid.tsx       # 포스트 그리드 레이아웃
│   ├── PostCard.tsx       # 개별 포스트 카드
│   ├── MuiThemeProvider.tsx # MUI 테마 프로바이더
│   └── ...
├── hooks/                 # 커스텀 React 훅
├── shared/               # 공통 타입 및 유틸리티
└── styles/               # SCSS 모듈 파일들
```

## 🚀 시작하기

### 환경 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/soompy/suriLab.git
   cd suriBlog
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

### 사용 가능한 스크립트

```bash
npm run dev        # 개발 서버 실행
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버 실행
npm run lint       # ESLint 실행
npm run type-check # TypeScript 타입 체크
npm run test       # Jest 테스트 실행
npm run test:watch # Jest 워치 모드
```

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: `rgb(25, 31, 40)` - 메인 브랜드 컬러
- **Secondary**: `rgb(107, 114, 128)` - 보조 텍스트
- **Background**: `#ffffff` - 배경색
- **Surface**: `#ffffff` - 카드 및 컴포넌트 배경

### 타이포그래피
- **Font Family**: 시스템 폰트 스택 (Apple San Francisco, Segoe UI, Roboto 등)
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semibold)

### 레이아웃
- **Max Width**: 1300px (컨테이너 최대 너비)
- **Grid**: 반응형 1-4열 그리드 시스템
- **Spacing**: 4px 기반 간격 시스템

## 📱 반응형 디자인

- **Mobile**: `< 768px` - 1열 레이아웃, 햄버거 메뉴
- **Tablet**: `768px - 1024px` - 2열 레이아웃
- **Desktop**: `1024px - 1440px` - 3열 레이아웃
- **Large**: `> 1440px` - 4열 레이아웃

## 🎯 주요 컴포넌트

### Header
- 반응형 네비게이션 바
- 모바일 햄버거 메뉴
- 활성 페이지 표시
- 14px 메뉴 간격

### PostCard
- 미니멀한 카드 디자인
- 호버 애니메이션
- 카테고리 배지
- 읽기 시간 표시

### PostGrid
- 반응형 그리드 레이아웃
- 무한 스크롤 준비
- 로딩 상태 관리

## 🔮 향후 계획

- [ ] 다크모드 완전 구현
- [ ] 블로그 포스트 CRUD 기능
- [ ] 마크다운 에디터
- [ ] 검색 기능
- [ ] 태그 시스템
- [ ] 댓글 시스템
- [ ] RSS 피드
- [ ] SEO 최적화
- [ ] PWA 지원

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 ISC 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 확인하세요.

## 👨‍💻 개발자

**SuriBlog Team**
- GitHub: [@soompy](https://github.com/soompy)

---

⭐ 이 프로젝트가 유용하다면 스타를 눌러주세요!