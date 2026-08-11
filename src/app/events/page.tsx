import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

// Events are inserted directly by the nightly Wilson Weekly cron job, outside
// any request Next.js can hook a revalidation trigger into — force dynamic
// rendering so new events show up without waiting for a redeploy.
export const dynamic = "force-dynamic";
import { FeaturedEvent } from "@/components/events/FeaturedEvent";
import { WeekEventList } from "@/components/events/WeekEventList";
import { HoaMeetingSidebar } from "@/components/events/HoaMeetingSidebar";
import { UpcomingSocials } from "@/components/events/UpcomingSocials";
import { Badge } from "@/components/ui/Badge";
import { BreadcrumbStructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Events & Community Calendar",
  description:
    "Sutton Fields community events in Celina, TX — pool parties, run clubs, garden meetups, HOA board meetings, and neighborhood socials. See what's happening at the Amenity Center and around the community.",
  alternates: { canonical: "https://suttonfields.info/events" },
  openGraph: {
    title: "Sutton Fields Events — Community Calendar in Celina, TX",
    description:
      "Upcoming events, HOA meetings, and neighborhood socials at Sutton Fields in Celina, Texas.",
  },
};

export default function EventsPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", href: "/" },
          { name: "Events", href: "/events" },
        ]}
      />
      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
        <PageHeader
          label="Community Calendar"
          title="The Community Calendar"
          description="Discover local gatherings, seasonal celebrations, and essential meetings at Sutton Fields in Celina, TX."
          ctaLabel="Add an Event"
          ctaIcon="add_circle"
          ctaHref="/events/new"
          ctaVariant="gradient"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <section className="md:col-span-8 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-headline italic text-on-surface">
                Featured
              </h2>
              <Badge variant="tag">Featured</Badge>
            </div>
            <FeaturedEvent />

            <h2 className="text-3xl font-headline italic text-on-surface">
              Upcoming Events
            </h2>
            <WeekEventList />
          </section>

          <aside className="md:col-span-4 flex flex-col gap-12">
            <HoaMeetingSidebar />
            <UpcomingSocials />
          </aside>
        </div>
      </div>
    </>
  );
}
