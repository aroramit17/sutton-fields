import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newcomer Guide — Sutton Fields",
  description:
    "New to Sutton Fields in Celina, TX? A step-by-step guide to joining the community WhatsApp, registering with the HOA, getting pool access, and connecting with your school.",
  alternates: { canonical: "https://suttonfields.info/newcomer-guide" },
  openGraph: {
    title: "Sutton Fields Newcomer Guide",
    description:
      "Everything a new Sutton Fields resident needs to do in their first few weeks.",
  },
};

export default function NewcomerGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
