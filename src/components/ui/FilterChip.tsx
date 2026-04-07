"use client";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors",
        selected
          ? "bg-primary text-on-primary"
          : "bg-secondary-container text-on-secondary-container hover:bg-primary hover:text-on-primary"
      )}
    >
      {label}
    </button>
  );
}
