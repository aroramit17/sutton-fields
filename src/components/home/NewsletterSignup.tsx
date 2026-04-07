"use client";

import { Icon } from "@/components/ui/Icon";

export function NewsletterSignup() {
  return (
    <section className="max-w-5xl mx-auto px-8 my-24">
      <div className="bg-surface-container-lowest p-12 md:p-20 rounded-[3rem] text-center shadow-elevated relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-headline mb-6 italic">
            Stay in the loop
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto mb-10">
            Get the &ldquo;Weekly Common&rdquo; digest delivered straight to
            your inbox. No spam, just the neighborhood pulse.
          </p>
          <form
            className="flex flex-col md:flex-row gap-4 max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              // Future: wire to Server Action or API
            }}
          >
            <input
              type="email"
              className="flex-1 bg-surface-container-low border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant/60"
              placeholder="Your email address"
            />
            <button
              type="submit"
              className="bg-primary text-on-primary font-bold px-8 py-4 rounded-xl hover:bg-primary-container transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Icon name="park" className="!text-[300px]" />
        </div>
      </div>
    </section>
  );
}
