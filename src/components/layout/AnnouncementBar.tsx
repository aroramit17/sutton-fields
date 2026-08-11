"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Announcement } from "@/types/database";

const DISMISSED_KEY_PREFIX = "sf-announcement-dismissed-";

export function AnnouncementBar({ announcement }: { announcement: Announcement }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY_PREFIX + announcement.id) === "1");
  }, [announcement.id]);

  if (dismissed) return null;

  return (
    <div className="bg-primary text-on-primary">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm text-center relative">
        <Icon name="campaign" className="!text-lg shrink-0" />
        <span className="font-medium">
          {announcement.message}
          {announcement.link_url && (
            <Link
              href={announcement.link_url}
              className="underline font-bold ml-2 hover:opacity-80"
            >
              {announcement.link_label || "Learn more"}
            </Link>
          )}
        </span>
        <button
          onClick={() => {
            localStorage.setItem(DISMISSED_KEY_PREFIX + announcement.id, "1");
            setDismissed(true);
          }}
          aria-label="Dismiss announcement"
          className="absolute right-4 shrink-0 hover:opacity-70"
        >
          <Icon name="close" className="!text-lg" />
        </button>
      </div>
    </div>
  );
}
