"use server";

import { and, desc, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { lost_found_posts, profiles } from "@/db/schema";
import { requireApprovedProfile, requireUserId } from "@/lib/auth";
import type { LostFoundPostWithProfile } from "@/types/database";

export async function getActiveLostFoundPosts(): Promise<LostFoundPostWithProfile[]> {
  const db = getDb();
  const rows = await db
    .select({
      post: lost_found_posts,
      first_name: profiles.first_name,
      last_name: profiles.last_name,
    })
    .from(lost_found_posts)
    .leftJoin(profiles, eq(lost_found_posts.user_id, profiles.id))
    .where(and(eq(lost_found_posts.is_active, true), gt(lost_found_posts.expires_at, new Date())))
    .orderBy(desc(lost_found_posts.created_at));

  return rows.map(({ post, first_name, last_name }) => ({
    ...post,
    created_at: post.created_at.toISOString(),
    expires_at: post.expires_at.toISOString(),
    deactivated_at: post.deactivated_at?.toISOString() ?? null,
    profiles: first_name ? { first_name, last_name: last_name! } : null,
  }));
}

export async function createLostFoundPost(input: {
  status: "lost" | "found";
  title: string;
  description: string;
  location: string;
  images: string[];
}) {
  const { userId } = await requireApprovedProfile();
  const db = getDb();
  await db.insert(lost_found_posts).values({
    user_id: userId,
    status: input.status,
    title: input.title,
    description: input.description,
    location: input.location,
    images: input.images,
    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });
}

export async function deactivateLostFoundPost(postId: string) {
  const userId = await requireUserId();
  const db = getDb();
  await db
    .update(lost_found_posts)
    .set({ is_active: false, deactivated_at: new Date() })
    .where(and(eq(lost_found_posts.id, postId), eq(lost_found_posts.user_id, userId)));
}
