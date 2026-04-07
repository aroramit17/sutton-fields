import Image from "next/image";
import { socialEvents } from "@/data/events";
import { Icon } from "@/components/ui/Icon";

export function UpcomingSocials() {
  return (
    <section>
      <h2 className="text-2xl font-headline italic text-on-surface mb-6">
        Upcoming Socials
      </h2>
      <div className="space-y-6">
        {socialEvents.map((event) => (
          <div
            key={event.title}
            className="relative overflow-hidden rounded-2xl bg-surface-container-low group"
          >
            <div className="relative w-full h-32">
              <Image
                src={event.image}
                alt={event.imageAlt}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h5 className="font-headline text-lg text-on-surface">
                {event.title}
              </h5>
              <p className="text-xs text-on-surface-variant mt-1">
                {event.details}
              </p>
            </div>
          </div>
        ))}
        <div className="p-4 rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center py-8">
          <Icon
            name="celebration"
            className="text-outline-variant mb-2 scale-125"
          />
          <p className="text-sm text-on-surface-variant">
            Planning a block party?
          </p>
          <a href="#" className="text-primary font-bold text-sm mt-1 hover:underline">
            Let the neighbors know
          </a>
        </div>
      </div>
    </section>
  );
}
