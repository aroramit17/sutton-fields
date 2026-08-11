import "server-only";
import OpenAI from "openai";
import { getDb } from "@/db";
import { events, wilson_weekly_processed } from "@/db/schema";
import { eq } from "drizzle-orm";

const AGENTMAIL_BASE = "https://api.agentmail.to/v0";
const TEXT_MODEL = "gpt-5.6-luna";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  return _openai;
}

interface AgentMailMessageSummary {
  message_id: string;
  subject: string;
  timestamp: string;
}

interface AgentMailMessage extends AgentMailMessageSummary {
  html?: string;
  text?: string;
}

interface ExtractedEvent {
  title: string;
  description: string;
  event_date: string; // YYYY-MM-DD
  location: string;
}

function agentMailHeaders() {
  return { Authorization: `Bearer ${process.env.AGENTMAIL_API_KEY!}` };
}

async function listWilsonWeeklyMessages(inboxId: string): Promise<AgentMailMessageSummary[]> {
  const since = new Date();
  since.setDate(since.getDate() - 14);
  const url = new URL(`${AGENTMAIL_BASE}/inboxes/${encodeURIComponent(inboxId)}/messages`);
  url.searchParams.set("subject", "Wilson Weekly");
  url.searchParams.set("after", since.toISOString());
  url.searchParams.set("limit", "20");

  const res = await fetch(url, { headers: agentMailHeaders() });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`AgentMail list messages failed: ${res.status} ${body}`);
  }
  const body = await res.json();
  return body.messages ?? [];
}

async function getMessage(inboxId: string, messageId: string): Promise<AgentMailMessage> {
  const url = `${AGENTMAIL_BASE}/inboxes/${encodeURIComponent(inboxId)}/messages/${encodeURIComponent(messageId)}`;
  const res = await fetch(url, { headers: agentMailHeaders() });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`AgentMail get message failed: ${res.status} ${body}`);
  }
  return res.json();
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

const DECORATIVE_IMAGE_PATTERNS = [
  /sendgrid\.net/,
  /secure\.smore\.com\/app\/reporting\/pixel/,
  /outgoing_link\.png/,
];

function extractContentImageUrls(html: string): string[] {
  const all = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
  const unique = [...new Set(all)];
  return unique.filter((url) => !DECORATIVE_IMAGE_PATTERNS.some((p) => p.test(url)));
}

function parseJsonArray(text: string): ExtractedEvent[] {
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

const JSON_INSTRUCTIONS =
  'Respond with ONLY a JSON array (no prose, no markdown fences). Each item: ' +
  '{"title": string, "description": string (1-2 sentences), "event_date": "YYYY-MM-DD", "location": string (empty string if unknown)}. ' +
  "If there are no relevant dated events, respond with exactly: []";

async function extractEventsFromText(text: string, referenceDate: string): Promise<ExtractedEvent[]> {
  const openai = getOpenAI();
  const response = await openai.responses.create({
    model: TEXT_MODEL,
    input:
      `This is the plain text of a Prosper ISD elementary school "Wilson Weekly" newsletter email, sent on ${referenceDate}. ` +
      "Extract every specific dated event, deadline, or activity mentioned (e.g. school holidays, assemblies, spirit days, form deadlines, meetings). " +
      `Resolve partial dates like "August 20th" using the school year implied by the email's send date (${referenceDate}) — if a date's month/day would fall in the current school year (roughly this send date through the following summer), use that year, not a later one. ` +
      "Skip generic non-dated calls to action (like \"visit our website\") that have no specific date attached. " +
      JSON_INSTRUCTIONS +
      "\n\nNewsletter text:\n" +
      text,
  });
  return parseJsonArray(response.output_text ?? "");
}

const IMAGE_FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; SuttonFieldsBot/1.0; +https://suttonfields.info)",
};

// OpenAI's own image-URL fetcher gets blocked (403) by Smore's CDN hotlink
// protection, so images are downloaded here (with a browser-like UA) and
// passed as data URIs instead of bare URLs.
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

async function extractEventsFromImages(
  imageUrls: string[],
  referenceDate: string
): Promise<ExtractedEvent[]> {
  if (imageUrls.length === 0) return [];
  const openai = getOpenAI();
  const batchSize = 20;
  const results: ExtractedEvent[] = [];

  for (let i = 0; i < imageUrls.length; i += batchSize) {
    const batch = imageUrls.slice(i, i + batchSize);
    const dataUris = (await Promise.all(batch.map(fetchImageAsDataUri))).filter(
      (uri): uri is string => uri !== null
    );
    if (dataUris.length === 0) continue;

    const content: OpenAI.Responses.ResponseInputContent[] = [
      {
        type: "input_text",
        text:
          `These images are from a Prosper ISD elementary school "Wilson Weekly" newsletter email, sent on ${referenceDate}. ` +
          "Look at each image. Only report images that show a calendar, list of school holidays/breaks, or an event schedule with dates. " +
          `Ignore logos, photos, maps, icons, and decorative graphics. Resolve partial dates using the school year implied by this send date (${referenceDate}) — a month/day within the current school year (this send date through the following summer) should use that year, not a later one. ` +
          "For date RANGES (e.g. a holiday break), use the first day as event_date and mention the full range in the description. " +
          JSON_INSTRUCTIONS,
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
    results.push(...parseJsonArray(response.output_text ?? ""));
  }

  return results;
}

function dedupeEvents(events: ExtractedEvent[]): ExtractedEvent[] {
  const seen = new Set<string>();
  return events.filter((e) => {
    const key = `${e.title.toLowerCase().trim()}|${e.event_date}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// The model occasionally resolves a partial date ("August 7th") to the wrong
// year — e.g. exactly one year off from a correctly-dated sibling event in
// the same email. A generous window still allows a full school-year calendar
// (a "2026-2027" newsletter can legitimately reference dates ~11 months out)
// while rejecting the classic "off by exactly a year" failure mode.
function isPlausibleEventDate(eventDate: Date, referenceDate: Date): boolean {
  const daysDiff = (eventDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff >= -30 && daysDiff < 366;
}

export async function scanWilsonWeeklyInbox(): Promise<{
  scanned: number;
  processed: number;
  eventsCreated: number;
}> {
  const inboxId = process.env.AGENTMAIL_INBOX_ID || "arorafam@agentmail.to";
  const db = getDb();

  const summaries = await listWilsonWeeklyMessages(inboxId);
  let processed = 0;
  let eventsCreated = 0;

  for (const summary of summaries) {
    const existing = await db
      .select({ message_id: wilson_weekly_processed.message_id })
      .from(wilson_weekly_processed)
      .where(eq(wilson_weekly_processed.message_id, summary.message_id))
      .limit(1);
    if (existing.length > 0) continue;

    const message = await getMessage(inboxId, summary.message_id);
    const html = message.html ?? "";
    if (!html) continue;

    const referenceDate = new Date(message.timestamp).toISOString().slice(0, 10);
    const text = htmlToText(html);
    const imageUrls = extractContentImageUrls(html);

    const [textEvents, imageEvents] = await Promise.all([
      extractEventsFromText(text, referenceDate),
      extractEventsFromImages(imageUrls, referenceDate),
    ]);

    const merged = dedupeEvents([...textEvents, ...imageEvents]);

    const referenceDateObj = new Date(message.timestamp);
    let createdForThisMessage = 0;
    for (const e of merged) {
      const parsedDate = new Date(e.event_date);
      if (Number.isNaN(parsedDate.getTime())) continue;
      if (!isPlausibleEventDate(parsedDate, referenceDateObj)) {
        console.warn(
          `Wilson Weekly: dropping implausible date for "${e.title}" (${e.event_date}, reference ${referenceDateObj.toISOString()})`
        );
        continue;
      }
      await db.insert(events).values({
        title: e.title,
        description: e.description,
        event_date: parsedDate,
        location: e.location || null,
        is_published: true,
        source: "wilson_weekly",
      });
      createdForThisMessage++;
    }
    eventsCreated += createdForThisMessage;

    await db.insert(wilson_weekly_processed).values({
      message_id: summary.message_id,
      events_created: createdForThisMessage,
    });

    processed++;
  }

  return { scanned: summaries.length, processed, eventsCreated };
}
