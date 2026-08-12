import { and, eq, lt } from "drizzle-orm";
import { getDb } from "@/db";
import { answers } from "@/db/schema";

const STALE_AFTER_DAYS = 90;

// The staleness sentinel: visible staleness is the #1 killer of community
// sites, so the nightly cron surfaces published answers whose last_verified_at
// is older than 90 days. They show amber in /admin/answers and in the cron's
// result JSON; re-verifying (or correcting) them resets the clock.
export async function checkStaleAnswers(): Promise<{
  staleAnswers: { slug: string; question: string; lastVerified: string }[];
}> {
  const db = getDb();
  const cutoff = new Date(Date.now() - STALE_AFTER_DAYS * 86400000);
  const rows = await db
    .select({
      slug: answers.slug,
      question: answers.question,
      last_verified_at: answers.last_verified_at,
    })
    .from(answers)
    .where(and(eq(answers.is_published, true), lt(answers.last_verified_at, cutoff)));

  return {
    staleAnswers: rows.map((r) => ({
      slug: r.slug,
      question: r.question,
      lastVerified: r.last_verified_at.toISOString(),
    })),
  };
}
