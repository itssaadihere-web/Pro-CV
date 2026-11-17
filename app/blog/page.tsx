import React, { Suspense } from 'react';
import Header from '@/components/Header';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import BlogIndexClient, { BlogPostItem } from '@/components/BlogIndexClient';

export const metadata: Metadata = {
  title: 'Career Advice & ATS Resume Writing Blog | Sophi',
  description: 'Expert tips on passing ATS resume screeners, tailoring CVs for jobs, optimizing LinkedIn profiles, and landing career opportunities.',
  alternates: { canonical: 'https://joinsophi.com/blog' },
  openGraph: {
    title: 'Career Advice & ATS Resume Writing Blog | Sophi',
    description: 'Expert tips on passing ATS resume screeners, tailoring CVs for jobs, optimizing LinkedIn profiles, and landing career opportunities.',
    url: 'https://joinsophi.com/blog',
    siteName: 'Sophi',
    type: 'website',
    images: [
      {
        url: 'https://joinsophi.com/og/home.png',
        width: 1200,
        height: 630,
        alt: 'Sophi Career Advice & ATS Resume Writing Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Advice & ATS Resume Writing Blog | Sophi',
    description: 'Expert tips on passing ATS resume screeners, tailoring CVs for jobs, optimizing LinkedIn profiles, and landing career opportunities.',
    images: ['https://joinsophi.com/og/home.png'],
  },
};

// Force dynamic rendering so new blogs appear immediately
export const dynamic = 'force-dynamic';

function BlogLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 bg-slate-200 rounded-xl w-3/4 max-w-md mx-auto" />
      <div className="flex gap-2 justify-center flex-wrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-24 bg-slate-200 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-96 flex flex-col">
            <div className="h-48 bg-slate-200 w-full" />
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-4/5" />
                <div className="h-4 bg-slate-200 rounded w-full" />
              </div>
              <div className="h-4 bg-slate-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function BlogIndexPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  let posts: BlogPostItem[] = [];
  
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Attempt to query with category column first
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, meta_description, published_at, author_name, featured_image, primary_keyword, category')
      .eq('published', true)
      .order('published_at', { ascending: false });
    
    if (!error && data) {
      posts = data as BlogPostItem[];
    } else {
      // Graceful fallback if category column does not exist in the database table yet
      const fallback = await supabase
        .from('blog_posts')
        .select('id, title, slug, meta_description, published_at, author_name, featured_image, primary_keyword')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (fallback.data) {
        posts = fallback.data as BlogPostItem[];
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-black text-primary uppercase tracking-wider">
            Sophi Career Resources
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Career & CV Tips Blog
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Expert career advice on ATS optimization, AI resume writing, LinkedIn profiles, cover letters, and job search strategies for Pakistani and Gulf professionals.
          </p>
        </div>

        {/* Interactive Blog Component with Category Filter, Sort & 10 Blogs/Page */}
        <Suspense fallback={<BlogLoadingSkeleton />}>
          <BlogIndexClient posts={posts} />
        </Suspense>
      </main>
    </div>
  );
}
