# 🚀 SQLite → Supabase PostgreSQL 마이그레이션 가이드

## 📋 준비사항

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com) 접속 후 로그인
2. "New Project" 클릭
3. 프로젝트 설정:
   - **Name**: `suri-blog`
   - **Database Password**: 강력한 비밀번호 생성 (반드시 저장!)
   - **Region**: `Northeast Asia (Seoul)`
4. "Create new project" 클릭 후 대기 (2-3분)

### 2. 연결 문자열 확인
1. Supabase 대시보드 → **Settings** → **Database**
2. **Connection string** 섹션에서 `URI` 복사
3. 형태: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## 🔧 로컬 마이그레이션 단계

### 1단계: 환경 변수 설정
```bash
# .env 파일에서 DATABASE_URL 업데이트
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 2단계: Prisma 클라이언트 재생성
```bash
npm run postinstall
```

### 3단계: 새 데이터베이스 스키마 적용
```bash
npx prisma migrate deploy
```

### 4단계: 기존 데이터 마이그레이션
```bash
npm run db:migrate-to-supabase
```

### 5단계: 마이그레이션 확인
```bash
npx prisma studio
```

## 🌐 Vercel 배포 설정

### 1. Vercel 환경 변수 설정
Vercel 대시보드 → Project → Settings → Environment Variables에서 추가:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
BLOG_ADMIN_PASSWORD=Risesuri25!
EMAIL_USER=yzsumin@naver.com
EMAIL_PASS=[YOUR-NAVER-APP-PASSWORD]
```

### 2. 배포 트리거
```bash
git add .
git commit -m "feat: migrate to Supabase PostgreSQL for production compatibility"
git push origin master
```

## 🧪 테스트

1. **로컬 테스트**: http://localhost:3000/write
2. **프로덕션 테스트**: https://suri-blog.vercel.app/write
3. **포스트 발행 테스트 수행**

## ⚠️ 문제 해결

### 연결 실패 시
1. Supabase 프로젝트가 완전히 시작되었는지 확인
2. 비밀번호에 특수문자가 있으면 URL 인코딩 필요
3. 방화벽/네트워크 설정 확인

### 마이그레이션 실패 시
1. 기존 SQLite 데이터 확인: `npx prisma studio`
2. PostgreSQL 연결 테스트: `npx prisma db pull`
3. 스키마 충돌 해결: `npx prisma migrate reset`

## 🎯 완료 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] 로컬 DATABASE_URL 업데이트
- [ ] Prisma 마이그레이션 실행
- [ ] 기존 데이터 마이그레이션 완료
- [ ] Vercel 환경 변수 설정
- [ ] 프로덕션 배포 완료
- [ ] 포스트 발행 기능 테스트 통과

## 🚨 백업 주의사항

**마이그레이션 전 반드시 백업!**
```bash
cp prisma/dev.db prisma/dev.db.backup
```