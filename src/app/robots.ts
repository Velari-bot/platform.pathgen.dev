import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/docs',
          '/docs/quickstart',
          '/pricing',
          '/status',
          '/signup',
          '/login'
        ],
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/playground',
          '/checkout',
          '/home',
          '/apps',
          '/keys',
          '/usage',
          '/billing',
          '/organization',
          '/settings',
          '/support',
          '/explorer',
          '/tutorials',
          '/cost',
          '/map-demo'
        ]
      }
    ],
    sitemap: 'https://platform.pathgen.dev/sitemap.xml',
    host: 'https://platform.pathgen.dev'
  }
}
