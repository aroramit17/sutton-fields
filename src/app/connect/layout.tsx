import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect — Sutton Fields",
  description:
    "Find the right WhatsApp group for your school, grade, or interest in Sutton Fields, Celina, TX, plus other ways to stay connected with the community.",
  alternates: { canonical: "https://suttonfields.info/connect" },
  openGraph: {
    title: "Sutton Fields Connect",
    description:
      "Directory of community WhatsApp groups and channels for Sutton Fields residents.",
  },
};

export default function ConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
