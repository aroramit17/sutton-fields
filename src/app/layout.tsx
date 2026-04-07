import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommunityStructuredData, HOAStructuredData } from "@/components/seo/StructuredData";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://suttonfields.com"),
  title: {
    default: "Sutton Fields | Master-Planned Community in Celina, TX",
    template: "%s | Sutton Fields - Celina, TX",
  },
  description:
    "Sutton Fields is a 2,289-home master-planned community in Celina, Texas with resort-style pools, walking trails, community garden, and Prosper ISD schools. Developed by Centurion American.",
  keywords: [
    "Sutton Fields",
    "Celina TX",
    "Celina Texas",
    "master-planned community",
    "Centurion American",
    "Prosper ISD",
    "Dan Christie Elementary",
    "homes for sale Celina TX",
    "Sutton Fields HOA",
    "Collin County neighborhoods",
    "North Texas communities",
    "Celina neighborhoods",
    "new homes Celina",
    "Sutton Fields amenities",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sutton Fields Community",
    title: "Sutton Fields | Master-Planned Community in Celina, TX",
    description:
      "2,289-home community in Celina, TX with resort-style pools, 3+ miles of trails, community garden, and top-rated Prosper ISD schools. HOA dues $550/year.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sutton Fields | Celina, TX Community",
    description:
      "Master-planned community in Celina, Texas. Resort pools, walking trails, Prosper ISD schools, and community garden.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://suttonfields.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${manrope.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <CommunityStructuredData />
        <HOAStructuredData />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="pt-24 flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
