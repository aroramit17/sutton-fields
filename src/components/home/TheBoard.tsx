import { getBoardStatus, type BoardChip, type BoardKey } from "@/actions/board";
import { getNextSchoolEvent } from "@/actions/events";
import { StatusChip } from "@/components/ui/StatusChip";
import { getTrashChip } from "@/data/trash";

const CHIP_ORDER: { key: BoardKey; label: string }[] = [
  { key: "pool", label: "Pool" },
  { key: "trash", label: "Trash" },
  { key: "water", label: "Water" },
  { key: "roads", label: "Roads" },
];

function fallback(key: BoardKey): Pick<BoardChip, "value" | "tone" | "note"> {
  // Trash is deterministic (every Monday + published bulk calendar), so its
  // default is computed rather than "unknown"; an admin row still overrides
  // it for holiday-shift weeks.
  if (key === "trash") return getTrashChip();
  return {
    value: "Status unknown",
    tone: "unknown",
    note: key === "pool" ? "Check the HOA portal" : null,
  };
}

/** The homepage utility strip: the glance-and-go layer. */
export async function TheBoard() {
  const [status, schoolEvent] = await Promise.all([
    getBoardStatus().catch(() => ({}) as Awaited<ReturnType<typeof getBoardStatus>>),
    getNextSchoolEvent().catch(() => null),
  ]);

  return (
    <section aria-label="Neighborhood status" className="border-b border-outline-variant bg-surface-container-low">
      <div className="mx-auto flex max-w-7xl items-center gap-2.5 overflow-x-auto px-4 py-3 scrollbar-none sm:px-8">
        {CHIP_ORDER.map(({ key, label }) => {
          const chip = status[key];
          const data = chip ?? fallback(key);
          return (
            <StatusChip
              key={key}
              label={label}
              value={data.value}
              tone={data.tone}
              note={data.note}
              href={chip?.link_url ?? undefined}
            />
          );
        })}
        {schoolEvent && (
          <StatusChip
            label="School"
            value={`${new Date(schoolEvent.event_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })} · ${schoolEvent.title}`}
            tone="ok"
            href="/events"
          />
        )}
      </div>
    </section>
  );
}
