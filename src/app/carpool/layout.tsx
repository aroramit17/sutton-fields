import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Carpool Board — Sutton Fields",
  description:
    "Find or post carpool matches for school runs and commutes in Sutton Fields, Celina, TX — Rushing Middle School, Dan Christie Elementary, UTD, UNT, and workplaces. Posts stay active for 30 days.",
  alternates: { canonical: "https://suttonfields.com/carpool" },
  openGraph: {
    title: "Sutton Fields Carpool Board",
    description:
      "Community carpool matching for Sutton Fields residents. Posts stay active for 30 days.",
  },
};

export default function CarpoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
