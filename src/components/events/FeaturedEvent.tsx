import { featuredEvent } from "@/data/events";
import { Icon } from "@/components/ui/Icon";

export function FeaturedEvent() {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-surface-container-low h-[400px] flex flex-col justify-end p-8 text-on-primary">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url('${featuredEvent.image}')`,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-on-surface/80 via-on-surface/20 to-transparent" />
      <div className="relative z-10">
        <div className="flex gap-4 mb-4">
          <div className="bg-surface-container-lowest/20 backdrop-blur-md px-4 py-2 rounded-xl text-center">
            <p className="text-xs uppercase font-bold tracking-tighter">
              {featuredEvent.month}
            </p>
            <p className="text-2xl font-headline">{featuredEvent.dayOfMonth}</p>
          </div>
          <div>
            <h3 className="text-3xl font-headline leading-tight">
              {featuredEvent.title}
            </h3>
            <div className="flex items-center gap-4 mt-1 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <Icon name="schedule" className="text-sm" />{" "}
                {featuredEvent.time}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="location_on" className="text-sm" />{" "}
                {featuredEvent.location}
              </span>
            </div>
          </div>
        </div>
        <p className="opacity-80 max-w-xl">{featuredEvent.description}</p>
      </div>
    </div>
  );
}
