import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/posts/', '/about/', '/projects/', '/contact/', '/archives/'],
      disallow: ['/admin/', '/api/', '/write/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
