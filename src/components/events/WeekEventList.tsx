import { weekEvents } from "@/data/events";
import { Icon } from "@/components/ui/Icon";

export function WeekEventList() {
  return (
    <div className="space-y-4">
      {weekEvents.map((event, i) => (
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
              {event.dayOfMonth}
              <span className="block text-xs uppercase font-bold text-on-surface-variant font-body">
                {event.dayOfWeek}
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
              {event.time} &bull; {event.location}
            </span>
            <button className="text-primary font-bold text-xs mt-2 flex items-center gap-1 uppercase tracking-wider">
              Details <Icon name="arrow_forward" className="text-sm" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
