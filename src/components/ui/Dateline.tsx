import { cn } from "@/lib/utils";

interface DatelineProps {
  prefix?: string;
  date?: Date;
  className?: string;
}

/** Newspaper-style dateline: "CELINA, TX — AUG 12" */
export function Dateline({ prefix = "Celina, TX", date, className }: DatelineProps) {
  const d = date ?? new Date();
  const formatted = d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/Chicago",
    })
    .toUpperCase();

  return (
    <span className={cn("dateline", className)}>
      {prefix.toUpperCase()} · {formatted}
    </span>
  );
}
