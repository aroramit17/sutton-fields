import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnswerBySlug, getPublishedAnswers } from "@/actions/answers";
import { AnswerCard, CATEGORY_LABELS } from "@/components/answers/AnswerCard";
import { RoadTracker } from "@/components/answers/RoadTracker";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LastVerified } from "@/components/ui/LastVerified";
import { FAQStructuredData } from "@/components/seo/StructuredData";
import { Markdown } from "@/lib/markdown";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

function plainText(markdown: string): string {
  return markdown.replace(/[#*[\]]/g, "").replace(/\(https?:\/\/[^\s)]+\)/g, "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const answer = await getAnswerBySlug(slug).catch(() => null);
  if (!answer) return { title: "Answer not found" };
  return {
    title: `${answer.question} — Sutton Fields Answers`,
    description: plainText(answer.answer).slice(0, 155),
    alternates: { canonical: `https://suttonfields.info/answers/${answer.slug}` },
  };
}

export default async function AnswerPage({ params }: Props) {
  const { slug } = await params;
  const answer = await getAnswerBySlug(slug).catch(() => null);
  if (!answer) notFound();

  const related = (await getPublishedAnswers().catch(() => []))
    .filter((a) => a.category === answer.category && a.id !== answer.id)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-10">
      <FAQStructuredData
        faqs={[{ question: answer.question, answer: plainText(answer.answer).slice(0, 800) }]}
      />
      <SectionLabel section="answers">
        {CATEGORY_LABELS[answer.category]}
      </SectionLabel>
      <h1 className="headline-lg text-on-surface">{answer.question}</h1>
      <div className="mt-4">
        <LastVerified date={new Date(answer.last_verified_at)} />
      </div>

      <div className="mt-8">
        <Markdown content={answer.answer} />
      </div>

      {answer.slug === "when-does-the-traffic-get-fixed" && <RoadTracker />}

      {answer.sources.length > 0 && (
        <section className="hairline mt-10 pt-6">
          <h2 className="dateline mb-4">Sources</h2>
          <ul className="space-y-2">
            {answer.sources.map((s, i) => (
              <li key={i} className="text-sm">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:text-primary-container"
                >
                  {s.title}
                </a>{" "}
                <span className="text-on-surface-variant">({s.date})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="hairline mt-10 pt-6 text-sm text-on-surface-variant">
        Spotted something outdated? This page was last verified on the date
        above — flag corrections in the{" "}
        <a
          href="https://www.facebook.com/groups/suttonfields"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2"
        >
          Facebook group
        </a>{" "}
        and it&apos;ll get fixed.
      </p>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="dateline mb-4">More in {CATEGORY_LABELS[answer.category]}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((a) => (
              <AnswerCard key={a.id} answer={a} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link href="/answers" className="dateline !text-primary">
          ← All answers
        </Link>
      </div>
    </article>
  );
}
