import { cn } from "@/lib/utils";

interface LastVerifiedProps {
  date: Date;
  className?: string;
}

const STALE_AFTER_DAYS = 90;

/** "Last verified" credibility badge; visually flags stale entries. */
export function LastVerified({ date, className }: LastVerifiedProps) {
  const days = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  const stale = days > STALE_AFTER_DAYS;
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        stale
          ? "border-amber-300 bg-amber-50 text-amber-800"
          : "border-outline-variant bg-surface-container-low text-on-surface-variant",
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          stale ? "bg-amber-500" : "bg-emerald-600"
        )}
        aria-hidden
      />
      Last verified {formatted}
    </span>
  );
}
