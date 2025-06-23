import { PrismaClient } from '@prisma/client'
import { BLOG_CATEGORIES } from '../src/shared/constants/categories'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 블로그 소유자 생성
  const user = await prisma.user.upsert({
    where: { id: 'owner-soomin' },
    update: {
      name: 'Suri',
      email: 'yzsumin@naver.com'
    },
    create: {
      id: 'owner-soomin',
      name: 'Suri',
      email: 'yzsumin@naver.com'
    }
  })

  // 카테고리 생성
  const categories = await Promise.all(
    BLOG_CATEGORIES.map(categoryName =>
      prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName }
      })
    )
  )

  // 태그 생성
  const tagNames = ['React', 'JavaScript', 'TypeScript', 'Next.js', 'CSS', 'Frontend', 'WebDev', 'Tutorial']
  const tags = await Promise.all(
    tagNames.map(tagName =>
      prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName }
      })
    )
  )

  // 샘플 포스트 생성
  const samplePosts = [
    {
      title: 'React Hooks로 시작하는 모던 React 개발',
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
      excerpt: 'React Hooks를 활용한 모던 컴포넌트 개발 방법과 실무 활용 팁',
      slug: 'react-hooks-modern-development',
      categoryId: categories.find(c => c.name === 'Tech Insights')!.id,
      authorId: user.id,
      featured: true,
      isPublished: true,
      views: 1247,
      tags: ['React', 'JavaScript', 'Frontend']
    },
    {
      title: 'TypeScript와 Next.js로 타입 안전한 웹 개발',
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
      excerpt: 'Next.js에서 TypeScript를 활용한 타입 안전한 개발 환경 구축',
      slug: 'typescript-nextjs-safe-development',
      categoryId: categories.find(c => c.name === 'Tech Insights')!.id,
      authorId: user.id,
      featured: false,
      isPublished: true,
      views: 2103,
      tags: ['TypeScript', 'Next.js', 'WebDev']
    },
    {
      title: 'CSS Grid와 Flexbox: 모던 레이아웃 완벽 가이드',
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
      excerpt: 'CSS Grid와 Flexbox를 활용한 현대적인 웹 레이아웃 구현 방법',
      slug: 'css-grid-flexbox-layout-guide',
      categoryId: categories.find(c => c.name === 'Code Solutions')!.id,
      authorId: user.id,
      featured: false,
      isPublished: true,
      views: 1856,
      tags: ['CSS', 'Frontend', 'Tutorial']
    }
  ]

  for (const postData of samplePosts) {
    const { tags: postTags, ...postInfo } = postData
    
    await prisma.post.create({
      data: {
        ...postInfo,
        readTime: Math.ceil(postInfo.content.split(' ').length / 200),
        tags: {
          connect: postTags.map(tagName => ({ name: tagName }))
        }
      }
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })