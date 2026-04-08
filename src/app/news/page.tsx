import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { NewsArticleCard } from "@/components/news/NewsArticleCard";
import { BreadcrumbStructuredData } from "@/components/seo/StructuredData";
import type { Article } from "@/types/database";

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const publishedArticles = (articles as Article[]) || [];
  const featured = publishedArticles[0];
  const rest = publishedArticles.slice(1);

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", href: "/" },
          { name: "News", href: "/news" },
        ]}
      />

      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">
        <PageHeader
          label="Community News"
          title="What's Happening in Celina"
          description="Stay up to date with the latest news relevant to Sutton Fields residents — city updates, school news, and community developments."
        />

        {publishedArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-on-surface-variant text-lg">
              No news articles published yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Article */}
            {featured && (
              <NewsArticleCard article={featured} featured />
            )}

            {/* Rest of articles */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((article) => (
                  <NewsArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
