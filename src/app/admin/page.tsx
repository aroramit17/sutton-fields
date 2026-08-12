"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/Icon";

const SECTIONS = [
  { href: "/admin/news", icon: "newspaper", title: "News", desc: "Review AI-drafted articles, publish, pin the lead story." },
  { href: "/admin/events", icon: "event", title: "Events", desc: "Manual events plus Wilson Weekly and Tipline drafts." },
  { href: "/admin/answers", icon: "help_center", title: "Answers", desc: "The Q&A library and the road tracker. Amber = needs re-verification." },
  { href: "/admin/board", icon: "dashboard", title: "The Board", desc: "Homepage status chips: pool, trash override, water, roads." },
  { href: "/admin/tipline", icon: "upload", title: "Tipline", desc: "Drop Facebook screenshots — extracts draft events and news." },
  { href: "/admin/announcements", icon: "campaign", title: "Announcements", desc: "The sticky banner at the top of every page." },
];

export default function AdminIndexPage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="h-8 bg-surface-container-high rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!user || !profile?.is_admin) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <Icon name="admin_panel_settings" className="text-6xl text-on-surface-variant mb-4" />
        <h1 className="text-3xl font-headline italic mb-2">Admin Access Required</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-headline italic text-on-surface mb-8">Newsroom</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex items-start gap-4 rounded-3xl bg-surface-container-low p-6 transition-colors hover:bg-surface-container"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name={s.icon} />
            </div>
            <div>
              <h2 className="font-headline text-xl italic text-on-surface group-hover:text-primary">
                {s.title}
              </h2>
              <p className="text-sm text-on-surface-variant">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
