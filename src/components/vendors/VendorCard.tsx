import Image from "next/image";
import type { Vendor } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
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
      <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
        {vendor.description}
      </p>
      <button className="w-full py-3 bg-surface-container-high text-primary font-bold rounded-xl group-hover:bg-primary group-hover:text-on-primary transition-all flex items-center justify-center gap-2">
        View Details
        <Icon name="arrow_forward" className="text-sm" />
      </button>
    </div>
  );
}
