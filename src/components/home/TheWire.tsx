import Link from "next/link";
import { getFeaturedArticle, getPublishedArticles } from "@/actions/articles";
import { SectionLabel } from "@/components/ui/SectionLabel";

function relativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/Chicago",
  });
}

/** Compact latest-news list — the wire feed below the lead story. */
export async function TheWire() {
  const [lead, articles] = await Promise.all([
    getFeaturedArticle(),
    getPublishedArticles(),
  ]);
  const rest = articles.filter((a) => a.id !== lead?.id).slice(0, 5);
  if (rest.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <div className="hairline flex items-end justify-between pt-6">
        <h2 className="font-headline text-3xl font-bold text-on-surface">The Wire</h2>
        <Link
          href="/news"
          className="dateline !text-primary transition-colors hover:!text-primary-container"
        >
          All news →
        </Link>
      </div>
      <ul className="mt-6">
        {rest.map((a) => (
          <li key={a.id} className="hairline first:border-t-0">
            <Link href="/news" className="group flex items-baseline gap-4 py-4">
              <SectionLabel section="news" className="!mb-0 shrink-0">
                {a.category}
              </SectionLabel>
              <span className="min-w-0 flex-1 font-headline text-lg font-semibold leading-snug text-on-surface transition-colors group-hover:text-primary">
                {a.title}
              </span>
              <span className="dateline shrink-0">
                {relativeDate(a.published_at ?? a.created_at)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
