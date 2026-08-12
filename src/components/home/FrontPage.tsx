import Image from "next/image";
import Link from "next/link";
import { getFeaturedArticle, getPublishedArticles } from "@/actions/articles";
import { getUpcomingEvents } from "@/actions/events";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Dateline } from "@/components/ui/Dateline";

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

/**
 * The A1 front page: a classic broadsheet grid. Main well (lead story plus
 * secondary stories) on the left, a rail of the latest wire items and this
 * week's events on the right, separated by a vertical column rule.
 */
export async function FrontPage() {
  const [lead, articles, events] = await Promise.all([
    getFeaturedArticle(),
    getPublishedArticles(),
    getUpcomingEvents().catch(() => []),
  ]);
  if (!lead) return null;

  const rest = articles.filter((a) => a.id !== lead.id);
  const secondary = rest.slice(0, 4);
  const wire = rest.slice(4, 10);
  const weekEvents = events.slice(0, 5);

  const published = lead.published_at
    ? new Date(lead.published_at)
    : new Date(lead.created_at);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-0">
        {/* Main well */}
        <div className="lg:col-span-8 lg:pr-10">
          <Link href="/news" className="group block">
            <SectionLabel section="news">{lead.category}</SectionLabel>
            <h1 className="headline-lg mt-2 !text-[clamp(1.9rem,4vw,3rem)] text-on-surface transition-colors group-hover:text-primary">
              {lead.title}
            </h1>
            {lead.image_url && (
              <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-sm">
                <Image
                  src={lead.image_url}
                  alt={lead.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            )}
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant line-clamp-5">
              {lead.summary}
            </p>
            <div className="mt-4">
              <Dateline date={published} />
            </div>
          </Link>

          {secondary.length > 0 && (
            <div className="hairline mt-8 grid gap-x-10 gap-y-6 pt-7 sm:grid-cols-2">
              {secondary.map((a) => (
                <Link key={a.id} href="/news" className="group block">
                  <SectionLabel section="news" className="!mb-1">
                    {a.category}
                  </SectionLabel>
                  <h3 className="font-headline text-xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant line-clamp-3">
                    {a.summary}
                  </p>
                  <span className="dateline mt-2 block">
                    {relativeDate(a.published_at ?? a.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Rail */}
        <aside className="lg:col-span-4 lg:border-l lg:border-outline-variant lg:pl-10">
          {wire.length > 0 && (
            <div className="mb-9">
              <div className="flex items-baseline justify-between border-b-2 border-on-surface pb-2">
                <h2 className="dateline !text-on-surface">The Latest</h2>
                <Link href="/news" className="dateline !text-primary">
                  All news →
                </Link>
              </div>
              <ul>
                {wire.map((a) => (
                  <li key={a.id} className="hairline first:border-t-0">
                    <Link href="/news" className="group block py-3.5">
                      <span className="font-headline text-base font-semibold leading-snug text-on-surface transition-colors group-hover:text-primary">
                        {a.title}
                      </span>
                      <span className="dateline mt-1 block">
                        {relativeDate(a.published_at ?? a.created_at)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {weekEvents.length > 0 && (
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-on-surface pb-2">
                <h2 className="dateline !text-on-surface">This Week</h2>
                <Link href="/events" className="dateline !text-primary">
                  Full calendar →
                </Link>
              </div>
              <ul>
                {weekEvents.map((e) => {
                  const d = new Date(e.event_date);
                  const tz = e.has_time ? "America/Chicago" : "UTC";
                  const when = d.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    timeZone: tz,
                  });
                  const time = e.has_time
                    ? d.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone: "America/Chicago",
                      })
                    : null;
                  return (
                    <li key={e.id} className="hairline first:border-t-0">
                      <Link href="/events" className="group block py-3.5">
                        <span className="dateline block !text-(--color-section-events)">
                          {when}
                          {time ? ` · ${time}` : ""}
                        </span>
                        <span className="mt-0.5 block font-headline text-base font-semibold leading-snug text-on-surface transition-colors group-hover:text-primary">
                          {e.title}
                        </span>
                        {e.location && (
                          <span className="mt-0.5 block text-xs text-on-surface-variant">
                            {e.location}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
