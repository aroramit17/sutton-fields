import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SchoolInfo } from "@/components/community/SchoolInfo";
import { AmenitiesGrid } from "@/components/community/AmenitiesGrid";
import { HoaDocs } from "@/components/community/HoaDocs";
import { ResourceLinks } from "@/components/community/ResourceLinks";

export const metadata: Metadata = {
  title: "Community | Sutton Fields",
  description:
    "Everything you need to know about Sutton Fields — schools, amenities, HOA documents, and community resources.",
};

export default function CommunityPage() {
  return (
    <>
      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full mb-16">
        <PageHeader
          label="Your Neighborhood"
          title="Everything Sutton Fields."
          description="Schools, amenities, HOA documents, and essential resources — all in one place for our community."
        />
      </div>
      <SchoolInfo />
      <AmenitiesGrid />
      <HoaDocs />
      <ResourceLinks />
    </>
  );
}
