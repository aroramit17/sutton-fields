"use server";

import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { draftArticleFromUrl } from "@/lib/article-draft";
import { serializeArticle } from "@/lib/article-serialize";
import type { Article } from "@/types/database";

export async function getPublishedArticles(): Promise<Article[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.is_published, true))
    .orderBy(desc(articles.published_at));
  return rows.map(serializeArticle);
}

export async function getAllArticlesForAdmin(): Promise<Article[]> {
  await requireAdmin();
  const db = getDb();
  const rows = await db.select().from(articles).orderBy(desc(articles.created_at));
  return rows.map(serializeArticle);
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

// Admin-only: scrape a source URL, summarize + generate a headline/image with
// OpenAI, upload the image to Vercel Blob, and save as an unpublished draft.
export async function generateArticleDraft(url: string, category: string) {
  const { userId } = await requireAdmin();
  return draftArticleFromUrl(url, category, userId);
}
