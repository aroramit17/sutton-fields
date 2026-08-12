"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { ListingGrid } from "@/components/marketplace/ListingGrid";
import { ListingSearch } from "@/components/marketplace/ListingSearch";
import { LostFoundGrid } from "@/components/lost-found/LostFoundGrid";
import { getActiveListings } from "@/actions/listings";
import { getActiveLostFoundPosts } from "@/actions/lost-found";
import type { ListingWithProfile, LostFoundPostWithProfile } from "@/types/database";

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-surface-container-low rounded-3xl p-6 h-72 animate-pulse" />
      ))}
    </div>
  );
}

function ClassifiedsContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "lost-found" ? "lost-found" : "sale";

  const [listings, setListings] = useState<ListingWithProfile[]>([]);
  const [posts, setPosts] = useState<LostFoundPostWithProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [l, p] = await Promise.all([
      getActiveListings().catch(() => []),
      getActiveLostFoundPosts().catch(() => []),
    ]);
    setListings(l);
    setPosts(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filteredListings = listings.filter((listing) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      listing.title.toLowerCase().includes(q) ||
      listing.description.toLowerCase().includes(q) ||
      listing.location.toLowerCase().includes(q)
    );
  });

  const isSale = tab === "sale";

  return (
    <div className="pb-24 px-6 max-w-7xl mx-auto">
      <PageHeader
        label="Classifieds"
        title={isSale ? "Buy, Sell & Trade" : "Lost & Found"}
        description={
          isSale
            ? "Post items for sale, find deals from your Sutton Fields neighbors, or trade goods right in the community. All listings expire after 48 hours."
            : "Lost a pet or a package? Found something on the trail? Post it here — posts expire automatically."
        }
        ctaLabel={isSale ? "Post a Listing" : "Post Lost & Found"}
        ctaIcon="add_circle"
        ctaHref={isSale ? "/classifieds/new" : "/classifieds/lost-found/new"}
        ctaVariant="gradient"
      />

      {/* Tabs */}
      <div className="mb-8 flex gap-2">
        <Link
          href="/classifieds"
          className={cn(
            "dateline rounded-full border px-4 py-2 !text-sm transition-colors",
            isSale
              ? "border-(--color-section-classifieds) bg-(--color-section-classifieds) !text-white"
              : "border-outline-variant !text-on-surface-variant hover:border-outline"
          )}
        >
          For Sale &amp; Trade
        </Link>
        <Link
          href="/classifieds?tab=lost-found"
          className={cn(
            "dateline rounded-full border px-4 py-2 !text-sm transition-colors",
            !isSale
              ? "border-(--color-section-classifieds) bg-(--color-section-classifieds) !text-white"
              : "border-outline-variant !text-on-surface-variant hover:border-outline"
          )}
        >
          Lost &amp; Found
        </Link>
      </div>

      {isSale ? (
        <>
          <ListingSearch value={searchQuery} onChange={setSearchQuery} />
          {loading ? (
            <SkeletonGrid />
          ) : (
            <ListingGrid listings={filteredListings} onListingDeactivated={fetchAll} />
          )}
        </>
      ) : loading ? (
        <SkeletonGrid />
      ) : (
        <LostFoundGrid posts={posts} onPostDeactivated={fetchAll} />
      )}
    </div>
  );
}

export default function ClassifiedsPage() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <ClassifiedsContent />
    </Suspense>
  );
}
