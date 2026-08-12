"use server";

import { desc, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { dispatch_issues, subscribers } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { assembleDispatch, sendDispatch, type SendResult } from "@/lib/dispatch";

export interface DispatchIssueSummary {
  id: string;
  subject: string;
  sent_at: string | null;
  recipient_count: number;
  failure_count: number;
}

export interface DispatchAdminData {
  subscriberCount: number;
  issues: DispatchIssueSummary[];
}

export async function getDispatchAdminData(): Promise<DispatchAdminData> {
  await requireAdmin();
  const db = getDb();
  const active = await db
    .select({ id: subscribers.id })
    .from(subscribers)
    .where(isNull(subscribers.unsubscribed_at));
  const issues = await db
    .select()
    .from(dispatch_issues)
    .orderBy(desc(dispatch_issues.created_at))
    .limit(20);
  return {
    subscriberCount: active.length,
    issues: issues.map((i) => ({
      id: i.id,
      subject: i.subject,
      sent_at: i.sent_at ? i.sent_at.toISOString() : null,
      recipient_count: i.recipient_count,
      failure_count: i.failure_count,
    })),
  };
}

// Live preview of what this week's issue would contain, with the unsubscribe
// placeholder pointed at the homepage.
export async function previewDispatch(): Promise<{
  subject: string;
  html: string;
  isEmpty: boolean;
}> {
  await requireAdmin();
  const assembled = await assembleDispatch();
  return {
    ...assembled,
    html: assembled.html.replaceAll("{{UNSUB_URL}}", "https://suttonfields.info"),
  };
}

export async function sendTestDispatch(email: string): Promise<SendResult> {
  await requireAdmin();
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalized)) {
    throw new Error("That doesn't look like an email address.");
  }
  return sendDispatch({ testTo: normalized });
}
