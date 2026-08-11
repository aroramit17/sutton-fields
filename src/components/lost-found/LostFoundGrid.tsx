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
