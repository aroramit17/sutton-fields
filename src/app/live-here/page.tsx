import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

const liveHereLinks = [
  { href: "/community", icon: "home", title: "Community Overview", description: "Amenities, HOA documents, utilities, and neighborhood info." },
  { href: "/community#schools", icon: "school", title: "Schools", description: "Dan Christie Elementary, Rushing Middle, and Prosper High." },
  { href: "/newcomer-guide", icon: "waving_hand", title: "Newcomer Guide", description: "Just moved in? Start here." },
];

export default function LiveHerePage() {
  return (
    <div className="pb-24 px-6 max-w-5xl mx-auto">
      <PageHeader
        label="Live Here"
        title="Everything About the Neighborhood"
        description="Amenities, schools, HOA documents, utilities, and getting settled in."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {liveHereLinks.map((link) => (
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
