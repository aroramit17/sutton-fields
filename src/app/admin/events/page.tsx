"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getAllEventsForAdmin,
  createEvent,
  togglePublishEvent,
  deleteEvent,
} from "@/actions/events";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { DbEvent } from "@/types/database";

export default function AdminEventsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchEvents() {
    try {
      setEvents(await getAllEventsForAdmin());
    } catch {
      setEvents([]);
    }
  }

  useEffect(() => {
    if (profile?.is_admin) fetchEvents();
  }, [profile]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await createEvent(title, description, eventDate, location);
      setTitle("");
      setDescription("");
      setEventDate("");
      setLocation("");
      fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    }
    setSaving(false);
  }

  async function togglePublish(event: DbEvent) {
    await togglePublishEvent(event.id, !event.is_published);
    fetchEvents();
  }

  async function handleDelete(id: string) {
    await deleteEvent(id);
    fetchEvents();
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
        Events Dashboard
      </h1>
      <p className="text-on-surface-variant mb-8">
        Add events manually, or review/edit events the nightly Wilson Weekly
        scan pulled in automatically.
      </p>

      <form
        onSubmit={handleCreate}
        className="bg-surface-container-low rounded-[2rem] p-8 mb-12 flex flex-col gap-4"
      >
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
          placeholder="Event title..."
          disabled={saving}
        />
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40 resize-none"
          placeholder="Description..."
          disabled={saving}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="datetime-local"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="flex-1 bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            disabled={saving}
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="Location (optional)"
            disabled={saving}
          />
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <Button variant="gradient" type="submit" className="w-full md:w-auto">
          <Icon name="add_circle" className="text-sm" />
          {saving ? "Adding..." : "Add Event"}
        </Button>
      </form>

      <h2 className="text-2xl font-headline italic mb-6">
        All Events ({events.length})
      </h2>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-surface-container-lowest rounded-2xl p-6 flex gap-6 items-start"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    event.is_published
                      ? "bg-primary/10 text-primary"
                      : "bg-tertiary-fixed text-tertiary"
                  }`}
                >
                  {event.is_published ? "Published" : "Hidden"}
                </span>
                {event.source === "wilson_weekly" && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary">
                    Wilson Weekly
                  </span>
                )}
                <span className="text-xs text-on-surface-variant">
                  {event.has_time
                    ? new Date(event.event_date).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : new Date(event.event_date).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                        timeZone: "UTC",
                      })}
                </span>
              </div>
              <h3 className="font-headline text-lg text-on-surface mb-1">
                {event.title}
              </h3>
              <p className="text-sm text-on-surface-variant line-clamp-2 mb-1">
                {event.description}
              </p>
              {event.location && (
                <p className="text-xs text-on-surface-variant">{event.location}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => togglePublish(event)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  event.is_published
                    ? "bg-tertiary-fixed text-tertiary hover:bg-tertiary hover:text-on-tertiary"
                    : "bg-primary text-on-primary hover:bg-primary-container"
                }`}
              >
                {event.is_published ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <p className="text-center text-on-surface-variant py-12">
            No events yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
