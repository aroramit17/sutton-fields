-- ============================================================
-- Sutton Fields — Supabase Schema Setup
-- Run this entire script in Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- 1. PROFILES TABLE (Resident Verification)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  address text not null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Index for admin lookups
create index idx_profiles_approved on public.profiles (is_approved, created_at desc);

-- Enable RLS
alter table public.profiles enable row level security;

-- Anyone can read approved profiles (for display names on listings)
create policy "Public can read approved profiles"
  on public.profiles for select
  using (is_approved = true);

-- Users can always read their own profile (even if not yet approved)
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can insert their own profile on sign-up
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- ============================================================
-- 2. LISTINGS TABLE (Buy/Sell/Trade Marketplace)
-- ============================================================
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10,2) not null check (price >= 0),
  location text not null,
  images text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '48 hours'),
  deactivated_at timestamptz
);

-- Index for browsing active listings (newest first)
create index idx_listings_active
  on public.listings (is_active, created_at desc)
  where is_active = true;

-- Index for the auto-deactivation cron job
create index idx_listings_expires
  on public.listings (expires_at)
  where is_active = true;

-- Index for a user's own listings
create index idx_listings_user
  on public.listings (user_id, created_at desc);

-- Enable RLS
alter table public.listings enable row level security;

-- Public can view active, non-expired listings (for SEO & browsing)
create policy "Public can view active listings"
  on public.listings for select
  using (is_active = true and expires_at > now());

-- Users can always see their own listings (any status)
create policy "Users can view own listings"
  on public.listings for select
  using (auth.uid() = user_id);

-- Only approved residents can create listings
create policy "Approved users can create listings"
  on public.listings for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_approved = true
    )
  );

-- Users can update their own listings (for deactivation)
create policy "Users can update own listings"
  on public.listings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own listings
create policy "Users can delete own listings"
  on public.listings for delete
  using (auth.uid() = user_id);


-- ============================================================
-- 3. STORAGE BUCKET (Listing Images)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true);

-- Anyone can view listing images (public bucket)
create policy "Public can view listing images"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- Authenticated users can upload to their own folder
create policy "Users can upload listing images"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own images
create policy "Users can delete own listing images"
  on storage.objects for delete
  using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================================
-- 4. AUTO-DEACTIVATION (48-hour expiry)
-- ============================================================

-- Function to deactivate expired listings
create or replace function deactivate_expired_listings()
returns void
language sql
security definer
as $$
  update public.listings
  set is_active = false, deactivated_at = now()
  where is_active = true and expires_at <= now();
$$;

-- Schedule via pg_cron (runs every 15 minutes)
-- NOTE: pg_cron must be enabled first. Go to:
--   Supabase Dashboard > Database > Extensions > search "pg_cron" > Enable
--
-- After enabling pg_cron, run this:
select cron.schedule(
  'deactivate-expired-listings',
  '*/15 * * * *',
  'select deactivate_expired_listings()'
);


-- ============================================================
-- 5. DONE!
-- ============================================================
-- Next steps:
--   1. Update .env.local with your Supabase URL and anon key
--   2. Add the same env vars in Vercel project settings
--   3. When residents sign up, approve them in the Supabase
--      Dashboard: Table Editor > profiles > toggle is_approved
-- ============================================================
