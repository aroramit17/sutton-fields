import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickLinks } from "@/components/home/QuickLinks";
import { NewsGrid } from "@/components/home/NewsGrid";
import { NeighborSpotlight } from "@/components/home/NeighborSpotlight";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { CommunityStatsBar } from "@/components/home/CommunityStatsBar";
import { FAQStructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Sutton Fields | Master-Planned Community in Celina, TX",
  description:
    "Sutton Fields is a 2,289-home master-planned community in Celina, Texas by Centurion American. Features resort-style pools, 3+ miles of walking trails, community garden, pocket farms, and top-rated Prosper ISD schools including Dan Christie Elementary. HOA dues $550/year.",
  alternates: { canonical: "https://suttonfields.com" },
};

const homeFaqs = [
  {
    question: "Where is Sutton Fields located?",
    answer:
      "Sutton Fields is located at 4600 Waugh Avenue in Celina, TX 75009 (Collin County). It is approximately 15 minutes from Frisco, 21 miles from McKinney, and 40 minutes from Downtown Dallas. The community has easy access to the Dallas North Tollway, US Highway 380, and Preston Road.",
  },
  {
    question: "What school district is Sutton Fields in?",
    answer:
      "Sutton Fields is served by Prosper ISD, ranked #13 Best Public School District in Texas. Dan Christie Elementary School (PK-5) is located within the community. Students also attend William Rushing Middle School (6-8, 2.9 miles) and Prosper High School (9-12, 5.4 miles).",
  },
  {
    question: "How much are Sutton Fields HOA dues?",
    answer:
      "Sutton Fields HOA annual dues are $550 per year. The HOA is managed by Essex Association Management L.P. You can pay online via ATG Pay or CIT Property Pay using credit/debit card or e-check. Contact the HOA at 972-428-2030.",
  },
  {
    question: "What amenities does Sutton Fields offer?",
    answer:
      "Sutton Fields features two resort-style swimming pools with cabanas, a splash pad, over 3 miles of walking trails, a community garden and pocket farms, playgrounds, basketball court, fire pit, scenic ponds, and a central Amenity Center at 4515 Westminster Ave with picnic areas and grilling stations.",
  },
  {
    question: "Who developed Sutton Fields?",
    answer:
      "Sutton Fields was developed by Centurion American Development Group. The community includes homes by builders such as D.R. Horton, First Texas Homes, Lennar, Mattamy Homes, M/I Homes, Bloomfield Homes, Pacesetter Homes, Sandlin Homes, Taylor Morrison, Beazer Homes, and more.",
  },
  {
    question: "What are home prices in Sutton Fields?",
    answer:
      "Homes in Sutton Fields range from the mid-$500s to the high-$800s depending on builder, size, and features. The community contains 2,289 single-family homes with an additional 450-home expansion approved.",
  },
];

export default function HomePage() {
  return (
    <>
      <FAQStructuredData faqs={homeFaqs} />
      <HeroSection />
      <CommunityStatsBar />
      <QuickLinks />
      <NewsGrid />
      <NeighborSpotlight />
      <NewsletterSignup />
    </>
  );
}
