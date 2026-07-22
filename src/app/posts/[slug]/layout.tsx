import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BLOG_CONFIG } from '@/config/blog'
import {
  SITE_NAME,
  absoluteUrl,
  createPageMetadata,
} from '@/lib/seo'
import { createTaxonomySlug } from '@/lib/taxonomy'
import { getPostDescription, getPublishedPostBySlug } from '@/lib/post-detail'
import type { PostEntity } from '@/entities/Post'

type PostLayoutProps = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

function getAuthor() {
  return {
    name: BLOG_CONFIG.owner.name,
    email: BLOG_CONFIG.owner.email,
  }
}

export async function generateMetadata({ params }: PostLayoutProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found | SuriBlog',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const description = getPostDescription(post)
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
      post.category,
      post.series,
      ...post.tags,
    ].filter(Boolean) as string[],
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [getAuthor().name],
      tags: post.tags,
      section: post.category,
    },
  }
}

function getBlogPostingJsonLd(post: PostEntity) {
  const description = getPostDescription(post)
  const postUrl = absoluteUrl(`/posts/${post.slug}`)
  const thumbnail = post.thumbnail?.startsWith('data:') || post.thumbnail?.startsWith('blob:')
    ? null
    : post.thumbnail
  const image = absoluteUrl(thumbnail || BLOG_CONFIG.owner.avatar)
  const author = getAuthor()

  return {
    '@context': 'https://schema.org',
    '@type': ['BlogPosting', 'Article'],
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
    articleSection: post.category,
    keywords: [post.category, post.series, ...post.tags].filter(Boolean),
    inLanguage: 'ko-KR',
  }
}

function getBreadcrumbJsonLd(post: PostEntity) {
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
        name: post.category,
        item: absoluteUrl(`/categories/${createTaxonomySlug(post.category)}`),
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
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
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
