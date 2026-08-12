import type { Metadata } from "next";
import Link from "next/link";
import { TheBoard } from "@/components/home/TheBoard";
import { FrontPage } from "@/components/home/FrontPage";
import { AroundTheNeighborhood } from "@/components/home/AroundTheNeighborhood";
import { DigestBand } from "@/components/home/DigestBand";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FAQStructuredData } from "@/components/seo/StructuredData";
import { getPublishedAnswers } from "@/actions/answers";
import { AnswerCard } from "@/components/answers/AnswerCard";

export const metadata: Metadata = {
  title: "Sutton Fields | The Unofficial Record: Celina, TX",
  description:
    "The independent, resident-run hub for Sutton Fields in Celina, Texas: neighborhood news, events, pool and trash status, classifieds, and straight answers about schools, taxes, roads, and the HOA.",
  alternates: { canonical: "https://suttonfields.info" },
};

// Every section pulls live DB data — without this the homepage would bake in
// whatever existed at build time and never refresh until the next deploy.
export const revalidate = 900;

const homeFaqs = [
  {
    question: "Where is Sutton Fields located?",
    answer:
      "Sutton Fields is located at 4600 Waugh Avenue in Celina, TX 75009, on the Denton County side of the city. It is approximately 15 miles from Frisco, 21 miles from McKinney, and 45 minutes from Downtown Dallas, with access via FM 428, FM 1385, and the Dallas North Tollway extension (opening to FM 428 in late 2027).",
  },
  {
    question: "What school district is Sutton Fields in?",
    answer:
      "Sutton Fields is served by Prosper ISD. Dan Christie Elementary School (PK-5) is located inside the community. Following Prosper ISD's 2025-26 rezoning, builder listings show Sutton Fields feeding Pete Moseley Middle School and Richland High School, verify your address on the district's attendance boundary map, as Prosper ISD adjusts zones almost every year.",
  },
  {
    question: "How much are Sutton Fields HOA dues?",
    answer:
      "Sutton Fields HOA annual dues are $550 per year. The HOA is managed by Essex Association Management L.P. You can pay online via the resident portal. Contact the HOA at 972-428-2030.",
  },
  {
    question: "What amenities does Sutton Fields offer?",
    answer:
      "Sutton Fields features two resort-style swimming pools with cabanas, a lap pool, a splash pad, over 3 miles of walking trails, a community garden and pocket farms, playgrounds, tennis court, fire pit, scenic ponds, and a central Amenity Center at 4515 Westminster Ave. A second amenity center is under construction at 5512 Liverpool.",
  },
  {
    question: "Who developed Sutton Fields?",
    answer:
      "Sutton Fields was developed by Centurion American Development Group. Builders include D.R. Horton, First Texas Homes, Lennar, Mattamy Homes, M/I Homes, Bloomfield Homes, Pacesetter Homes, Sandlin Homes, Stonehollow Homes, and Beazer Homes in earlier phases, with roughly 2,350 homes planned at buildout.",
  },
  {
    question: "Does Sutton Fields have a PID or MUD?",
    answer:
      "Sutton Fields is covered by the Sutton Fields II Public Improvement District (PID), administered by MuniCap for the City of Celina. PID assessments are fixed when the bonds are sold and appear as an annual installment on your property tax bill, partially offset by a TIRZ credit. There is no MUD.",
  },
];

export default async function HomePage() {
  const topAnswers = (await getPublishedAnswers().catch(() => [])).slice(0, 4);

  return (
    <>
      <FAQStructuredData faqs={homeFaqs} />
      <TheBoard />
      <FrontPage />

      {/* Answers */}
      {topAnswers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
          <div className="hairline flex items-end justify-between pt-6">
            <div>
              <SectionLabel section="answers" className="!mb-1">
                Answers
              </SectionLabel>
              <h2 className="font-headline text-3xl font-bold text-on-surface">
                Asked &amp; Answered
              </h2>
            </div>
            <Link href="/answers" className="dateline !text-primary">
              All answers →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {topAnswers.map((a) => (
              <AnswerCard key={a.id} answer={a} />
            ))}
          </div>
        </section>
      )}

      <AroundTheNeighborhood />
      <DigestBand />
    </>
  );
}
