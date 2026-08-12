import Image from "next/image";
import Link from "next/link";
import { getFeaturedArticle } from "@/actions/articles";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Dateline } from "@/components/ui/Dateline";

/** The front page's single biggest element: one story, newspaper-sized. */
export async function LeadStory() {
  const article = await getFeaturedArticle();
  if (!article) return null;

  const published = article.published_at
    ? new Date(article.published_at)
    : new Date(article.created_at);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-8">
      <Link href="/news" className="group grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col justify-center lg:col-span-7">
          <SectionLabel section="news">{article.category}</SectionLabel>
          <h1 className="headline-xl text-on-surface transition-colors group-hover:text-primary">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            {article.summary}
          </p>
          <div className="mt-5">
            <Dateline date={published} />
          </div>
        </div>
        {article.image_url && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl lg:col-span-5">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
      </Link>
    </section>
  );
}
