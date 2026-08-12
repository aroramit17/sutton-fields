import Link from "next/link";
import { getActiveListings } from "@/actions/listings";
import { vendors } from "@/data/vendors";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Newest classifieds + directory picks in one strip. */
export async function AroundTheNeighborhood() {
  const listings = (await getActiveListings().catch(() => [])).slice(0, 3);
  const featuredVendors = vendors.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <div className="hairline pt-6">
        <h2 className="font-headline text-3xl font-bold text-on-surface">
          Around the Neighborhood
        </h2>
      </div>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <div className="flex items-baseline justify-between">
            <SectionLabel section="classifieds">Newest Classifieds</SectionLabel>
            <Link href="/classifieds" className="dateline !text-primary">
              All →
            </Link>
          </div>
          {listings.length === 0 ? (
            <p className="py-4 text-sm text-on-surface-variant">
              Nothing listed right now. Verified residents can post anytime.
            </p>
          ) : (
            <ul>
              {listings.map((l) => (
                <li key={l.id} className="hairline first:border-t-0">
                  <Link
                    href="/classifieds"
                    className="group flex items-baseline justify-between gap-4 py-3"
                  >
                    <span className="min-w-0 flex-1 truncate font-semibold text-on-surface transition-colors group-hover:text-primary">
                      {l.title}
                    </span>
                    <span className="shrink-0 font-headline text-lg font-bold text-on-surface">
                      ${Number(l.price).toLocaleString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <SectionLabel section="directory">From the Directory</SectionLabel>
            <Link href="/directory" className="dateline !text-primary">
              All →
            </Link>
          </div>
          <ul>
            {featuredVendors.map((v) => (
              <li key={v.id} className="hairline first:border-t-0">
                <Link
                  href="/directory"
                  className="group block py-3"
                >
                  <span className="font-semibold text-on-surface transition-colors group-hover:text-primary">
                    {v.name}
                  </span>
                  <span className="block truncate text-sm text-on-surface-variant">
                    {v.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
