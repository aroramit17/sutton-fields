"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

export default function JoinPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signUp } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await signUp(email, password, firstName, lastName, address);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
          <Icon name="check_circle" className="text-4xl" />
        </div>
        <h1 className="text-3xl font-headline italic text-on-surface mb-4">
          Application Submitted
        </h1>
        <p className="text-on-surface-variant mb-8">
          Thank you, {firstName}! Your account is pending admin approval. We verify
          that all sign-ups belong to Sutton Fields residents. You&rsquo;ll receive an
          email once your account is approved.
        </p>
        <Button variant="secondary" href="/login">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-4xl font-headline italic text-on-surface mb-2">
        Request Resident Access
      </h1>
      <p className="text-on-surface-variant mb-8">
        Sign up with your Sutton Fields address. Your account will be verified
        by a community admin before activation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-on-surface block mb-1">
              First Name
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-on-surface block mb-1">
              Last Name
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-on-surface block mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-on-surface block mb-1">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="Minimum 6 characters"
          />
        </div>

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

        <Button
          variant="primary"
          type="submit"
          className="w-full py-4"
        >
          {submitting ? "Submitting..." : "Request Access"}
        </Button>
      </form>

      <p className="text-sm text-on-surface-variant mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
