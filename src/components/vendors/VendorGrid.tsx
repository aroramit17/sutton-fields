import type { Vendor } from "@/types";
import { VendorCard } from "./VendorCard";
import { SubmitVendorCTA } from "./SubmitVendorCTA";

interface VendorGridProps {
  vendors: Vendor[];
}

export function VendorGrid({ vendors }: VendorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
      <SubmitVendorCTA />
    </div>
  );
}
