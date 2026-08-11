"use server";

import { and, desc, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { carpool_posts, profiles } from "@/db/schema";
import { requireApprovedProfile, requireUserId } from "@/lib/auth";
import type { CarpoolPostWithProfile } from "@/types/database";

export async function getActiveCarpoolPosts(): Promise<CarpoolPostWithProfile[]> {
  const db = getDb();
  const rows = await db
    .select({
      post: carpool_posts,
      first_name: profiles.first_name,
      last_name: profiles.last_name,
    })
    .from(carpool_posts)
    .leftJoin(profiles, eq(carpool_posts.user_id, profiles.id))
    .where(and(eq(carpool_posts.is_active, true), gt(carpool_posts.expires_at, new Date())))
    .orderBy(desc(carpool_posts.created_at));

  return rows.map(({ post, first_name, last_name }) => ({
    ...post,
    created_at: post.created_at.toISOString(),
    expires_at: post.expires_at.toISOString(),
    deactivated_at: post.deactivated_at?.toISOString() ?? null,
    profiles: first_name ? { first_name, last_name: last_name! } : null,
  }));
}

export async function createCarpoolPost(input: {
  title: string;
  description: string;
  destination: string;
  schedule: string;
}) {
  const { userId } = await requireApprovedProfile();
  const db = getDb();
  await db.insert(carpool_posts).values({
    user_id: userId,
    title: input.title,
    description: input.description,
    destination: input.destination,
    schedule: input.schedule,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function deactivateCarpoolPost(postId: string) {
  const userId = await requireUserId();
  const db = getDb();
  await db
    .update(carpool_posts)
    .set({ is_active: false, deactivated_at: new Date() })
    .where(and(eq(carpool_posts.id, postId), eq(carpool_posts.user_id, userId)));
}
