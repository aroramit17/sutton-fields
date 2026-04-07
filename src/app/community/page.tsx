import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { AboutSection } from "@/components/community/AboutSection";
import { SchoolInfo } from "@/components/community/SchoolInfo";
import { AmenitiesGrid } from "@/components/community/AmenitiesGrid";
import { NearbyAttractions } from "@/components/community/NearbyAttractions";
import { UtilityGuide } from "@/components/community/UtilityGuide";
import { HoaDocs } from "@/components/community/HoaDocs";
import { ResourceLinks } from "@/components/community/ResourceLinks";
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Community Info — Schools, Amenities, HOA",
  description:
    "Everything about Sutton Fields in Celina, TX: Prosper ISD schools (Dan Christie Elementary on-site), resort-style pools, walking trails, community garden, HOA details, utility providers, and nearby attractions. Developed by Centurion American with 2,289 homes.",
  alternates: { canonical: "https://suttonfields.com/community" },
  openGraph: {
    title: "Sutton Fields Community — Celina, TX Neighborhood Guide",
    description:
      "Schools, amenities, HOA info, utility providers, builders, and nearby attractions for Sutton Fields residents and homebuyers in Celina, Texas.",
  },
};

const communityFaqs = [
  {
    question: "What utilities do I need to set up at Sutton Fields?",
    answer:
      "Electric: CoServ (1-800-274-4104) or GCEC (903-482-5231) depending on your location. Gas: Atmos Energy (1-800-460-3030). Water/Sewer: City of Celina (972-382-2682). Trash: Community Waste Disposal (contracted by City of Celina, weekly pickup). Internet: AT&T Fiber, Spectrum, and others serve the area.",
  },
  {
    question: "Who manages the Sutton Fields HOA?",
    answer:
      "Essex Association Management L.P. manages the Sutton Fields HOA. Office: 4570 Westgrove Drive, Suite 230, Addison, TX 75001. Phone: 972-428-2030. After-hours emergency: 1-888-740-2233. You can pay dues online via ATG Pay or CIT Property Pay.",
  },
  {
    question: "What builders offer homes in Sutton Fields?",
    answer:
      "Sutton Fields features homes from 12+ builders including D.R. Horton, First Texas Homes, Lennar, Mattamy Homes, M/I Homes, Bloomfield Homes, Pacesetter Homes, Sandlin Homes, Stonehollow Homes, Taylor Morrison, Beazer Homes, and William Ryan Homes. Prices range from mid-$500s to high-$800s.",
  },
  {
    question: "Is there a community pool at Sutton Fields?",
    answer:
      "Yes, Sutton Fields has two resort-style swimming pools with cabanas, a dedicated lap pool, and a splash pad for children. The pools are located at the Amenity Center at 4515 Westminster Ave and are open seasonally (May through September).",
  },
  {
    question: "What is the Sutton Fields expansion?",
    answer:
      "Celina City Council approved the annexation and rezoning of 110 acres for a 450-home eastern addition to Sutton Fields. Phase 1 includes 245 lots and Phase 2 includes 205 lots, expanding the community beyond its current 2,289 homes.",
  },
];

export default function CommunityPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", href: "/" },
          { name: "Community", href: "/community" },
        ]}
      />
      <FAQStructuredData faqs={communityFaqs} />

      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full mb-16">
        <PageHeader
          label="Your Neighborhood"
          title="Everything Sutton Fields."
          description="Schools, amenities, builders, utility providers, HOA details, and essential resources — your complete guide to life in Sutton Fields, Celina, TX."
        />
      </div>
      <AboutSection />
      <SchoolInfo />
      <AmenitiesGrid />
      <NearbyAttractions />
      <UtilityGuide />
      <HoaDocs />
      <ResourceLinks />
    </>
  );
}
