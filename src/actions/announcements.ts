"use server";

import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { announcements } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import type { Announcement } from "@/types/database";

function serialize(a: typeof announcements.$inferSelect): Announcement {
  return { ...a, created_at: a.created_at.toISOString() };
}

export async function getActiveAnnouncement(): Promise<Announcement | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.is_active, true))
    .orderBy(desc(announcements.created_at))
    .limit(1);
  return row ? serialize(row) : null;
}

export async function getAllAnnouncementsForAdmin(): Promise<Announcement[]> {
  await requireAdmin();
  const db = getDb();
  const rows = await db.select().from(announcements).orderBy(desc(announcements.created_at));
  return rows.map(serialize);
}

export async function createAnnouncement(
  message: string,
  linkUrl: string,
  linkLabel: string
): Promise<Announcement> {
  const { userId } = await requireAdmin();
  const db = getDb();
  // Only one banner should show at a time, so a new one takes over immediately.
  await db.update(announcements).set({ is_active: false }).where(eq(announcements.is_active, true));
  const [row] = await db
    .insert(announcements)
    .values({
      message,
      link_url: linkUrl || null,
      link_label: linkLabel || null,
      is_active: true,
      created_by: userId,
    })
    .returning();
  return serialize(row);
}

export async function setActiveAnnouncement(id: string): Promise<void> {
  await requireAdmin();
  const db = getDb();
  await db.update(announcements).set({ is_active: false }).where(eq(announcements.is_active, true));
  await db.update(announcements).set({ is_active: true }).where(eq(announcements.id, id));
}

export async function deactivateAnnouncement(id: string): Promise<void> {
  await requireAdmin();
  const db = getDb();
  await db.update(announcements).set({ is_active: false }).where(eq(announcements.id, id));
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await requireAdmin();
  const db = getDb();
  await db.delete(announcements).where(eq(announcements.id, id));
}
