"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";
import type { ListingWithProfile } from "@/types/database";

interface ListingCardProps {
  listing: ListingWithProfile;
  onDeactivated?: () => void;
}

function timeRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export function ListingCard({ listing, onDeactivated }: ListingCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === listing.user_id;

  async function handleDeactivate() {
    const supabase = createClient();
    await supabase
      .from("listings")
      .update({ is_active: false, deactivated_at: new Date().toISOString() })
      .eq("id", listing.id);
    onDeactivated?.();
  }

  const posterName = listing.profiles
    ? `${listing.profiles.first_name} ${listing.profiles.last_name[0]}.`
    : "Resident";

  return (
    <div className="group bg-surface-container-low rounded-3xl p-6 transition-all duration-300 hover:bg-surface-container-lowest hover:shadow-xl">
      {/* Image */}
      {listing.images.length > 0 && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover"
          />
          {listing.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-on-surface/60 text-white text-xs px-2 py-1 rounded-full">
              +{listing.images.length - 1} more
            </div>
          )}
        </div>
      )}

      {/* Price */}
      <div className="text-2xl font-headline text-primary mb-1">
        ${listing.price.toLocaleString()}
      </div>

      {/* Title */}
      <h3 className="text-lg font-headline italic text-on-surface mb-2">
        {listing.title}
      </h3>

      {/* Description */}
      <p className="text-on-surface-variant text-sm mb-3 line-clamp-2">
        {listing.description}
      </p>

      {/* Location & Meta */}
      <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
        <Icon name="location_on" className="text-sm text-primary" />
        <span>{listing.location}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <Icon name="person" className="text-sm" />
          {posterName}
        </span>
        <span className="flex items-center gap-1 text-tertiary font-bold">
          <Icon name="schedule" className="text-sm" />
          {timeRemaining(listing.expires_at)}
        </span>
      </div>

      {/* Owner controls */}
      {isOwner && (
        <button
          onClick={handleDeactivate}
          className="mt-4 w-full py-2 text-sm font-bold text-error bg-error-container rounded-xl hover:bg-error hover:text-on-error transition-all"
        >
          Deactivate Listing
        </button>
      )}
    </div>
  );
}
