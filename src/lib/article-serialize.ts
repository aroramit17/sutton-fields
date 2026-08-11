import type { articles } from "@/db/schema";
import type { Article } from "@/types/database";

export function serializeArticle(a: typeof articles.$inferSelect): Article {
  return {
    ...a,
    published_at: a.published_at?.toISOString() ?? null,
    created_at: a.created_at.toISOString(),
  };
}
