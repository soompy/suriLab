import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/posts/',
        '/about/',
        '/articles/',
        '/build-log/',
        '/momenttune/',
        '/projects/',
        '/contact/',
        '/archives/',
        '/rss.xml',
      ],
      disallow: ['/admin/', '/api/', '/write/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
