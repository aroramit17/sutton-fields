import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

// Events are inserted directly by the nightly Wilson Weekly cron job, outside
// any request Next.js can hook a revalidation trigger into — force dynamic
// rendering so new events show up without waiting for a redeploy.
export const dynamic = "force-dynamic";
import { WeekEventList } from "@/components/events/WeekEventList";
import { BreadcrumbStructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Events & Community Calendar",
  description:
    "Sutton Fields community events in Celina, TX: HOA socials, school dates, food trucks, and neighborhood gatherings at the Amenity Center and around the community.",
  alternates: { canonical: "https://suttonfields.info/events" },
  openGraph: {
    title: "Sutton Fields Events: Community Calendar in Celina, TX",
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
          title="What's happening in Sutton Fields."
          description="HOA socials, school dates, food trucks, and neighborhood gatherings. School events flow in automatically from the Wilson Weekly newsletter; know of something missing? Post it in the Facebook group and it will get picked up."
        />
        <WeekEventList />
      </div>
    </>
  );
}
