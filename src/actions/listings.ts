"use server";

import { and, desc, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { listings, profiles } from "@/db/schema";
import { requireApprovedProfile, requireUserId } from "@/lib/auth";
import type { ListingWithProfile } from "@/types/database";

export async function getActiveListings(): Promise<ListingWithProfile[]> {
  const db = getDb();
  const rows = await db
    .select({
      listing: listings,
      first_name: profiles.first_name,
      last_name: profiles.last_name,
    })
    .from(listings)
    .leftJoin(profiles, eq(listings.user_id, profiles.id))
    .where(and(eq(listings.is_active, true), gt(listings.expires_at, new Date())))
    .orderBy(desc(listings.created_at));

  return rows.map(({ listing, first_name, last_name }) => ({
    ...listing,
    price: Number(listing.price),
    created_at: listing.created_at.toISOString(),
    expires_at: listing.expires_at.toISOString(),
    deactivated_at: listing.deactivated_at?.toISOString() ?? null,
    profiles: first_name ? { first_name, last_name: last_name! } : null,
  }));
}

export async function createListing(input: {
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
}) {
  const { userId } = await requireApprovedProfile();
  const db = getDb();
  await db.insert(listings).values({
    user_id: userId,
    title: input.title,
    description: input.description,
    price: input.price.toString(),
    location: input.location,
    images: input.images,
    expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000),
  });
}

export async function deactivateListing(listingId: string) {
  const userId = await requireUserId();
  const db = getDb();
  await db
    .update(listings)
    .set({ is_active: false, deactivated_at: new Date() })
    .where(and(eq(listings.id, listingId), eq(listings.user_id, userId)));
}
