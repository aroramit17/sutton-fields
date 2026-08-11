"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function CarpoolForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [schedule, setSchedule] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("carpool_posts").insert({
      user_id: user.id,
      title,
      description,
      destination,
      schedule,
    });

    if (insertError) {
      setError(`Failed to create post: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    router.push("/carpool");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-bold text-on-surface block mb-1">
          Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
          placeholder="e.g., Looking for morning carpool to Rushing MS"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-on-surface block mb-1">
          Description
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40 resize-none"
          placeholder="Grade/school, pickup area, and how to reach you"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-on-surface block mb-1">
            Destination
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="e.g., Rushing Middle School"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-on-surface block mb-1">
            Schedule
          </label>
          <input
            type="text"
            required
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="e.g., Mon-Fri, 7:45am drop-off"
          />
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-4 flex items-start gap-3">
        <Icon name="info" className="text-tertiary shrink-0" />
        <p className="text-xs text-on-surface-variant">
          Your post stays active for <strong>30 days</strong>, or remove it earlier
          from the Carpool page once you&rsquo;ve found a match.
        </p>
      </div>

      <Button variant="gradient" type="submit" className="w-full py-4">
        {submitting ? "Posting..." : "Post to Carpool Board"}
      </Button>
    </form>
  );
}
