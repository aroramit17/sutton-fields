"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getAllAnswersForAdmin,
  createAnswer,
  updateAnswer,
  togglePublishAnswer,
  deleteAnswer,
  type Answer,
  type AnswerCategory,
  type AnswerInput,
  type AnswerSource,
} from "@/actions/answers";
import {
  getRoadProjects,
  createRoadProject,
  updateRoadProject,
  deleteRoadProject,
  type RoadProject,
  type RoadProjectInput,
} from "@/actions/roads";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const CATEGORIES: AnswerCategory[] = ["money", "schools", "roads", "hoa", "living"];

const emptyAnswer: AnswerInput = {
  slug: "",
  question: "",
  answer: "",
  category: "living",
  sources: [],
  is_published: false,
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

const inputCls =
  "bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40";

export default function AdminAnswersPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [roads, setRoads] = useState<RoadProject[]>([]);
  const [form, setForm] = useState<AnswerInput>(emptyAnswer);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [verified, setVerified] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roadForm, setRoadForm] = useState<RoadProjectInput>({ name: "", status: "", eta_text: "" });
  const [roadEditingId, setRoadEditingId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const [a, r] = await Promise.all([
      getAllAnswersForAdmin().catch(() => []),
      getRoadProjects().catch(() => []),
    ]);
    setAnswers(a);
    setRoads(r);
  }, []);

  useEffect(() => {
    if (profile?.is_admin) fetchAll();
  }, [profile, fetchAll]);

  function startEdit(a: Answer) {
    setEditingId(a.id);
    setVerified(false);
    setForm({
      slug: a.slug,
      question: a.question,
      answer: a.answer,
      category: a.category,
      sources: a.sources,
      is_published: a.is_published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (editingId) {
        await updateAnswer(editingId, form, verified);
      } else {
        await createAnswer(form);
      }
      setForm(emptyAnswer);
      setEditingId(null);
      setVerified(true);
      fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
    setSaving(false);
  }

  function updateSource(i: number, patch: Partial<AnswerSource>) {
    setForm((f) => ({
      ...f,
      sources: f.sources.map((s, si) => (si === i ? { ...s, ...patch } : s)),
    }));
  }

  async function handleRoadSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (roadEditingId) {
        await updateRoadProject(roadEditingId, roadForm);
      } else {
        await createRoadProject({ ...roadForm, sort: roads.length });
      }
      setRoadForm({ name: "", status: "", eta_text: "" });
      setRoadEditingId(null);
      fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save road project");
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

  const staleCutoff = Date.now() - 90 * 86400000;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-headline italic text-on-surface mb-2">Answers</h1>
      <p className="text-on-surface-variant mb-8">
        The canonical Q&amp;A library. Amber rows haven&apos;t been verified in
        90+ days and need a re-check.
      </p>

      {error && (
        <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {/* Editor */}
      <form onSubmit={handleSave} className="bg-surface-container-low rounded-[2rem] p-8 mb-12 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline italic">
            {editingId ? "Edit answer" : "New answer"}
          </h2>
          {editingId && (
            <button
              type="button"
              className="text-xs text-primary underline"
              onClick={() => {
                setEditingId(null);
                setForm(emptyAnswer);
                setVerified(true);
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
        <input
          required
          type="text"
          value={form.question}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              question: e.target.value,
              slug: editingId ? f.slug : slugify(e.target.value),
            }))
          }
          className={inputCls}
          placeholder="Question, e.g. What's my real tax rate?"
          disabled={saving}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <input
            required
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className={`${inputCls} flex-1 font-mono text-sm`}
            placeholder="slug"
            disabled={saving}
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as AnswerCategory }))}
            className={inputCls}
            disabled={saving}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <textarea
          required
          value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          rows={12}
          className={`${inputCls} resize-y font-mono text-sm`}
          placeholder={"Markdown: ## headings, **bold**, *italic*, [links](https://…), - lists"}
          disabled={saving}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="dateline">Sources</span>
            <button
              type="button"
              className="text-xs text-primary underline"
              onClick={() =>
                setForm((f) => ({ ...f, sources: [...f.sources, { title: "", url: "", date: "" }] }))
              }
            >
              + Add source
            </button>
          </div>
          <div className="space-y-2">
            {form.sources.map((s, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={s.title}
                  onChange={(e) => updateSource(i, { title: e.target.value })}
                  className={`${inputCls} flex-[2] !py-2 text-sm`}
                  placeholder="Source title"
                />
                <input
                  type="url"
                  value={s.url}
                  onChange={(e) => updateSource(i, { url: e.target.value })}
                  className={`${inputCls} flex-[3] !py-2 text-sm`}
                  placeholder="https://…"
                />
                <input
                  type="text"
                  value={s.date}
                  onChange={(e) => updateSource(i, { date: e.target.value })}
                  className={`${inputCls} flex-1 !py-2 text-sm`}
                  placeholder="May 2026"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, sources: f.sources.filter((_, si) => si !== i) }))
                  }
                  className="text-error text-xs px-2"
                  aria-label="Remove source"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
            />
            Published
          </label>
          {editingId && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
              Mark verified today
            </label>
          )}
          <Button variant="gradient" type="submit">
            {saving ? "Saving…" : editingId ? "Save changes" : "Create answer"}
          </Button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-3 mb-16">
        {answers.map((a) => {
          const stale = new Date(a.last_verified_at).getTime() < staleCutoff;
          return (
            <div
              key={a.id}
              className={`rounded-2xl p-5 flex gap-4 items-center ${
                stale ? "bg-amber-50 border border-amber-300" : "bg-surface-container-lowest"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="dateline">{a.category}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      a.is_published
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {a.is_published ? "Published" : "Draft"}
                  </span>
                  {stale && (
                    <span className="text-xs font-bold text-amber-800">needs re-verification</span>
                  )}
                </div>
                <p className="text-on-surface font-semibold mt-1 truncate">{a.question}</p>
                <p className="text-xs text-on-surface-variant">
                  /{a.slug} · verified{" "}
                  {new Date(a.last_verified_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => startEdit(a)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    await togglePublishAnswer(a.id, !a.is_published);
                    fetchAll();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                >
                  {a.is_published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={async () => {
                    await deleteAnswer(a.id);
                    fetchAll();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {answers.length === 0 && (
          <p className="text-center text-on-surface-variant py-8">No answers yet.</p>
        )}
      </div>

      {/* Road projects */}
      <h2 className="text-3xl font-headline italic text-on-surface mb-2">Road Tracker</h2>
      <p className="text-on-surface-variant mb-6">
        Rows on the &ldquo;when does the traffic get fixed&rdquo; answer page.
      </p>
      <form onSubmit={handleRoadSave} className="bg-surface-container-low rounded-[2rem] p-6 mb-8 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            required
            type="text"
            value={roadForm.name}
            onChange={(e) => setRoadForm((f) => ({ ...f, name: e.target.value }))}
            className={`${inputCls} flex-[2]`}
            placeholder="Project, e.g. DNT Phase 4A"
          />
          <input
            required
            type="text"
            value={roadForm.status}
            onChange={(e) => setRoadForm((f) => ({ ...f, status: e.target.value }))}
            className={`${inputCls} flex-[2]`}
            placeholder="Status, e.g. Under construction"
          />
          <input
            required
            type="text"
            value={roadForm.eta_text}
            onChange={(e) => setRoadForm((f) => ({ ...f, eta_text: e.target.value }))}
            className={`${inputCls} flex-1`}
            placeholder="ETA, e.g. Late 2027"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={roadForm.detail ?? ""}
            onChange={(e) => setRoadForm((f) => ({ ...f, detail: e.target.value }))}
            className={`${inputCls} flex-[2]`}
            placeholder="Optional detail"
          />
          <input
            type="url"
            value={roadForm.source_url ?? ""}
            onChange={(e) => setRoadForm((f) => ({ ...f, source_url: e.target.value }))}
            className={`${inputCls} flex-[2]`}
            placeholder="Source URL"
          />
          <Button variant="gradient" type="submit">
            {roadEditingId ? "Save project" : "Add project"}
          </Button>
          {roadEditingId && (
            <button
              type="button"
              className="text-xs text-primary underline"
              onClick={() => {
                setRoadEditingId(null);
                setRoadForm({ name: "", status: "", eta_text: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="space-y-2">
        {roads.map((r) => (
          <div key={r.id} className="bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-on-surface truncate">
                {r.name} <span className="text-on-surface-variant font-normal">· {r.status}</span>
              </p>
              <p className="text-xs text-on-surface-variant">ETA {r.eta_text}</p>
            </div>
            <button
              onClick={() => {
                setRoadEditingId(r.id);
                setRoadForm({
                  name: r.name,
                  status: r.status,
                  eta_text: r.eta_text,
                  detail: r.detail ?? "",
                  source_url: r.source_url ?? "",
                  sort: r.sort,
                });
                window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "smooth" });
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary"
            >
              Edit
            </button>
            <button
              onClick={async () => {
                await deleteRoadProject(r.id);
                fetchAll();
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-error-container text-on-error-container"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
