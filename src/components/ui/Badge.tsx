import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

type BadgeVariant = "rating" | "tag" | "featured" | "residentOwned";

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  value?: number;
  className?: string;
}

export function Badge({ variant, children, value, className }: BadgeProps) {
  if (variant === "rating" && value !== undefined) {
    return (
      <div
        className={cn(
          "bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm",
          className
        )}
      >
        <Icon name="star" filled className="text-amber-500 text-sm" />
        <span className="text-xs font-bold text-on-surface">{value}</span>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <span
        className={cn(
          "bg-primary text-on-primary text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold",
          className
        )}
      >
        {children || "Featured Event"}
      </span>
    );
  }

  if (variant === "residentOwned") {
    return (
      <span
        className={cn(
          "text-xs font-bold uppercase tracking-tighter text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded",
          className
        )}
      >
        Resident Owned
      </span>
    );
  }

  // tag variant
  return (
    <span
      className={cn(
        "bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
        className
      )}
    >
      {children}
    </span>
  );
}
