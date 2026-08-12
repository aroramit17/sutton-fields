import Image from "next/image";
import type { Vendor } from "@/types";
import type { EndorsementSummary } from "@/actions/endorsements";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

const categoryIcon: Record<string, string> = {
  "Lawn & Landscape": "grass",
  "Pest Control": "pest_control",
  Electrical: "bolt",
  Handyman: "handyman",
  "Home Inspection": "fact_check",
  "Garage & Floors": "garage",
  Cleaning: "cleaning_services",
  "Water Softeners": "water_drop",
  "Events & Rentals": "celebration",
  "Photography & Decor": "photo_camera",
  Classes: "self_improvement",
  "Real Estate & Notary": "real_estate_agent",
  Wildlife: "pets",
};

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
    <div className="group flex flex-col bg-surface-container-low rounded-3xl p-6 transition-all duration-300 hover:bg-surface-container-lowest hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {vendor.image ? (
            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
              <Image src={vendor.image} alt={vendor.imageAlt ?? vendor.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name={categoryIcon[vendor.category] ?? "storefront"} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate font-headline text-xl font-bold text-on-surface">
              {vendor.name}
            </h3>
            <span className="dateline">{vendor.category}</span>
          </div>
        </div>
        {vendor.rating !== undefined && <Badge variant="rating" value={vendor.rating} />}
      </div>

      <p className="text-on-surface-variant text-sm leading-relaxed mb-4 flex-1">
        {vendor.description}
      </p>

      {(vendor.phone || vendor.website) && (
        <div className="mb-4 flex flex-wrap gap-3 text-sm">
          {vendor.phone && (
            <a
              href={`tel:${vendor.phone.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <Icon name="call" className="!text-sm" />
              {vendor.phone}
            </a>
          )}
          {vendor.website && (
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <Icon name="language" className="!text-sm" />
              Website
            </a>
          )}
        </div>
      )}

      <p className="text-xs text-on-surface-variant mb-3">
        {count > 0 ? (
          <>
            Recommended by <strong>{count}</strong> verified resident
            {count > 1 ? "s" : ""}
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
          "Sourced from the residents' recommendation spreadsheet"
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
