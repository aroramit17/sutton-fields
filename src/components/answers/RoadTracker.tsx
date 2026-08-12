import { getRoadProjects } from "@/actions/roads";

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });
}

/** Per-project status table on the "when does the traffic get fixed" answer. */
export async function RoadTracker() {
  const projects = await getRoadProjects().catch(() => []);
  if (projects.length === 0) return null;

  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-outline-variant">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="bg-surface-container-low text-left">
            <th className="dateline px-4 py-3">Project</th>
            <th className="dateline px-4 py-3">Status</th>
            <th className="dateline px-4 py-3">ETA</th>
            <th className="dateline px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id} className="border-t border-outline-variant align-top">
              <td className="px-4 py-3">
                <span className="font-semibold text-on-surface">{p.name}</span>
                {p.detail && (
                  <span className="block text-xs text-on-surface-variant">{p.detail}</span>
                )}
              </td>
              <td className="px-4 py-3 text-on-surface">{p.status}</td>
              <td className="px-4 py-3 font-semibold text-on-surface">{p.eta_text}</td>
              <td className="px-4 py-3 text-on-surface-variant">
                {p.source_url ? (
                  <a
                    href={p.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    {fmt(p.last_updated)}
                  </a>
                ) : (
                  fmt(p.last_updated)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
