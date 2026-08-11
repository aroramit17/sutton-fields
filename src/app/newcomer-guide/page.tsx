import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { newcomerSteps } from "@/data/newcomer";

export default function NewcomerGuidePage() {
  return (
    <div className="pb-24 px-6 max-w-4xl mx-auto">
      <PageHeader
        label="Live Here"
        title="New to Sutton Fields?"
        description="Five things to do in your first few weeks — from joining the neighbor network to getting pool access sorted."
      />

      <div className="space-y-6">
        {newcomerSteps.map((step, i) => (
          <div
            key={step.title}
            className="flex gap-6 bg-surface-container-low rounded-3xl p-6"
          >
            <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Icon name={step.icon} />
            </div>
            <div>
              <div className="text-xs font-bold text-primary mb-1">
                Step {i + 1}
              </div>
              <h3 className="text-lg font-headline italic text-on-surface mb-1">
                {step.title}
              </h3>
              <p className="text-on-surface-variant text-sm">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
