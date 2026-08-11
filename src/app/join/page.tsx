"use client";

import { useState } from "react";
import { SignUp, useUser } from "@clerk/nextjs";
import { useAuth } from "@/context/AuthContext";
import { createProfile } from "@/actions/profile";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

function AddressStep() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { refreshProfile } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createProfile(address);
      await refreshProfile();
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    }
    setSubmitting(false);
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
          <Icon name="check_circle" className="text-4xl" />
        </div>
        <h1 className="text-3xl font-headline italic text-on-surface mb-4">
          Application Submitted
        </h1>
        <p className="text-on-surface-variant mb-8">
          Thank you! Your account is pending admin approval. We verify that
          all sign-ups belong to Sutton Fields residents. You&rsquo;ll be
          able to post once approved.
        </p>
        <Button variant="secondary" href="/">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-headline italic text-on-surface mb-2">
        One More Step
      </h1>
      <p className="text-on-surface-variant mb-8">
        Confirm your Sutton Fields address so we can verify your account.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="text-sm font-bold text-on-surface block mb-1">
            Sutton Fields Address
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="e.g., 1234 Westminster Ave, Celina, TX 75009"
          />
          <p className="text-xs text-on-surface-variant mt-1">
            Must be a valid Sutton Fields address for verification.
          </p>
        </div>
        <Button variant="primary" type="submit" className="w-full py-4">
          {submitting ? "Submitting..." : "Request Access"}
        </Button>
      </form>
    </>
  );
}

export default function JoinPage() {
  const { isSignedIn, isLoaded } = useUser();
  const { profile, loading: profileLoading } = useAuth();

  if (!isLoaded || (isSignedIn && profileLoading)) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="h-64 bg-surface-container-low rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-4xl font-headline italic text-on-surface mb-2">
          Request Resident Access
        </h1>
        <p className="text-on-surface-variant mb-8">
          Create an account, then confirm your Sutton Fields address. Your
          account will be verified by a community admin before activation.
        </p>
        <SignUp routing="hash" fallbackRedirectUrl="/join" signInUrl="/login" />
      </div>
    );
  }

  if (profile) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 bg-tertiary-fixed rounded-full flex items-center justify-center text-tertiary mx-auto mb-6">
          <Icon name="hourglass_top" className="text-3xl" />
        </div>
        <h1 className="text-3xl font-headline italic text-on-surface mb-4">
          {profile.is_approved ? "You're All Set" : "Account Pending Approval"}
        </h1>
        <p className="text-on-surface-variant mb-8">
          {profile.is_approved
            ? "Your resident account is verified — you can post to any community board."
            : "Your account is being verified by a Sutton Fields admin. Check back soon!"}
        </p>
        <Button variant="secondary" href="/">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <AddressStep />
      <p className="text-sm text-on-surface-variant mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
