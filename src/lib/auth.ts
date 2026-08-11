import "server-only";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import type { Profile } from "@/types/database";

export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const db = getDb();
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId));
  if (!profile) return null;
  return { ...profile, created_at: profile.created_at.toISOString() };
}

// Every board's create/update action calls this first — it's the single
// place that re-implements what the old Supabase RLS policies enforced
// ("Approved users can create ...", "Users can update own ...").
export async function requireApprovedProfile(): Promise<{ userId: string; profile: Profile }> {
  const userId = await requireUserId();
  const profile = await getProfile(userId);
  if (!profile?.is_approved) throw new Error("Account pending approval");
  return { userId, profile };
}

export async function requireAdmin(): Promise<{ userId: string; profile: Profile }> {
  const userId = await requireUserId();
  const profile = await getProfile(userId);
  if (!profile?.is_admin) throw new Error("Admin access required");
  return { userId, profile };
}
