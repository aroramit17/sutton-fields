"use server";

import { desc, eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import { GoogleGenAI } from "@google/genai";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import type { Article } from "@/types/database";

// Lazy — this module is imported by the public /news page too, which has no
// reason to touch Gemini. A top-level instantiation would throw at import
// time (crashing /news) whenever GEMINI_API_KEY isn't set, same failure
// mode as a top-level neon() call.
let _genai: GoogleGenAI | null = null;
function getGenAI() {
  if (!_genai) _genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  return _genai;
}

function serialize(a: typeof articles.$inferSelect): Article {
  return {
    ...a,
    published_at: a.published_at?.toISOString() ?? null,
    created_at: a.created_at.toISOString(),
  };
}

export async function getPublishedArticles(): Promise<Article[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.is_published, true))
    .orderBy(desc(articles.published_at));
  return rows.map(serialize);
}

export async function getAllArticlesForAdmin(): Promise<Article[]> {
  await requireAdmin();
  const db = getDb();
  const rows = await db.select().from(articles).orderBy(desc(articles.created_at));
  return rows.map(serialize);
}

export async function togglePublishArticle(articleId: string, publish: boolean) {
  await requireAdmin();
  const db = getDb();
  await db
    .update(articles)
    .set({ is_published: publish, published_at: publish ? new Date() : null })
    .where(eq(articles.id, articleId));
}

export async function deleteArticle(articleId: string) {
  await requireAdmin();
  const db = getDb();
  await db.delete(articles).where(eq(articles.id, articleId));
}

function extractText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : "Untitled";
}

// Admin-only: scrape a source URL, summarize + generate a headline/image with
// Gemini, upload the image to Vercel Blob, and save as an unpublished draft.
// Consolidates the old /api/news/generate + /api/news/publish routes.
export async function generateArticleDraft(url: string, category: string) {
  await requireAdmin();
  const genai = getGenAI();

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SuttonFieldsBot/1.0; +https://suttonfields.com)",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  const articleText = extractText(html);
  const sourceTitle = extractTitle(html);

  const summaryResponse = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are a community news editor for Sutton Fields, a residential neighborhood in Celina, Texas. Summarize the following article in 2-3 paragraphs that would be relevant and interesting to neighborhood residents. Write in a warm, community-focused tone. Include key facts and dates. Do not include any preamble like "Here's a summary" — just write the summary directly.

Article source: ${url}
Article title: ${sourceTitle}

Article content:
${articleText}`,
          },
        ],
      },
    ],
  });

  const summary =
    summaryResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Summary could not be generated.";

  const titleResponse = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Write a short, engaging headline (max 80 characters) for this community news article summary. No quotes around it. Just the headline text.

Summary: ${summary}`,
          },
        ],
      },
    ],
  });

  const generatedTitle =
    titleResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || sourceTitle;

  let imageUrl: string | null = null;
  try {
    const imageResponse = await genai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate a photorealistic editorial image for a community newspaper article with this headline: "${generatedTitle}". The image should look like a professional photograph that could accompany a local neighborhood news story. Style: warm, inviting, community-focused. Setting: suburban Texas neighborhood. Do NOT include any text or words in the image.`,
            },
          ],
        },
      ],
      config: { responseModalities: ["TEXT", "IMAGE"] },
    });

    const parts = imageResponse.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith("image/")) {
        const imageBuffer = Buffer.from(part.inlineData.data!, "base64");
        const blob = await put(`article-images/${crypto.randomUUID()}.png`, imageBuffer, {
          access: "public",
          contentType: "image/png",
        });
        imageUrl = blob.url;
        break;
      }
    }
  } catch (imgError) {
    console.error("Image generation failed, continuing without image:", imgError);
  }

  const { userId } = await requireAdmin();
  const db = getDb();
  const [article] = await db
    .insert(articles)
    .values({
      title: generatedTitle,
      summary,
      source_url: url,
      source_title: sourceTitle,
      image_url: imageUrl,
      category: category || "Community",
      is_published: false,
      created_by: userId,
    })
    .returning();

  return serialize(article);
}
