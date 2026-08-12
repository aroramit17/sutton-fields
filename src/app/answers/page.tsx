import type { Metadata } from "next";
import { getPublishedAnswers, type AnswerCategory } from "@/actions/answers";
import { AnswerCard, CATEGORY_LABELS } from "@/components/answers/AnswerCard";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Answers — Straight Facts About Living in Sutton Fields",
  description:
    "Canonical, sourced, regularly verified answers to the questions Sutton Fields residents actually ask: property taxes and the PID, school zoning, road construction timelines, HOA processes, trash and watering rules, and more.",
  alternates: { canonical: "https://suttonfields.info/answers" },
};

export const revalidate = 3600;

const CATEGORY_ORDER: AnswerCategory[] = ["money", "schools", "roads", "hoa", "living"];

export default async function AnswersPage() {
  const answers = await getPublishedAnswers().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      <PageHeader
        label="Answers"
        title="The questions everyone asks, answered once."
        description="Sourced, dated, and re-verified — built to be pasted into the Facebook group whenever the question comes up again. Spot something outdated? Every page shows when it was last checked."
      />

      {answers.length === 0 ? (
        <p className="py-12 text-center text-on-surface-variant">
          Answers are being written — check back shortly.
        </p>
      ) : (
        <div className="space-y-12">
          {CATEGORY_ORDER.map((cat) => {
            const group = answers.filter((a) => a.category === cat);
            if (group.length === 0) return null;
            return (
              <section key={cat}>
                <div className="hairline pt-5">
                  <h2 className="mb-5 font-headline text-2xl font-bold text-on-surface">
                    {CATEGORY_LABELS[cat]}
                  </h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((a) => (
                    <AnswerCard key={a.id} answer={a} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
