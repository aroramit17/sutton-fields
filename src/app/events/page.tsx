import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeaturedEvent } from "@/components/events/FeaturedEvent";
import { WeekEventList } from "@/components/events/WeekEventList";
import { HoaMeetingSidebar } from "@/components/events/HoaMeetingSidebar";
import { UpcomingSocials } from "@/components/events/UpcomingSocials";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Community Events | Sutton Fields",
  description:
    "Discover local gatherings, seasonal celebrations, and essential meetings that define the heart of Sutton Fields.",
};

export default function EventsPage() {
  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
      <PageHeader
        label="Community Calendar"
        title="The Community Calendar"
        description="Discover local gatherings, seasonal celebrations, and essential meetings that define the heart of Sutton Fields."
        ctaLabel="Add an Event"
        ctaIcon="add_circle"
        ctaHref="/events/new"
        ctaVariant="gradient"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Content */}
        <section className="md:col-span-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-headline italic text-on-surface">
              This Week
            </h2>
            <Badge variant="tag">Featured</Badge>
          </div>
          <FeaturedEvent />
          <WeekEventList />
        </section>

        {/* Sidebar */}
        <aside className="md:col-span-4 flex flex-col gap-12">
          <HoaMeetingSidebar />
          <UpcomingSocials />
        </aside>
      </div>
    </div>
  );
}
