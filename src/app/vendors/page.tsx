"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { VendorSearch } from "@/components/vendors/VendorSearch";
import { VendorGrid } from "@/components/vendors/VendorGrid";
import { vendors } from "@/data/vendors";

export default function VendorsPage() {
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
        label="Neighborhood Directory"
        title="Trusted local experts for your home."
        description="Connect with community-vetted vendors. From weekend landscapers to trusted sitters, find the help you need right here in the neighborhood."
        ctaLabel="Submit a Vendor"
        ctaIcon="add_circle"
        ctaHref="/vendors/submit"
      />
      <VendorSearch
        onSearch={setSearchQuery}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />
      <VendorGrid vendors={filteredVendors} />
    </div>
  );
}
