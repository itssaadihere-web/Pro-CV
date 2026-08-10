import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { generateBlogPostWithGemini } from '@/lib/blog-generator';
import { getServiceSupabase } from '@/lib/supabase-server';
import { notifyIndexNow } from '@/lib/indexNow';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secretParam = searchParams.get('secret');
  const authHeader = request.headers.get('authorization');
  
  const expectedSecret = process.env.CRON_SECRET || 'Blog@sophi_321';
  const isHeaderValid = authHeader === `Bearer ${expectedSecret}`;
  const isParamValid = secretParam === expectedSecret;

  if (!isHeaderValid && !isParamValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getServiceSupabase();

    // Fetch up to 30 existing blog titles to prevent topic repetition
    let existingTitles: string[] = [];
    try {
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('title')
        .order('published_at', { ascending: false })
        .limit(30);
      
      if (posts) {
        existingTitles = posts.map(p => p.title);
      }
    } catch (err) {
      console.warn('Could not fetch existing blog titles for deduplication:', err);
    }

    const blogData = await generateBlogPostWithGemini(existingTitles);
    
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
        primary_keyword: blogData.primary_keyword || '',
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

