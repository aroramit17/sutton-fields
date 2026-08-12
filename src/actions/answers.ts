"use server";

import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { answers } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export type AnswerCategory = "money" | "schools" | "roads" | "hoa" | "living";

export interface AnswerSource {
  title: string;
  url: string;
  date: string; // human-readable, e.g. "May 2026"
}

export interface Answer {
  id: string;
  slug: string;
  question: string;
  answer: string;
  category: AnswerCategory;
  sources: AnswerSource[];
  last_verified_at: string;
  is_published: boolean;
  created_at: string;
}

function serialize(row: typeof answers.$inferSelect): Answer {
  let sources: AnswerSource[] = [];
  try {
    sources = JSON.parse(row.sources);
  } catch {
    sources = [];
  }
  return {
    ...row,
    sources,
    last_verified_at: row.last_verified_at.toISOString(),
    created_at: row.created_at.toISOString(),
  };
}

export async function getPublishedAnswers(): Promise<Answer[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(answers)
    .where(eq(answers.is_published, true))
    .orderBy(asc(answers.category), desc(answers.last_verified_at));
  return rows.map(serialize);
}

export async function getAnswerBySlug(slug: string): Promise<Answer | null> {
  const db = getDb();
  const [row] = await db.select().from(answers).where(eq(answers.slug, slug)).limit(1);
  if (!row || !row.is_published) return null;
  return serialize(row);
}

export async function getAllAnswersForAdmin(): Promise<Answer[]> {
  await requireAdmin();
  const db = getDb();
  const rows = await db.select().from(answers).orderBy(asc(answers.category), asc(answers.slug));
  return rows.map(serialize);
}

export interface AnswerInput {
  slug: string;
  question: string;
  answer: string;
  category: AnswerCategory;
  sources: AnswerSource[];
  is_published: boolean;
}

export async function createAnswer(input: AnswerInput): Promise<Answer> {
  await requireAdmin();
  const db = getDb();
  const [row] = await db
    .insert(answers)
    .values({ ...input, sources: JSON.stringify(input.sources) })
    .returning();
  return serialize(row);
}

// `verified` marks the content as re-checked today; edits without it keep the
// old verification date so the badge never overstates freshness.
export async function updateAnswer(
  id: string,
  input: AnswerInput,
  verified: boolean
): Promise<Answer> {
  await requireAdmin();
  const db = getDb();
  const [row] = await db
    .update(answers)
    .set({
      ...input,
      sources: JSON.stringify(input.sources),
      ...(verified ? { last_verified_at: new Date() } : {}),
    })
    .where(eq(answers.id, id))
    .returning();
  return serialize(row);
}

export async function togglePublishAnswer(id: string, publish: boolean): Promise<void> {
  await requireAdmin();
  const db = getDb();
  await db.update(answers).set({ is_published: publish }).where(eq(answers.id, id));
}

export async function deleteAnswer(id: string): Promise<void> {
  await requireAdmin();
  const db = getDb();
  await db.delete(answers).where(eq(answers.id, id));
}
