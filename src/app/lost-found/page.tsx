"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LostFoundGrid } from "@/components/lost-found/LostFoundGrid";
import { getActiveLostFoundPosts } from "@/actions/lost-found";
import type { LostFoundPostWithProfile } from "@/types/database";

export default function LostFoundPage() {
  const [posts, setPosts] = useState<LostFoundPostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const data = await getActiveLostFoundPosts();
    setPosts(data);
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
