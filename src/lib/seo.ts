import type { Metadata } from 'next'
import { BLOG_CONFIG } from '@/config/blog'

export const SITE_NAME = 'SuriBlog'
export const SITE_TITLE = 'SuriBlog | Building AI Products in Public'
export const SITE_DESCRIPTION =
  'MomentTune 제작기, 1인 창업, AI 자동화, AI 코딩 도구, 제품 기획과 블로그 성장 실험을 기록하는 개인 브랜드 미디어입니다.'
export const DEFAULT_OG_IMAGE = '/images/profile.jpg'

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://suri-blog.vercel.app').replace(/\/$/, '')
}

export function absoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalizedPath}`
}

export function getDefaultImages(image?: string | null) {
  return [
    {
      url: absoluteUrl(image || DEFAULT_OG_IMAGE),
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    },
  ]
}

export function createPageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
}: {
  title: string
  description: string
  path: string
  image?: string | null
  type?: 'website' | 'article'
}): Metadata {
  const url = absoluteUrl(path)

  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': absoluteUrl('/rss.xml'),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: getDefaultImages(image),
      locale: 'ko_KR',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: getDefaultImages(image).map(item => item.url),
    },
  }
}

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getSiteUrl(),
    description: SITE_DESCRIPTION,
    inLanguage: 'ko-KR',
  }
}

export function getPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: BLOG_CONFIG.owner.name,
    url: getSiteUrl(),
    image: absoluteUrl(BLOG_CONFIG.owner.avatar),
    description: BLOG_CONFIG.owner.bio,
    email: BLOG_CONFIG.owner.email,
  }
}
