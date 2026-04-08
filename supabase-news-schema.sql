-- ============================================================
-- Sutton Fields — News System Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Add is_admin column to profiles
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- 2. Create articles table
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  source_url text not null,
  source_title text,
  image_url text,
  category text not null default 'Community',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create index idx_articles_published on public.articles (is_published, published_at desc) where is_published = true;

alter table public.articles enable row level security;

-- Anyone can read published articles (SEO)
create policy "Public can read published articles"
  on public.articles for select
  using (is_published = true);

-- Admins can do everything
create policy "Admins full access"
  on public.articles for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 3. Storage bucket for article images
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

create policy "Public can view article images"
  on storage.objects for select
  using (bucket_id = 'article-images');

create policy "Admins can upload article images"
  on storage.objects for insert
  with check (
    bucket_id = 'article-images'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- After running this, manually set your profile as admin:
-- UPDATE profiles SET is_admin = true WHERE email = 'your@email.com';
-- ============================================================
