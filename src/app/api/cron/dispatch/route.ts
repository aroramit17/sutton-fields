import { NextRequest, NextResponse } from "next/server";
import { sendDispatch } from "@/lib/dispatch";

// Thursday 23:00 UTC (6 PM Central during daylight time) via vercel.json.
// sendDispatch is idempotent (one issue per 6 days), so a manual re-trigger
// or a double-fire cannot double-send.
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await sendDispatch();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
