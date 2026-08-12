"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { VendorSearch } from "@/components/vendors/VendorSearch";
import { VendorGrid } from "@/components/vendors/VendorGrid";
import { vendors } from "@/data/vendors";
import { otherChannels } from "@/data/groups";
import { Icon } from "@/components/ui/Icon";

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      searchQuery === "" ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "All" || vendor.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pb-24 px-6 max-w-7xl mx-auto">
      <PageHeader
        label="Directory"
        title="Trusted by your actual neighbors."
        description="Community-vetted vendors serving Sutton Fields — from sprinkler repair to babysitters — plus the groups and channels where the neighborhood organizes."
      />
      <VendorSearch
        onSearch={setSearchQuery}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />
      <VendorGrid vendors={filteredVendors} />

      {/* Groups & Rides */}
      <section className="mt-16">
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
          Groups &amp; Rides
        </h2>
        <p className="text-on-surface-variant text-sm mb-6 max-w-2xl">
          The real-time conversation lives on Facebook — this site is the
          reference desk. Carpool matching for school runs and commutes happens
          in the group, too.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {otherChannels.map((c) => (
            <a
              key={c.href}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-3xl bg-surface-container-low p-6 transition-colors hover:bg-surface-container"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="groups" />
              </div>
              <div>
                <h3 className="font-headline text-lg italic text-on-surface group-hover:text-primary">
                  {c.name}
                  <Icon name="open_in_new" className="!text-xs ml-1" />
                </h3>
                <p className="text-sm text-on-surface-variant">{c.description}</p>
              </div>
            </a>
          ))}
          <div className="flex items-start gap-4 rounded-3xl bg-surface-container-low p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="directions_car" />
            </div>
            <div>
              <h3 className="font-headline text-lg italic text-on-surface">
                Carpool &amp; school runs
              </h3>
              <p className="text-sm text-on-surface-variant">
                Ask in the Facebook group — posts there reach 3,000+ neighbors
                instantly, which is exactly what ride matching needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
