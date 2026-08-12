"use server";

import { eq, isNull, and } from "drizzle-orm";
import { getDb } from "@/db";
import { subscribers } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function subscribe(
  email: string
): Promise<{ ok: boolean; error?: string }> {
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_RE.test(normalized)) {
    return { ok: false, error: "That doesn't look like an email address." };
  }
  const db = getDb();
  // Re-subscribing after an unsubscribe should just work; duplicates are a no-op.
  await db
    .insert(subscribers)
    .values({ email: normalized })
    .onConflictDoUpdate({
      target: subscribers.email,
      set: { unsubscribed_at: null },
    });
  return { ok: true };
}

export async function unsubscribe(token: string): Promise<boolean> {
  const db = getDb();
  const result = await db
    .update(subscribers)
    .set({ unsubscribed_at: new Date() })
    .where(eq(subscribers.unsubscribe_token, token))
    .returning({ id: subscribers.id });
  return result.length > 0;
}

export async function getSubscriberCount(): Promise<number> {
  await requireAdmin();
  const db = getDb();
  const rows = await db
    .select({ id: subscribers.id })
    .from(subscribers)
    .where(and(isNull(subscribers.unsubscribed_at)));
  return rows.length;
}
