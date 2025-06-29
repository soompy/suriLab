exports.id=628,exports.ids=[628],exports.modules={31183:(e,t,r)=>{"use strict";r.d(t,{z:()=>s});var o=r(96330);let s=globalThis.prisma??new o.PrismaClient({log:["query","info","warn","error"]})},51641:(e,t,r)=>{"use strict";r.d(t,{HU:()=>i,b_:()=>n,o1:()=>c,uF:()=>l});var o=r(43205),s=r.n(o);let a=process.env.JWT_SECRET||process.env.BLOG_ADMIN_PASSWORD||"default-secret-key";function i(){try{let e=s().sign({admin:!0},a,{expiresIn:"24h",issuer:"suri-blog"});return console.log("[AUTH] JWT token generated successfully"),e}catch(e){throw console.error("[AUTH] Error generating JWT token:",e),Error("Failed to generate token")}}function n(){return{jwtSecret:a?"Set":"Not set",authMethod:"JWT-based authentication",tokenExpiry:"24 hours"}}function c(e="관리자 권한이 필요합니다."){return new Response(JSON.stringify({error:e}),{status:401,headers:{"Content-Type":"application/json"}})}let l=function(e){let t=e.headers.get("authorization");if(console.log(`[AUTH] Verifying request to: ${e.nextUrl.pathname}`),console.log(`[AUTH] Authorization header: ${t?`Bearer ${t.substring(7,15)}...`:"None"}`),console.log("[AUTH] All headers:",Object.fromEntries(e.headers.entries())),!t||!t.startsWith("Bearer "))return console.log("[AUTH] Missing or invalid authorization header format"),console.log("[AUTH] Expected format: Bearer <token>"),!1;let r=t.replace("Bearer ","");if(console.log(`[AUTH] Extracted token length: ${r.length}`),!r||r.length<10)return console.log("[AUTH] Token is too short or empty"),!1;try{let e=s().verify(r,a);if(console.log("[AUTH] JWT payload decoded:",{admin:e.admin,iat:e.iat,exp:e.exp}),!0===e.admin)return console.log("[AUTH] JWT token validated successfully"),!0;return console.log("[AUTH] JWT token invalid: admin flag not set"),!1}catch(e){return e instanceof s().TokenExpiredError?console.log("[AUTH] JWT token expired at:",e.expiredAt):e instanceof s().JsonWebTokenError?console.log("[AUTH] JWT token invalid:",e.message):console.log("[AUTH] JWT verification error:",e),!1}}},52240:(e,t,r)=>{"use strict";r.d(t,{EX:()=>j,Rr:()=>N,iy:()=>C,N7:()=>R});var o=r(32190);class s{constructor(e){this.prisma=e}async findAll(e,t,r){let o={};if(e){if(e.category&&(o.category={name:e.category}),e.tags&&e.tags.length>0&&(o.tags={some:{name:{in:e.tags}}}),e.authorId&&(o.authorId=e.authorId),e.searchQuery){let t=e.searchQuery.toLowerCase();o.OR=[{title:{contains:t,mode:"insensitive"}},{excerpt:{contains:t,mode:"insensitive"}},{content:{contains:t,mode:"insensitive"}},{tags:{some:{name:{contains:t,mode:"insensitive"}}}}]}void 0!==e.featured&&(o.featured=e.featured),void 0!==e.isPublished&&(o.isPublished=e.isPublished)}let s={};t?s[t.field]=t.order:s.publishedAt="desc";let a=r?.page||1,i=r?.limit||10,[n,c]=await Promise.all([this.prisma.post.findMany({where:o,orderBy:s,skip:(a-1)*i,take:i,include:{tags:!0,category:!0,author:!0}}),this.prisma.post.count({where:o})]);return{posts:n.map(this.mapToEntity),total:c,page:a,totalPages:Math.ceil(c/i)}}async findById(e){let t=await this.prisma.post.findUnique({where:{id:e},include:{tags:!0,category:!0,author:!0}});return t?this.mapToEntity(t):null}async findBySlug(e){let t=await this.prisma.post.findUnique({where:{slug:e},include:{tags:!0,category:!0,author:!0}});return t?this.mapToEntity(t):null}async create(e){let t=await this.prisma.category.upsert({where:{name:e.category},update:{},create:{name:e.category}}),r=await this.prisma.user.upsert({where:{id:e.authorId},update:{},create:{id:e.authorId,name:"Blog Author",email:"author@example.com"}}),o=e.slug;await this.prisma.post.findUnique({where:{slug:e.slug},select:{id:!0}})&&(o=`${e.slug}-${Date.now()}`);let s=await this.prisma.post.create({data:{title:e.title,content:e.content,excerpt:e.excerpt,slug:o,featured:e.featured||!1,isPublished:e.isPublished||!1,readTime:Math.ceil(e.content.split(" ").length/200),categoryId:t.id,authorId:r.id,tags:{connectOrCreate:e.tags.map(e=>({where:{name:e},create:{name:e}}))}},include:{tags:!0,category:!0,author:!0}});return this.mapToEntity(s)}async update(e){let t={};if(e.title&&(t.title=e.title),e.content&&(t.content=e.content,t.readTime=Math.ceil(e.content.split(" ").length/200)),e.excerpt&&(t.excerpt=e.excerpt),e.slug){let r=await this.prisma.post.findUnique({where:{slug:e.slug},select:{id:!0}});r&&r.id!==e.id?t.slug=`${e.slug}-${Date.now()}`:t.slug=e.slug}if(void 0!==e.featured&&(t.featured=e.featured),void 0!==e.isPublished&&(t.isPublished=e.isPublished,!0===e.isPublished)){let r=await this.prisma.post.findUnique({where:{id:e.id},select:{isPublished:!0}});r&&!r.isPublished&&(t.publishedAt=new Date)}e.category&&(t.categoryId=(await this.prisma.category.upsert({where:{name:e.category},update:{},create:{name:e.category}})).id),e.tags&&(t.tags={set:[],connectOrCreate:e.tags.map(e=>({where:{name:e},create:{name:e}}))});let r=await this.prisma.post.update({where:{id:e.id},data:t,include:{tags:!0,category:!0,author:!0}});return this.mapToEntity(r)}async delete(e){await this.prisma.post.delete({where:{id:e}})}async incrementViews(e){await this.prisma.post.update({where:{id:e},data:{views:{increment:1}}})}async getCategories(){return(await this.prisma.category.findMany({select:{name:!0}})).map(e=>e.name)}async getTags(){return(await this.prisma.tag.findMany({select:{name:!0}})).map(e=>e.name)}async getStats(){let[e,t,r,o]=await Promise.all([this.prisma.post.count({where:{isPublished:!0,author:{email:{not:"yzsumin@naver.com"}}}}),this.prisma.post.aggregate({_sum:{views:!0},where:{isPublished:!0,author:{email:{not:"yzsumin@naver.com"}}}}),this.prisma.category.count(),this.prisma.tag.count()]);return{totalPosts:e,totalViews:t._sum.views||0,totalCategories:r,totalTags:o}}mapToEntity(e){return{id:e.id,title:e.title,content:e.content,excerpt:e.excerpt,slug:e.slug,publishedAt:e.publishedAt,updatedAt:e.updatedAt,tags:e.tags.map(e=>e.name),category:e.category.name,authorId:e.authorId,readTime:e.readTime,views:e.views,featured:e.featured,isPublished:e.isPublished}}}class a{constructor(e){this.postRepository=e}async execute(e,t,r){return await this.postRepository.findAll(e,t||{field:"publishedAt",order:"desc"},r||{page:1,limit:10})}}class i{constructor(e){this.postRepository=e}async execute(e){let t=await this.postRepository.findById(e);return t&&await this.postRepository.incrementViews(e),t}}class n{constructor(e){this.postRepository=e}async execute(e){let t=await this.postRepository.findBySlug(e);return t&&await this.postRepository.incrementViews(t.id),t}}class c{constructor(e){this.postRepository=e}async execute(){let[e,t,r]=await Promise.all([this.postRepository.getStats(),this.postRepository.getCategories(),this.postRepository.getTags()]);return{...e,categories:t,tags:r}}}class l{constructor(e){this.postRepository=e}async execute(e){return this.validateInput(e),await this.postRepository.create(e)}validateInput(e){if(!e.title.trim())throw Error("Title is required");if(!e.content.trim())throw Error("Content is required");if(!e.excerpt.trim())throw Error("Excerpt is required");if(!e.slug.trim())throw Error("Slug is required");if(!e.category.trim())throw Error("Category is required");if(!e.authorId.trim())throw Error("Author ID is required");if(0===e.tags.length)throw Error("At least one tag is required");if(!/^[a-z0-9가-힣]+(?:-[a-z0-9가-힣]+)*$/i.test(e.slug))throw Error("Slug must contain only alphanumeric characters, Korean characters, and hyphens")}}class u{constructor(e){this.postRepository=e}async execute(e){this.validateInput(e);let t=await this.postRepository.findById(e.id);if(!t)throw Error("Post not found");if(e.slug&&e.slug!==t.slug){let t=await this.postRepository.findBySlug(e.slug);if(t&&t.id!==e.id)throw Error("Post with this slug already exists")}return await this.postRepository.update(e)}validateInput(e){if(!e.id.trim())throw Error("Post ID is required");if(void 0!==e.title&&!e.title.trim())throw Error("Title cannot be empty");if(void 0!==e.content&&!e.content.trim())throw Error("Content cannot be empty");if(void 0!==e.excerpt&&!e.excerpt.trim())throw Error("Excerpt cannot be empty");if(void 0!==e.category&&!e.category.trim())throw Error("Category cannot be empty");if(void 0!==e.tags&&0===e.tags.length)throw Error("At least one tag is required");if(void 0!==e.slug&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e.slug))throw Error("Slug must be lowercase alphanumeric with hyphens only")}}class d{constructor(e){this.postRepository=e}async execute(e){if(!e.trim())throw Error("Post ID is required");if(!await this.postRepository.findById(e))throw Error("Post not found");await this.postRepository.delete(e)}}var p=r(31183);async function g(){try{await p.z.$connect(),console.log("Database connected successfully");let e=process.env.DATABASE_URL||"";console.log(`Database URL: ${e.substring(0,30)}...`),process.env.VERCEL&&(console.log("Vercel environment detected, using Neon PostgreSQL..."),console.log("Checking database connection and initialization...")),await h(),console.log("Database initialization completed")}catch(e){console.error("Database initialization failed:",e),console.log("Continuing without database initialization...")}}async function h(){try{let e=await p.z.user.upsert({where:{email:"yzsumin@naver.com"},update:{},create:{id:"admin-user-id",name:"이수민",email:"yzsumin@naver.com"}});console.log("Default user ready"),await Promise.all([p.z.category.upsert({where:{name:"Study Journal"},update:{},create:{id:"study-journal",name:"Study Journal",description:"학습 과정과 기록을 공유하는 일지입니다.",color:"#3b82f6"}}),p.z.category.upsert({where:{name:"Tech Insights"},update:{},create:{id:"tech-insights",name:"Tech Insights",description:"기술 인사이트",color:"#8b5cf6"}}),p.z.category.upsert({where:{name:"Code Solutions"},update:{},create:{id:"code-solutions",name:"Code Solutions",description:"코드 솔루션",color:"#10b981"}})]),console.log("Default categories ready"),await Promise.all([p.z.tag.upsert({where:{name:"React"},update:{},create:{name:"React"}}),p.z.tag.upsert({where:{name:"Next.js"},update:{},create:{name:"Next.js"}}),p.z.tag.upsert({where:{name:"TypeScript"},update:{},create:{name:"TypeScript"}}),p.z.tag.upsert({where:{name:"JavaScript"},update:{},create:{name:"JavaScript"}}),p.z.tag.upsert({where:{name:"CSS"},update:{},create:{name:"CSS"}}),p.z.tag.upsert({where:{name:"Frontend"},update:{},create:{name:"Frontend"}}),p.z.tag.upsert({where:{name:"WebDev"},update:{},create:{name:"WebDev"}}),p.z.tag.upsert({where:{name:"Tutorial"},update:{},create:{name:"Tutorial"}})]),console.log("Default tags ready");let t=await p.z.post.count();0===t&&(console.log("No posts found, creating sample posts..."),await m(e.id))}catch(e){console.error("Error creating default data:",e)}}async function m(e){try{for(let t of[{title:"React Hooks로 시작하는 모던 React 개발",content:`# React Hooks로 시작하는 모던 React 개발

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

이러한 Hooks를 활용하면 더욱 깔끔하고 재사용 가능한 컴포넌트를 만들 수 있습니다.`,excerpt:"React Hooks를 활용한 모던 컴포넌트 개발 방법과 실무 활용 팁",slug:"react-hooks-modern-development",categoryId:"tech-insights",tags:["JavaScript","React","Frontend"],featured:!0,views:1247},{title:"TypeScript와 Next.js로 타입 안전한 웹 개발",content:`# TypeScript와 Next.js로 타입 안전한 웹 개발

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

TypeScript와 Next.js의 조합으로 더욱 안전하고 확장 가능한 웹 애플리케이션을 개발할 수 있습니다.`,excerpt:"Next.js에서 TypeScript를 활용한 타입 안전한 개발 환경 구축",slug:"typescript-nextjs-safe-development",categoryId:"tech-insights",tags:["Next.js","TypeScript","WebDev"],featured:!1,views:2103},{title:"CSS Grid와 Flexbox: 모던 레이아웃 완벽 가이드",content:`# CSS Grid와 Flexbox: 모던 레이아웃 완벽 가이드

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

이러한 모던 CSS 기법들을 활용하면 반응형 웹 디자인을 쉽게 구현할 수 있습니다.`,excerpt:"CSS Grid와 Flexbox를 활용한 현대적인 웹 레이아웃 구현 방법",slug:"css-grid-flexbox-layout-guide",categoryId:"code-solutions",tags:["CSS","Tutorial","Frontend"],featured:!1,views:1856}])await p.z.post.upsert({where:{slug:t.slug},update:{views:t.views,featured:t.featured},create:{title:t.title,content:t.content,excerpt:t.excerpt,slug:t.slug,authorId:e,categoryId:t.categoryId,tags:{connect:t.tags.map(e=>({name:e}))},featured:t.featured,views:t.views,readTime:1,isPublished:!0}});console.log("Sample posts created for Vercel environment")}catch(e){console.error("Error creating sample posts:",e)}}var y=r(51641);let f=new s(p.z),w=new a(f),S=new i(f),x=new n(f),T=new c(f),b=new l(f),P=new u(f),E=new d(f);async function v(e,t,r){try{return await w.execute(e,t,r)}catch(e){throw console.error("Error getting posts:",e),e}}async function A(e){try{return await S.execute(e)}catch(e){throw console.error("Error getting post by id:",e),e}}async function R(e){try{return await x.execute(e)}catch(e){throw console.error("Error getting post by slug:",e),e}}async function z(){try{return await T.execute()}catch(e){throw console.error("Error getting blog stats:",e),e}}async function k(e){try{return await b.execute(e)}catch(e){throw console.error("Error creating post:",e),e}}async function I(e){try{return await P.execute(e)}catch(e){throw console.error("Error updating post:",e),e}}async function O(e){try{return await E.execute(e)}catch(e){throw console.error("Error deleting post:",e),e}}class C{static async GET(e){try{await g();let{searchParams:t}=new URL(e.url),r=t.get("category")||void 0,s=t.get("tags")?.split(",")||void 0,a=t.get("authorId")||void 0,i=t.get("search")||void 0,n="true"===t.get("featured")||void 0,c=t.get("isPublished"),l=t.get("sortField")||"publishedAt",u=t.get("sortOrder")||"desc",d=parseInt(t.get("page")||"1"),p=parseInt(t.get("limit")||"10"),h=await v({category:r,tags:s,authorId:a,searchQuery:i,featured:n,isPublished:"true"===c||"false"!==c&&void 0},{field:l,order:u},{page:d,limit:p});return o.NextResponse.json(h)}catch{return o.NextResponse.json({error:"Failed to fetch posts"},{status:500})}}static async POST(e){try{console.log("[POSTS] POST request received");let t=e.headers.get("authorization");console.log(`[POSTS] Authorization header present: ${!!t}`),t&&console.log(`[POSTS] Auth header format: ${t.substring(0,15)}...`);let r=(0,y.uF)(e);if(console.log(`[POSTS] Authorization check result: ${r}`),!r)return console.log("[POSTS] Authorization failed, returning 401"),console.log("[POSTS] Expected Authorization header format: Bearer <jwt-token>"),console.log("[POSTS] Actual header:",t?`Bearer ${t.substring(7,15)}...`:"None"),(0,y.o1)("포스트 작성 권한이 없습니다. 세션이 만료되었을 수 있습니다.");let s=await e.json();console.log("[POSTS] Creating post with data:",{title:s.title,category:s.category,isPublished:s.isPublished});try{await g(),console.log("[POSTS] Database initialized successfully")}catch(e){console.warn("[POSTS] Database initialization failed, continuing...",e)}let a=await k(s);return console.log("[POSTS] Post created successfully:",{id:a.id,title:a.title,isPublished:a.isPublished}),o.NextResponse.json(a,{status:201})}catch(e){return console.error("[POSTS] Error creating post:",e),o.NextResponse.json({error:"Failed to create post",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}}class N{static async GET(e,{params:t}){try{let e=await A(t.id);if(!e)return o.NextResponse.json({error:"Post not found"},{status:404});return o.NextResponse.json(e)}catch{return o.NextResponse.json({error:"Failed to fetch post"},{status:500})}}static async PUT(e,{params:t}){try{console.log(`[POSTS] PUT request received for post ID: ${t.id}`);let r=e.headers.get("authorization");console.log(`[POSTS] Authorization header present: ${!!r}`);let s=(0,y.uF)(e);if(console.log(`[POSTS] Authorization check result: ${s}`),!s)return console.log("[POSTS] Authorization failed for PUT request, returning 401"),console.log("[POSTS] Expected Authorization header format: Bearer <jwt-token>"),console.log("[POSTS] Actual header:",r?`Bearer ${r.substring(7,15)}...`:"None"),(0,y.o1)("포스트 수정 권한이 없습니다. 세션이 만료되었을 수 있습니다.");let a=await e.json();console.log("[POSTS] Updating post with data:",{id:t.id,title:a.title,isPublished:a.isPublished});let i={id:t.id,...a},n=await I(i);return console.log("[POSTS] Post updated successfully:",{id:n.id,title:n.title,isPublished:n.isPublished}),o.NextResponse.json(n)}catch(e){return console.error("[POSTS] Error updating post:",e),o.NextResponse.json({error:"Failed to update post",details:e instanceof Error?e.message:"Unknown error"},{status:400})}}static async DELETE(e,{params:t}){try{console.log(`[POSTS] DELETE request received for post ID: ${t.id}`);let r=e.headers.get("authorization");console.log(`[POSTS] Authorization header present: ${!!r}`);let s=(0,y.uF)(e);if(console.log(`[POSTS] Authorization check result: ${s}`),!s)return console.log("[POSTS] Authorization failed for DELETE request, returning 401"),console.log("[POSTS] Actual header:",r?`Bearer ${r.substring(7,15)}...`:"None"),(0,y.o1)("포스트 삭제 권한이 없습니다. 세션이 만료되었을 수 있습니다.");return console.log(`[POSTS] Attempting to delete post: ${t.id}`),await O(t.id),console.log(`[POSTS] Post deleted successfully: ${t.id}`),o.NextResponse.json({success:!0})}catch(e){return console.error(`[POSTS] Error deleting post ${t.id}:`,e),o.NextResponse.json({error:"Failed to delete post",details:e instanceof Error?e.message:"Unknown error"},{status:400})}}}class j{static async GET(){try{let e=await z();return o.NextResponse.json(e)}catch{return o.NextResponse.json({error:"Failed to fetch blog stats"},{status:500})}}}},78335:()=>{},96487:()=>{}};