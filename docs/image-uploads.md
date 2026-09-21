# 포스트 이미지 업로드

작성 화면의 **이미지 업로드** 버튼으로 본문에 이미지를 삽입하고, 썸네일 영역에서 대표 이미지를 업로드한다. JPEG, PNG, GIF, WebP 파일을 최대 4MB까지 지원한다. 파일명은 본문 이미지의 기본 대체 텍스트이며 마크다운에서 수정할 수 있다.

관리자 인증 후 `/api/upload`에서 형식, 크기, 파일 시그니처를 확인한다. PostgreSQL `uploaded_images` 테이블에 바이너리를 저장하고 `/api/images/[id]` URL로 공개 제공한다. 서버 로컬 디스크나 별도 스토리지 계정에 의존하지 않는다. 업로드된 이미지는 공개 URL이므로 게시 전 이미지도 URL을 아는 사람이 볼 수 있다.

배포 전 `npm run db:migrate:status`로 미적용 마이그레이션을 확인하고 `npm run db:migrate:deploy`로 적용한다. 이미지 테이블 마이그레이션은 `20260908000000_add_uploaded_images`이다. `npm run build`와 `npm run vercel-build`는 Prisma Client를 생성하지만 DB 마이그레이션은 적용하지 않는다. 개발 DB에서는 `npm run db:migrate`를 사용한다.

`npm run db:check:images`로 실제 DB에 PNG를 저장하고 다시 읽어 바이트와 MIME 형식을 검증할 수 있다. 검증용 트랜잭션은 롤백되므로 테스트 이미지는 남지 않는다.

기존 이미지 URL과 인라인 썸네일은 변경하지 않는다. 이미지 크롤링을 위해 robots에 `/api/images/` 허용 예외를 추가한다. 기존 포스트 경로, 메타데이터 및 사이트맵은 유지하며 새 썸네일도 기존 공유 미리보기 로직을 사용한다. 이미지 URL은 변경되지 않으며 장기 캐시된다. 현재 이미지 삭제/고아 이미지 정리는 제공하지 않는다. DB 용량과 백업 크기에 이미지 데이터가 포함된다.
