"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/navigation";
import { AuthButtons } from "./AuthButtons";
import { Icon } from "@/components/ui/Icon";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md shadow-ambient">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-2xl font-headline italic text-primary"
        >
          Sutton Fields
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-body text-sm tracking-wide transition-colors duration-300",
                  isActive
                    ? "text-primary font-semibold after:content-[''] after:block after:mx-auto after:w-1 after:h-1 after:bg-primary after:rounded-full"
                    : "text-on-surface-variant hover:text-primary-container"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <AuthButtons />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-on-surface-variant"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Icon name={mobileOpen ? "close" : "menu"} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container-lowest/95 backdrop-blur-md px-8 pb-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "font-body text-sm py-2 transition-colors",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-on-surface-variant"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-4 pt-2">
              <AuthButtons />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
