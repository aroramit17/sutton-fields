import { NextRequest, NextResponse } from "next/server";
import { expireStalePosts } from "@/lib/expire-posts";

// Standalone route kept for manual/debug triggering. The scheduled Vercel
// Cron entry hits /api/cron/nightly instead, which calls this same logic
// alongside the other nightly jobs — Vercel's Hobby plan caps the number of
// distinct scheduled cron jobs, so everything nightly is consolidated there.
export async function GET(request: NextRequest) {
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const deactivated = await expireStalePosts();
  return NextResponse.json({ deactivated });
}
