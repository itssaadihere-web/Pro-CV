-- Migration: Add Category Column & Index to blog_posts
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

alter table public.blog_posts 
  add column if not exists category text;

-- Optional: Create index on category for faster filtering
create index if not exists idx_blog_posts_category 
  on public.blog_posts (category);

-- Optional: Create index on published & published_at for faster sorted queries
create index if not exists idx_blog_posts_published_date 
  on public.blog_posts (published, published_at desc);
