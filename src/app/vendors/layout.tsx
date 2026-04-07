import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Directory — Local Services",
  description:
    "Find trusted, community-vetted vendors serving Sutton Fields in Celina, TX. Landscapers, electricians, pet sitters, bakeries, and childcare — all recommended by your neighbors.",
  alternates: { canonical: "https://suttonfields.com/vendors" },
  openGraph: {
    title: "Sutton Fields Vendor Directory — Celina, TX",
    description:
      "Community-vetted local vendors and services recommended by Sutton Fields residents in Celina, Texas.",
  },
};

export default function VendorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
