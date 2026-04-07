"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ListingGrid } from "@/components/marketplace/ListingGrid";
import { ListingSearch } from "@/components/marketplace/ListingSearch";
import { createClient } from "@/lib/supabase/client";
import type { ListingWithProfile } from "@/types/database";

export default function BuySellTradePage() {
  const [listings, setListings] = useState<ListingWithProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("listings")
      .select("*, profiles(first_name, last_name)")
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    setListings((data as ListingWithProfile[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const filteredListings = listings.filter((listing) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      listing.title.toLowerCase().includes(q) ||
      listing.description.toLowerCase().includes(q) ||
      listing.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pb-24 px-6 max-w-7xl mx-auto">
      <PageHeader
        label="Neighborhood Marketplace"
        title="Buy, Sell & Trade"
        description="Post items for sale, find deals from your Sutton Fields neighbors, or trade goods right in the community. All listings expire after 48 hours."
        ctaLabel="Post a Listing"
        ctaIcon="add_circle"
        ctaHref="/buy-sell-trade/new"
        ctaVariant="gradient"
      />

      <ListingSearch value={searchQuery} onChange={setSearchQuery} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-container-low rounded-3xl p-6 h-72 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <ListingGrid
          listings={filteredListings}
          onListingDeactivated={fetchListings}
        />
      )}
    </div>
  );
}
