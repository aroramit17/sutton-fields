import "server-only";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { draftArticleFromUrl } from "./article-draft";

const TEXT_MODEL = "gpt-5.6-luna";
const CATEGORIES = [
  "Community",
  "City of Celina",
  "Prosper ISD",
  "Safety",
  "Development",
  "Events",
  "HOA",
];

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  return _openai;
}

interface NewsHit {
  title: string;
  url: string;
  published_date: string;
  summary: string;
  category: string;
}

function parseJsonArray(text: string): NewsHit[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return [];
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Nightly: search the web for genuinely recent, hyper-local news and publish
// each new hit directly (owner decision Aug 2026: an empty news section costs
// more than the small risk of an off-target story; the prompt's real-URL and
// geography guardrails plus source_url dedup stay in force, and anything off
// can be unpublished in /admin/news).
export async function scanForLocalNews(): Promise<{ found: number; drafted: number }> {
  const openai = getOpenAI();
  const today = new Date().toISOString().slice(0, 10);

  const response = await openai.responses.create({
    model: TEXT_MODEL,
    tools: [{ type: "web_search" }],
    input:
      `Today is ${today}. Search the web for REAL local news articles published within the last 5 days ` +
      "that are directly relevant to residents of Sutton Fields, a neighborhood in Celina, Texas 75009, " +
      "located at 4600 Waugh Avenue. Prioritize stories from roughly a 5 mile radius: Celina city " +
      "government/council news, road/traffic/development news, public safety, Prosper ISD school news " +
      "(especially Dan Christie Elementary, Moseley Middle School, or Richland High School), and community events. " +
      "Only include articles you actually found via search with real, working URLs. Never invent a URL or " +
      "article. It is completely fine to return an empty list if nothing genuinely recent and relevant exists. " +
      `Classify each into one of: ${CATEGORIES.join(", ")}. ` +
      'Respond with ONLY a JSON array (no prose, no markdown fences), up to 5 items: ' +
      '[{"title": string, "url": string, "published_date": "YYYY-MM-DD", "summary": string, "category": string}]. ' +
      "If nothing qualifies, respond with exactly: []",
  });

  const hits = parseJsonArray(response.output_text ?? "");
  const db = getDb();
  let drafted = 0;

  for (const hit of hits) {
    if (!hit.url) continue;
    const existing = await db
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.source_url, hit.url))
      .limit(1);
    if (existing.length > 0) continue;

    try {
      await draftArticleFromUrl(
        hit.url,
        CATEGORIES.includes(hit.category) ? hit.category : "Community",
        null,
        { publish: true }
      );
      drafted++;
    } catch (err) {
      console.warn(`News scan: failed to draft ${hit.url}:`, err);
    }
  }

  return { found: hits.length, drafted };
}
