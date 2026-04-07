import Link from "next/link";
import { footerLinks } from "@/data/navigation";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="bg-surface-container-low w-full mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center p-12 gap-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="font-headline text-xl text-primary italic">
            Sutton Fields
          </div>
          <p className="text-on-surface-variant text-sm">
            &copy; {new Date().getFullYear()} Sutton Fields Homeowners
            Association. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-on-surface-variant hover:text-primary text-sm transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-4">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all"
          >
            <Icon name="share" className="text-xl" />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all"
          >
            <Icon name="map" className="text-xl" />
          </a>
        </div>
      </div>
    </footer>
  );
}
