import Image from "next/image";
import type { Vendor } from "@/types";
import type { EndorsementSummary } from "@/actions/endorsements";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

interface VendorCardProps {
  vendor: Vendor;
  endorsement?: EndorsementSummary;
  canEndorse?: boolean;
  onToggleEndorse?: (vendorId: string, endorsed: boolean) => void;
}

export function VendorCard({
  vendor,
  endorsement,
  canEndorse = false,
  onToggleEndorse,
}: VendorCardProps) {
  const count = endorsement?.count ?? 0;
  const mine = endorsement?.endorsedByMe ?? false;

  return (
    <div className="group bg-surface-container-low rounded-3xl p-6 transition-all duration-300 hover:bg-surface-container-lowest hover:shadow-xl">
      <div className="relative mb-6">
        <div className="relative w-full h-48 rounded-xl overflow-hidden">
          <Image
            src={vendor.image}
            alt={vendor.imageAlt}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="rating" value={vendor.rating} />
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-headline italic text-on-surface">
          {vendor.name}
        </h3>
        {vendor.verified && (
          <Icon name="verified" filled className="text-primary" />
        )}
        {vendor.residentOwned && <Badge variant="residentOwned" />}
      </div>
      <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
        {vendor.description}
      </p>
      <p className="text-xs text-on-surface-variant mb-4">
        {count > 0 ? (
          <>
            <Icon name="thumb_up" className="!text-sm text-primary" /> Recommended
            by <strong>{count}</strong> verified resident{count > 1 ? "s" : ""}
            {endorsement?.latest && (
              <>
                {" "}
                · latest{" "}
                {new Date(endorsement.latest).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </>
            )}
          </>
        ) : (
          "No resident recommendations yet"
        )}
      </p>
      {canEndorse ? (
        <button
          onClick={() => onToggleEndorse?.(vendor.id, mine)}
          className={`w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            mine
              ? "bg-primary text-on-primary"
              : "bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary"
          }`}
        >
          <Icon name={mine ? "check" : "thumb_up"} className="text-sm" />
          {mine ? "Recommended by you" : "Recommend"}
        </button>
      ) : (
        <p className="text-center text-xs text-on-surface-variant py-2">
          Verified residents can recommend vendors
        </p>
      )}
    </div>
  );
}
