"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { useAuth } from "@/context/AuthContext";
import { submitTipline } from "@/actions/tipline";
import type { TiplineResult } from "@/lib/tipline";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function AdminTiplinePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<"idle" | "uploading" | "extracting" | "done">("idle");
  const [result, setResult] = useState<TiplineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || files.length === 0) return;
    setError(null);
    setResult(null);
    try {
      setState("uploading");
      const urls: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop() || "png";
        const blob = await upload(
          `tipline/${user.id}/${crypto.randomUUID()}.${ext}`,
          file,
          { access: "public", handleUploadUrl: "/api/blob/upload" }
        );
        urls.push(blob.url);
      }
      setState("extracting");
      const res = await submitTipline(urls);
      setResult(res);
      setFiles([]);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed");
      setState("idle");
    }
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
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-headline italic text-on-surface mb-2">Tipline</h1>
      <p className="text-on-surface-variant mb-8">
        Drop screenshots from the Facebook group, flyers, HOA letters, or
        school notices. Dated items become <strong>draft events</strong>;
        newsworthy items become <strong>draft news articles</strong>, both
        wait for your approval in their admin pages before publishing.
      </p>

      <form onSubmit={handleSubmit} className="bg-surface-container-low rounded-[2rem] p-8 flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 10))}
          className="text-sm text-on-surface-variant file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-on-primary"
          disabled={state === "uploading" || state === "extracting"}
        />
        {files.length > 0 && (
          <p className="text-xs text-on-surface-variant">
            {files.length} screenshot{files.length > 1 ? "s" : ""} selected
          </p>
        )}
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm">
            {error}
          </div>
        )}
        <Button variant="gradient" type="submit" className="w-full md:w-auto">
          {state === "uploading"
            ? "Uploading…"
            : state === "extracting"
              ? "Reading screenshots…"
              : "Extract events & news"}
        </Button>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6">
            <h2 className="dateline mb-3">Draft events created ({result.eventsCreated.length})</h2>
            {result.eventsCreated.length === 0 ? (
              <p className="text-sm text-on-surface-variant">None found.</p>
            ) : (
              <ul className="space-y-1 text-sm text-on-surface">
                {result.eventsCreated.map((e, i) => (
                  <li key={i}>
                    <strong>{e.title}</strong>, {e.event_date}
                  </li>
                ))}
              </ul>
            )}
            {result.eventsSkipped.length > 0 && (
              <p className="mt-3 text-xs text-on-surface-variant">
                Skipped: {result.eventsSkipped.join("; ")}
              </p>
            )}
            <a href="/admin/events" className="mt-3 inline-block text-sm text-primary underline">
              Review in Events admin →
            </a>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-6">
            <h2 className="dateline mb-3">Draft news created ({result.newsDrafted.length})</h2>
            {result.newsDrafted.length === 0 ? (
              <p className="text-sm text-on-surface-variant">None found.</p>
            ) : (
              <ul className="space-y-1 text-sm text-on-surface">
                {result.newsDrafted.map((t, i) => (
                  <li key={i}>
                    <strong>{t}</strong>
                  </li>
                ))}
              </ul>
            )}
            <a href="/admin/news" className="mt-3 inline-block text-sm text-primary underline">
              Review in News admin →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
