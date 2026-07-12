# 🚀 Vercel 배포 가이드

## 1. 사전 준비사항

### 필요한 계정
- [Vercel 계정](https://vercel.com)
- [Supabase 계정](https://supabase.com) (무료 PostgreSQL)
- 도메인 (선택사항)

## 2. 데이터베이스 설정 (Supabase)

### 2.1 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `suriblog-db`
   - Database Password: 강력한 비밀번호 설정
   - Region: Northeast Asia (Seoul)
4. 프로젝트 생성 완료까지 대기 (약 2분)

### 2.2 데이터베이스 연결 정보 획득
1. 프로젝트 대시보드 → Settings → Database
2. "Connection string" 섹션에서 "URI" 복사
3. 예시: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## 3. Vercel 배포

### 3.1 GitHub 연결
1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub에서 `suriBlog` 저장소 import
4. 프로젝트 설정:
   - Framework Preset: Next.js
   - Build Command: `npm run vercel-build`
   - Output Directory: `.next`

### 3.2 환경변수 설정
Vercel 프로젝트 설정 → Environment Variables에 다음 추가:

```bash
# 데이터베이스
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# 관리자 인증
BLOG_ADMIN_PASSWORD=your-secure-admin-password

# 이메일 설정
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password

# 사이트 URL
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Google Search Console
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=google-site-verification-token

# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3.3 배포 실행
1. "Deploy" 버튼 클릭
2. 빌드 완료 대기 (약 3-5분)
3. 배포 완료 후 URL 확인

## 4. 커스텀 도메인 설정

### 4.1 도메인 구매 (권장 서비스)
- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- [Cloudflare](https://www.cloudflare.com)

### 4.2 Vercel에 도메인 추가
1. Vercel 프로젝트 → Settings → Domains
2. "Add Domain" 클릭
3. 구매한 도메인 입력 (예: `yourblog.com`)
4. DNS 설정 방법 확인

### 4.3 DNS 설정
도메인 관리 페이지에서 다음 레코드 추가:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.19
```

## 5. SSL 및 보안 설정

### 5.1 자동 HTTPS
- Vercel이 자동으로 Let's Encrypt SSL 인증서 발급
- 배포 후 24시간 이내 활성화

### 5.2 보안 헤더 설정
`next.config.js`에 보안 헤더 추가됨:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  }
]
```

## 6. 성능 최적화

### 6.1 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP/AVIF 자동 변환
- 적응형 이미지 크기

### 6.2 CDN 및 캐싱
- Vercel Edge Network 활용
- 정적 자산 캐싱
- API 응답 캐싱

## 7. 모니터링 및 분석

### 7.1 Vercel Analytics
1. 프로젝트 → Analytics 탭
2. "Enable Analytics" 클릭
3. 실시간 성능 모니터링

### 7.2 Google Analytics (선택사항)
1. Google Analytics에서 GA4 Web Stream 생성
2. 측정 ID 복사 (예: `G-XXXXXXXXXX`)
3. Vercel Environment Variables에 `NEXT_PUBLIC_GA_ID` 추가
4. 재배포 후 실시간 보고서에서 접속 이벤트 확인

### 7.3 Google Search Console
1. URL prefix 속성으로 `NEXT_PUBLIC_SITE_URL` 값 등록
2. HTML tag 인증 토큰을 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`에 추가
3. 재배포 후 소유권 확인
4. `https://your-domain.vercel.app/sitemap.xml` 제출

## 8. 배포 후 체크리스트

- [ ] 사이트 정상 접속 확인
- [ ] 댓글 시스템 테스트
- [ ] 좋아요 기능 테스트
- [ ] 관리자 로그인 테스트
- [ ] 이메일 전송 테스트
- [ ] 모바일 반응형 확인
- [ ] 페이지 로딩 속도 확인
- [ ] SEO 메타태그 확인

## 9. 도메인 예시

### 개인 블로그 도메인 아이디어
- `soomin.dev`
- `soomin.blog`
- `surilab.com`
- `soomin-tech.com`
- `codewithsoomin.com`

### 추천 TLD
- `.com` - 가장 신뢰성 높음
- `.dev` - 개발자용
- `.blog` - 블로그 전용
- `.me` - 개인용
- `.tech` - 기술 블로그용

## 10. 비용 예상

### Vercel (무료)
- 100GB 대역폭/월
- 무제한 정적 사이트
- Serverless Functions 100GB-Hrs/월

### Supabase (무료)
- 500MB 데이터베이스
- 50MB 파일 저장소
- 2GB 대역폭/월

### 도메인 (연간)
- `.com`: $10-15/년
- `.dev`: $12-20/년
- `.blog`: $30-40/년

**총 예상 비용: $10-40/년** (도메인만 유료)
