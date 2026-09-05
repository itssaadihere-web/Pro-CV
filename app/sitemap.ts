import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://joinsophi.com'
  const now = new Date()

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' as const, lastModified: now },
    { url: `${baseUrl}/ai-cv-builder-app`, priority: 1.0, changeFrequency: 'daily' as const, lastModified: now },
    { url: `${baseUrl}/ats-checker`, priority: 0.9, changeFrequency: 'daily' as const, lastModified: now },
    { url: `${baseUrl}/pricing`, priority: 0.9, changeFrequency: 'weekly' as const, lastModified: now },
    { url: `${baseUrl}/sophi-vs-rezi`, priority: 0.9, changeFrequency: 'weekly' as const, lastModified: now },
    { url: `${baseUrl}/sophi-vs-kickresume`, priority: 0.9, changeFrequency: 'weekly' as const, lastModified: now },
    { url: `${baseUrl}/linkedin-optimizer`, priority: 0.9, changeFrequency: 'weekly' as const, lastModified: now },
    { url: `${baseUrl}/tailor-cv`, priority: 0.9, changeFrequency: 'weekly' as const, lastModified: now },
    { url: `${baseUrl}/transform-cv`, priority: 0.9, changeFrequency: 'weekly' as const, lastModified: now },
    { url: `${baseUrl}/how-it-works`, priority: 0.9, changeFrequency: 'monthly' as const, lastModified: now },
    { url: `${baseUrl}/templates`, priority: 0.8, changeFrequency: 'weekly' as const, lastModified: now },
    { url: `${baseUrl}/cv-builder-karachi`, priority: 0.8, changeFrequency: 'monthly' as const, lastModified: now },
    { url: `${baseUrl}/cv-builder-lahore`, priority: 0.8, changeFrequency: 'monthly' as const, lastModified: now },
    { url: `${baseUrl}/cv-builder-islamabad`, priority: 0.8, changeFrequency: 'monthly' as const, lastModified: now },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: 'daily' as const, lastModified: now },
    { url: `${baseUrl}/login`, priority: 0.7, changeFrequency: 'weekly' as const, lastModified: now },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: 'monthly' as const, lastModified: now },
    { url: `${baseUrl}/privacy-policy`, priority: 0.3, changeFrequency: 'yearly' as const, lastModified: now },
    { url: `${baseUrl}/terms-and-conditions`, priority: 0.3, changeFrequency: 'yearly' as const, lastModified: now },
    { url: `${baseUrl}/refund-policy`, priority: 0.3, changeFrequency: 'yearly' as const, lastModified: now },
  ]

  let blogPages: any[] = [];
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('published', true)

      if (posts) {
        blogPages = posts.map(post => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          priority: 0.7,
          changeFrequency: 'weekly' as const
        }))
      }
    }
  } catch (err) {
    console.error("Failed to fetch blog posts for sitemap", err);
  }

  return [...staticPages, ...blogPages]
}
