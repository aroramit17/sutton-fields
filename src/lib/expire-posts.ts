import "server-only";
import { and, eq, lte } from "drizzle-orm";
import { getDb } from "@/db";
import { listings, lost_found_posts, carpool_posts } from "@/db/schema";

export async function expireStalePosts() {
  const db = getDb();
  const now = new Date();

  const [expiredListings, expiredLostFound, expiredCarpool] = await Promise.all([
    db
      .update(listings)
      .set({ is_active: false, deactivated_at: now })
      .where(and(eq(listings.is_active, true), lte(listings.expires_at, now)))
      .returning({ id: listings.id }),
    db
      .update(lost_found_posts)
      .set({ is_active: false, deactivated_at: now })
      .where(and(eq(lost_found_posts.is_active, true), lte(lost_found_posts.expires_at, now)))
      .returning({ id: lost_found_posts.id }),
    db
      .update(carpool_posts)
      .set({ is_active: false, deactivated_at: now })
      .where(and(eq(carpool_posts.is_active, true), lte(carpool_posts.expires_at, now)))
      .returning({ id: carpool_posts.id }),
  ]);

  return {
    listings: expiredListings.length,
    lost_found_posts: expiredLostFound.length,
    carpool_posts: expiredCarpool.length,
  };
}
