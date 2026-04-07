import { HeroSection } from "@/components/home/HeroSection";
import { QuickLinks } from "@/components/home/QuickLinks";
import { NewsGrid } from "@/components/home/NewsGrid";
import { NeighborSpotlight } from "@/components/home/NeighborSpotlight";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickLinks />
      <NewsGrid />
      <NeighborSpotlight />
      <NewsletterSignup />
    </>
  );
}
