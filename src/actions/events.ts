"use server";

import { and, asc, desc, eq, gte } from "drizzle-orm";
import { getDb } from "@/db";
import { events } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import type { DbEvent } from "@/types/database";

function serialize(e: typeof events.$inferSelect): DbEvent {
  return {
    ...e,
    event_date: e.event_date.toISOString(),
    created_at: e.created_at.toISOString(),
  };
}

export async function getUpcomingEvents(): Promise<DbEvent[]> {
  const db = getDb();
  // Date-only strings (from manual entry or Wilson Weekly extraction) parse
  // as UTC midnight, so "today" must be computed in UTC too — otherwise an
  // event dated "today" can appear already-past depending on server timezone.
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const rows = await db
    .select()
    .from(events)
    .where(and(eq(events.is_published, true), gte(events.event_date, startOfToday)))
    .orderBy(asc(events.event_date));
  return rows.map(serialize);
}

export async function getAllEventsForAdmin(): Promise<DbEvent[]> {
  await requireAdmin();
  const db = getDb();
  const rows = await db.select().from(events).orderBy(desc(events.event_date));
  return rows.map(serialize);
}

export async function createEvent(
  title: string,
  description: string,
  eventDate: string,
  location: string
): Promise<DbEvent> {
  const { userId } = await requireAdmin();
  const db = getDb();
  const [row] = await db
    .insert(events)
    .values({
      title,
      description,
      event_date: new Date(eventDate),
      location: location || null,
      source: "manual",
      created_by: userId,
    })
    .returning();
  return serialize(row);
}

export async function togglePublishEvent(id: string, publish: boolean): Promise<void> {
  await requireAdmin();
  const db = getDb();
  await db.update(events).set({ is_published: publish }).where(eq(events.id, id));
}

export async function deleteEvent(id: string): Promise<void> {
  await requireAdmin();
  const db = getDb();
  await db.delete(events).where(eq(events.id, id));
}
