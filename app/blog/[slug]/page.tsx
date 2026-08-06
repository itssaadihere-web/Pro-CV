import React from 'react';
import Header from '@/components/Header';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { blogPostSchema } from '@/lib/schema';
import { ArrowLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';

export const revalidate = 3600;

async function getPost(slug: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
    
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | Sophi Blog`,
    description: post.meta_description,
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: 'article',
      authors: [post.author_name],
      publishedTime: post.published_at,
    }
  };
}

function formatBlogHeadings(htmlContent: string) {
  if (!htmlContent) return '';
  let content = htmlContent;

  // 1. Transform Quick Answer blocks into stylized golden callout cards
  content = content.replace(
    /(?:<p>)?(?:<strong>)?Quick Answer:(?:<\/strong>)?\s*([\s\S]*?)(?:<\/p>|$)/gi,
    '<div class="my-8 p-6 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-sm text-slate-800"><div class="flex items-center gap-2 mb-2"><span class="font-black text-amber-900 bg-amber-200/80 px-3 py-1 rounded-lg text-xs tracking-wider uppercase flex items-center gap-1">⚡ Quick Answer</span></div><div class="text-slate-800 font-semibold text-base leading-relaxed">$1</div></div>'
  );

  // 2. Transform numbered heading paragraphs like <p>1. Master the Art...</p> into prominent <h2> tags
  content = content.replace(
    /<p>(?:<strong>)?(\d+\.\s+[^<]+)(?:<\/strong>)?<\/p>/gi,
    '<h2 class="text-2xl md:text-3xl font-black text-slate-900 mt-12 mb-5 pb-3 border-b border-slate-200">$1</h2>'
  );

  // 3. Transform unnumbered heading paragraphs like <p>Stop Guessing and Start Optimizing</p> into <h2>
  content = content.replace(
    /<p>([A-Z][A-Za-z0-9\s,':\-\?]{5,80})<\/p>/g,
    (match, p1) => {
      if (!p1.endsWith('.') && p1.length < 80 && !p1.toLowerCase().startsWith('quick answer')) {
        return `<h2 class="text-2xl md:text-3xl font-black text-slate-900 mt-12 mb-5 pb-3 border-b border-slate-200">${p1}</h2>`;
      }
      return match;
    }
  );

  // 4. Style existing <h2> and <h3> tags for strong visual hierarchy
  content = content.replace(
    /<h2>/gi,
    '<h2 class="text-2xl md:text-3xl font-black text-slate-900 mt-12 mb-5 pb-3 border-b border-slate-200">'
  );

  content = content.replace(
    /<h3>/gi,
    '<h3 class="text-xl md:text-2xl font-bold text-slate-900 mt-8 mb-4">'
  );

  return content;
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const formattedContent = formatBlogHeadings(post.content);

  const schema = blogPostSchema({
    title: post.title,
    description: post.meta_description,
    slug: post.slug,
    publishedAt: post.published_at,
    updatedAt: post.updated_at,
    authorName: post.author_name,
    imageUrl: post.featured_image || 'https://joinsophi.com/logo.png',
    wordCount: post.word_count
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Script
        id={`schema-article-${post.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-800 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              {post.featured_image && (
                <img src={post.featured_image} alt={post.title} className="w-full h-72 md:h-[450px] object-cover" />
              )}
              
              <div className="p-8 md:p-12">
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary-900 to-slate-800">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-10 pb-10 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-50 border-2 border-primary-100 flex items-center justify-center font-bold text-primary text-xl">
                      {post.author_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{post.author_name}</div>
                      <div className="text-slate-500 text-xs flex items-center gap-1">
                        <span className="text-gold">★</span> Career Expert
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-slate-200" />
                  <div className="text-sm text-slate-500 font-medium">
                    {Math.ceil(post.word_count / 250)} min read
                  </div>
                </div>

                <div 
                  className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-sm"
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />

                <div className="mt-16 pt-8 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Share this article</h4>
                  <ShareButtons title={post.title} slug={post.slug} />
                </div>

                {/* "Does your CV pass the ATS test?" Banner Section */}
                <div className="mt-12 rounded-3xl bg-slate-950 p-8 sm:p-10 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#c5a059]/15 blur-3xl" />
                  
                  <div className="relative space-y-4">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 px-3.5 py-1 text-xs font-black text-[#c5a059]">
                      <Sparkles className="h-3.5 w-3.5 text-[#c5a059]" />
                      <span>SOPHI AI CV REVAMP</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                      Does your CV pass the ATS test?
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed max-w-2xl font-medium">
                      Over 90% of job applications get silently auto-rejected by ATS screening software. Revamp your document into an executive, ATS-optimized CV instantly! Includes job tailoring & cover letter generation.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                      <Link
                        href="/transform-cv"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-xl hover:scale-105"
                      >
                        <Sparkles className="h-4 w-4 text-slate-950" />
                        <span>Revamp My CV Now</span>
                        <ArrowRight className="h-4 w-4 text-slate-950" />
                      </Link>

                      <span className="text-xs text-slate-400 font-medium">
                        ✓ ATS Score Optimization • Instant Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24">
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#c5a059]/15 blur-2xl" />
                
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 px-3 py-1 text-[11px] font-black text-[#c5a059] mb-4">
                  <Sparkles className="h-3 w-3 text-[#c5a059]" />
                  <span>SOPHI AI CV REVAMP</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black mb-3 text-white leading-tight">
                  Does your CV pass the ATS test?
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed font-medium">
                  90% of large companies use ATS systems. Find out if your CV is getting auto-rejected and revamp it instantly with AI.
                </p>
                
                <Link
                  href="/transform-cv"
                  className="block w-full text-center py-3.5 bg-gold hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md hover:scale-105"
                >
                  Revamp My CV Now
                </Link>
                
                <div className="mt-3 text-center text-[11px] text-slate-400 font-medium">
                  Instant AI Optimization
                </div>
              </div>

              <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Quick Tips
                </h4>
                <ul className="space-y-4 text-sm text-slate-600 font-medium">
                  <li className="flex gap-3">
                    <span className="text-blue-500 font-bold">1.</span>
                    Always use standard section headings (e.g. "Work Experience", not "My Journey").
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-500 font-bold">2.</span>
                    Save your CV as a PDF to preserve formatting across all devices.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-500 font-bold">3.</span>
                    Start every bullet point with a strong action verb (Developed, Managed, Led).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
