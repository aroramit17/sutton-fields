import type { Metadata } from "next";
import Link from "next/link";
import { desc, isNotNull } from "drizzle-orm";
import { getDb } from "@/db";
import { dispatch_issues } from "@/db/schema";
import { PageHeader } from "@/components/layout/PageHeader";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The Thursday Dispatch: Past Issues",
  description:
    "Every issue of The Thursday Dispatch, the weekly Sutton Fields email digest: news, events, answers, and classifieds in one Thursday email.",
  alternates: { canonical: "https://suttonfields.info/dispatch" },
};

export default async function DispatchArchivePage() {
  const db = getDb();
  const issues = await db
    .select({
      id: dispatch_issues.id,
      subject: dispatch_issues.subject,
      sent_at: dispatch_issues.sent_at,
      recipient_count: dispatch_issues.recipient_count,
    })
    .from(dispatch_issues)
    .where(isNotNull(dispatch_issues.sent_at))
    .orderBy(desc(dispatch_issues.sent_at));

  return (
    <div className="pb-24 px-6 max-w-4xl mx-auto">
      <PageHeader
        label="The Thursday Dispatch"
        title="Every issue, on the record."
        description="The weekly Sutton Fields digest lands every Thursday evening: the week's news, what's happening, freshly verified answers, and classifieds. Sign up on the homepage."
      />
      {issues.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-8 text-center">
          <p className="font-headline text-xl text-on-surface mb-2">
            The first issue hasn&apos;t gone out yet.
          </p>
          <p className="text-sm text-on-surface-variant">
            Sign up on the{" "}
            <Link href="/#dispatch" className="text-primary font-semibold hover:underline">
              homepage
            </Link>{" "}
            and it will land in your inbox on Thursday evening.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-outline-variant">
          {issues.map((issue) => (
            <li key={issue.id}>
              <Link
                href={`/dispatch/${issue.id}`}
                className="group flex items-baseline justify-between gap-4 py-5"
              >
                <span className="font-headline text-xl font-bold text-on-surface group-hover:text-primary">
                  {issue.subject}
                </span>
                <span className="dateline shrink-0">
                  {issue.sent_at?.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "America/Chicago",
                  })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
