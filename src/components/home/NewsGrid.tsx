import Image from "next/image";
import Link from "next/link";
import { newsItems } from "@/data/home";
import { Badge } from "@/components/ui/Badge";

export function NewsGrid() {
  const featured = newsItems.find((item) => item.featured);
  const secondary = newsItems.filter((item) => !item.featured);

  return (
    <section className="max-w-7xl mx-auto px-8 mb-24">
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">
            Current Happenings
          </span>
          <h2 className="text-4xl md:text-5xl font-headline">
            Latest Neighborhood News
          </h2>
        </div>
        <Link
          href="#"
          className="text-primary font-semibold border-b-2 border-primary/20 hover:border-primary transition-all pb-1 hidden md:block"
        >
          View all updates
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Featured News */}
        {featured && (
          <div className="md:col-span-7 group">
            <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6">
              <Image
                src={featured.image}
                alt={featured.imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6">
                <Badge variant="featured">{featured.category}</Badge>
              </div>
            </div>
            <h3 className="text-3xl font-headline mb-3 leading-tight group-hover:text-primary transition-colors">
              {featured.title}
            </h3>
            <p className="text-on-surface-variant font-light leading-relaxed max-w-2xl">
              {featured.excerpt}
            </p>
          </div>
        )}

        {/* Secondary News */}
        <div className="md:col-span-5 flex flex-col gap-10">
          {secondary.map((item) => (
            <div key={item.title} className="flex gap-6 group cursor-pointer">
              <div className="shrink-0 w-32 h-32 rounded-2xl overflow-hidden relative">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="text-tertiary text-xs font-bold mb-2 block uppercase">
                  {item.category}
                </span>
                <h4 className="text-xl font-headline mb-2 group-hover:text-primary transition-colors italic">
                  {item.title}
                </h4>
                <p className="text-on-surface-variant text-sm line-clamp-2">
                  {item.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
