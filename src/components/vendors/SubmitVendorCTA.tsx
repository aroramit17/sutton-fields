import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export function SubmitVendorCTA() {
  return (
    <div className="bg-primary/5 rounded-3xl p-8 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center gap-4 group">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon name="volunteer_activism" className="text-3xl" />
      </div>
      <div>
        <h3 className="text-2xl font-headline italic text-primary mb-2">
          Know a great vendor?
        </h3>
        <p className="text-on-surface-variant text-sm">
          Help your neighbors find the best services by submitting a
          recommendation.
        </p>
      </div>
      <Button variant="primary" href="/vendors/submit" className="mt-4 shadow-md hover:shadow-lg hover:-translate-y-1">
        Submit Details
      </Button>
    </div>
  );
}
