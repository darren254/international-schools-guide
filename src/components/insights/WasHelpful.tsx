"use client";

import { useState } from "react";

export function WasHelpful() {
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);

  return (
    <section className="mt-10 border border-warm-border rounded-sm p-4 font-sans bg-cream-200">
      <p className="text-sm font-medium text-charcoal mb-3">Was this helpful?</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setChoice("yes")}
          className={`px-3 py-1.5 text-sm rounded border transition-colors ${
            choice === "yes"
              ? "border-primary bg-primary/10 text-primary"
              : "border-warm-border text-charcoal hover:border-charcoal"
          }`}
        >
          👍 Yes
        </button>
        <button
          type="button"
          onClick={() => setChoice("no")}
          className={`px-3 py-1.5 text-sm rounded border transition-colors ${
            choice === "no"
              ? "border-primary bg-primary/10 text-primary"
              : "border-warm-border text-charcoal hover:border-charcoal"
          }`}
        >
          👎 No
        </button>
      </div>
    </section>
  );
}

