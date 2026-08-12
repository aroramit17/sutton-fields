"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getBoardStatus,
  setBoardStatus,
  type BoardChip,
  type BoardKey,
  type BoardTone,
} from "@/actions/board";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const CHIPS: { key: BoardKey; label: string; hint: string }[] = [
  { key: "pool", label: "Pool", hint: 'e.g. "Open" / "Closed — contamination"' },
  { key: "trash", label: "Trash", hint: 'e.g. "Wednesdays" + note for next Clean Sweep' },
  { key: "water", label: "Water", hint: 'e.g. "Stage 2" + note "$500+ fines"' },
  { key: "roads", label: "Roads", hint: 'e.g. "DNT 4A paving — opens late 2027"' },
];

const TONES: BoardTone[] = ["ok", "warn", "alert", "unknown"];

interface ChipForm {
  value: string;
  note: string;
  tone: BoardTone;
  link_url: string;
}

const emptyForm: ChipForm = { value: "", note: "", tone: "unknown", link_url: "" };

export default function AdminBoardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [forms, setForms] = useState<Record<BoardKey, ChipForm>>({
    pool: emptyForm,
    trash: emptyForm,
    water: emptyForm,
    roads: emptyForm,
  });
  const [savingKey, setSavingKey] = useState<BoardKey | null>(null);
  const [savedKey, setSavedKey] = useState<BoardKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.is_admin) return;
    getBoardStatus().then((status) => {
      setForms((prev) => {
        const next = { ...prev };
        for (const { key } of CHIPS) {
          const chip: BoardChip | undefined = status[key];
          if (chip) {
            next[key] = {
              value: chip.value,
              note: chip.note ?? "",
              tone: chip.tone,
              link_url: chip.link_url ?? "",
            };
          }
        }
        return next;
      });
    });
  }, [profile]);

  async function handleSave(key: BoardKey) {
    setError(null);
    setSavingKey(key);
    setSavedKey(null);
    try {
      const f = forms[key];
      await setBoardStatus(key, {
        value: f.value,
        note: f.note || undefined,
        tone: f.tone,
        link_url: f.link_url || undefined,
      });
      setSavedKey(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
    setSavingKey(null);
  }

  function update(key: BoardKey, patch: Partial<ChipForm>) {
    setForms((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
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
      <h1 className="text-4xl font-headline italic text-on-surface mb-2">The Board</h1>
      <p className="text-on-surface-variant mb-8">
        The utility chips at the top of the homepage. The School chip fills
        itself from upcoming Wilson Weekly events; these four are yours.
      </p>

      {error && (
        <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {CHIPS.map(({ key, label, hint }) => {
          const f = forms[key];
          return (
            <form
              key={key}
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(key);
              }}
              className="bg-surface-container-low rounded-[2rem] p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-headline italic">{label}</h2>
                <span className="text-xs text-on-surface-variant">{hint}</span>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  required
                  type="text"
                  value={f.value}
                  onChange={(e) => update(key, { value: e.target.value })}
                  className="flex-1 bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
                  placeholder="Chip value"
                  disabled={savingKey === key}
                />
                <select
                  value={f.tone}
                  onChange={(e) => update(key, { tone: e.target.value as BoardTone })}
                  className="bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface"
                  disabled={savingKey === key}
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={f.note}
                  onChange={(e) => update(key, { note: e.target.value })}
                  className="flex-1 bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface"
                  placeholder="Optional note (shown on wider screens)"
                  disabled={savingKey === key}
                />
                <input
                  type="text"
                  value={f.link_url}
                  onChange={(e) => update(key, { link_url: e.target.value })}
                  className="flex-1 bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface"
                  placeholder="Optional link (e.g. /answers/pool-hours)"
                  disabled={savingKey === key}
                />
              </div>
              <Button variant="gradient" type="submit" className="w-full md:w-auto">
                {savingKey === key ? "Saving..." : savedKey === key ? "Saved ✓" : `Save ${label}`}
              </Button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
