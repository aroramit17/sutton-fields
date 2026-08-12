import type { Vendor } from "@/types";
import type { EndorsementSummary } from "@/actions/endorsements";
import { VendorCard } from "./VendorCard";
import { SubmitVendorCTA } from "./SubmitVendorCTA";

interface VendorGridProps {
  vendors: Vendor[];
  endorsements?: Record<string, EndorsementSummary>;
  canEndorse?: boolean;
  onToggleEndorse?: (vendorId: string, endorsed: boolean) => void;
}

export function VendorGrid({
  vendors,
  endorsements = {},
  canEndorse = false,
  onToggleEndorse,
}: VendorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          endorsement={endorsements[vendor.id]}
          canEndorse={canEndorse}
          onToggleEndorse={onToggleEndorse}
        />
      ))}
      <SubmitVendorCTA />
    </div>
  );
}
