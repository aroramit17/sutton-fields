-- ============================================================
-- Sutton Fields — Community Boards Schema (Lost & Found, Carpool)
-- Run this entire script in Supabase Dashboard > SQL Editor
-- Requires: profiles table (from supabase-schema.sql) to already exist
-- ============================================================

-- ============================================================
-- 1. LOST & FOUND POSTS
-- ============================================================
create table public.lost_found_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('lost', 'found')),
  title text not null,
  description text not null,
  location text not null,
  images text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '14 days'),
  deactivated_at timestamptz
);

create index idx_lost_found_active
  on public.lost_found_posts (is_active, created_at desc)
  where is_active = true;

create index idx_lost_found_expires
  on public.lost_found_posts (expires_at)
  where is_active = true;

create index idx_lost_found_user
  on public.lost_found_posts (user_id, created_at desc);

alter table public.lost_found_posts enable row level security;

create policy "Public can view active lost & found posts"
  on public.lost_found_posts for select
  using (is_active = true and expires_at > now());

create policy "Users can view own lost & found posts"
  on public.lost_found_posts for select
  using (auth.uid() = user_id);

create policy "Approved users can create lost & found posts"
  on public.lost_found_posts for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_approved = true
    )
  );

create policy "Users can update own lost & found posts"
  on public.lost_found_posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own lost & found posts"
  on public.lost_found_posts for delete
  using (auth.uid() = user_id);


-- ============================================================
-- 2. CARPOOL POSTS
-- ============================================================
create table public.carpool_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  destination text not null,
  schedule text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  deactivated_at timestamptz
);

create index idx_carpool_active
  on public.carpool_posts (is_active, created_at desc)
  where is_active = true;

create index idx_carpool_expires
  on public.carpool_posts (expires_at)
  where is_active = true;

create index idx_carpool_user
  on public.carpool_posts (user_id, created_at desc);

alter table public.carpool_posts enable row level security;

create policy "Public can view active carpool posts"
  on public.carpool_posts for select
  using (is_active = true and expires_at > now());

create policy "Users can view own carpool posts"
  on public.carpool_posts for select
  using (auth.uid() = user_id);

create policy "Approved users can create carpool posts"
  on public.carpool_posts for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_approved = true
    )
  );

create policy "Users can update own carpool posts"
  on public.carpool_posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own carpool posts"
  on public.carpool_posts for delete
  using (auth.uid() = user_id);


-- ============================================================
-- 3. STORAGE BUCKET (Lost & Found images — carpool posts need none)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('lost-found-images', 'lost-found-images', true);

create policy "Public can view lost & found images"
  on storage.objects for select
  using (bucket_id = 'lost-found-images');

create policy "Users can upload lost & found images"
  on storage.objects for insert
  with check (
    bucket_id = 'lost-found-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own lost & found images"
  on storage.objects for delete
  using (
    bucket_id = 'lost-found-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================================
-- 4. AUTO-DEACTIVATION (reuses the same pg_cron extension enabled
--    for listings — see supabase-schema.sql section 4)
-- ============================================================
create or replace function deactivate_expired_community_posts()
returns void
language sql
security definer
as $$
  update public.lost_found_posts
  set is_active = false, deactivated_at = now()
  where is_active = true and expires_at <= now();

  update public.carpool_posts
  set is_active = false, deactivated_at = now()
  where is_active = true and expires_at <= now();
$$;

select cron.schedule(
  'deactivate-expired-community-posts',
  '*/15 * * * *',
  'select deactivate_expired_community_posts()'
);
