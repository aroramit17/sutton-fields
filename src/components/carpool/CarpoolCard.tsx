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
