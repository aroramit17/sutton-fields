"use client";

import { useEffect, useState } from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Navbar } from "./Navbar";
import { getActiveAnnouncement } from "@/actions/announcements";
import type { Announcement } from "@/types/database";

// Fetched client-side (like AuthContext does for profile data) rather than
// awaited in this server layout — most pages are statically generated, and
// a server-side fetch here would bake a stale announcement into that static
// HTML until the next deploy. A client fetch stays fresh on every page load.
export function SiteHeader() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    getActiveAnnouncement()
      .then(setAnnouncement)
      .catch(() => setAnnouncement(null));
  }, []);

  return (
    <div className="sticky top-0 z-50 flex flex-col">
      {announcement && <AnnouncementBar announcement={announcement} />}
      <Navbar />
    </div>
  );
}
