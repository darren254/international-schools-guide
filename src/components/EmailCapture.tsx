"use client";

export default function EmailCapture() {
  return (
    <section className="bg-primary-light py-14 px-6 text-center">
      <h2 className="font-display text-display-lg md:text-display-xl mb-2">
        Get the free Jakarta schools guide
      </h2>
      <p className="text-sm text-charcoal-muted max-w-md mx-auto mb-8 leading-relaxed">
        A curated breakdown of fees, curricula, and honest takes - delivered
        to your inbox. Plus early access when new cities go live.
      </p>
      <form
        className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="flex-1 min-w-0 px-4 py-3.5 border border-warm-border bg-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover text-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
        >
          Send Me the Guide
        </button>
      </form>
      <p className="text-label-xs text-charcoal-muted">
        No spam. Unsubscribe anytime. We&apos;re parents too.
      </p>
    </section>
  );
}
