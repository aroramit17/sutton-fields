"use client";

import { Icon } from "./Icon";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  showButton?: boolean;
}

export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  showButton = false,
}: SearchBarProps) {
  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <Icon name="search" className="text-on-surface-variant" />
      </div>
      <input
        type="text"
        className="w-full h-16 pl-14 pr-6 rounded-full bg-surface-container-lowest shadow-ambient border-none focus:ring-2 focus:ring-surface-tint/40 text-on-surface placeholder:text-on-surface-variant/60 transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {showButton && (
        <div className="absolute right-3 inset-y-3">
          <button className="h-full px-6 rounded-full bg-primary text-on-primary font-medium text-sm hover:bg-primary-container transition-colors">
            Search
          </button>
        </div>
      )}
    </div>
  );
}
