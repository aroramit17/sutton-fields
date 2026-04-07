import { nearbyAttractions } from "@/data/community";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function NearbyAttractions() {
  return (
    <section className="bg-surface-container-low py-24">
      <div className="max-w-7xl mx-auto px-8">
        <SectionLabel color="tertiary">Explore the Area</SectionLabel>
        <h2 className="text-4xl md:text-5xl font-headline mb-4">
          Near Sutton Fields
        </h2>
        <p className="text-on-surface-variant mb-12 max-w-2xl">
          Celina, Texas is one of North Texas&rsquo;s fastest-growing cities with small-town
          charm. Here&rsquo;s what&rsquo;s near your front door.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyAttractions.map((attraction) => (
            <div
              key={attraction.name}
              className="bg-surface-container-lowest p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline text-lg italic text-on-surface">
                  {attraction.name}
                </h3>
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                  {attraction.distance}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {attraction.description}
              </p>
            </div>
          ))}
        </div>

        {/* Location context for SEO */}
        <div className="mt-16 p-8 bg-surface-container-lowest rounded-[2rem]">
          <h3 className="text-2xl font-headline italic mb-4">
            Getting Around from Sutton Fields
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-on-surface-variant">
            <div>
              <h4 className="font-bold text-on-surface mb-2">Major Highways</h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <Icon name="directions_car" className="text-primary text-sm" />
                  Dallas North Tollway — direct route to Dallas/Frisco
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="directions_car" className="text-primary text-sm" />
                  US Highway 380 — east-west corridor to McKinney &amp; Denton
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="directions_car" className="text-primary text-sm" />
                  Preston Road (FM 1385) — local north-south artery
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-2">Distances</h4>
              <ul className="space-y-1">
                <li>Frisco — 15 minutes</li>
                <li>McKinney — 21 miles</li>
                <li>Denton — 21 miles</li>
                <li>Downtown Dallas — 40 minutes</li>
                <li>Toyota HQ (Plano) — 25 minutes</li>
                <li>DFW Airport — 45 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
