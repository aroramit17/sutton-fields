import { amenities } from "@/data/community";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function AmenitiesGrid() {
  return (
    <section className="bg-surface-container-low py-24">
      <div className="max-w-7xl mx-auto px-8">
        <SectionLabel>Neighborhood Amenities</SectionLabel>
        <h2 className="text-4xl md:text-5xl font-headline mb-12">
          Things to Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity) => (
            <div
              key={amenity.name}
              className="bg-surface-container-lowest p-8 rounded-[2rem] hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <Icon name={amenity.icon} />
              </div>
              <h3 className="text-2xl font-headline mb-2">{amenity.name}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                {amenity.description}
              </p>
              {amenity.hours && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Icon name="schedule" className="text-primary text-sm" />
                  {amenity.hours}
                </div>
              )}
              {amenity.status && (
                <span
                  className={`inline-block mt-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    amenity.status === "open"
                      ? "bg-primary/10 text-primary"
                      : amenity.status === "seasonal"
                        ? "bg-tertiary-fixed text-tertiary"
                        : "bg-error-container text-on-error-container"
                  }`}
                >
                  {amenity.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
