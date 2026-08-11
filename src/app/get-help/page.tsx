import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

const getHelpLinks = [
  { href: "/vendors", icon: "storefront", title: "Vendor Directory", description: "Community-vetted home services, food, tutoring, and pet care." },
  { href: "/buy-sell-trade", icon: "sell", title: "Buy / Sell / Trade", description: "Post items for sale or find deals from neighbors." },
  { href: "/lost-found", icon: "pets", title: "Lost & Found", description: "Lost a pet or item, or found one? Post it here." },
  { href: "/carpool", icon: "directions_car", title: "Carpool Board", description: "Find a match for school runs and commutes." },
];

export default function GetHelpPage() {
  return (
    <div className="pb-24 px-6 max-w-5xl mx-auto">
      <PageHeader
        label="Get Help"
        title="Find What You Need"
        description="Vendors, classifieds, lost & found, and carpool matching — all in one place."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getHelpLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-surface-container-low rounded-3xl p-6 hover:bg-surface-container-lowest hover:shadow-xl transition-all"
          >
            <Icon name={link.icon} className="text-primary text-3xl mb-3" />
            <h3 className="font-headline italic text-lg text-on-surface mb-1">{link.title}</h3>
            <p className="text-on-surface-variant text-sm">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
