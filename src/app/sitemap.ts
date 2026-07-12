import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getSiteUrl } from '@/lib/seo'
import { createTaxonomySlug } from '@/lib/taxonomy'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/momenttune`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/build-log`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/archives`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/rss.xml`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.4,
    },
  ]

  try {
    const [posts, categories, tags] = await Promise.all([
      prisma.post.findMany({
        where: { isPublished: true },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      prisma.category.findMany({
        where: {
          posts: {
            some: { isPublished: true },
          },
        },
        select: {
          name: true,
          posts: {
            where: { isPublished: true },
            select: { updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.tag.findMany({
        where: {
          posts: {
            some: { isPublished: true },
          },
        },
        select: {
          name: true,
          posts: {
            where: { isPublished: true },
            select: { updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 1,
          },
        },
      }),
    ])

    return [
      ...staticRoutes,
      ...posts.map((post) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...categories.map((category) => ({
        url: `${baseUrl}/categories/${createTaxonomySlug(category.name)}`,
        lastModified: category.posts[0]?.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      })),
      ...tags.map((tag) => ({
        url: `${baseUrl}/tags/${createTaxonomySlug(tag.name)}`,
        lastModified: tag.posts[0]?.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.55,
      })),
    ]
  } catch (error) {
    console.warn('Failed to load posts for sitemap:', error)
    return staticRoutes
  }
}
