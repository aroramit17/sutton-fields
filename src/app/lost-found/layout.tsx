import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lost & Found — Sutton Fields",
  description:
    "Lost a pet or item in Sutton Fields, Celina, TX, or found one? Post it here to reconnect with your neighbors. Posts stay active for 14 days.",
  alternates: { canonical: "https://suttonfields.com/lost-found" },
  openGraph: {
    title: "Sutton Fields Lost & Found",
    description:
      "Community lost & found board for Sutton Fields residents. Posts stay active for 14 days.",
  },
};

export default function LostFoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
