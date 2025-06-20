# REST API 설계 문서

## 개요
블로그 게시글 관리를 위한 RESTful API 설계입니다.

## 데이터 모델

### Post Entity
```typescript
interface PostEntity {
  id: string              // 게시글 ID
  title: string          // 제목
  content: string        // 내용
  excerpt: string        // 요약
  slug: string           // URL 슬러그
  publishedAt: Date      // 작성일
  updatedAt: Date        // 수정일
  tags: string[]         // 태그 목록
  category: string       // 카테고리
  authorId: string       // 작성자 ID
  readTime?: number      // 예상 읽기 시간
  views?: number         // 조회수
  featured?: boolean     // 추천 글 여부
  isPublished: boolean   // 공개 여부
}
```

## API 엔드포인트

### 1. 게시글 목록 조회
```
GET /api/posts
```

#### Query Parameters
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| page | number | X | 1 | 페이지 번호 |
| limit | number | X | 10 | 페이지당 항목 수 |
| category | string | X | - | 카테고리 필터 |
| tags | string | X | - | 태그 필터 (콤마로 구분) |
| authorId | string | X | - | 작성자 필터 |
| search | string | X | - | 검색어 |
| featured | boolean | X | - | 추천 글 필터 |
| isPublished | boolean | X | true | 공개 여부 필터 |
| sortField | string | X | publishedAt | 정렬 필드 |
| sortOrder | string | X | desc | 정렬 순서 (asc/desc) |

#### 응답 예시
```json
{
  "posts": [
    {
      "id": "1",
      "title": "React Hooks 가이드",
      "content": "React Hooks에 대한 상세한 설명...",
      "excerpt": "React Hooks 사용법을 알아봅시다",
      "slug": "react-hooks-guide",
      "publishedAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "tags": ["React", "JavaScript"],
      "category": "Frontend",
      "authorId": "user-1",
      "readTime": 8,
      "views": 1247,
      "featured": true,
      "isPublished": true
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

### 2. 게시글 상세 조회
```
GET /api/posts/{id}
```

#### Path Parameters
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | string | 게시글 ID |

#### 응답 예시
```json
{
  "id": "1",
  "title": "React Hooks 가이드",
  "content": "# React Hooks 가이드\n\nReact Hooks에 대한 상세한 설명...",
  "excerpt": "React Hooks 사용법을 알아봅시다",
  "slug": "react-hooks-guide",
  "publishedAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "tags": ["React", "JavaScript"],
  "category": "Frontend",
  "authorId": "user-1",
  "readTime": 8,
  "views": 1248,
  "featured": true,
  "isPublished": true
}
```

### 3. 슬러그로 게시글 조회
```
GET /api/posts/slug/{slug}
```

#### Path Parameters
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| slug | string | 게시글 슬러그 |

### 4. 게시글 생성
```
POST /api/posts
```

#### 요청 Body
```json
{
  "title": "새로운 게시글",
  "content": "게시글 내용입니다.",
  "excerpt": "게시글 요약",
  "slug": "new-post",
  "tags": ["Tag1", "Tag2"],
  "category": "Category",
  "authorId": "user-1",
  "featured": false,
  "isPublished": true
}
```

#### 응답 예시
```json
{
  "id": "2",
  "title": "새로운 게시글",
  "content": "게시글 내용입니다.",
  "excerpt": "게시글 요약",
  "slug": "new-post",
  "publishedAt": "2024-01-16T09:30:00Z",
  "updatedAt": "2024-01-16T09:30:00Z",
  "tags": ["Tag1", "Tag2"],
  "category": "Category",
  "authorId": "user-1",
  "readTime": 2,
  "views": 0,
  "featured": false,
  "isPublished": true
}
```

### 5. 게시글 수정
```
PUT /api/posts/{id}
```

#### Path Parameters
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | string | 게시글 ID |

#### 요청 Body (부분 업데이트 지원)
```json
{
  "title": "수정된 제목",
  "content": "수정된 내용",
  "isPublished": false
}
```

#### 응답 예시
```json
{
  "id": "2",
  "title": "수정된 제목",
  "content": "수정된 내용",
  "excerpt": "게시글 요약",
  "slug": "new-post",
  "publishedAt": "2024-01-16T09:30:00Z",
  "updatedAt": "2024-01-16T10:15:00Z",
  "tags": ["Tag1", "Tag2"],
  "category": "Category",
  "authorId": "user-1",
  "readTime": 3,
  "views": 5,
  "featured": false,
  "isPublished": false
}
```

### 6. 게시글 삭제
```
DELETE /api/posts/{id}
```

#### Path Parameters
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | string | 게시글 ID |

#### 응답 예시
```json
{
  "success": true
}
```

### 7. 블로그 통계 조회
```
GET /api/blog/stats
```

#### 응답 예시
```json
{
  "totalPosts": 50,
  "totalViews": 15432,
  "totalCategories": 8,
  "totalTags": 25,
  "categories": ["Frontend", "Backend", "DevOps"],
  "tags": ["React", "JavaScript", "Node.js", "TypeScript"]
}
```

## HTTP 상태 코드

| 코드 | 의미 | 사용 상황 |
|------|------|----------|
| 200 | OK | 성공적인 GET, PUT 요청 |
| 201 | Created | 성공적인 POST 요청 |
| 400 | Bad Request | 잘못된 요청 데이터 |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 500 | Internal Server Error | 서버 내부 오류 |

## 에러 응답 형식

```json
{
  "error": "오류 메시지"
}
```

## 인증 및 권한

- 게시글 조회: 인증 불필요 (공개된 게시글만)
- 게시글 생성/수정/삭제: 작성자 인증 필요
- 비공개 게시글 조회: 작성자 권한 필요

## 필터링 및 검색

### 공개 여부 필터링
- `isPublished=true`: 공개된 게시글만
- `isPublished=false`: 비공개 게시글만
- 파라미터 없음: 기본적으로 공개된 게시글만

### 검색 기능
- 제목, 내용, 태그에서 검색
- 대소문자 구분 없음
- 부분 일치 지원

### 정렬 옵션
- `publishedAt`: 작성일순
- `updatedAt`: 수정일순
- `views`: 조회수순
- `title`: 제목순

## 페이지네이션

- 기본 페이지 크기: 10개
- 최대 페이지 크기: 100개
- 0번째 페이지 없음 (1부터 시작)