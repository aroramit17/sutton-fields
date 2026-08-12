"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getDispatchAdminData,
  previewDispatch,
  sendTestDispatch,
  type DispatchAdminData,
} from "@/actions/dispatch";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function AdminDispatchPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [data, setData] = useState<DispatchAdminData | null>(null);
  const [preview, setPreview] = useState<{ subject: string; html: string; isEmpty: boolean } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.is_admin) return;
    getDispatchAdminData().then(setData).catch(() => setData(null));
    if (profile.email) setTestEmail((prev) => prev || profile.email);
  }, [profile]);

  async function handlePreview() {
    setError(null);
    setLoadingPreview(true);
    try {
      setPreview(await previewDispatch());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed");
    }
    setLoadingPreview(false);
  }

  async function handleTestSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setSending(true);
    try {
      await sendTestDispatch(testEmail);
      setStatus(`Test issue sent to ${testEmail}. Check the inbox (and spam).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test send failed");
    }
    setSending(false);
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
      <h1 className="text-4xl font-headline italic text-on-surface mb-2">The Thursday Dispatch</h1>
      <p className="text-on-surface-variant mb-8">
        Goes out automatically every Thursday at 6 PM Central. One issue per
        week maximum; the cron skips itself if something already went out.
      </p>

      {error && (
        <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}
      {status && (
        <div className="bg-surface-container-low border border-outline-variant p-3 rounded-xl text-sm mb-6 text-on-surface">
          {status}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <div className="rounded-3xl bg-surface-container-low p-6">
          <div className="dateline mb-1">Active subscribers</div>
          <div className="font-headline text-4xl font-bold text-on-surface">
            {data ? data.subscriberCount : "…"}
          </div>
        </div>
        <form onSubmit={handleTestSend} className="rounded-3xl bg-surface-container-low p-6 flex flex-col gap-3">
          <div className="dateline">Send a test issue</div>
          <input
            required
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="you@example.com"
            disabled={sending}
          />
          <Button variant="gradient" type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send test"}
          </Button>
        </form>
      </div>

      <div className="mb-8">
        <Button variant="gradient" onClick={handlePreview} disabled={loadingPreview}>
          {loadingPreview ? "Assembling..." : preview ? "Refresh preview" : "Preview this week's issue"}
        </Button>
        {preview && (
          <div className="mt-4">
            <div className="dateline mb-2">
              Subject: {preview.subject}
              {preview.isEmpty && " (would be skipped: no lead, news, or events)"}
            </div>
            <iframe
              srcDoc={preview.html}
              sandbox=""
              title="Dispatch preview"
              className="w-full rounded-2xl border border-outline-variant bg-[#faf8f4]"
              style={{ height: "70vh" }}
            />
          </div>
        )}
      </div>

      <h2 className="font-headline text-2xl italic text-on-surface mb-3">Past issues</h2>
      {!data || data.issues.length === 0 ? (
        <p className="text-sm text-on-surface-variant">No issues yet. The first one goes out Thursday.</p>
      ) : (
        <ul className="divide-y divide-outline-variant">
          {data.issues.map((i) => (
            <li key={i.id} className="py-3 flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold text-on-surface">{i.subject}</span>
              <span className="text-sm text-on-surface-variant">
                {i.sent_at
                  ? `Sent ${new Date(i.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${i.recipient_count} delivered${i.failure_count ? ` · ${i.failure_count} failed` : ""}`
                  : "Not sent"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
