"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getAllAnnouncementsForAdmin,
  createAnnouncement,
  setActiveAnnouncement,
  deactivateAnnouncement,
  deleteAnnouncement,
} from "@/actions/announcements";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Announcement } from "@/types/database";

export default function AdminAnnouncementsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [message, setMessage] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchAnnouncements() {
    try {
      setAnnouncements(await getAllAnnouncementsForAdmin());
    } catch {
      setAnnouncements([]);
    }
  }

  useEffect(() => {
    if (profile?.is_admin) fetchAnnouncements();
  }, [profile]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await createAnnouncement(message, linkUrl, linkLabel);
      setMessage("");
      setLinkUrl("");
      setLinkLabel("");
      fetchAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create announcement");
    }
    setSaving(false);
  }

  async function handleActivate(id: string) {
    await setActiveAnnouncement(id);
    fetchAnnouncements();
  }

  async function handleDeactivate(id: string) {
    await deactivateAnnouncement(id);
    fetchAnnouncements();
  }

  async function handleDelete(id: string) {
    await deleteAnnouncement(id);
    fetchAnnouncements();
  }

  if (authLoading) {
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
        <p className="text-on-surface-variant">
          This page is restricted to Sutton Fields administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-headline italic text-on-surface mb-2">
        Announcements
      </h1>
      <p className="text-on-surface-variant mb-8">
        Control the sticky banner shown at the top of every page. Only one
        announcement can be active at a time.
      </p>

      <form
        onSubmit={handleCreate}
        className="bg-surface-container-low rounded-[2rem] p-8 mb-12 flex flex-col gap-4"
      >
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40 resize-none"
          placeholder="Announcement message..."
          disabled={saving}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="Optional link URL (e.g. /events)"
            disabled={saving}
          />
          <input
            type="text"
            value={linkLabel}
            onChange={(e) => setLinkLabel(e.target.value)}
            className="flex-1 bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="Optional link label (e.g. Learn more)"
            disabled={saving}
          />
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <Button variant="gradient" type="submit" className="w-full md:w-auto">
          <Icon name="campaign" className="text-sm" />
          {saving ? "Publishing..." : "Publish as Active Announcement"}
        </Button>
      </form>

      <h2 className="text-2xl font-headline italic mb-6">
        History ({announcements.length})
      </h2>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-surface-container-lowest rounded-2xl p-6 flex gap-6 items-start"
          >
            <div className="flex-1 min-w-0">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  a.is_active
                    ? "bg-primary/10 text-primary"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {a.is_active ? "Active" : "Inactive"}
              </span>
              <p className="text-on-surface mt-2">{a.message}</p>
              {a.link_url && (
                <a
                  href={a.link_url}
                  className="text-xs text-primary hover:underline"
                >
                  {a.link_label || a.link_url}
                </a>
              )}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              {a.is_active ? (
                <button
                  onClick={() => handleDeactivate(a.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-tertiary-fixed text-tertiary hover:bg-tertiary hover:text-on-tertiary transition-colors"
                >
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={() => handleActivate(a.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container transition-colors"
                >
                  Activate
                </button>
              )}
              <button
                onClick={() => handleDelete(a.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <p className="text-center text-on-surface-variant py-12">
            No announcements yet. Create one above.
          </p>
        )}
      </div>
    </div>
  );
}
