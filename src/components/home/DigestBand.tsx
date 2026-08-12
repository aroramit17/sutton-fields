"use client";

import { useState } from "react";
import { subscribe } from "@/actions/subscribers";

/** The Thursday Dispatch signup band. Anchor target for "Get the Dispatch". */
export function DigestBand() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setError(null);
    try {
      const result = await subscribe(email);
      if (result.ok) {
        setState("done");
      } else {
        setState("error");
        setError(result.error ?? "Something went wrong — try again.");
      }
    } catch {
      setState("error");
      setError("Something went wrong — try again.");
    }
  }

  return (
    <section id="dispatch" className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold text-on-primary sm:text-4xl">
            The Thursday Dispatch
          </h2>
          <p className="mt-3 text-on-primary/90">
            One email a week: events, answers, listings, and the lead story.
            No spam, unsubscribe anytime.
          </p>
          {state === "done" ? (
            <p className="mt-6 font-headline text-xl italic text-on-primary">
              You&apos;re on the list. See you Thursday.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-full border-none bg-white/95 px-5 py-3 text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-white"
                disabled={state === "saving"}
              />
              <button
                type="submit"
                disabled={state === "saving"}
                className="rounded-full bg-on-surface px-6 py-3 text-sm font-bold uppercase tracking-wider text-background transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {state === "saving" ? "Adding…" : "Sign up"}
              </button>
            </form>
          )}
          {error && <p className="mt-3 text-sm text-on-primary">{error}</p>}
        </div>
      </div>
    </section>
  );
}
