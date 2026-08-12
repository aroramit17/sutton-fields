import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Classifieds: Buy, Sell, Trade & Lost and Found",
  description:
    "Sutton Fields neighborhood classifieds: buy, sell, and trade with verified resident neighbors in Celina, TX, plus lost & found posts. Listings auto-expire after 48 hours.",
  alternates: { canonical: "https://suttonfields.info/classifieds" },
  openGraph: {
    title: "Sutton Fields Classifieds: Celina, TX",
    description:
      "Neighborhood classifieds for Sutton Fields residents: for-sale listings and lost & found, posted by verified neighbors.",
  },
};

export default function ClassifiedsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
