import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createPageMetadata } from '@/lib/seo'
import { findNameBySlug } from '@/lib/taxonomy'

type CategoryLayoutProps = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

async function getCategoryName(slug: string) {
  const categories = await prisma.category.findMany({
    select: { name: true },
    orderBy: { name: 'asc' },
  })

  return findNameBySlug(categories.map((category) => category.name), slug)
}

export async function generateMetadata({ params }: CategoryLayoutProps): Promise<Metadata> {
  const { slug } = await params
  const categoryName = await getCategoryName(slug)

  if (!categoryName) {
    return {
      title: 'Category Not Found | SuriBlog',
      robots: { index: false, follow: false },
    }
  }

  return createPageMetadata({
    title: `${categoryName} | SuriBlog`,
    description: `${categoryName} 주제로 발행된 SuriBlog 글 모음입니다.`,
    path: `/categories/${slug}`,
  })
}

export default async function CategoryLayout({ children, params }: CategoryLayoutProps) {
  const { slug } = await params
  const categoryName = await getCategoryName(slug)

  if (!categoryName) {
    notFound()
  }

  return children
}
