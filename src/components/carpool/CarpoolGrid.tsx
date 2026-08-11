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
