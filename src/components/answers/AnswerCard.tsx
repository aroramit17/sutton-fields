import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LastVerified } from "@/components/ui/LastVerified";
import type { Answer, AnswerCategory } from "@/actions/answers";

export const CATEGORY_LABELS: Record<AnswerCategory, string> = {
  money: "Money & Taxes",
  schools: "Schools",
  roads: "Roads & Traffic",
  hoa: "The HOA",
  living: "Living Here",
};

export function AnswerCard({ answer }: { answer: Answer }) {
  return (
    <Link
      href={`/answers/${answer.slug}`}
      className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:border-outline"
    >
      <div>
        <SectionLabel section="answers" className="!mb-2">
          {CATEGORY_LABELS[answer.category]}
        </SectionLabel>
        <h3 className="font-headline text-xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
          {answer.question}
        </h3>
      </div>
      <LastVerified date={new Date(answer.last_verified_at)} />
    </Link>
  );
}
