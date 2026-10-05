import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { generateBlogPostWithGemini, TARGET_SEO_KEYWORDS } from '@/lib/blog-generator';
import { getServiceSupabase } from '@/lib/supabase-server';
import { notifyIndexNow } from '@/lib/indexNow';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secretParam = searchParams.get('secret');
  const authHeader = request.headers.get('authorization');
  const requestedKeyword = searchParams.get('keyword');
  
  const expectedSecret = process.env.CRON_SECRET || 'Blog@sophi_321';
  const isHeaderValid = authHeader === `Bearer ${expectedSecret}`;
  const isParamValid = secretParam === expectedSecret;

  if (!isHeaderValid && !isParamValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getServiceSupabase();

    // Fetch existing blog titles and primary keywords to track keyword coverage
    let existingTitles: string[] = [];
    const usedKeywords = new Set<string>();
    try {
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('title, primary_keyword')
        .order('published_at', { ascending: false })
        .limit(60);
      
      if (posts) {
        existingTitles = posts.map(p => p.title);
        posts.forEach(p => {
          if (p.primary_keyword) {
            usedKeywords.add(p.primary_keyword.toLowerCase().trim());
          }
        });
      }
    } catch (err) {
      console.warn('Could not fetch existing blog titles for deduplication:', err);
    }

    // Select target keyword: manual param override, first uncovered keyword, or daily cyclic rotation
    let selectedKeyword = requestedKeyword;
    if (!selectedKeyword) {
      const unusedKeywords = TARGET_SEO_KEYWORDS.filter(kw => !usedKeywords.has(kw.toLowerCase()));
      if (unusedKeywords.length > 0) {
        selectedKeyword = unusedKeywords[0];
      } else {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        selectedKeyword = TARGET_SEO_KEYWORDS[dayOfYear % TARGET_SEO_KEYWORDS.length];
      }
    }

    const blogData = await generateBlogPostWithGemini(existingTitles, selectedKeyword);
    
    if (!blogData) {
      return NextResponse.json({ error: 'Failed to generate blog content (Gemini API key missing or generation failed)' }, { status: 500 });
    }

    // Generate a URL-friendly slug
    const baseSlug = ((blogData as any).url_slug || blogData.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || 'career-guide';

    // Ensure slug is unique
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      
      if (!existingPost) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const featured_image = `https://picsum.photos/seed/${encodeURIComponent(slug)}/1200/600`;

    const { data, error } = await supabase.from('blog_posts').insert([
      {
        slug,
        title: blogData.title,
        meta_description: blogData.description || (blogData as any).meta_description || '',
        content: blogData.content,
        primary_keyword: blogData.primary_keyword || selectedKeyword || '',
        featured_image,
        word_count: blogData.content ? blogData.content.split(/\s+/).length : 0,
        published: true,
        published_at: new Date().toISOString()
      }
    ]).select();

    if (error) {
      console.error('Error inserting blog post:', error);
      return NextResponse.json({ 
        error: 'Database insert failed', 
        details: error.message || error,
        hint: error.hint || null,
        code: error.code || null
      }, { status: 500 });
    }

    // Purge Next.js cache so the new post appears immediately on /blog
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${slug}`);
      revalidatePath('/sitemap.xml');
    } catch (e) {
      console.error('Revalidate error:', e);
    }

    // Notify Bing via IndexNow
    const blogUrl = `https://joinsophi.com/blog/${slug}`;
    await notifyIndexNow([blogUrl]).catch(e => console.error('IndexNow error:', e));

    return NextResponse.json({ success: true, post: data?.[0] || null });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error?.message || String(error) 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}

