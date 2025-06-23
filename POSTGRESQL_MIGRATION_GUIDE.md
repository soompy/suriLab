# PostgreSQL 무료 데이터베이스 마이그레이션 가이드

현재 Vercel 환경에서 SQLite는 파일 시스템 제약으로 인해 제한적입니다. 
영구 데이터 저장을 위해 무료 PostgreSQL 서비스로 마이그레이션하는 방법을 안내드립니다.

## 1단계: Neon PostgreSQL 계정 생성

1. [Neon 공식 사이트](https://neon.com/) 접속
2. "Get Started" 또는 "Sign Up" 클릭
3. GitHub 계정으로 로그인 (권장)
4. 프로젝트 생성:
   - 프로젝트 이름: `suri-blog-db`
   - 지역: `US East (Ohio)` (가장 가까운 지역)
   - PostgreSQL 버전: 기본값 사용

## 2단계: 데이터베이스 연결 정보 획득

프로젝트 생성 후 대시보드에서:
1. "Connection details" 또는 "Connect" 버튼 클릭
2. **Pooled connection** 탭 선택 (성능상 권장)
3. 연결 문자열 복사 (형태: `postgresql://user:password@host/dbname?sslmode=require`)

예시:
```
postgresql://neondb_owner:abc123def456@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## 3단계: Vercel 환경 변수 업데이트

```bash
# 현재 메모리 DB 환경 변수 제거
vercel env rm DATABASE_URL production

# 새로운 PostgreSQL 연결 문자열 추가
vercel env add DATABASE_URL production
# 프롬프트에서 위에서 복사한 연결 문자열 입력
```

## 4단계: Prisma 스키마 업데이트

`prisma/schema.prisma` 파일을 수정:

```prisma
datasource db {
  provider = "postgresql"  // sqlite에서 postgresql로 변경
  url      = env("DATABASE_URL")
}
```

## 5단계: 배포 및 테스트

```bash
# 변경사항 커밋
git add -A
git commit -m "feat: PostgreSQL 데이터베이스로 마이그레이션"
git push origin master

# Vercel 재배포
vercel --prod
```

## 6단계: 데이터 마이그레이션 (선택사항)

기존 SQLite 데이터가 있다면:

```bash
# 로컬에서 마이그레이션 스크립트 실행
npm run db:migrate-to-postgresql
```

## 완료 확인

1. https://suri-blog-suris-projects.vercel.app 접속
2. 메인 페이지에서 게시글 로딩 확인
3. `/write` 페이지에서 새 글 작성 테스트
4. 댓글과 좋아요 기능 테스트

## Neon 무료 티어 제한사항

- **저장용량**: 0.5GB
- **연결 수**: 동시 연결 10개
- **활성 시간**: 매월 100시간 (충분함)
- **데이터 전송**: 5GB/월

## 문제 해결

### 연결 오류
- SSL 모드가 `require`로 설정되어 있는지 확인
- 연결 문자열에 특수 문자가 올바르게 인코딩되어 있는지 확인

### 성능 최적화
- **Pooled connection** 사용 (호스트명에 `-pooler` 포함)
- 연결 풀링으로 서버리스 환경에서 성능 향상

### 백업
- Neon 대시보드에서 자동 백업 설정
- 정기적으로 `pg_dump`로 로컬 백업 생성

## 대안 서비스

Neon 외에도 다음 무료 PostgreSQL 서비스들을 고려할 수 있습니다:

1. **Supabase** - 2개 프로젝트, 500MB
2. **Railway** - $5 크레딧/월
3. **Aiven** - 30일 무료 체험

---

**참고**: 현재는 임시로 메모리 데이터베이스를 사용하고 있어 서버 재시작 시 데이터가 초기화됩니다. 
영구 저장을 위해 위 단계를 따라 PostgreSQL 마이그레이션을 완료해주세요.