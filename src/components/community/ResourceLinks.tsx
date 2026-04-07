import { communityResources } from "@/data/community";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function ResourceLinks() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-24">
      <SectionLabel color="tertiary">Community Resources</SectionLabel>
      <h2 className="text-4xl md:text-5xl font-headline mb-12">
        Helpful Links
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communityResources.map((resource) => (
          <a
            key={resource.title}
            href={resource.href}
            className="bg-surface-container-low p-8 rounded-[2rem] flex gap-6 items-start hover:bg-surface-container-high transition-colors group"
          >
            <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary shrink-0 group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
              <Icon name={resource.icon} />
            </div>
            <div>
              <h3 className="text-xl font-headline italic mb-1 group-hover:text-tertiary transition-colors">
                {resource.title}
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {resource.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
