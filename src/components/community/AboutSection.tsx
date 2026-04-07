import { communityOverview, builders, hoaDetails } from "@/data/community";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Icon } from "@/components/ui/Icon";

export function AboutSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <SectionLabel>About Sutton Fields</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-headline mb-8">
            A Community Where Dreams Flourish
          </h2>
          <div className="prose prose-lg text-on-surface-variant space-y-4">
            <p>
              Sutton Fields is a {communityOverview.totalHomes.toLocaleString()}-home
              master-planned community developed by{" "}
              <strong>{communityOverview.developer}</strong> in the rapidly growing
              city of <strong>Celina, Texas</strong> (zip code {communityOverview.location.zip}).
              Located in Collin County, the community sits along the FM 1385 corridor
              approximately {communityOverview.distanceFromFrisco} from Frisco and{" "}
              {communityOverview.distanceFromDallas} from Downtown Dallas.
            </p>
            <p>
              Homes range from the <strong>{communityOverview.homesPriceRange}</strong>,
              with spacious lots and a variety of floor plans from top national and
              regional builders. The neighborhood&rsquo;s master-planned design features
              consistent sidewalks, street lighting, and landscaping throughout, while
              many properties back up to greenbelts or community walking trails.
            </p>
            <p>
              Families benefit from <strong>Prosper ISD</strong> schools — ranked #13
              Best Public School District in Texas — including Dan Christie Elementary,
              which was built right inside the community and opened in 2023.
            </p>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { icon: "location_on", label: "Location", value: `${communityOverview.location.city}, TX ${communityOverview.location.zip}` },
              { icon: "home", label: "Total Homes", value: communityOverview.totalHomes.toLocaleString() },
              { icon: "payments", label: "Price Range", value: communityOverview.homesPriceRange },
              { icon: "calendar_month", label: "Established", value: String(communityOverview.yearEstablished) },
              { icon: "toll", label: "Annual HOA Dues", value: `$${hoaDetails.annualDues}` },
              { icon: "school", label: "School District", value: "Prosper ISD" },
            ].map((fact) => (
              <div key={fact.label} className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
                <Icon name={fact.icon} className="text-primary shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-on-surface-variant">
                    {fact.label}
                  </div>
                  <div className="text-sm font-semibold text-on-surface">
                    {fact.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Builders */}
        <div className="md:col-span-5">
          <div className="bg-surface-container-low rounded-[2rem] p-8">
            <h3 className="text-2xl font-headline italic mb-6">
              Home Builders
            </h3>
            <p className="text-on-surface-variant text-sm mb-6">
              Sutton Fields features homes from {builders.length} top builders. Visit
              their websites to explore floor plans, pricing, and available lots.
            </p>
            <div className="space-y-3">
              {builders.map((builder) => (
                <a
                  key={builder.name}
                  href={builder.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-high transition-colors group"
                >
                  <span className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                    {builder.name}
                  </span>
                  <Icon
                    name="open_in_new"
                    className="text-sm text-on-surface-variant group-hover:text-primary"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
