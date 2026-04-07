import { communityStats } from "@/data/home";

export function CommunityStatsBar() {
  const stats = [
    { value: communityStats.totalHomes, label: "Homes", note: null },
    { value: communityStats.hoaDues, label: "HOA Dues", note: "Soon to be $660/yr" },
    { value: communityStats.schoolDistrict, label: "School District", note: null },
    { value: communityStats.pools, label: "Pools", note: null },
    { value: communityStats.trails, label: "of Trails", note: null },
  ];

  return (
    <section className="max-w-7xl mx-auto px-8 mb-16">
      <div className="bg-surface-container-low rounded-[2rem] p-8 flex flex-wrap justify-around gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl md:text-3xl font-headline text-primary">
              {stat.value}
            </div>
            <div className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mt-1">
              {stat.label}
            </div>
            {stat.note && (
              <div className="text-[10px] text-tertiary font-semibold mt-1">
                {stat.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
