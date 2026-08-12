// One-off Board chip seeder. Run: npx dotenv -e .env.local -- npx tsx scripts/seed-board.ts
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const CHIPS = [
  {
    key: "water",
    value: "Stage 2",
    note: "Fines $500–$2,000",
    tone: "alert",
    link_url: "/answers/watering-rules-vs-hoa-enforcement",
  },
  {
    key: "roads",
    value: "DNT 4A building",
    note: "Opens late 2027",
    tone: "warn",
    link_url: "/answers/when-does-the-traffic-get-fixed",
  },
  // No "trash" row on purpose: TheBoard computes that chip live from the CWD
  // schedule in src/data/trash.ts; a DB row would freeze it. Pool is left for
  // the admin to set (current reopen status unverified).
];

async function main() {
  for (const c of CHIPS) {
    await sql`INSERT INTO board_status (key, value, note, tone, link_url, updated_at)
      VALUES (${c.key}, ${c.value}, ${c.note}, ${c.tone}, ${c.link_url}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${c.value}, note = ${c.note}, tone = ${c.tone}, link_url = ${c.link_url}, updated_at = NOW()`;
    console.log(`seeded chip ${c.key}`);
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
