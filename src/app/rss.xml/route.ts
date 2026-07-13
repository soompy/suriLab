import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl, getSiteUrl } from '@/lib/seo'
import { BLOG_CONFIG } from '@/config/blog'
import { getPublishedContentPosts } from '@/lib/content'

export const dynamic = 'force-dynamic'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function escapeCdata(value: string) {
  return value.replace(/]]>/g, ']]]]><![CDATA[>')
}

export async function GET() {
  const siteUrl = getSiteUrl()
  const databasePosts = await prisma.post.findMany({
    where: { isPublished: true },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      publishedAt: true,
      updatedAt: true,
      category: {
        select: { name: true },
      },
      tags: {
        select: { name: true },
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  })
  const contentPosts = getPublishedContentPosts().map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    category: {
      name: post.category,
    },
    tags: post.tags.map((name) => ({ name })),
  }))
  const posts = [...databasePosts, ...contentPosts]
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 50)

  const items = posts.map((post) => {
    const postUrl = absoluteUrl(`/posts/${post.slug}`)
    const description = post.excerpt || stripHtml(post.content).slice(0, 200)
    const categories = [post.category.name, ...post.tags.map(tag => tag.name)]
      .filter(Boolean)
      .map(category => `<category>${escapeXml(category)}</category>`)
      .join('')

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <description><![CDATA[${escapeCdata(description)}]]></description>
      <author>${escapeXml(BLOG_CONFIG.owner.email)} (${escapeXml(BLOG_CONFIG.owner.name)})</author>
      <pubDate>${post.publishedAt.toUTCString()}</pubDate>
      <lastBuildDate>${post.updatedAt.toUTCString()}</lastBuildDate>
      ${categories}
    </item>`
  }).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
    ${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
