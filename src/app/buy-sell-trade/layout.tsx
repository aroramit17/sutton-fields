import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buy, Sell & Trade — Neighborhood Marketplace",
  description:
    "Buy, sell, and trade items with your Sutton Fields neighbors in Celina, TX. Post listings with photos — all listings expire after 48 hours. Resident-verified marketplace.",
  alternates: { canonical: "https://suttonfields.com/buy-sell-trade" },
  openGraph: {
    title: "Sutton Fields Buy/Sell/Trade — Celina, TX",
    description:
      "Neighborhood marketplace for Sutton Fields residents. Post items for sale with photos. Listings auto-expire after 48 hours.",
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
