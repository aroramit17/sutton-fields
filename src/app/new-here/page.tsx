import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { newcomerSteps } from "@/data/newcomer";
import { spotlight } from "@/data/home";
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
  title: "New Here?: The Sutton Fields Starter Guide",
  description:
    "Moving to Sutton Fields in Celina, TX? Schools (Prosper ISD, Dan Christie Elementary on-site), amenities, HOA details, utility setup, builders, and everything else newcomers and homebuyers need in one place.",
  alternates: { canonical: "https://suttonfields.info/new-here" },
  openGraph: {
    title: "New to Sutton Fields? Start Here: Celina, TX",
    description:
      "The starter guide for Sutton Fields newcomers and homebuyers: schools, amenities, HOA, utilities, and neighborhood resources.",
  },
};

const newHereFaqs = [
  {
    question: "What utilities do I need to set up at Sutton Fields?",
    answer:
      "Electric: CoServ (1-800-274-4014) or GCEC (903-482-7100) depending on your location. Gas: Atmos Energy (1-800-460-3030). Water/Sewer: City of Celina (945-362-9001). Trash: Community Waste Disposal (contracted by City of Celina, weekly pickup). Internet: AT&T Fiber, Nextlink fiber, and others serve the area.",
  },
  {
    question: "Who manages the Sutton Fields HOA?",
    answer:
      "Essex Association Management L.P. manages the Sutton Fields HOA. Office: 4570 Westgrove Drive, Suite 230, Addison, TX 75001. Phone: 972-428-2030. After-hours emergency: 1-888-740-2233. You can pay dues online via the resident portal.",
  },
  {
    question: "What builders offer homes in Sutton Fields?",
    answer:
      "Sutton Fields features homes from builders including First Texas Homes, Lennar, Mattamy Homes, M/I Homes, Bloomfield Homes, Pacesetter Homes, Sandlin Homes, Stonehollow Homes, and, in earlier phases, D.R. Horton and Beazer Homes, roughly 2,350 homes planned at buildout.",
  },
  {
    question: "Is there a community pool at Sutton Fields?",
    answer:
      "Yes, two resort-style swimming pools with cabanas, a dedicated lap pool, and a splash pad, centered on the Amenity Center at 4515 Westminster Ave (open seasonally). A second amenity center is under construction at 5512 Liverpool.",
  },
  {
    question: "What is the Sutton Fields expansion?",
    answer:
      "Celina City Council approved the annexation and rezoning of 110 acres for a 450-home eastern addition to Sutton Fields. Phase 1 includes 245 lots and Phase 2 includes 205 lots.",
  },
];

export default function NewHerePage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", href: "/" },
          { name: "New Here?", href: "/new-here" },
        ]}
      />
      <FAQStructuredData faqs={newHereFaqs} />

      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full">
        <PageHeader
          label="New Here?"
          title="Welcome to the neighborhood."
          description="Whether you just closed or you're still house-hunting: schools, amenities, HOA details, utility setup, and the five things to do in your first few weeks, all in one place."
        />
      </div>

      {/* First weeks checklist */}
      <div className="px-6 max-w-4xl mx-auto mb-16">
        <div className="space-y-6">
          {newcomerSteps.map((step, i) => (
            <div
              key={step.title}
              className="flex gap-6 bg-surface-container-low rounded-3xl p-6"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Icon name={step.icon} />
              </div>
              <div>
                <div className="text-xs font-bold text-primary mb-1">
                  Step {i + 1}
                </div>
                <h3 className="text-lg font-headline italic text-on-surface mb-1">
                  {step.title}
                </h3>
                <p className="text-on-surface-variant text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AboutSection />

      {/* Neighborhood school spotlight */}
      <div className="px-6 max-w-7xl mx-auto mb-16">
        <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
          <Image
            src={spotlight.image}
            alt={spotlight.imageAlt}
            fill
            sizes="(max-width: 1280px) 100vw, 1216px"
            className="object-cover"
          />
        </div>
      </div>

      <div id="schools">
        <SchoolInfo />
      </div>
      <AmenitiesGrid />
      <NearbyAttractions />
      <UtilityGuide />
      <div id="documents">
        <HoaDocs />
      </div>
      <ResourceLinks />
    </>
  );
}
