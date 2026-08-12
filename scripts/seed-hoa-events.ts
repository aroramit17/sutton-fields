// One-off: insert the HOA's announced August 2026 events (from the HOA's
// notice, provided by the site owner). Times are CDT (UTC-5) stored as UTC.
// Run: npx dotenv -e .env.local -- npx tsx scripts/seed-hoa-events.ts
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const EVENTS = [
  {
    title: "Food Truck Friday: So Forkin' Good BBQ",
    description: "So Forkin' Good BBQ at the Amenity Center, 5-8 PM. Grab dinner and meet your neighbors.",
    event_date: "2026-08-14T22:00:00Z", // 5:00 PM CDT
    location: "Amenity Center",
  },
  {
    title: "First Week Fest",
    description:
      "Celebrate the kids finishing their first week of school: DJ, five inflatables and bounce houses, water slide, obstacle course, axe throwing game, photo booth, Halal Subs and Sterling's BBQ, Metroplex Gym, School of Rock, raffles and more. 11 AM to 2 PM.",
    event_date: "2026-08-15T16:00:00Z", // 11:00 AM CDT
    location: "Amenity Center",
  },
];

async function main() {
  for (const e of EVENTS) {
    const existing = await sql`SELECT id FROM events WHERE lower(title) = ${e.title.toLowerCase()}`;
    if (existing.length > 0) {
      console.log(`skip ${e.title}`);
      continue;
    }
    await sql`INSERT INTO events (title, description, event_date, has_time, location, is_published, source)
      VALUES (${e.title}, ${e.description}, ${e.event_date}, true, ${e.location}, true, 'manual')`;
    console.log(`seeded ${e.title}`);
  }
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
