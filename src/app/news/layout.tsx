import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News — Celina & Community Updates",
  description:
    "Latest news for Sutton Fields residents in Celina, TX — city updates, Prosper ISD school news, community events, safety alerts, and neighborhood developments.",
  alternates: { canonical: "https://suttonfields.com/news" },
  openGraph: {
    title: "Sutton Fields News — Celina, TX Community Updates",
    description:
      "Stay informed with the latest local news relevant to Sutton Fields homeowners in Celina, Texas.",
  },
};

export const dynamic = "force-dynamic";

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
