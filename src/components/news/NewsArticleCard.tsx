import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Article } from "@/types/database";

interface NewsArticleCardProps {
  article: Article;
  featured?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function NewsArticleCard({ article, featured }: NewsArticleCardProps) {
  if (featured) {
    return (
      <article className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {article.image_url && (
          <div className="md:col-span-7 relative aspect-[16/10] rounded-[2rem] overflow-hidden">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-6 left-6">
              <span className="bg-primary text-on-primary text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                {article.category}
              </span>
            </div>
          </div>
        )}
        <div className={article.image_url ? "md:col-span-5 flex flex-col justify-center" : "md:col-span-12"}>
          <span className="text-xs text-on-surface-variant mb-2 block">
            {article.published_at && formatDate(article.published_at)}
          </span>
          <h2 className="text-3xl md:text-4xl font-headline mb-4 leading-tight">
            {article.title}
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-6">
            {article.summary}
          </p>
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
          >
            Read Original Source
            <Icon name="open_in_new" className="text-sm" />
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-surface-container-low rounded-3xl overflow-hidden hover:shadow-xl transition-shadow">
      {article.image_url && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-tertiary uppercase">
            {article.category}
          </span>
          <span className="text-xs text-on-surface-variant">
            {article.published_at && formatDate(article.published_at)}
          </span>
        </div>
        <h3 className="text-xl font-headline italic mb-3 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-on-surface-variant text-sm line-clamp-3 mb-4">
          {article.summary}
        </p>
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary font-bold text-xs"
        >
          Read Source <Icon name="open_in_new" className="text-xs" />
        </a>
      </div>
    </article>
  );
}
