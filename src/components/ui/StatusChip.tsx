import Link from "next/link";
import { cn } from "@/lib/utils";

export type StatusTone = "ok" | "warn" | "alert" | "unknown";

interface StatusChipProps {
  label: string;
  value: string;
  tone?: StatusTone;
  href?: string;
  note?: string | null;
  className?: string;
}

const dotColor: Record<StatusTone, string> = {
  ok: "bg-emerald-600",
  warn: "bg-amber-500",
  alert: "bg-(--color-accent)",
  unknown: "bg-outline",
};

/** Live-status pill for The Board. */
export function StatusChip({
  label,
  value,
  tone = "unknown",
  href,
  note,
  className,
}: StatusChipProps) {
  const body = (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-3.5 py-2",
        href && "transition-colors hover:border-outline",
        className
      )}
    >
      <span className={cn("size-2 rounded-full", dotColor[tone])} aria-hidden />
      <span className="dateline !text-on-surface-variant">{label}</span>
      <span className="text-sm font-semibold text-on-surface">
        {tone === "unknown" && !value ? "Status unknown" : value}
      </span>
      {note ? (
        <span className="hidden text-xs text-on-surface-variant sm:inline">
          {note}
        </span>
      ) : null}
    </span>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}
