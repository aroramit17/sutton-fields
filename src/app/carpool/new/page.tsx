"use client";

import { useAuth } from "@/context/AuthContext";
import { CarpoolForm } from "@/components/carpool/CarpoolForm";
import { ContentGate } from "@/components/ui/ContentGate";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NewCarpoolPage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="h-8 bg-surface-container-high rounded-xl animate-pulse mb-4" />
        <div className="h-64 bg-surface-container-low rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <ContentGate
          title="Sign In Required"
          description="You need a verified Sutton Fields resident account to post to the Carpool Board."
        />
      </div>
    );
  }

  if (profile && !profile.is_approved) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 bg-tertiary-fixed rounded-full flex items-center justify-center text-tertiary mx-auto mb-6">
          <Icon name="hourglass_top" className="text-3xl" />
        </div>
        <h1 className="text-3xl font-headline italic text-on-surface mb-4">
          Account Pending Approval
        </h1>
        <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
          Your account is being verified by a Sutton Fields admin. You&rsquo;ll
          be able to post once approved. Check back soon!
        </p>
        <Button variant="secondary" href="/carpool">
          Browse Carpool Board
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/carpool"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-6 transition-colors"
      >
        <Icon name="arrow_back" className="text-sm" /> Back to Carpool Board
      </Link>

      <h1 className="text-4xl font-headline italic text-on-surface mb-2">
        Post a Carpool Request
      </h1>
      <p className="text-on-surface-variant mb-8">
        Find a match for a school run or commute.
      </p>

      <CarpoolForm />
    </div>
  );
}
