"use client";

import { Icon } from "@/components/ui/Icon";

interface ListingSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ListingSearch({ value, onChange }: ListingSearchProps) {
  return (
    <div className="mb-8">
      <div className="bg-surface-container-lowest p-4 rounded-full shadow-ambient flex items-center">
        <Icon
          name="search"
          className="ml-4 mr-2 text-on-surface-variant"
        />
        <input
          type="text"
          className="w-full py-2 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60"
          placeholder="Search listings..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
