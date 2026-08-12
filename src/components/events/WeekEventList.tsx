import { getUpcomingEvents } from "@/actions/events";
import { Icon } from "@/components/ui/Icon";

export async function WeekEventList({ limit }: { limit?: number } = {}) {
  const allEvents = await getUpcomingEvents();
  const events = limit ? allEvents.slice(0, limit) : allEvents;

  if (events.length === 0) {
    return (
      <p className="text-on-surface-variant text-sm py-8 text-center">
        No upcoming events yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, i) => {
        const date = new Date(event.event_date);
        // Timed events are stored as real instants and must render in Central
        // time (the server runs UTC); date-only events are stored as UTC
        // midnight and must render in UTC or they'd show the previous day.
        const tz = event.has_time ? "America/Chicago" : "UTC";
        return (
          <div
            key={event.id}
            className={`p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group ${
              i % 2 === 0
                ? "bg-surface-container-lowest hover:shadow-md transition-shadow"
                : "bg-surface-container-low hover:bg-surface-container transition-colors"
            }`}
          >
            <div className="flex gap-6 items-center">
              <div className="text-primary font-headline text-2xl w-12 text-center">
                {date.toLocaleDateString("en-US", { day: "numeric", timeZone: tz })}
                <span className="block text-xs uppercase font-bold text-on-surface-variant font-body">
                  {date.toLocaleDateString("en-US", { weekday: "short", timeZone: tz })}
                </span>
              </div>
              <div>
                <h4 className="font-headline text-xl text-on-surface group-hover:text-primary transition-colors">
                  {event.title}
                </h4>
                <p className="text-on-surface-variant text-sm">
                  {event.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-sm text-on-surface-variant">
                {date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: tz })}
                {event.has_time && (
                  <>
                    {" • "}
                    {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz })}
                  </>
                )}
                {event.location ? ` • ${event.location}` : ""}
              </span>
              {event.source === "wilson_weekly" && (
                <span className="text-xs text-secondary mt-1">From Wilson Weekly</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
