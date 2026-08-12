import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Directory — Neighbor-Recommended Services & Groups",
  description:
    "The Sutton Fields directory: trusted local vendors recommended by residents of this Celina, TX neighborhood — plus the community groups and channels where neighbors organize.",
  alternates: { canonical: "https://suttonfields.info/directory" },
  openGraph: {
    title: "Sutton Fields Directory — Celina, TX",
    description:
      "Neighbor-recommended vendors and community groups for Sutton Fields residents in Celina, Texas.",
  },
};

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
