"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Article } from "@/types/database";
import Image from "next/image";

const CATEGORIES = [
  "Community",
  "City of Celina",
  "Prosper ISD",
  "Safety",
  "Development",
  "Events",
  "HOA",
];

export default function AdminNewsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Community");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function fetchArticles() {
    const supabase = createClient();
    // Admin sees all articles (RLS policy allows this for admins)
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    setArticles(data || []);
  }

  useEffect(() => {
    if (profile?.is_admin) fetchArticles();
  }, [profile]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setGenerating(true);

    try {
      const res = await fetch("/api/news/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, category }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate article");
      } else {
        setSuccess(`Article "${data.article.title}" generated successfully!`);
        setUrl("");
        fetchArticles();
      }
    } catch {
      setError("Network error — please try again");
    }

    setGenerating(false);
  }

  async function togglePublish(article: Article) {
    const res = await fetch("/api/news/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articleId: article.id,
        publish: !article.is_published,
      }),
    });

    if (res.ok) fetchArticles();
  }

  async function deleteArticle(id: string) {
    const supabase = createClient();
    await supabase.from("articles").delete().eq("id", id);
    fetchArticles();
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
        News Dashboard
      </h1>
      <p className="text-on-surface-variant mb-8">
        Paste a news link below. Gemini will scrape, summarize, and generate an
        image for the article.
      </p>

      {/* Generate Form */}
      <form
        onSubmit={handleGenerate}
        className="bg-surface-container-low rounded-[2rem] p-8 mb-12"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="Paste article URL here..."
            disabled={generating}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-primary/10 text-primary p-3 rounded-xl text-sm mb-4">
            {success}
          </div>
        )}

        <Button variant="gradient" type="submit" className="w-full md:w-auto">
          {generating ? (
            <>
              <Icon name="hourglass_top" className="animate-spin text-sm" />
              Generating with Gemini...
            </>
          ) : (
            <>
              <Icon name="auto_awesome" className="text-sm" />
              Generate Article
            </>
          )}
        </Button>
      </form>

      {/* Articles List */}
      <h2 className="text-2xl font-headline italic mb-6">
        All Articles ({articles.length})
      </h2>

      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-surface-container-lowest rounded-2xl p-6 flex gap-6 items-start"
          >
            {article.image_url && (
              <div className="shrink-0 w-24 h-24 rounded-xl overflow-hidden relative hidden md:block">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    article.is_published
                      ? "bg-primary/10 text-primary"
                      : "bg-tertiary-fixed text-tertiary"
                  }`}
                >
                  {article.is_published ? "Published" : "Draft"}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {article.category}
                </span>
              </div>
              <h3 className="font-headline text-lg text-on-surface mb-1 truncate">
                {article.title}
              </h3>
              <p className="text-sm text-on-surface-variant line-clamp-2 mb-2">
                {article.summary}
              </p>
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Source: {article.source_title || article.source_url}
              </a>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => togglePublish(article)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  article.is_published
                    ? "bg-tertiary-fixed text-tertiary hover:bg-tertiary hover:text-on-tertiary"
                    : "bg-primary text-on-primary hover:bg-primary-container"
                }`}
              >
                {article.is_published ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => deleteArticle(article.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {articles.length === 0 && (
          <p className="text-center text-on-surface-variant py-12">
            No articles yet. Paste a URL above to generate your first one.
          </p>
        )}
      </div>
    </div>
  );
}
