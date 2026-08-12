import "server-only";
import { put } from "@vercel/blob";
import OpenAI from "openai";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { serializeArticle } from "./article-serialize";

const TEXT_MODEL = "gpt-5.6-luna";
const IMAGE_MODEL = "gpt-image-2-2026-04-21";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  return _openai;
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

// Shared by the admin "paste a URL" action and the nightly local-news scan:
// scrape a source URL, summarize + generate a headline/image with OpenAI,
// upload the image to Vercel Blob, and save the article. Admin drafts stay
// unpublished for review; the nightly scan passes publish=true so the news
// section never sits empty. Caller is responsible for authorization — this
// function does none.
export async function draftArticleFromUrl(
  url: string,
  category: string,
  createdBy: string | null,
  options: { publish?: boolean } = {}
) {
  const openai = getOpenAI();

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SuttonFieldsBot/1.0; +https://suttonfields.info)",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  const articleText = extractText(html);
  const sourceTitle = extractTitle(html);

  const summaryResponse = await openai.responses.create({
    model: TEXT_MODEL,
    input: `You are a community news editor for Sutton Fields, a residential neighborhood in Celina, Texas. Summarize the following article in 2-3 paragraphs that would be relevant and interesting to neighborhood residents. Write in a warm, community-focused tone. Include key facts and dates. Never use em dashes; use commas, colons, or separate sentences instead. Do not include any preamble like "Here's a summary", just write the summary directly.

Article source: ${url}
Article title: ${sourceTitle}

Article content:
${articleText}`,
  });

  const summary = summaryResponse.output_text || "Summary could not be generated.";

  const titleResponse = await openai.responses.create({
    model: TEXT_MODEL,
    input: `Write a short, engaging headline (max 80 characters) for this community news article summary. No quotes around it. Never use em dashes. Just the headline text.

Summary: ${summary}`,
  });

  const generatedTitle = titleResponse.output_text?.trim() || sourceTitle;

  let imageUrl: string | null = null;
  try {
    const imageResponse = await openai.images.generate({
      model: IMAGE_MODEL,
      prompt: `Generate a photorealistic editorial image for a community newspaper article with this headline: "${generatedTitle}". The image should look like a professional photograph that could accompany a local neighborhood news story. Style: warm, inviting, community-focused. Setting: suburban Texas neighborhood. Do NOT include any text or words in the image.`,
      size: "1024x1024",
    });

    const b64 = imageResponse.data?.[0]?.b64_json;
    if (b64) {
      const imageBuffer = Buffer.from(b64, "base64");
      const blob = await put(`article-images/${crypto.randomUUID()}.png`, imageBuffer, {
        access: "public",
        contentType: "image/png",
      });
      imageUrl = blob.url;
    }
  } catch (imgError) {
    console.error("Image generation failed, continuing without image:", imgError);
  }

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
      is_published: options.publish ?? false,
      published_at: options.publish ? new Date() : null,
      created_by: createdBy,
    })
    .returning();

  return serializeArticle(article);
}
