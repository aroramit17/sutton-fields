import { NextRequest, NextResponse } from "next/server";
import { scanWilsonWeeklyInbox } from "@/lib/wilson-weekly";

// Standalone route kept for manual/debug triggering — the scheduled Vercel
// Cron entry hits /api/cron/nightly instead (see that route for why).
// Idempotent: wilson_weekly_processed tracks which AgentMail messages have
// already been scanned, so re-running this on the same email is a no-op.
export async function GET(request: NextRequest) {
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await scanWilsonWeeklyInbox();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Wilson Weekly scan failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
