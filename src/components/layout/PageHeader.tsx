import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

interface PageHeaderProps {
  label: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaIcon?: string;
  ctaHref?: string;
  ctaVariant?: "primary" | "gradient";
}

export function PageHeader({
  label,
  title,
  description,
  ctaLabel,
  ctaIcon,
  ctaHref,
  ctaVariant = "primary",
}: PageHeaderProps) {
  return (
    <header className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-7">
          <SectionLabel>{label}</SectionLabel>
          <h1 className="text-5xl md:text-7xl font-headline italic tracking-tight text-on-surface leading-[1.1]">
            {title}
          </h1>
        </div>
        <div className="lg:col-span-5 pb-2">
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
            {description}
          </p>
          {ctaLabel && (
            <Button variant={ctaVariant} href={ctaHref} className="px-8 py-4">
              {ctaIcon && <Icon name={ctaIcon} />}
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
