"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      router.push(redirect);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
        />
      </div>

      <Button variant="primary" type="submit" className="w-full py-4">
        {submitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-4xl font-headline italic text-on-surface mb-2">
        Welcome Back
      </h1>
      <p className="text-on-surface-variant mb-8">
        Sign in to your Sutton Fields resident account.
      </p>

      <Suspense fallback={<div className="h-64 bg-surface-container-low rounded-xl animate-pulse" />}>
        <LoginForm />
      </Suspense>

      <p className="text-sm text-on-surface-variant mt-6 text-center">
        Don&rsquo;t have an account?{" "}
        <Link href="/join" className="text-primary font-bold hover:underline">
          Request Access
        </Link>
      </p>
    </div>
  );
}
