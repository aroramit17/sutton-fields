"use client";

import type { ListingWithProfile } from "@/types/database";
import { ListingCard } from "./ListingCard";

interface ListingGridProps {
  listings: ListingWithProfile[];
  onListingDeactivated?: () => void;
}

export function ListingGrid({ listings, onListingDeactivated }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-on-surface-variant text-lg">
          No active listings right now. Be the first to post!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onDeactivated={onListingDeactivated}
        />
      ))}
    </div>
  );
}
