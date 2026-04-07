"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { FilterChip } from "@/components/ui/FilterChip";
import { vendorCategories } from "@/data/vendors";

interface VendorSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (category: string) => void;
  activeFilter: string;
}

export function VendorSearch({
  onSearch,
  onFilterChange,
  activeFilter,
}: VendorSearchProps) {
  const [query, setQuery] = useState("");

  return (
    <section className="mb-12 sticky top-24 z-40">
      <div className="bg-surface-container-lowest p-4 rounded-full shadow-ambient flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="text"
            className="w-full pl-12 pr-6 py-3 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60"
            placeholder="Search by name or service..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
          />
        </div>
        <div className="h-8 w-px bg-outline-variant/30 hidden md:block" />
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 px-2">
          {vendorCategories.map((cat) => (
            <FilterChip
              key={cat}
              label={cat}
              selected={activeFilter === cat}
              onClick={() => onFilterChange(cat)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
