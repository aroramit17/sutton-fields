"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { deactivateLostFoundPost } from "@/actions/lost-found";
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
    await deactivateLostFoundPost(post.id);
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
