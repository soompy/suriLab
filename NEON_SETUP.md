# 🗄️ Neon PostgreSQL 설정 완료 가이드

## 현재 상태
✅ PostgreSQL 스키마 준비 완료
✅ Vercel 환경 변수 슬롯 준비 완료
⚠️ 실제 Neon URL 설정 필요

## 🚀 Neon 설정 단계

### 1️⃣ Neon 계정 생성
1. **https://neon.tech** 접속
2. **"Sign up"** 클릭
3. **GitHub 계정**으로 가입

### 2️⃣ 프로젝트 생성
1. **"Create your first project"** 클릭
2. 설정값 입력:
   ```
   Project name: suri-blog
   Database name: suri-blog-db
   Region: AWS US East (N. Virginia)
   PostgreSQL version: 15
   ```
3. **"Create project"** 클릭

### 3️⃣ 연결 문자열 복사
1. 생성된 프로젝트에서 **"Connect"** 버튼 클릭
2. **"Prisma"** 탭 선택
3. 연결 문자열 복사 (예시):
   ```
   postgresql://suri-blog-owner:AbCdEf123456@ep-silent-forest-123456.us-east-1.aws.neon.tech/suri-blog-db?sslmode=require
   ```

### 4️⃣ Vercel 환경 변수 업데이트
```bash
# 기존 샘플 URL 제거
vercel env rm DATABASE_URL production

# 실제 Neon URL 추가 (위에서 복사한 연결 문자열 사용)
echo "postgresql://your-actual-neon-url" | vercel env add DATABASE_URL production
```

### 5️⃣ 배포 실행
```bash
# 프로덕션 배포 (자동으로 PostgreSQL 스키마 생성)
vercel --prod
```

## 📊 무료 플랜 한도
- **저장 공간**: 500MB
- **컴퓨트 시간**: 100시간/월  
- **동시 연결**: 100개
- **브랜치**: 1개
- **백업 보관**: 7일

## ✅ 완료 후 확인사항
1. **사이트 접속**: https://suri-blog.vercel.app
2. **관리자 로그인**: https://suri-blog.vercel.app/write
3. **포스트 발행 테스트**: 제목, 내용, 카테고리 입력 후 발행
4. **데이터 영구성**: 서버 재시작 후에도 포스트 유지 확인

## 🎯 마이그레이션 완료 후 혜택
- ✅ **영구 데이터 저장**: 서버 재시작해도 데이터 유지
- ✅ **성능 향상**: PostgreSQL 최적화된 쿼리
- ✅ **확장성**: 동시 사용자 지원
- ✅ **백업 자동화**: Neon 자동 백업
- ✅ **모니터링**: Neon 대시보드에서 실시간 모니터링

## 🔧 문제 해결
### 연결 오류 시:
```bash
# SSL 설정 확인
DATABASE_URL="postgresql://...?sslmode=require"
```

### 스키마 오류 시:
```bash
# 스키마 재생성
npx prisma db push --force-reset
```

---

**⚠️ 중요**: 위 4️⃣ 단계를 완료해야 실제 영구 데이터베이스가 활성화됩니다!