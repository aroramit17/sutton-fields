import Image from "next/image";
import { spotlight } from "@/data/home";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function NeighborSpotlight() {
  return (
    <section className="bg-surface-container-low py-24">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        <div className="md:col-span-5 relative">
          <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden rotate-[-2deg] shadow-xl relative z-10">
            <Image
              src={spotlight.image}
              alt={spotlight.imageAlt}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary-container rounded-full -z-0 opacity-50 blur-3xl" />
        </div>
        <div className="md:col-span-7">
          <SectionLabel color="tertiary">Neighbor Spotlight</SectionLabel>
          <h2 className="text-5xl md:text-6xl font-headline mb-8">
            {spotlight.title}
          </h2>
          <p className="text-lg text-on-surface-variant font-light leading-relaxed mb-8">
            {spotlight.description}
          </p>
          <div className="flex gap-12 mb-10">
            {spotlight.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl text-primary font-headline mb-1">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-widest font-bold text-outline">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" href={spotlight.href} className="px-8 py-4 group">
            Read Their Story
            <Icon
              name="arrow_forward"
              className="group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>
      </div>
    </section>
  );
}
