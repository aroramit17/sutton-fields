# Community Boards & Navigation Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the two new resident boards (Lost & Found, Carpool) surfaced by the WhatsApp research, expand the vendor directory, add the Newcomer Guide and WhatsApp-group directory, and restructure navigation from a flat 6-item list into 5 task-based hubs (Live Here / Get Help / Stay Informed / Connect), per `docs/superpowers/specs/2026-08-10-site-restructure-design.md`.

**Architecture:** Follows the existing Buy/Sell/Trade pattern exactly — a Supabase table per board with RLS (public read of active posts, approved-resident insert, owner update/delete), a `*Form`/`*Grid`/`*Card` component trio per board, a list page + a `/new` page gated by `ContentGate`. Navigation becomes hub landing pages (plain server components with link cards) that the existing pages nest under; `src/data/navigation.ts` collapses to 5 top-level entries.

**Tech Stack:** Next.js App Router, Supabase (Postgres + RLS + Storage + Auth via existing `AuthContext`), Tailwind v4 with the existing MD3-token design system. No test framework exists in this repo (`package.json` has no test runner) — verification is `npm run build` (catches TypeScript/type errors across the app) plus a manual check in `npm run dev`, called out per task instead of fabricated unit tests.

**Deferred to a follow-up plan** (per the spec's scope-check): the homepage live-dashboard aggregator and the nightly Daily News automation pipeline. Both depend on these boards existing and are architecturally distinct (cron job, LLM search grounding, refactor of the existing `/api/news/generate` route) — they get their own plan once this lands.

---

## Task 1: Supabase schema for Lost & Found and Carpool boards

**Files:**
- Create: `supabase-community-boards-schema.sql`

- [ ] **Step 1: Write the schema file**

```sql
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
```

- [ ] **Step 2: Run it against Supabase**

This step is manual — the engineer executing this plan does not have direct Supabase Dashboard access. Tell the user: "Run `supabase-community-boards-schema.sql` in the Supabase Dashboard SQL Editor before testing the Lost & Found or Carpool pages against real data — until then, `npm run build` will still pass but the pages will show empty states."

- [ ] **Step 3: Commit**

```bash
git add supabase-community-boards-schema.sql
git commit -m "Add Supabase schema for Lost & Found and Carpool boards"
```

---

## Task 2: Database types for the new boards

**Files:**
- Modify: `src/types/database.ts`

- [ ] **Step 1: Add the new types**

Append to `src/types/database.ts`:

```typescript
export interface LostFoundPost {
  id: string;
  user_id: string;
  status: "lost" | "found";
  title: string;
  description: string;
  location: string;
  images: string[];
  is_active: boolean;
  created_at: string;
  expires_at: string;
  deactivated_at: string | null;
}

export interface LostFoundPostWithProfile extends LostFoundPost {
  profiles: Pick<Profile, "first_name" | "last_name"> | null;
}

export interface CarpoolPost {
  id: string;
  user_id: string;
  title: string;
  description: string;
  destination: string;
  schedule: string;
  is_active: boolean;
  created_at: string;
  expires_at: string;
  deactivated_at: string | null;
}

export interface CarpoolPostWithProfile extends CarpoolPost {
  profiles: Pick<Profile, "first_name" | "last_name"> | null;
}
```

- [ ] **Step 2: Verify it typechecks**

Run: `npm run build`
Expected: build succeeds (these are unused-but-valid types at this point, so nothing else should break).

- [ ] **Step 3: Commit**

```bash
git add src/types/database.ts
git commit -m "Add LostFoundPost and CarpoolPost types"
```

---

## Task 3: Lost & Found board

**Files:**
- Create: `src/components/lost-found/LostFoundCard.tsx`
- Create: `src/components/lost-found/LostFoundGrid.tsx`
- Create: `src/components/lost-found/LostFoundForm.tsx`
- Create: `src/app/lost-found/page.tsx`
- Create: `src/app/lost-found/layout.tsx`
- Create: `src/app/lost-found/new/page.tsx`

- [ ] **Step 1: Card component**

Create `src/components/lost-found/LostFoundCard.tsx`:

```tsx
"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";
import type { LostFoundPostWithProfile } from "@/types/database";

interface LostFoundCardProps {
  post: LostFoundPostWithProfile;
  onDeactivated?: () => void;
}

export function LostFoundCard({ post, onDeactivated }: LostFoundCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === post.user_id;

  async function handleDeactivate() {
    const supabase = createClient();
    await supabase
      .from("lost_found_posts")
      .update({ is_active: false, deactivated_at: new Date().toISOString() })
      .eq("id", post.id);
    onDeactivated?.();
  }

  const posterName = post.profiles
    ? `${post.profiles.first_name} ${post.profiles.last_name[0]}.`
    : "Resident";

  return (
    <div className="group bg-surface-container-low rounded-3xl p-6 transition-all duration-300 hover:bg-surface-container-lowest hover:shadow-xl">
      {post.images.length > 0 && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
          <Image src={post.images[0]} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <span
        className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${
          post.status === "lost"
            ? "bg-error-container text-on-error-container"
            : "bg-primary/10 text-primary"
        }`}
      >
        {post.status === "lost" ? "Lost" : "Found"}
      </span>

      <h3 className="text-lg font-headline italic text-on-surface mb-2">
        {post.title}
      </h3>

      <p className="text-on-surface-variant text-sm mb-3 line-clamp-2">
        {post.description}
      </p>

      <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
        <Icon name="location_on" className="text-sm text-primary" />
        <span>{post.location}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <Icon name="person" className="text-sm" />
          {posterName}
        </span>
      </div>

      {isOwner && (
        <button
          onClick={handleDeactivate}
          className="mt-4 w-full py-2 text-sm font-bold text-error bg-error-container rounded-xl hover:bg-error hover:text-on-error transition-all"
        >
          Mark Resolved
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Grid component**

Create `src/components/lost-found/LostFoundGrid.tsx`:

```tsx
"use client";

import type { LostFoundPostWithProfile } from "@/types/database";
import { LostFoundCard } from "./LostFoundCard";

interface LostFoundGridProps {
  posts: LostFoundPostWithProfile[];
  onPostDeactivated?: () => void;
}

export function LostFoundGrid({ posts, onPostDeactivated }: LostFoundGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-on-surface-variant text-lg">
          Nothing posted right now. If you&rsquo;ve lost or found something, post it below.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <LostFoundCard key={post.id} post={post} onDeactivated={onPostDeactivated} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Form component**

Create `src/components/lost-found/LostFoundForm.tsx`:

```tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const MAX_IMAGES = 4;
const MAX_SIZE_MB = 5;

export function LostFoundForm() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"lost" | "found">("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(profile?.address || "");
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    const newFiles: { file: File; url: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      if (previews.length + newFiles.length >= MAX_IMAGES) break;
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Each image must be under ${MAX_SIZE_MB}MB.`);
        continue;
      }
      newFiles.push({ file, url: URL.createObjectURL(file) });
    }
    setPreviews((prev) => [...prev, ...newFiles]);
  }

  function removeImage(index: number) {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSubmitting(true);

    const supabase = createClient();

    const imageUrls: string[] = [];
    for (const { file } of previews) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("lost-found-images")
        .upload(path, file);
      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }
      const { data } = supabase.storage.from("lost-found-images").getPublicUrl(path);
      imageUrls.push(data.publicUrl);
    }

    const { error: insertError } = await supabase.from("lost_found_posts").insert({
      user_id: user.id,
      status,
      title,
      description,
      location,
      images: imageUrls,
    });

    if (insertError) {
      setError(`Failed to create post: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    router.push("/lost-found");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-bold text-on-surface block mb-2">
          Is this a lost or found item/pet?
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStatus("lost")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
              status === "lost"
                ? "bg-error-container text-on-error-container"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            Lost
          </button>
          <button
            type="button"
            onClick={() => setStatus("found")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
              status === "found"
                ? "bg-primary/10 text-primary"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            Found
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-on-surface block mb-1">
          Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
          placeholder="e.g., Orange tabby cat, Bracken Dr"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-on-surface block mb-1">
          Description
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40 resize-none"
          placeholder="Describe distinguishing details, when it was lost/found, and how to reach you"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-on-surface block mb-1">
          Location
        </label>
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
          placeholder="Street or nearest cross-street in Sutton Fields"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-on-surface block mb-2">
          Photos (up to {MAX_IMAGES})
        </label>
        <div
          className="border-2 border-dashed border-outline-variant rounded-2xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          <Icon name="add_photo_alternate" className="text-3xl text-on-surface-variant mb-1" />
          <p className="text-sm text-on-surface-variant">
            Drag & drop or click to browse
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {previews.length > 0 && (
          <div className="flex gap-3 mt-3 flex-wrap">
            {previews.map((preview, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                <img src={preview.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-on-surface/70 text-white rounded-full flex items-center justify-center hover:bg-error transition-colors"
                >
                  <Icon name="close" className="!text-[10px]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface-container-low rounded-xl p-4 flex items-start gap-3">
        <Icon name="info" className="text-tertiary shrink-0" />
        <p className="text-xs text-on-surface-variant">
          Your post stays active for <strong>14 days</strong>, or mark it resolved earlier
          from the Lost &amp; Found page once reunited.
        </p>
      </div>

      <Button variant="gradient" type="submit" className="w-full py-4">
        {submitting ? "Posting..." : "Post to Lost & Found"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: List page**

Create `src/app/lost-found/page.tsx`:

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LostFoundGrid } from "@/components/lost-found/LostFoundGrid";
import { createClient } from "@/lib/supabase/client";
import type { LostFoundPostWithProfile } from "@/types/database";

export default function LostFoundPage() {
  const [posts, setPosts] = useState<LostFoundPostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("lost_found_posts")
      .select("*, profiles(first_name, last_name)")
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    setPosts((data as LostFoundPostWithProfile[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="pb-24 px-6 max-w-7xl mx-auto">
      <PageHeader
        label="Get Help"
        title="Lost & Found"
        description="Lost a pet or item, or found one wandering the neighborhood? Post it here — posts stay active for 14 days."
        ctaLabel="Post to Lost & Found"
        ctaIcon="add_circle"
        ctaHref="/lost-found/new"
        ctaVariant="gradient"
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-low rounded-3xl p-6 h-72 animate-pulse" />
          ))}
        </div>
      ) : (
        <LostFoundGrid posts={posts} onPostDeactivated={fetchPosts} />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Layout wrapper**

Create `src/app/lost-found/layout.tsx` (matches the pattern in `src/app/buy-sell-trade/layout.tsx` — read that file first and mirror its metadata export exactly, substituting title "Lost & Found | Sutton Fields" and a one-line description about the board).

- [ ] **Step 6: New post page**

Create `src/app/lost-found/new/page.tsx`:

```tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { LostFoundForm } from "@/components/lost-found/LostFoundForm";
import { ContentGate } from "@/components/ui/ContentGate";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NewLostFoundPage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="h-8 bg-surface-container-high rounded-xl animate-pulse mb-4" />
        <div className="h-64 bg-surface-container-low rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <ContentGate
          title="Sign In Required"
          description="You need a verified Sutton Fields resident account to post to Lost & Found."
        />
      </div>
    );
  }

  if (profile && !profile.is_approved) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 bg-tertiary-fixed rounded-full flex items-center justify-center text-tertiary mx-auto mb-6">
          <Icon name="hourglass_top" className="text-3xl" />
        </div>
        <h1 className="text-3xl font-headline italic text-on-surface mb-4">
          Account Pending Approval
        </h1>
        <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
          Your account is being verified by a Sutton Fields admin. You&rsquo;ll
          be able to post once approved. Check back soon!
        </p>
        <Button variant="secondary" href="/lost-found">
          Browse Lost & Found
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/lost-found"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-6 transition-colors"
      >
        <Icon name="arrow_back" className="text-sm" /> Back to Lost & Found
      </Link>

      <h1 className="text-4xl font-headline italic text-on-surface mb-2">
        Post to Lost & Found
      </h1>
      <p className="text-on-surface-variant mb-8">
        Help reunite a neighbor with their pet or item.
      </p>

      <LostFoundForm />
    </div>
  );
}
```

- [ ] **Step 7: Verify it builds**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 8: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/lost-found` and `http://localhost:3000/lost-found/new`. Expected: list page renders the empty state (no schema run yet means an empty/error result is acceptable at this point — confirm the page doesn't crash), new page shows the sign-in gate if not logged in.

- [ ] **Step 9: Commit**

```bash
git add src/components/lost-found src/app/lost-found
git commit -m "Add Lost & Found board (list, post form, Supabase-backed)"
```

---

## Task 4: Carpool board

**Files:**
- Create: `src/components/carpool/CarpoolCard.tsx`
- Create: `src/components/carpool/CarpoolGrid.tsx`
- Create: `src/components/carpool/CarpoolForm.tsx`
- Create: `src/app/carpool/page.tsx`
- Create: `src/app/carpool/layout.tsx`
- Create: `src/app/carpool/new/page.tsx`

- [ ] **Step 1: Card component**

Create `src/components/carpool/CarpoolCard.tsx`:

```tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";
import type { CarpoolPostWithProfile } from "@/types/database";

interface CarpoolCardProps {
  post: CarpoolPostWithProfile;
  onDeactivated?: () => void;
}

export function CarpoolCard({ post, onDeactivated }: CarpoolCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === post.user_id;

  async function handleDeactivate() {
    const supabase = createClient();
    await supabase
      .from("carpool_posts")
      .update({ is_active: false, deactivated_at: new Date().toISOString() })
      .eq("id", post.id);
    onDeactivated?.();
  }

  const posterName = post.profiles
    ? `${post.profiles.first_name} ${post.profiles.last_name[0]}.`
    : "Resident";

  return (
    <div className="group bg-surface-container-low rounded-3xl p-6 transition-all duration-300 hover:bg-surface-container-lowest hover:shadow-xl">
      <h3 className="text-lg font-headline italic text-on-surface mb-2">
        {post.title}
      </h3>

      <p className="text-on-surface-variant text-sm mb-3 line-clamp-2">
        {post.description}
      </p>

      <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
        <Icon name="flag" className="text-sm text-primary" />
        <span>{post.destination}</span>
      </div>

      <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-3">
        <Icon name="schedule" className="text-sm text-primary" />
        <span>{post.schedule}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <Icon name="person" className="text-sm" />
          {posterName}
        </span>
      </div>

      {isOwner && (
        <button
          onClick={handleDeactivate}
          className="mt-4 w-full py-2 text-sm font-bold text-error bg-error-container rounded-xl hover:bg-error hover:text-on-error transition-all"
        >
          Remove Post
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Grid component**

Create `src/components/carpool/CarpoolGrid.tsx`:

```tsx
"use client";

import type { CarpoolPostWithProfile } from "@/types/database";
import { CarpoolCard } from "./CarpoolCard";

interface CarpoolGridProps {
  posts: CarpoolPostWithProfile[];
  onPostDeactivated?: () => void;
}

export function CarpoolGrid({ posts, onPostDeactivated }: CarpoolGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-on-surface-variant text-lg">
          No open carpool requests right now. Post one below.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <CarpoolCard key={post.id} post={post} onDeactivated={onPostDeactivated} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Form component**

Create `src/components/carpool/CarpoolForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function CarpoolForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [schedule, setSchedule] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("carpool_posts").insert({
      user_id: user.id,
      title,
      description,
      destination,
      schedule,
    });

    if (insertError) {
      setError(`Failed to create post: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    router.push("/carpool");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-bold text-on-surface block mb-1">
          Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
          placeholder="e.g., Looking for morning carpool to Rushing MS"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-on-surface block mb-1">
          Description
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40 resize-none"
          placeholder="Grade/school, pickup area, and how to reach you"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-on-surface block mb-1">
            Destination
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="e.g., Rushing Middle School"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-on-surface block mb-1">
            Schedule
          </label>
          <input
            type="text"
            required
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="e.g., Mon-Fri, 7:45am drop-off"
          />
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-4 flex items-start gap-3">
        <Icon name="info" className="text-tertiary shrink-0" />
        <p className="text-xs text-on-surface-variant">
          Your post stays active for <strong>30 days</strong>, or remove it earlier
          from the Carpool page once you&rsquo;ve found a match.
        </p>
      </div>

      <Button variant="gradient" type="submit" className="w-full py-4">
        {submitting ? "Posting..." : "Post to Carpool Board"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: List page**

Create `src/app/carpool/page.tsx`:

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CarpoolGrid } from "@/components/carpool/CarpoolGrid";
import { createClient } from "@/lib/supabase/client";
import type { CarpoolPostWithProfile } from "@/types/database";

export default function CarpoolPage() {
  const [posts, setPosts] = useState<CarpoolPostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("carpool_posts")
      .select("*, profiles(first_name, last_name)")
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    setPosts((data as CarpoolPostWithProfile[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="pb-24 px-6 max-w-7xl mx-auto">
      <PageHeader
        label="Get Help"
        title="Carpool Board"
        description="Post or find carpool matches for school runs and commutes — Rushing MS, Dan Christie Elementary, UTD, UNT, or your workplace. Posts stay active for 30 days."
        ctaLabel="Post a Carpool Request"
        ctaIcon="add_circle"
        ctaHref="/carpool/new"
        ctaVariant="gradient"
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-low rounded-3xl p-6 h-56 animate-pulse" />
          ))}
        </div>
      ) : (
        <CarpoolGrid posts={posts} onPostDeactivated={fetchPosts} />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Layout wrapper**

Create `src/app/carpool/layout.tsx`, mirroring `src/app/buy-sell-trade/layout.tsx`'s metadata pattern with title "Carpool Board | Sutton Fields".

- [ ] **Step 6: New post page**

Create `src/app/carpool/new/page.tsx` — identical structure to `src/app/lost-found/new/page.tsx` from Task 3 Step 6, with these substitutions: import `CarpoolForm` instead of `LostFoundForm`; all `/lost-found` hrefs become `/carpool`; gate description reads "You need a verified Sutton Fields resident account to post to the Carpool Board."; heading reads "Post a Carpool Request"; final paragraph reads "Find a match for a school run or commute."

- [ ] **Step 7: Verify it builds**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 8: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/carpool` and `http://localhost:3000/carpool/new`. Expected: same behavior pattern as the Lost & Found manual check in Task 3.

- [ ] **Step 9: Commit**

```bash
git add src/components/carpool src/app/carpool
git commit -m "Add Carpool board (list, post form, Supabase-backed)"
```

---

## Task 5: Vendor category expansion

**Files:**
- Modify: `src/data/vendors.ts:3-9`

- [ ] **Step 1: Expand the category list**

In `src/data/vendors.ts`, replace the existing `vendorCategories` export:

```typescript
export const vendorCategories = [
  "All",
  "Home Services",
  "Irrigation & Sprinkler",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Flooring & Concrete",
  "Lightning Protection",
  "Food & Dining",
  "Babysitting",
  "Tutoring & Lessons",
  "Pet Care",
];
```

Leave the existing `vendors` array entries and their current `category` values unchanged — new categories will simply have zero listings until real vendors are added, same as any category would before its first entry.

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: build succeeds. Manually check `/vendors` in `npm run dev` — the category filter chips should now show the expanded list.

- [ ] **Step 3: Commit**

```bash
git add src/data/vendors.ts
git commit -m "Expand vendor categories to match recurring resident requests"
```

---

## Task 6: Newcomer Guide page

**Files:**
- Create: `src/data/newcomer.ts`
- Create: `src/app/newcomer-guide/page.tsx`
- Create: `src/app/newcomer-guide/layout.tsx`

- [ ] **Step 1: Content data**

Create `src/data/newcomer.ts`:

```typescript
export interface NewcomerStep {
  icon: string;
  title: string;
  description: string;
}

export const newcomerSteps: NewcomerStep[] = [
  {
    icon: "groups",
    title: "Join the community WhatsApp group",
    description:
      "Ask any neighbor for an invite, or check the Connect page for the current group links, including school- and grade-specific sub-groups.",
  },
  {
    icon: "how_to_reg",
    title: "Register with the HOA",
    description:
      "Contact Essex Association Management (972-428-2030) to confirm your account is set up and dues are current — see Live Here > HOA Documents for details.",
  },
  {
    icon: "pool",
    title: "Request pool & amenity access",
    description:
      "Amenity access runs through the Paxton app. Check your email from the HOA for the request link — approval has been taking one to three weeks, so apply as soon as you move in.",
  },
  {
    icon: "school",
    title: "Get connected with your school",
    description:
      "Dan Christie Elementary sits inside the community; Rushing Middle and Prosper High are a short drive. See Live Here > Schools, and ask in Connect for your grade's carpool or parent group.",
  },
  {
    icon: "storefront",
    title: "Browse trusted vendors",
    description:
      "Before searching outside the neighborhood, check Get Help > Vendors — most home-service needs already have a resident-recommended provider.",
  },
];
```

- [ ] **Step 2: Page**

Create `src/app/newcomer-guide/page.tsx`:

```tsx
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { newcomerSteps } from "@/data/newcomer";

export default function NewcomerGuidePage() {
  return (
    <div className="pb-24 px-6 max-w-4xl mx-auto">
      <PageHeader
        label="Live Here"
        title="New to Sutton Fields?"
        description="Five things to do in your first few weeks — from joining the neighbor network to getting pool access sorted."
      />

      <div className="space-y-6">
        {newcomerSteps.map((step, i) => (
          <div
            key={step.title}
            className="flex gap-6 bg-surface-container-low rounded-3xl p-6"
          >
            <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Icon name={step.icon} />
            </div>
            <div>
              <div className="text-xs font-bold text-primary mb-1">
                Step {i + 1}
              </div>
              <h3 className="text-lg font-headline italic text-on-surface mb-1">
                {step.title}
              </h3>
              <p className="text-on-surface-variant text-sm">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Layout wrapper**

Create `src/app/newcomer-guide/layout.tsx`, mirroring `src/app/buy-sell-trade/layout.tsx`'s metadata pattern with title "Newcomer Guide | Sutton Fields".

- [ ] **Step 4: Verify and commit**

Run: `npm run build`, then manually check `/newcomer-guide` in `npm run dev`.

```bash
git add src/data/newcomer.ts src/app/newcomer-guide
git commit -m "Add Newcomer Guide page"
```

---

## Task 7: Connect hub — WhatsApp group directory

**Files:**
- Create: `src/data/groups.ts`
- Create: `src/app/connect/page.tsx`
- Create: `src/app/connect/layout.tsx`

- [ ] **Step 1: Content data**

Create `src/data/groups.ts`. The `href` values are placeholders (`"#"`) — flag to the user that real invite links need to be filled in before this ships, since fabricating working WhatsApp invite links isn't possible:

```typescript
export interface CommunityGroup {
  name: string;
  description: string;
  href: string;
}

export const communityGroups: CommunityGroup[] = [
  {
    name: "Sutton Fields — Main Group",
    description: "The primary neighborhood WhatsApp group for general community discussion.",
    href: "#",
  },
  {
    name: "Dan Christie Elementary Parents",
    description: "For DCE families — PTO events, carline updates, teacher assignments.",
    href: "#",
  },
  {
    name: "Rushing Middle School Parents",
    description: "For families with kids at Rushing Middle School.",
    href: "#",
  },
  {
    name: "Brenda Calhoun PreK",
    description: "For families with kids in the Prosper ISD PreK program.",
    href: "#",
  },
];

export const otherChannels = [
  {
    name: "Facebook Group",
    description: "Community discussion and announcements.",
    href: "https://www.facebook.com/groups/suttonfields/",
  },
];
```

- [ ] **Step 2: Page**

Create `src/app/connect/page.tsx`:

```tsx
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { communityGroups, otherChannels } from "@/data/groups";

export default function ConnectPage() {
  return (
    <div className="pb-24 px-6 max-w-4xl mx-auto">
      <PageHeader
        label="Connect"
        title="Find Your Group"
        description="WhatsApp sub-groups by school and interest, plus other ways to stay in the loop. If you don't see a group you're looking for, ask in the main group."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {communityGroups.map((group) => (
          <a
            key={group.name}
            href={group.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface-container-low rounded-3xl p-6 hover:bg-surface-container-lowest hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon name="chat" className="text-primary" />
              <h3 className="font-headline italic text-lg text-on-surface">
                {group.name}
              </h3>
            </div>
            <p className="text-on-surface-variant text-sm">{group.description}</p>
          </a>
        ))}
      </div>

      <h2 className="text-2xl font-headline italic mb-6">Other Channels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {otherChannels.map((channel) => (
          <a
            key={channel.name}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface-container-low rounded-3xl p-6 hover:bg-surface-container-lowest hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon name="public" className="text-primary" />
              <h3 className="font-headline italic text-lg text-on-surface">
                {channel.name}
              </h3>
            </div>
            <p className="text-on-surface-variant text-sm">{channel.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Layout wrapper**

Create `src/app/connect/layout.tsx`, mirroring `src/app/buy-sell-trade/layout.tsx`'s metadata pattern with title "Connect | Sutton Fields".

- [ ] **Step 4: Verify and commit**

Run: `npm run build`, then manually check `/connect` in `npm run dev`.

```bash
git add src/data/groups.ts src/app/connect
git commit -m "Add Connect page with WhatsApp group directory"
```

---

## Task 8: Navigation restructure — 5 hubs

**Files:**
- Modify: `src/data/navigation.ts`
- Create: `src/app/live-here/page.tsx`
- Create: `src/app/get-help/page.tsx`
- Create: `src/app/stay-informed/page.tsx`

This task ties everything together: three new hub landing pages (simple link-card grids to the pages built in Tasks 3-7 plus the existing Community/Vendors/Events/News/Buy-Sell-Trade pages), and a collapsed top nav.

- [ ] **Step 1: Hub landing page component pattern**

All three hub pages share one shape. Create `src/app/live-here/page.tsx`:

```tsx
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

const liveHereLinks = [
  { href: "/community", icon: "home", title: "Community Overview", description: "Amenities, HOA documents, utilities, and neighborhood info." },
  { href: "/community#schools", icon: "school", title: "Schools", description: "Dan Christie Elementary, Rushing Middle, and Prosper High." },
  { href: "/newcomer-guide", icon: "waving_hand", title: "Newcomer Guide", description: "Just moved in? Start here." },
];

export default function LiveHerePage() {
  return (
    <div className="pb-24 px-6 max-w-5xl mx-auto">
      <PageHeader
        label="Live Here"
        title="Everything About the Neighborhood"
        description="Amenities, schools, HOA documents, utilities, and getting settled in."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {liveHereLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-surface-container-low rounded-3xl p-6 hover:bg-surface-container-lowest hover:shadow-xl transition-all"
          >
            <Icon name={link.icon} className="text-primary text-3xl mb-3" />
            <h3 className="font-headline italic text-lg text-on-surface mb-1">{link.title}</h3>
            <p className="text-on-surface-variant text-sm">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Get Help hub**

Create `src/app/get-help/page.tsx`, same structure as Step 1 with this `links` array:

```typescript
const getHelpLinks = [
  { href: "/vendors", icon: "storefront", title: "Vendor Directory", description: "Community-vetted home services, food, tutoring, and pet care." },
  { href: "/buy-sell-trade", icon: "sell", title: "Buy / Sell / Trade", description: "Post items for sale or find deals from neighbors." },
  { href: "/lost-found", icon: "pets", title: "Lost & Found", description: "Lost a pet or item, or found one? Post it here." },
  { href: "/carpool", icon: "directions_car", title: "Carpool Board", description: "Find a match for school runs and commutes." },
];
```

(page title: "Find What You Need", description: "Vendors, classifieds, lost & found, and carpool matching — all in one place.")

- [ ] **Step 3: Stay Informed hub**

Create `src/app/stay-informed/page.tsx`, same structure with this `links` array:

```typescript
const stayInformedLinks = [
  { href: "/news", icon: "newspaper", title: "Community News", description: "City, school district, and HOA news relevant to residents." },
  { href: "/events", icon: "event", title: "Events", description: "Upcoming HOA, PTO, and community events." },
];
```

(page title: "Stay in the Loop", description: "Community news and upcoming events. Community Alerts and the Daily News feed are coming in a follow-up build.")

- [ ] **Step 4: Collapse the top nav**

Replace `src/data/navigation.ts` in full:

```typescript
import type { NavLink } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Live Here", href: "/live-here" },
  { label: "Get Help", href: "/get-help" },
  { label: "Stay Informed", href: "/stay-informed" },
  { label: "Connect", href: "/connect" },
];

export const footerLinks: NavLink[] = [
  { label: "HOA Bylaws", href: "#" },
  { label: "Contact Committee", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Resident Portal", href: "#" },
];
```

`Navbar.tsx` already renders `navLinks` generically (read in Task exploration — no changes needed there); this file swap is the entire nav restructure.

- [ ] **Step 5: Verify it builds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Manual check**

Run: `npm run dev`. Click through the top nav: Home → Live Here → Get Help → Stay Informed → Connect. Confirm each hub page loads and every link card navigates to a working page (including the ones built in Tasks 3-7).

- [ ] **Step 7: Commit**

```bash
git add src/data/navigation.ts src/app/live-here src/app/get-help src/app/stay-informed
git commit -m "Restructure navigation into 5 task-based hubs"
```

---

## Task 9: Push to GitHub

**Files:** none (git operations only)

- [ ] **Step 1: Confirm branch state**

```bash
git status
git log --oneline -12
```

Expected: working tree clean, all 8 prior commits present on `main`.

- [ ] **Step 2: Push**

```bash
git push origin main
```

Expected: pushes to `https://github.com/aroramit17/sutton-fields.git`. This is the point where the user connects the Vercel project to this GitHub repo (their stated next step, outside the scope of this plan) to replace the current Lovable-hosted deployment.

---

## Self-Review Notes

- **Spec coverage:** Nav restructure (Task 8), Get Help → Lost & Found + Carpool (Tasks 3-4), vendor category expansion (Task 5), Newcomer Guide (Task 6), Connect/WhatsApp directory (Task 7) are all covered. Homepage dashboard and Daily News automation are explicitly deferred to a follow-up plan per the scope-check in the header — not a gap, a sequencing decision already called out in the spec.
- **Known placeholder, flagged not hidden:** `src/data/groups.ts` WhatsApp invite links are `"#"` — Task 7 Step 1 explicitly tells the user these need real links before launch, since no agent can fabricate a working invite URL.
- **Type consistency:** `LostFoundPostWithProfile` / `CarpoolPostWithProfile` (Task 2) match the field names used in every query and component in Tasks 3-4 (`status`, `location`, `images` for Lost & Found; `destination`, `schedule` for Carpool) — checked against every `.select()` and prop destructure above.
