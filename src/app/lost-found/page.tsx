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
