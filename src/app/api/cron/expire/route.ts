import { NextRequest, NextResponse } from "next/server";
import { and, eq, lte } from "drizzle-orm";
import { getDb } from "@/db";
import { listings, lost_found_posts, carpool_posts } from "@/db/schema";

// Replaces the old pg_cron jobs (Neon has no pg_cron). Scheduled via
// vercel.json — daily, the max frequency on the Vercel Hobby plan. This is
// just housekeeping: every read query already filters on expires_at, so
// expired posts stop appearing immediately regardless of cron cadence.
export async function GET(request: NextRequest) {
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

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

  return NextResponse.json({
    deactivated: {
      listings: expiredListings.length,
      lost_found_posts: expiredLostFound.length,
      carpool_posts: expiredCarpool.length,
    },
  });
}
