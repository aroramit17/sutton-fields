import Link from "next/link";
import { footerLinks } from "@/data/navigation";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="bg-surface-container-low w-full mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-4">
            <div className="font-headline text-xl font-bold uppercase tracking-tight text-on-surface mb-1">
              Sutton Fields
            </div>
            <p className="font-headline italic text-sm text-on-surface-variant mb-3">
              The unofficial record of Sutton Fields, Celina, Texas
            </p>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
              An independent, resident-run site. Not affiliated with the HOA,
              Essex Association Management, or Centurion American. For official
              HOA business, use the resident portal below.
            </p>
            <div className="text-sm text-on-surface-variant space-y-1">
              <p>4600 Waugh Avenue, Celina, TX 75009</p>
              <p>
                HOA Office:{" "}
                <a href="tel:9724282030" className="text-primary hover:underline">
                  972-428-2030
                </a>
              </p>
              <p>
                Emergency:{" "}
                <a href="tel:18887402233" className="text-primary hover:underline">
                  1-888-740-2233
                </a>
              </p>
            </div>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-bold text-sm text-on-surface mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {footerLinks.map((link) =>
                link.href.startsWith("http") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-on-surface-variant hover:text-primary text-sm transition-all"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-on-surface-variant hover:text-primary text-sm transition-all"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-bold text-sm text-on-surface mb-4">Resources</h4>
            <div className="flex flex-col gap-2">
              <a href="https://suttonfieldshoa.com" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary text-sm transition-all">
                Official HOA Portal
              </a>
              <a href="https://www.prosper-isd.net" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary text-sm transition-all">
                Prosper ISD
              </a>
              <a href="https://www.celina-tx.gov" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary text-sm transition-all">
                City of Celina
              </a>
              <a href="https://www.prosper-isd.net/christie" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary text-sm transition-all">
                Dan Christie Elementary
              </a>
            </div>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-bold text-sm text-on-surface mb-4">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/groups/suttonfields"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all"
              >
                <Icon name="share" className="text-xl" />
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=4600+Waugh+Avenue+Celina+TX+75009"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all"
              >
                <Icon name="map" className="text-xl" />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 bg-[linear-gradient(to_right,transparent,var(--color-outline-variant),transparent)] bg-[length:100%_1px] bg-no-repeat bg-top">
          <p className="text-on-surface-variant text-xs text-center">
            &copy; {new Date().getFullYear()} suttonfields.info, an independent
            community site by and for Sutton Fields residents. Celina, TX 75009.
          </p>
        </div>
      </div>
    </footer>
  );
}
