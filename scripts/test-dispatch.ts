// One-off: assemble this week's Dispatch and send a test issue to the address
// given as argv[2]. Creates no issue row. Run with:
//   npx dotenv -e .env.local -- npx tsx scripts/test-dispatch.ts you@example.com
import { assembleDispatch, sendDispatch } from "../src/lib/dispatch";

async function main() {
  const to = process.argv[2];
  const assembled = await assembleDispatch();
  console.log("Subject:", assembled.subject);
  console.log("HTML bytes:", assembled.html.length, "| isEmpty:", assembled.isEmpty);
  if (!to) {
    console.log("No address given; assembly-only run.");
    return;
  }
  const result = await sendDispatch({ testTo: to });
  console.log("Send result:", result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
