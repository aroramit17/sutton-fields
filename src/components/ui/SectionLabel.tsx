import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  color?: "primary" | "tertiary";
}

export function SectionLabel({
  children,
  className,
  color = "primary",
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "font-bold tracking-widest text-xs uppercase block mb-4",
        color === "primary" ? "text-primary" : "text-tertiary",
        className
      )}
    >
      {children}
    </span>
  );
}
