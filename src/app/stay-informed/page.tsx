import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

const stayInformedLinks = [
  { href: "/news", icon: "newspaper", title: "Community News", description: "City, school district, and HOA news relevant to residents." },
  { href: "/events", icon: "event", title: "Events", description: "Upcoming HOA, PTO, and community events." },
];

export default function StayInformedPage() {
  return (
    <div className="pb-24 px-6 max-w-5xl mx-auto">
      <PageHeader
        label="Stay Informed"
        title="Stay in the Loop"
        description="Community news and upcoming events. Community Alerts and the Daily News feed are coming in a follow-up build."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stayInformedLinks.map((link) => (
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
