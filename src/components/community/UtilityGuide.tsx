import { utilities } from "@/data/community";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";

const utilityIcons: Record<string, string> = {
  Electricity: "bolt",
  "Natural Gas": "local_fire_department",
  "Water & Sewer": "water_drop",
  "Trash & Recycling": "delete",
  "Internet & Cable": "wifi",
};

export function UtilityGuide() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-24" id="utilities">
      <SectionLabel>New Resident Guide</SectionLabel>
      <h2 className="text-4xl md:text-5xl font-headline mb-4">
        Utility Providers
      </h2>
      <p className="text-on-surface-variant mb-12 max-w-2xl">
        Moving to Sutton Fields? Here are the utility providers you&rsquo;ll need to set
        up service with for your new home in Celina, TX 75009.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {utilities.map((utility) => (
          <div
            key={utility.name}
            className="bg-surface-container-lowest p-6 rounded-2xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Icon name={utilityIcons[utility.name] || "settings"} />
              </div>
              <h3 className="font-headline text-lg italic">{utility.name}</h3>
            </div>
            <p className="text-sm font-semibold text-on-surface mb-1">
              {utility.provider}
            </p>
            {utility.phone && (
              <p className="text-sm text-on-surface-variant mb-1">
                <Icon name="phone" className="text-xs mr-1" />
                {utility.phone}
              </p>
            )}
            {utility.notes && (
              <p className="text-xs text-on-surface-variant mt-2 italic">
                {utility.notes}
              </p>
            )}
            {utility.website && (
              <a
                href={utility.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary font-bold text-xs mt-3"
              >
                Visit Website <Icon name="open_in_new" className="text-xs" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
