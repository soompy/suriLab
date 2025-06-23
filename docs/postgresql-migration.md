# 🗄️ PostgreSQL 마이그레이션 가이드

## 1. Neon PostgreSQL 설정

### 1️⃣ Neon 계정 생성
1. https://neon.tech 접속
2. GitHub 계정으로 가입
3. 새 프로젝트 생성
   - 프로젝트명: `suri-blog`
   - 리전: `AWS US East`
   - PostgreSQL 버전: `15`

### 2️⃣ 연결 문자열 복사
1. Neon 대시보드에서 "Connect" 클릭
2. "Prisma" 탭 선택
3. 연결 문자열 복사 (예시):
```
postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 2. 로컬 마이그레이션 테스트

### 1️⃣ 환경 변수 설정
```bash
# .env.local 파일 생성
echo "POSTGRESQL_DATABASE_URL=your_neon_connection_string" >> .env.local
```

### 2️⃣ 스키마 푸시
```bash
# PostgreSQL 스키마 생성
POSTGRESQL_DATABASE_URL="your_connection_string" npx prisma db push
```

### 3️⃣ 데이터 마이그레이션 (선택사항)
```bash
# 기존 SQLite 데이터가 있는 경우
POSTGRESQL_DATABASE_URL="your_connection_string" npx tsx scripts/migrate-to-postgresql.ts
```

## 3. Vercel 환경 변수 업데이트

### 1️⃣ 현재 DATABASE_URL 제거
```bash
vercel env rm DATABASE_URL production
```

### 2️⃣ PostgreSQL URL 추가
```bash
echo "your_neon_connection_string" | vercel env add DATABASE_URL production
```

### 3️⃣ 배포
```bash
vercel --prod
```

## 4. 장점 및 특징

### ✅ PostgreSQL 장점
- **영구 데이터 저장**: 서버 재시작 시에도 데이터 유지
- **ACID 트랜잭션**: 데이터 일관성 보장
- **확장성**: 대용량 데이터 처리
- **백업 및 복구**: 자동 백업 시스템
- **동시성**: 여러 사용자 동시 접근 지원

### 🆓 Neon 무료 플랜
- **저장 공간**: 500MB
- **컴퓨트 시간**: 100시간/월
- **브랜치**: 1개
- **연결 수**: 100개

### 🔧 기술 스택 변경사항
- **데이터베이스**: SQLite → PostgreSQL
- **호스팅**: Vercel Serverless + Neon
- **ORM**: Prisma (변경 없음)
- **타입 안전성**: TypeScript (변경 없음)

## 5. 모니터링 및 유지보수

### 📊 Neon 대시보드
- **사용량 모니터링**: 저장 공간, 컴퓨트 시간
- **쿼리 성능**: 느린 쿼리 분석
- **연결 상태**: 실시간 연결 모니터링

### 🔄 정기 백업
- **자동 백업**: Neon에서 자동 처리
- **수동 백업**: `pg_dump` 사용 가능
- **데이터 복구**: 특정 시점으로 복구 가능

## 6. 트러블슈팅

### 🐛 일반적인 문제들

#### 연결 오류
```bash
# SSL 관련 오류 시
DATABASE_URL="postgresql://...?sslmode=require"
```

#### 마이그레이션 오류
```bash
# 스키마 재설정
npx prisma db push --force-reset
```

#### 성능 최적화
```sql
-- 인덱스 생성
CREATE INDEX idx_posts_published ON posts(isPublished, publishedAt);
CREATE INDEX idx_posts_slug ON posts(slug);
```

## 7. 비용 계획

### 무료 한도 초과 시
- **Pro 플랜**: $19/월
- **Scale 플랜**: $69/월
- **Enterprise**: 커스텀 가격

### 사용량 최적화
- **커넥션 풀링**: Prisma 자동 관리
- **쿼리 최적화**: N+1 문제 방지
- **인덱스 활용**: 검색 성능 향상

---

이 가이드를 통해 SQLite에서 PostgreSQL로 안전하고 효율적으로 마이그레이션할 수 있습니다.