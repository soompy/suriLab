import { prisma } from './prisma'

export async function initializeDatabase() {
  try {
    // 데이터베이스 연결 테스트
    await prisma.$connect()
    console.log('Database connected successfully')

    // 데이터베이스 파일 경로 확인
    const dbUrl = process.env.DATABASE_URL || ''
    console.log(`Database URL: ${dbUrl.substring(0, 30)}...`)

    // Vercel 환경에서 메모리 데이터베이스 사용
    if (process.env.VERCEL) {
      console.log('Vercel environment detected, initializing in-memory database...')
      // 메모리 데이터베이스의 경우 항상 초기화가 필요
      console.log('Initializing tables and data...')  
    }

    // 기본 데이터 생성 (영구 저장 또는 메모리)
    await createDefaultData()
    console.log('Database initialization completed')
  } catch (error) {
    console.error('Database initialization failed:', error)
    // 에러가 발생해도 계속 진행
    console.log('Continuing without database initialization...')
  }
}

// 스키마 생성 함수는 필요시에만 사용
// async function createSchema() { ... }

async function createDefaultData() {
  try {
    // 기본 사용자 확인/생성 (upsert 사용)
    const user = await prisma.user.upsert({
      where: { email: 'yzsumin@naver.com' },
      update: {},
      create: {
        id: 'admin-user-id',
        name: '이수민',
        email: 'yzsumin@naver.com'
      }
    })
    console.log('Default user ready')

    // 기본 카테고리 생성 (upsert)
    await Promise.all([
      prisma.category.upsert({
        where: { name: '기술' },
        update: {},
        create: { id: 'tech', name: '기술', description: '기술 관련 포스트', color: '#3b82f6' }
      }),
      prisma.category.upsert({
        where: { name: 'Tech Insights' },
        update: {},
        create: { id: 'tech-insights', name: 'Tech Insights', description: '기술 인사이트', color: '#8b5cf6' }
      }),
      prisma.category.upsert({
        where: { name: 'Code Solutions' },
        update: {},
        create: { id: 'code-solutions', name: 'Code Solutions', description: '코드 솔루션', color: '#10b981' }
      })
    ])
    console.log('Default categories ready')

    // 기본 태그 생성 (upsert)
    await Promise.all([
      prisma.tag.upsert({ where: { name: 'React' }, update: {}, create: { name: 'React' } }),
      prisma.tag.upsert({ where: { name: 'Next.js' }, update: {}, create: { name: 'Next.js' } }),
      prisma.tag.upsert({ where: { name: 'TypeScript' }, update: {}, create: { name: 'TypeScript' } }),
      prisma.tag.upsert({ where: { name: 'JavaScript' }, update: {}, create: { name: 'JavaScript' } }),
      prisma.tag.upsert({ where: { name: 'CSS' }, update: {}, create: { name: 'CSS' } }),
      prisma.tag.upsert({ where: { name: 'Frontend' }, update: {}, create: { name: 'Frontend' } }),
      prisma.tag.upsert({ where: { name: 'WebDev' }, update: {}, create: { name: 'WebDev' } }),
      prisma.tag.upsert({ where: { name: 'Tutorial' }, update: {}, create: { name: 'Tutorial' } })
    ])
    console.log('Default tags ready')

    // 샘플 포스트 생성 (메모리 DB에서 필요)
    if (process.env.VERCEL) {
      await createSamplePosts(user.id)
    }
  } catch (error) {
    console.error('Error creating default data:', error)
  }
}

async function createSamplePosts(userId: string) {
  try {
    // 샘플 포스트 데이터
    const samplePosts = [
      {
        title: "React Hooks로 시작하는 모던 React 개발",
        content: `# React Hooks로 시작하는 모던 React 개발

React Hooks는 함수형 컴포넌트에서 상태 관리와 생명주기 기능을 사용할 수 있게 해주는 강력한 기능입니다.

## useState Hook

가장 기본적인 Hook인 useState를 살펴보겠습니다.

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

부수 효과를 처리하기 위한 useEffect Hook입니다.

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

이러한 Hooks를 활용하면 더욱 깔끔하고 재사용 가능한 컴포넌트를 만들 수 있습니다.`,
        excerpt: "React Hooks를 활용한 모던 컴포넌트 개발 방법과 실무 활용 팁",
        slug: "react-hooks-modern-development",
        categoryId: "tech-insights",
        tags: ["JavaScript", "React", "Frontend"],
        featured: true,
        views: 1247
      },
      {
        title: "TypeScript와 Next.js로 타입 안전한 웹 개발",
        content: `# TypeScript와 Next.js로 타입 안전한 웹 개발

Next.js에서 TypeScript를 활용하여 타입 안전한 웹 애플리케이션을 개발하는 방법을 알아봅시다.

## TypeScript 설정

Next.js에서 TypeScript를 설정하는 것은 매우 간단합니다.

\`\`\`bash
npx create-next-app@latest my-app --typescript
\`\`\`

## 타입 정의

인터페이스를 활용한 타입 정의 예시입니다.

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  publishedAt: Date;
}
\`\`\`

## API Routes with TypeScript

타입 안전한 API Routes 구현 방법입니다.

\`\`\`typescript
import { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
\`\`\`

TypeScript와 Next.js의 조합으로 더욱 안전하고 확장 가능한 웹 애플리케이션을 개발할 수 있습니다.`,
        excerpt: "Next.js에서 TypeScript를 활용한 타입 안전한 개발 환경 구축",
        slug: "typescript-nextjs-safe-development",
        categoryId: "tech-insights",
        tags: ["Next.js", "TypeScript", "WebDev"],
        featured: false,
        views: 2103
      },
      {
        title: "CSS Grid와 Flexbox: 모던 레이아웃 완벽 가이드",
        content: `# CSS Grid와 Flexbox: 모던 레이아웃 완벽 가이드

CSS Grid와 Flexbox를 활용하여 현대적인 웹 레이아웃을 구현하는 방법을 상세히 설명합니다.

## CSS Grid 기본 구조

CSS Grid의 기본적인 사용법을 알아보겠습니다.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.item {
  background: #f0f0f0;
  padding: 20px;
  text-align: center;
}
\`\`\`

## Flexbox 활용

Flexbox를 활용한 레이아웃 예시입니다.

\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.flex-item {
  flex: 1;
  margin: 10px;
  padding: 20px;
  background: #e0e0e0;
}
\`\`\`

## 실제 프로젝트 예시

실제 웹사이트 레이아웃을 구현하는 예시입니다.

\`\`\`css
.layout {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

이러한 모던 CSS 기법들을 활용하면 반응형 웹 디자인을 쉽게 구현할 수 있습니다.`,
        excerpt: "CSS Grid와 Flexbox를 활용한 현대적인 웹 레이아웃 구현 방법",
        slug: "css-grid-flexbox-layout-guide",
        categoryId: "code-solutions",
        tags: ["CSS", "Tutorial", "Frontend"],
        featured: false,
        views: 1856
      }
    ]

    // 포스트 생성
    for (const postData of samplePosts) {
      await prisma.post.upsert({
        where: { slug: postData.slug },
        update: {
          views: postData.views,
          featured: postData.featured
        },
        create: {
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          slug: postData.slug,
          authorId: userId,
          categoryId: postData.categoryId,
          tags: postData.tags,
          featured: postData.featured,
          views: postData.views,
          readTime: 1,
          isPublished: true
        }
      })
    }

    console.log('Sample posts created for Vercel environment')
  } catch (error) {
    console.error('Error creating sample posts:', error)
  }
}