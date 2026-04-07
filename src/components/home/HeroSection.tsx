import { heroContent } from "@/data/home";
import { SearchBar } from "@/components/ui/SearchBar";

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-16">
      <div className="relative rounded-[2.5rem] overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center p-8">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroContent.backgroundImage}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-on-surface/20 to-on-surface/60" />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl text-white mb-6 leading-[0.95] tracking-tight font-headline">
            {heroContent.title}
          </h1>
          <p className="text-lg text-white/90 font-light mb-10 max-w-xl mx-auto">
            {heroContent.subtitle}
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              placeholder="Search for news, events, or local vendors..."
              showButton
            />
          </div>
        </div>
      </div>
    </section>
  );
}
