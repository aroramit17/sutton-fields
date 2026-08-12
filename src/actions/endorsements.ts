"use server";

import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { vendor_endorsements } from "@/db/schema";
import { requireApprovedProfile, requireUserId } from "@/lib/auth";

export interface EndorsementSummary {
  count: number;
  latest: string | null; // ISO date of most recent endorsement
  endorsedByMe: boolean;
}

export async function getEndorsements(
  currentUserId?: string
): Promise<Record<string, EndorsementSummary>> {
  const db = getDb();
  const rows = await db
    .select()
    .from(vendor_endorsements)
    .orderBy(desc(vendor_endorsements.created_at));

  const map: Record<string, EndorsementSummary> = {};
  for (const r of rows) {
    if (!map[r.vendor_id]) {
      map[r.vendor_id] = { count: 0, latest: r.created_at.toISOString(), endorsedByMe: false };
    }
    map[r.vendor_id].count++;
    if (currentUserId && r.profile_id === currentUserId) {
      map[r.vendor_id].endorsedByMe = true;
    }
  }
  return map;
}

export async function getMyEndorsementContext(): Promise<{
  userId: string | null;
  endorsements: Record<string, EndorsementSummary>;
}> {
  let userId: string | null = null;
  try {
    userId = await requireUserId();
  } catch {
    userId = null;
  }
  return { userId, endorsements: await getEndorsements(userId ?? undefined) };
}

export async function endorseVendor(vendorId: string): Promise<void> {
  const { userId } = await requireApprovedProfile();
  const db = getDb();
  await db
    .insert(vendor_endorsements)
    .values({ vendor_id: vendorId, profile_id: userId })
    .onConflictDoNothing();
}

export async function unendorseVendor(vendorId: string): Promise<void> {
  const { userId } = await requireApprovedProfile();
  const db = getDb();
  await db
    .delete(vendor_endorsements)
    .where(
      and(
        eq(vendor_endorsements.vendor_id, vendorId),
        eq(vendor_endorsements.profile_id, userId)
      )
    );
}
