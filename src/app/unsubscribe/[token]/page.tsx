import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { subscribers } from "@/db/schema";

// One-click unsubscribe target from the Dispatch footer. Must run on every
// hit (the whole point is the side effect), so no caching.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false },
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Props {
  params: Promise<{ token: string }>;
}

export default async function UnsubscribePage({ params }: Props) {
  const { token } = await params;

  let ok = false;
  if (UUID_RE.test(token)) {
    const db = getDb();
    const result = await db
      .update(subscribers)
      .set({ unsubscribed_at: new Date() })
      .where(eq(subscribers.unsubscribe_token, token))
      .returning({ id: subscribers.id });
    ok = result.length > 0;
  }

  return (
    <div className="pb-24 px-6 max-w-xl mx-auto pt-16 text-center">
      <h1 className="font-headline text-3xl font-bold text-on-surface mb-4">
        {ok ? "You're unsubscribed." : "That link didn't work."}
      </h1>
      <p className="text-on-surface-variant mb-8">
        {ok
          ? "No more Thursday Dispatch emails. If this was a mistake, you can sign up again below in ten seconds."
          : "This unsubscribe link is invalid or was already used with a different address. If you keep getting the Dispatch and want out, reply to any issue and a human will remove you."}
      </p>
      <Link
        href="/#dispatch"
        className="inline-block rounded-xl bg-primary px-6 py-3 font-bold text-on-primary"
      >
        {ok ? "Re-subscribe" : "Back to the site"}
      </Link>
    </div>
  );
}
