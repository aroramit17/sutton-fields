"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/navigation";
import { AuthButtons } from "./AuthButtons";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";

const sectionUnderline: Record<string, { active: string; idle: string }> = {
  news: {
    active: "border-(--color-section-news)",
    idle: "border-transparent hover:border-(--color-section-news)",
  },
  events: {
    active: "border-(--color-section-events)",
    idle: "border-transparent hover:border-(--color-section-events)",
  },
  answers: {
    active: "border-(--color-section-answers)",
    idle: "border-transparent hover:border-(--color-section-answers)",
  },
  directory: {
    active: "border-(--color-section-directory)",
    idle: "border-transparent hover:border-(--color-section-directory)",
  },
  classifieds: {
    active: "border-(--color-section-classifieds)",
    idle: "border-transparent hover:border-(--color-section-classifieds)",
  },
  default: {
    active: "border-primary",
    idle: "border-transparent hover:border-primary",
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <nav className="w-full bg-background/95 backdrop-blur-md">
      {/* Row 1: masthead */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-3 sm:py-4">
          <div className="hidden sm:block" aria-hidden />
          {/* Mobile menu button occupies the left slot on small screens */}
          <button
            className="sm:hidden justify-self-start text-on-surface-variant"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>

          <Link href="/" className="justify-self-center text-center">
            <span className="flex items-center justify-center gap-2.5 sm:gap-3">
              <Logo className="size-8 shrink-0 sm:size-10" />
              <span className="font-headline text-3xl font-bold uppercase leading-none tracking-tight text-on-surface sm:text-4xl">
                Sutton Fields
              </span>
            </span>
            {isHome && (
              <span className="mt-1 hidden font-headline text-sm italic text-on-surface-variant sm:block">
                The unofficial record of Sutton Fields, Celina, Texas
              </span>
            )}
          </Link>

          <div className="flex items-center justify-self-end gap-3">
            <Link
              href="/#dispatch"
              className="hidden rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-primary transition-colors hover:bg-primary-container sm:block"
            >
              Get the Dispatch
            </Link>
            <div className="hidden items-center gap-3 lg:flex">
              <AuthButtons />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: section nav */}
      <div className="hairline border-b border-b-outline-variant">
        <div className="mx-auto hidden max-w-7xl items-center justify-center gap-8 px-8 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const underline =
              sectionUnderline[link.section ?? "default"] ??
              sectionUnderline.default;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "dateline border-b-2 py-2.5 !text-on-surface transition-colors",
                  isActive ? underline.active : underline.idle
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-b border-outline-variant bg-surface-container-lowest/95 px-6 pb-6 backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "dateline py-3 !text-base",
                    isActive ? "!text-primary" : "!text-on-surface"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/#dispatch"
              onClick={() => setMobileOpen(false)}
              className="mt-2 self-start rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-primary"
            >
              Get the Dispatch
            </Link>
            <div className="flex items-center gap-4 pt-4">
              <AuthButtons />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
