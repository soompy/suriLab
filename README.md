# SuriBlog 🚀

> 현대적이고 사용자 친화적인 개발 블로그 플랫폼

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.10-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Jest-30.0.0-C21325?logo=jest)](https://jestjs.io/)

## ✨ 주요 기능

### 📝 에디터 기능
- **Markdown 기반 에디터**: 실시간 미리보기와 편집 모드 전환
- **키보드 단축키**: `Ctrl+S`로 빠른 저장
- **자동 저장**: 설정 가능한 지연 시간으로 자동 저장
- **태그 시스템**: 자동완성 제안과 중복 방지 기능

### 🎨 사용자 인터페이스
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **현대적 UI**: Tailwind CSS로 구현된 깔끔한 디자인
- **실시간 통계**: 단어 수, 글자 수, 태그 개수 표시
- **포스트 상태 관리**: 초안/발행/비공개 상태 전환

### 🔧 개발자 경험
- **TDD 방식**: 테스트 주도 개발로 안정성 보장
- **Clean Architecture**: 확장 가능한 구조 설계
- **TypeScript**: 타입 안전성과 개발 생산성 향상
- **ESLint**: 코드 품질 관리

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 4.1.10
- **State Management**: Zustand 5.0.5
- **Data Fetching**: TanStack Query 5.80.7

### Content Management
- **Markdown**: react-markdown + remark-gfm
- **MDX**: @next/mdx for enhanced content

### Testing
- **Test Framework**: Jest 30.0.0
- **Testing Library**: React Testing Library 16.3.0
- **Test Environment**: jsdom

### Development Tools
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm
- **Git Hooks**: 사전 커밋 검증

## 🚀 빠른 시작

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/soompy/suriLab.git
cd suriLab

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 사용 가능한 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린팅 실행
npm run lint

# 타입 체크
npm run type-check

# 테스트 실행
npm test

# 테스트 감시 모드
npm run test:watch
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── __tests__/         # 컴포넌트 테스트
│   ├── __mocks__/         # 테스트 모킹
│   ├── MarkdownEditor.tsx # 마크다운 에디터
│   └── TagSystem.tsx      # 태그 시스템
├── entities/              # 도메인 엔티티
├── infrastructure/        # 외부 서비스 연동
├── presentation/          # 프레젠테이션 레이어
├── repositories/          # 데이터 접근 계층
├── shared/               # 공통 유틸리티
└── usecases/             # 비즈니스 로직
```

## 🧪 테스트

이 프로젝트는 **TDD(Test-Driven Development)** 방식으로 개발되었습니다.

### 테스트 실행

```bash
# 모든 테스트 실행
npm test

# 테스트 감시 모드 (개발 중 권장)
npm run test:watch

# 테스트 커버리지 확인
npm test -- --coverage
```

### 테스트 커버리지

- ✅ **MarkdownEditor**: 실시간 편집, 미리보기, 자동저장, 키보드 단축키
- ✅ **TagSystem**: 태그 추가/삭제, 자동완성, 유효성 검사, 최대 개수 제한

## 🎯 개발 로드맵

### ✅ 완료된 기능
- [x] 프로젝트 초기 설정 및 환경 구성
- [x] TDD 환경 설정 (Jest + React Testing Library)
- [x] Markdown 에디터 구현
- [x] 태그 시스템 구현
- [x] 반응형 UI 구현

### 🚧 진행 중인 기능
- [ ] 포스트 목록 및 정렬 기능
- [ ] 댓글 시스템
- [ ] 좋아요/공감 기능
- [ ] SNS 공유 기능

### 📋 예정된 기능
- [ ] 사용자 인증 시스템
- [ ] 포스트 발행 상태 관리
- [ ] SEO 최적화 (meta tags, sitemap)
- [ ] Google Analytics 연동
- [ ] 관련 글 추천 기능
- [ ] 검색 기능
- [ ] 다크 모드

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 커밋 메시지 가이드

이 프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다:

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드 추가/수정
chore: 빌드 프로세스, 도구 설정 변경
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

**SoomPy** - [GitHub](https://github.com/soompy)

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!

## 🔧 개발 환경 설정

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 9.0.0 이상

### VS Code 확장 프로그램 권장
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Jest Runner
- Prettier - Code formatter

### 환경 변수 설정

`.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```env
# 예시 환경 변수
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📊 성능 최적화

- **코드 분할**: Next.js 자동 코드 분할 활용
- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **CSS 최적화**: Tailwind CSS의 PurgeCSS 활용
- **번들 분석**: `npm run analyze`로 번들 크기 확인

## 🐛 버그 리포트

버그를 발견했다면 [Issues](https://github.com/soompy/suriLab/issues)에 다음 정보와 함께 리포트해 주세요:

- 버그 설명
- 재현 단계
- 예상 결과 vs 실제 결과
- 환경 정보 (OS, 브라우저, Node.js 버전)
- 스크린샷 (해당되는 경우)

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 라이브러리들의 도움으로 만들어졌습니다:

- [Next.js](https://nextjs.org/) - React 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 CSS 프레임워크
- [react-markdown](https://github.com/remarkjs/react-markdown) - 마크다운 렌더링
- [Zustand](https://github.com/pmndrs/zustand) - 상태 관리
- [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/) - 테스팅