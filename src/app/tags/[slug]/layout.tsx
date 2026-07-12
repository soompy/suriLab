import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createPageMetadata } from '@/lib/seo'
import { findNameBySlug } from '@/lib/taxonomy'

type TagLayoutProps = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

async function getTagName(slug: string) {
  const tags = await prisma.tag.findMany({
    select: { name: true },
    orderBy: { name: 'asc' },
  })

  return findNameBySlug(tags.map((tag) => tag.name), slug)
}

export async function generateMetadata({ params }: TagLayoutProps): Promise<Metadata> {
  const { slug } = await params
  const tagName = await getTagName(slug)

  if (!tagName) {
    return {
      title: 'Tag Not Found | SuriBlog',
      robots: { index: false, follow: false },
    }
  }

  return createPageMetadata({
    title: `#${tagName} | SuriBlog`,
    description: `#${tagName} 태그가 달린 SuriBlog 글 모음입니다.`,
    path: `/tags/${slug}`,
  })
}

export default async function TagLayout({ children, params }: TagLayoutProps) {
  const { slug } = await params
  const tagName = await getTagName(slug)

  if (!tagName) {
    notFound()
  }

  return children
}
