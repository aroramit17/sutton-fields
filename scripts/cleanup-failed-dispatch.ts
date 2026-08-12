// Removes dispatch_issues rows that delivered to zero recipients (failed
// sends). A zero-delivery row still trips the one-issue-per-6-days guard and
// blocks the next real send, so it has to go. Rows with any deliveries are
// never touched. Run with:
//   npx dotenv -e .env.local -- npx tsx scripts/cleanup-failed-dispatch.ts
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { dispatch_issues } from "../src/db/schema";

async function main() {
  const db = getDb();
  const deleted = await db
    .delete(dispatch_issues)
    .where(eq(dispatch_issues.recipient_count, 0))
    .returning({ id: dispatch_issues.id, subject: dispatch_issues.subject });
  for (const row of deleted) console.log("Removed failed issue:", row.subject);
  console.log("Done:", deleted.length, "row(s) removed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
