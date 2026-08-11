"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { getProfile } from "@/lib/auth";
import type { Profile } from "@/types/database";

export async function getMyProfile(): Promise<Profile | null> {
  const { userId } = await auth();
  if (!userId) return null;
  return getProfile(userId);
}

// Called from /join once the user has a Clerk account but no resident
// profile yet — replaces the old Supabase signUp() flow. is_approved stays
// false until an admin flips it (see admin/news pattern for the same gate).
export async function createProfile(address: string): Promise<Profile> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const existing = await getProfile(userId);
  if (existing) return existing;

  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const db = getDb();
  await db
    .insert(profiles)
    .values({
      id: userId,
      first_name: user.firstName || "Resident",
      last_name: user.lastName || "",
      email: user.primaryEmailAddress?.emailAddress || "",
      address,
      is_approved: false,
      is_admin: false,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { address },
    });

  return (await getProfile(userId))!;
}
