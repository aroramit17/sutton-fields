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
