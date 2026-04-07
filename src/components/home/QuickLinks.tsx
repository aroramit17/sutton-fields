import { quickLinks } from "@/data/home";
import { Icon } from "@/components/ui/Icon";

export function QuickLinks() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((link) => (
          <div
            key={link.title}
            className={
              link.variant === "accent"
                ? "bg-primary text-on-primary p-8 rounded-[2rem] flex flex-col justify-between shadow-lg shadow-primary/10"
                : "bg-surface-container-low p-8 rounded-[2rem] flex flex-col justify-between hover:bg-surface-container-high transition-colors group"
            }
          >
            <div>
              <div
                className={
                  link.variant === "accent"
                    ? "w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6"
                    : "w-12 h-12 bg-surface-container-lowest rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform"
                }
              >
                <Icon
                  name={link.icon}
                  className={link.variant === "accent" ? "text-white" : ""}
                />
              </div>
              <h3 className={`text-2xl font-headline mb-2 ${link.variant === "accent" ? "text-white" : ""}`}>
                {link.title}
              </h3>
              <p
                className={`text-sm leading-relaxed mb-6 ${
                  link.variant === "accent"
                    ? "text-white/80"
                    : "text-on-surface-variant"
                }`}
              >
                {link.description}
              </p>
            </div>
            <a
              href={link.ctaHref}
              className={`inline-flex items-center font-bold text-sm gap-2 ${
                link.variant === "accent" ? "text-white" : "text-primary"
              }`}
            >
              {link.ctaLabel}{" "}
              <Icon
                name={link.variant === "accent" ? "open_in_new" : "arrow_forward"}
                className="text-sm"
              />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
