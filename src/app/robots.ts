import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/posts/',
        '/api/images/',
        '/about/',
        '/articles/',
        '/categories/',
        '/tags/',
        '/build-log/',
        '/momenttune/',
        '/projects/',
        '/contact/',
        '/archives/',
        '/rss.xml',
        '/llms.txt',
        '/ads.txt',
      ],
      disallow: ['/admin/', '/api/', '/write/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
