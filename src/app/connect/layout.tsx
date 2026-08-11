import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect — Sutton Fields",
  description:
    "Ways to stay connected with the Sutton Fields community in Celina, TX, including the neighborhood Facebook group.",
  alternates: { canonical: "https://suttonfields.info/connect" },
  openGraph: {
    title: "Sutton Fields Connect",
    description:
      "Directory of community channels for Sutton Fields residents.",
  },
};

export default function ConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
