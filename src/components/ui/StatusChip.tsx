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
        "flex h-full w-full items-center gap-2.5 rounded-2xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5",
        href && "transition-colors hover:border-outline",
        className
      )}
    >
      <span className={cn("size-2 shrink-0 rounded-full", dotColor[tone])} aria-hidden />
      <span className="min-w-0">
        <span className="dateline block !text-on-surface-variant">{label}</span>
        <span className="block truncate text-sm font-semibold leading-tight text-on-surface">
          {tone === "unknown" && !value ? "Status unknown" : value}
        </span>
        {note ? (
          <span className="block truncate text-xs leading-tight text-on-surface-variant">
            {note}
          </span>
        ) : null}
      </span>
    </span>
  );

  return href ? (
    <Link href={href} className="block h-full min-w-0">
      {body}
    </Link>
  ) : (
    <span className="block h-full min-w-0">{body}</span>
  );
}
