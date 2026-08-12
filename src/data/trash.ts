// Sutton Fields trash schedule (Community Waste Disposal via City of Celina).
// Regular pickup: every Monday. Bulk/brush pickup: alternating Mondays below,
// read off the CWD 2026 collection calendar (Sutton Fields = MONDAY zone,
// blue calendar weeks). Provided by the site owner from the printed calendar,
// Aug 2026. Extend this list when CWD publishes the next calendar year.
// The Board's trash chip computes from this; an admin board_status row for
// "trash" overrides it (for holiday shifts like Thanksgiving/Christmas).

export const BULK_PICKUP_MONDAYS = [
  "2026-08-24",
  "2026-09-14",
  "2026-09-28",
  "2026-10-12",
  "2026-10-26",
  "2026-11-09",
  "2026-11-23",
  "2026-12-14",
  "2026-12-28",
];

function centralNow(): Date {
  // Compute "today" in America/Chicago regardless of server timezone.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return new Date(`${parts}T00:00:00Z`);
}

export function getTrashChip(): { value: string; note: string | null; tone: "ok" } {
  const today = centralNow();
  // Next Monday (or today, if today is Monday — pickup day itself).
  const dow = today.getUTCDay(); // 0 Sun .. 6 Sat
  const daysUntilMonday = dow === 1 ? 0 : (8 - dow) % 7;
  const nextPickup = new Date(today);
  nextPickup.setUTCDate(today.getUTCDate() + daysUntilMonday);

  const nextBulk = BULK_PICKUP_MONDAYS.map((d) => new Date(`${d}T00:00:00Z`)).find(
    (d) => d >= today
  );

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  return {
    value: daysUntilMonday === 0 ? "Today (Mon)" : `Mon ${fmt(nextPickup)}`,
    note: nextBulk ? `Bulk: ${fmt(nextBulk)}` : null,
    tone: "ok",
  };
}
