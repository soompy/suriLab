# 🚀 SuriBlog 프로덕션 배포 가이드

## 📋 배포 현황

### 🌐 프로덕션 사이트
- **메인 URL**: https://suri-blog.vercel.app
- **배포 플랫폼**: Vercel
- **배포 상태**: ✅ 실제 서비스 운영 중
- **마지막 배포**: 2025-01-24
- **마지막 업데이트**: 2025-01-24 (관리자 비밀번호 변경)

### 🔧 배포된 기능들
- ✅ 완전한 블로그 시스템 (CRUD)
- ✅ 관리자 인증 시스템
- ✅ 댓글 시스템 (실시간 CRUD)
- ✅ 좋아요 기능 (IP 기반 중복 방지)
- ✅ 마크다운 에디터 (Velog 수준)
- ✅ 이미지 업로드 및 최적화
- ✅ 반응형 디자인 (Material-UI)
- ✅ 다크모드 완전 지원
- ✅ 실시간 검색 기능
- ✅ RSS 피드 자동 생성

## 🛠️ 배포 설정

### 📦 Environment Variables (Vercel)
```bash
# 데이터베이스
DATABASE_URL=file:./database.db

# 인증 시스템
BLOG_ADMIN_PASSWORD=[사용자 설정 비밀번호]

# 이메일 서비스
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 🔧 Build Configuration
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run vercel-build",
  "regions": ["icn1"]
}
```

### 📝 Build Scripts
```json
{
  "scripts": {
    "vercel-build": "prisma generate && next build",
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

## 🎯 배포 과정

### 1️⃣ 초기 배포 준비
```bash
# 1. 로컬 빌드 테스트
npm run build

# 2. Vercel CLI 설치
npm install -g vercel

# 3. 프로젝트 연결
vercel
```

### 2️⃣ 환경 변수 설정
```bash
# 각 환경 변수 추가
vercel env add DATABASE_URL production
vercel env add BLOG_ADMIN_PASSWORD production
vercel env add EMAIL_USER production
vercel env add EMAIL_PASS production
```

### 3️⃣ 프로덕션 배포
```bash
# 프로덕션 배포
vercel --prod

# URL 별칭 설정
vercel alias https://suri-blog-[hash]-suris-projects.vercel.app suri-blog.vercel.app
```

## 📊 성능 최적화

### ⚡ Next.js 15 최적화 사항
- **App Router**: 최신 라우팅 시스템
- **Server Components**: 서버 사이드 렌더링 최적화
- **Image Optimization**: 자동 이미지 최적화
- **Bundle Splitting**: 코드 분할 최적화

### 🎨 UI 최적화
- **Material-UI**: 트리 쉐이킹 적용
- **CSS-in-JS**: Emotion 런타임 최적화
- **반응형 이미지**: WebP 포맷 자동 변환

### 💾 데이터베이스 최적화
- **Prisma ORM**: 타입 안전한 쿼리
- **Connection Pooling**: 자동 연결 관리
- **Query Optimization**: 인덱스 최적화

## 🔍 모니터링 및 분석

### 📈 Vercel Analytics
- **성능 메트릭**: Core Web Vitals 모니터링
- **사용자 분석**: 방문자 통계
- **오류 추적**: 실시간 에러 모니터링

### 🐛 디버깅 도구
```bash
# 배포 로그 확인
vercel logs [deployment-url]

# 함수 실행 로그
vercel logs --follow
```

## 🔐 보안 설정

### 🛡️ 환경 변수 보안
- **Production Only**: 프로덕션 전용 변수 분리
- **암호화 저장**: Vercel 자동 암호화
- **Git 제외**: `.env` 파일 Git 추적 제외

### 🔒 API 보안
- **CORS 설정**: 필요한 도메인만 허용
- **Rate Limiting**: API 호출 제한
- **Input Validation**: 모든 입력값 검증

## 🚀 지속적 배포 (CD)

### 📦 자동 배포 설정
```yaml
# GitHub Actions (옵션)
name: Deploy to Vercel
on:
  push:
    branches: [master]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 🔄 배포 전략
1. **Feature Branch**: 기능 개발
2. **Staging**: 테스트 배포
3. **Production**: 메인 배포
4. **Rollback**: 필요시 이전 버전 복구

## 📝 배포 체크리스트

### ✅ 배포 전 확인사항
- [ ] 로컬 빌드 성공 확인
- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 마이그레이션 완료
- [ ] 테스트 케이스 통과
- [ ] 보안 설정 점검

### ✅ 배포 후 확인사항
- [ ] 사이트 접속 확인
- [ ] 모든 페이지 정상 작동
- [ ] 댓글/좋아요 기능 테스트
- [ ] 관리자 로그인 테스트
- [ ] 모바일 반응형 확인

## 🔐 보안 및 비밀번호 관리

### 🔑 비밀번호 변경 방법
```bash
# 1. 기존 비밀번호 제거
vercel env rm BLOG_ADMIN_PASSWORD production

# 2. 새 비밀번호 설정 (개행 문자 없이)
printf "새로운비밀번호" | vercel env add BLOG_ADMIN_PASSWORD production

# 3. 새 배포 트리거
vercel --prod
```

### 🛡️ 보안 특징
- **암호화 저장**: 모든 환경 변수는 Vercel에서 자동 암호화
- **Git 안전성**: 비밀번호가 소스 코드에 노출되지 않음
- **서버 사이드 검증**: 클라이언트에서 비밀번호 접근 불가
- **HTTPS 통신**: 모든 데이터 전송 암호화

### 🔒 비밀번호 정책
- **최소 8자 이상** 권장
- **대소문자, 숫자, 특수문자** 조합
- **정기적 변경** (3-6개월마다)
- **추측 어려운 조합** 사용

## 🔧 트러블슈팅

### 🐛 일반적인 문제들

#### Build Error
```bash
# Prisma 클라이언트 재생성
npx prisma generate

# 캐시 클리어
rm -rf .next
npm run build
```

#### Environment Variables
```bash
# 환경 변수 확인
vercel env ls

# 환경 변수 업데이트
vercel env rm VARIABLE_NAME production
vercel env add VARIABLE_NAME production
```

#### Database Connection
```bash
# 데이터베이스 상태 확인
npx prisma db push
npx prisma studio
```

## 📞 지원 및 문의

### 🆘 문제 해결
- **GitHub Issues**: [이슈 생성](https://github.com/soompy/suriLab/issues)
- **Vercel Support**: [Vercel 지원 센터](https://vercel.com/support)
- **개발자 연락**: yzsumin@naver.com

### 📚 참고 자료
- [Vercel 배포 가이드](https://vercel.com/docs)
- [Next.js 15 문서](https://nextjs.org/docs)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)

---

## 🎉 배포 성공!

**🌐 프로덕션 사이트**: https://suri-blog.vercel.app

실제 서비스 수준의 블로그가 성공적으로 배포되었습니다!

---

*마지막 업데이트: 2025-01-24*
*배포자: 이수민 ([@soompy](https://github.com/soompy))*