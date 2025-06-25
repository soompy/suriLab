# 📦 데이터 백업 및 복구 가이드

포스트 게시글 손실을 방지하기 위한 완전한 백업 시스템을 구축했습니다.

## 🚀 빠른 시작

### 즉시 백업 생성
```bash
npm run backup
```

### 백업 시스템 테스트
```bash
npm run backup:test
```

### 백업에서 복구
```bash
npm run restore backups/backup-2024-01-01T00-00-00-000Z.json
```

## 📋 백업 시스템 구성

### 1. 수동 백업 스크립트
- **파일**: `scripts/backup-database.js`
- **기능**: 모든 포스트, 카테고리, 태그, 사용자, 댓글 데이터를 JSON으로 백업
- **저장위치**: `backups/` 폴더
- **자동정리**: 10개 이상 시 오래된 백업 자동 삭제

### 2. 복구 스크립트
- **파일**: `scripts/restore-database.js`
- **기능**: 백업 파일로부터 완전한 데이터베이스 복구
- **안전장치**: 복구 전 확인 프롬프트

### 3. 자동 백업 (GitHub Actions)
- **파일**: `.github/workflows/auto-backup.yml`
- **주기**: 매일 오전 2시 (KST 11시) 자동 실행
- **저장**: GitHub Artifacts에 30일간 보관

### 4. 백업 검증 시스템
- **파일**: `scripts/test-backup.js`
- **기능**: 백업 생성, 파일 유효성, 데이터 일관성 검사

## 🛡️ 데이터 보호 전략

### 정기 백업
```bash
# 매일 실행 권장
npm run backup

# 또는 cron 설정
0 2 * * * cd /path/to/suriblog && npm run backup
```

### 중요 작업 전 백업
```bash
# 데이터베이스 마이그레이션 전
npm run backup

# 대량 데이터 수정 전
npm run backup

# 배포 전
npm run backup
```

### 백업 검증
```bash
# 백업 시스템 상태 확인
npm run backup:test
```

## 📁 백업 파일 구조

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0",
  "statistics": {
    "posts": 5,
    "categories": 3,
    "tags": 15,
    "users": 1,
    "comments": 0
  },
  "data": {
    "posts": [...],
    "categories": [...],
    "tags": [...],
    "users": [...],
    "comments": [...]
  }
}
```

## 🔄 복구 절차

### 1. 백업 파일 확인
```bash
ls -la backups/
```

### 2. 복구 실행
```bash
npm run restore backups/backup-YYYY-MM-DDTHH-mm-ss-sssZ.json
```

### 3. 복구 확인
- 웹사이트 접속하여 데이터 확인
- 관리자 페이지에서 포스트 목록 확인

## ⚠️ 주의사항

### 환경변수 보안
- `.env` 파일은 Git에 커밋되지 않음
- `.env.example` 참조하여 설정
- 프로덕션 환경변수는 별도 관리

### 백업 파일 관리
- 민감한 정보 포함되므로 보안 주의
- 로컬 백업은 안전한 위치에 보관
- 클라우드 백업 시 암호화 권장

### 복구 시 주의점
- 복구는 기존 데이터를 완전히 교체
- 복구 전 현재 상태 백업 권장
- 테스트 환경에서 먼저 검증

## 🛠️ 추가 설정

### GitHub Secrets 설정
프로젝트 Settings > Secrets and variables > Actions에서 설정:
```
DATABASE_URL=your_neon_postgresql_url
```

### Vercel 환경변수
Vercel 대시보드에서 환경변수 설정:
- `DATABASE_URL`
- `BLOG_ADMIN_PASSWORD`
- `EMAIL_USER`
- `EMAIL_PASS`

## 🆘 문제 해결

### 백업 실패 시
1. 데이터베이스 연결 확인
2. 디스크 공간 확인
3. 권한 문제 확인

### 복구 실패 시
1. 백업 파일 유효성 확인
2. 데이터베이스 스키마 버전 확인
3. 네트워크 연결 확인

## 📞 지원

백업 시스템 관련 문제 시:
1. `npm run backup:test`로 시스템 상태 확인
2. GitHub Issues에 상세한 오류 로그와 함께 문의
3. 긴급한 경우 직접 데이터베이스 백업 생성

---

**💡 팁**: 중요한 포스트 작성 후에는 즉시 백업을 생성하는 습관을 만드세요!