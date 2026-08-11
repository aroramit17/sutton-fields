import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Sutton Fields",
  description:
    "How Sutton Fields (suttonfields.info) collects, stores, and uses resident information.",
  alternates: { canonical: "https://suttonfields.info/privacy" },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
