import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/transform-cv',
          '/transform-cv/',
          '/new-cv',
          '/new-cv/',
          '/upload',
          '/upload/',
          '/result',
          '/result/',
          '/payment',
          '/payment/',
          '/api',
          '/api/',
          '/cv-render',
          '/cv-render/',
          '/credit-history',
        ]
      },
      {
        userAgent: 'GPTBot',
        allow: '/'
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/'
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/'
      },
      {
        userAgent: 'Google-Extended',
        allow: '/'
      },
      {
        userAgent: 'GoogleOther',
        allow: '/'
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/'
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/'
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/'
      },
      {
        userAgent: 'Bytespider',
        allow: '/'
      }
    ],
    sitemap: 'https://joinsophi.com/sitemap.xml',
    host: 'https://joinsophi.com'
  }
}
