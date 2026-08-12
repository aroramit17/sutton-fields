import { cn } from "@/lib/utils";

export type SiteSection =
  | "news"
  | "events"
  | "answers"
  | "directory"
  | "classifieds";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  color?: "primary" | "tertiary";
  section?: SiteSection;
}

const sectionColor: Record<SiteSection, string> = {
  news: "text-(--color-section-news)",
  events: "text-(--color-section-events)",
  answers: "text-(--color-section-answers)",
  directory: "text-(--color-section-directory)",
  classifieds: "text-(--color-section-classifieds)",
};

export function SectionLabel({
  children,
  className,
  color = "primary",
  section,
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "font-bold tracking-widest text-xs uppercase block mb-4",
        section
          ? sectionColor[section]
          : color === "primary"
            ? "text-primary"
            : "text-tertiary",
        className
      )}
    >
      {children}
    </span>
  );
}
