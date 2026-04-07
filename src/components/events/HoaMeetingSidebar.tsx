import { hoaMeeting } from "@/data/events";
import { Icon } from "@/components/ui/Icon";

export function HoaMeetingSidebar() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Icon name="gavel" className="text-tertiary" />
        <h2 className="text-2xl font-headline italic text-on-surface">
          HOA Meetings
        </h2>
      </div>
      <div className="bg-tertiary/5 p-8 rounded-3xl border border-tertiary/10">
        <div className="mb-6">
          <span className="text-tertiary font-bold text-xs uppercase tracking-widest block mb-2">
            Next Meeting
          </span>
          <h4 className="font-headline text-2xl text-on-surface mb-2">
            {hoaMeeting.title}
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {hoaMeeting.description}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-3 text-on-surface">
            <Icon name="calendar_today" className="text-tertiary text-lg" />
            {hoaMeeting.date}
          </div>
          <div className="flex items-center gap-3 text-on-surface">
            <Icon name="schedule" className="text-tertiary text-lg" />
            {hoaMeeting.timeRange}
          </div>
          <div className="flex items-center gap-3 text-on-surface">
            <Icon name="videocam" className="text-tertiary text-lg" />
            {hoaMeeting.format}
          </div>
        </div>
        <button className="mt-8 w-full py-3 bg-surface-container-lowest text-tertiary border border-tertiary/20 rounded-xl font-bold text-sm hover:bg-tertiary hover:text-on-tertiary transition-all">
          View Agenda
        </button>
      </div>
    </section>
  );
}
