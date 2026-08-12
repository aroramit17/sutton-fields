import OpenAI from "openai";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { articles, events } from "@/db/schema";

// The Tipline: the Facebook group can't be scraped (private, ToS), so the
// admin uploads screenshots of relevant posts/flyers and the vision model
// extracts events and news items into the existing draft pipelines. Shares
// techniques with wilson-weekly.ts (data-URI images, plausible-date guard,
// cross-DB event dedup) but stays independent so neither pipeline's prompt
// tuning breaks the other.

const TEXT_MODEL = "gpt-5.6-luna";

function getOpenAI(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

const IMAGE_FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; SuttonFieldsBot/1.0; +https://suttonfields.info)",
};

async function fetchImageAsDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: IMAGE_FETCH_HEADERS });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/png";
    if (!contentType.startsWith("image/")) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

interface TiplineEvent {
  title: string;
  description: string;
  event_date: string;
  location: string;
}

interface TiplineNews {
  title: string;
  summary: string;
  category: string;
}

interface TiplineExtraction {
  events: TiplineEvent[];
  news: TiplineNews[];
}

function parseExtraction(text: string): TiplineExtraction {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return { events: [], news: [] };
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    return {
      events: Array.isArray(parsed.events) ? parsed.events : [],
      news: Array.isArray(parsed.news) ? parsed.news : [],
    };
  } catch {
    return { events: [], news: [] };
  }
}

function isPlausibleEventDate(eventDate: Date, referenceDate: Date): boolean {
  const daysDiff = (eventDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff >= -30 && daysDiff < 366;
}

export interface TiplineResult {
  eventsCreated: { title: string; event_date: string }[];
  eventsSkipped: string[];
  newsDrafted: string[];
}

export async function processTiplineImages(
  imageUrls: string[],
  createdBy: string
): Promise<TiplineResult> {
  const openai = getOpenAI();
  const db = getDb();
  const today = new Date();
  const referenceDate = today.toISOString().slice(0, 10);

  const dataUris = (await Promise.all(imageUrls.map(fetchImageAsDataUri))).filter(
    (uri): uri is string => uri !== null
  );
  if (dataUris.length === 0) {
    return { eventsCreated: [], eventsSkipped: [], newsDrafted: [] };
  }

  const content: OpenAI.Responses.ResponseInputContent[] = [
    {
      type: "input_text",
      text:
        `These are screenshots submitted by the admin of a neighborhood community site for Sutton Fields (Celina, TX) — typically Facebook group posts, flyers, HOA letters, or school notices. Today's date is ${referenceDate}. ` +
        "Extract two things: (1) EVENTS — anything with a specific date (community events, meetings, closures, deadlines). Resolve partial dates to the nearest sensible upcoming occurrence relative to today. " +
        "(2) NEWS — noteworthy neighborhood information without a specific event date (a new store opening announcement, HOA policy change, construction notice). " +
        "Ignore personal chatter, comments, usernames, and anything identifying a private individual — extract only the substantive community information. " +
        'Respond with ONLY a JSON object (no prose, no markdown fences): {"events": [{"title": string, "description": string (1-2 sentences), "event_date": "YYYY-MM-DD", "location": string ("" if unknown)}], "news": [{"title": string (headline), "summary": string (2-3 sentences), "category": string (one of: Community, Schools, City, Construction, Retail)}]}. ' +
        'If nothing qualifies, respond: {"events": [], "news": []}',
    },
    ...dataUris.map(
      (uri): OpenAI.Responses.ResponseInputContent => ({
        type: "input_image",
        image_url: uri,
        detail: "high",
      })
    ),
  ];

  const response = await openai.responses.create({
    model: TEXT_MODEL,
    input: [{ role: "user", content }],
  });
  const extraction = parseExtraction(response.output_text ?? "");

  const result: TiplineResult = { eventsCreated: [], eventsSkipped: [], newsDrafted: [] };

  for (const e of extraction.events) {
    const parsedDate = new Date(e.event_date);
    if (Number.isNaN(parsedDate.getTime()) || !isPlausibleEventDate(parsedDate, today)) {
      result.eventsSkipped.push(`${e.title} (implausible date ${e.event_date})`);
      continue;
    }
    const dayStart = new Date(
      Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate())
    );
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const alreadyExists = await db
      .select({ id: events.id })
      .from(events)
      .where(
        and(
          eq(sql`lower(${events.title})`, e.title.toLowerCase().trim()),
          gte(events.event_date, dayStart),
          lt(events.event_date, dayEnd)
        )
      )
      .limit(1);
    if (alreadyExists.length > 0) {
      result.eventsSkipped.push(`${e.title} (duplicate)`);
      continue;
    }

    // Unpublished draft: unlike Wilson Weekly (a trusted school newsletter),
    // tipline screenshots get a human look before going live.
    await db.insert(events).values({
      title: e.title,
      description: e.description,
      event_date: parsedDate,
      has_time: false,
      location: e.location || null,
      is_published: false,
      source: "manual",
      created_by: createdBy,
    });
    result.eventsCreated.push({ title: e.title, event_date: e.event_date });
  }

  for (const n of extraction.news) {
    // articles.source_url is NOT NULL and used for dedup — synthesize a unique
    // pointer back to the group since screenshots have no canonical URL.
    const sourceUrl = `https://www.facebook.com/groups/suttonfields#tipline-${Date.now()}-${result.newsDrafted.length}`;
    await db.insert(articles).values({
      title: n.title,
      summary: n.summary,
      source_url: sourceUrl,
      source_title: "Sutton Fields Facebook group (screenshot)",
      category: n.category || "Community",
      is_published: false,
      created_by: createdBy,
    });
    result.newsDrafted.push(n.title);
  }

  return result;
}
