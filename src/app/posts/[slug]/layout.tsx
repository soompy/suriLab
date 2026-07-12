import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BLOG_CONFIG } from '@/config/blog'
import {
  SITE_NAME,
  absoluteUrl,
  createPageMetadata,
} from '@/lib/seo'
import { createTaxonomySlug } from '@/lib/taxonomy'

type PostLayoutProps = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      series: true,
      thumbnail: true,
      publishedAt: true,
      updatedAt: true,
      isPublished: true,
      category: {
        select: { name: true },
      },
      tags: {
        select: { name: true },
      },
      author: {
        select: { name: true, email: true },
      },
    },
  })
}

function getDescription(post: Awaited<ReturnType<typeof getPost>>) {
  if (!post) return ''

  return post.excerpt || post.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
}

function getAuthor(post: NonNullable<Awaited<ReturnType<typeof getPost>>>) {
  const isPlaceholderAuthor = post.author?.email === 'author@example.com'

  return {
    name: isPlaceholderAuthor ? BLOG_CONFIG.owner.name : post.author?.name || BLOG_CONFIG.owner.name,
    email: isPlaceholderAuthor ? BLOG_CONFIG.owner.email : post.author?.email || BLOG_CONFIG.owner.email,
  }
}

export async function generateMetadata({ params }: PostLayoutProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post || !post.isPublished) {
    return {
      title: 'Post Not Found | SuriBlog',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const description = getDescription(post)
  const metadata = createPageMetadata({
    title: `${post.title} | SuriBlog`,
    description,
    path: `/posts/${post.slug}`,
    image: post.thumbnail,
    type: 'article',
  })

  return {
    ...metadata,
    keywords: [
      post.category.name,
      post.series,
      ...post.tags.map(tag => tag.name),
    ].filter(Boolean) as string[],
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [getAuthor(post).name],
      tags: post.tags.map(tag => tag.name),
      section: post.category.name,
    },
  }
}

function getBlogPostingJsonLd(post: NonNullable<Awaited<ReturnType<typeof getPost>>>) {
  const description = getDescription(post)
  const postUrl = absoluteUrl(`/posts/${post.slug}`)
  const image = absoluteUrl(post.thumbnail || BLOG_CONFIG.owner.avatar)
  const author = getAuthor(post)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    image,
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: author.name,
      email: author.email,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(BLOG_CONFIG.owner.avatar),
      },
    },
    articleSection: post.category.name,
    keywords: [post.category.name, post.series, ...post.tags.map(tag => tag.name)].filter(Boolean),
    inLanguage: 'ko-KR',
  }
}

function getBreadcrumbJsonLd(post: NonNullable<Awaited<ReturnType<typeof getPost>>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.category.name,
        item: absoluteUrl(`/categories/${createTaxonomySlug(post.category.name)}`),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: absoluteUrl(`/posts/${post.slug}`),
      },
    ],
  }
}

export default async function PostLayout({ children, params }: PostLayoutProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post || !post.isPublished) {
    notFound()
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBlogPostingJsonLd(post)) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbJsonLd(post)) }}
      />
      {children}
    </>
  )
}
