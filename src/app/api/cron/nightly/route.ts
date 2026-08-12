import { NextRequest, NextResponse } from "next/server";
import { expireStalePosts } from "@/lib/expire-posts";
import { scanWilsonWeeklyInbox } from "@/lib/wilson-weekly";
import { scanForLocalNews } from "@/lib/news-scan";
import { checkStaleAnswers } from "@/lib/stale-answers";

// The single scheduled entry in vercel.json — Vercel's Hobby plan caps the
// number of distinct cron jobs, so every nightly task runs from here instead
// of each having its own schedule. Each task is independent and reports its
// own error rather than aborting the others.
//
// maxDuration is set to the Hobby plan's ceiling since this can involve
// several sequential OpenAI calls (vision batches, web search, image gen).
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const results: Record<string, unknown> = {};

  try {
    results.expire = await expireStalePosts();
  } catch (err) {
    results.expire = { error: err instanceof Error ? err.message : "Unknown error" };
  }

  try {
    results.wilsonWeekly = await scanWilsonWeeklyInbox();
  } catch (err) {
    results.wilsonWeekly = { error: err instanceof Error ? err.message : "Unknown error" };
  }

  try {
    results.newsScan = await scanForLocalNews();
  } catch (err) {
    results.newsScan = { error: err instanceof Error ? err.message : "Unknown error" };
  }

  try {
    results.staleAnswers = await checkStaleAnswers();
  } catch (err) {
    results.staleAnswers = { error: err instanceof Error ? err.message : "Unknown error" };
  }

  return NextResponse.json(results);
}
