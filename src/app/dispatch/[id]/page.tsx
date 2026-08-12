import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { dispatch_issues } from "@/db/schema";

export const revalidate = 3600;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Props {
  params: Promise<{ id: string }>;
}

async function getIssue(id: string) {
  if (!UUID_RE.test(id)) return null;
  const db = getDb();
  const [issue] = await db
    .select()
    .from(dispatch_issues)
    .where(eq(dispatch_issues.id, id))
    .limit(1);
  return issue && issue.sent_at ? issue : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const issue = await getIssue(id);
  if (!issue) return { title: "Issue not found" };
  return {
    title: issue.subject,
    description: "An issue of The Thursday Dispatch, the weekly Sutton Fields email digest.",
  };
}

export default async function DispatchIssuePage({ params }: Props) {
  const { id } = await params;
  const issue = await getIssue(id);
  if (!issue) notFound();

  // The stored snapshot is escape-by-construction HTML from assembleDispatch.
  // It renders in a sandboxed iframe (no scripts, no same-origin access), the
  // strictest way to show a full email document inside the site's chrome.
  const html = issue.html.replaceAll("{{UNSUB_URL}}", "https://suttonfields.info");

  return (
    <div className="pb-24 px-6 max-w-4xl mx-auto">
      <div className="py-6 flex items-baseline justify-between gap-4">
        <Link href="/dispatch" className="dateline text-primary hover:underline">
          &larr; All issues
        </Link>
        <span className="dateline">
          Sent{" "}
          {issue.sent_at!.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "America/Chicago",
          })}
        </span>
      </div>
      <iframe
        srcDoc={html}
        sandbox=""
        title={issue.subject}
        className="w-full rounded-2xl border border-outline-variant bg-[#faf8f4]"
        style={{ height: "80vh" }}
      />
    </div>
  );
}
