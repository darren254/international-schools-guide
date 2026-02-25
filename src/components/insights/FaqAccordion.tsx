"use client";

import { useState } from "react";

export type FaqItem = { question: string; answer: string };

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.question ?? null);

  return (
    <div className="space-y-2">
      {faqs.map((faq) => {
        const id = faq.question.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "");
        const isOpen = openId === faq.question;

        return (
          <div
            key={faq.question}
            className="border border-warm-border rounded-sm overflow-hidden transition-shadow hover:shadow-sm bg-cream-200"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.question)}
              className="w-full text-left px-4 py-3 flex items-center justify-between gap-4 bg-cream-200 hover:bg-cream-300 transition-colors"
              aria-expanded={isOpen}
              aria-controls={`faq-${id}`}
              id={`faq-btn-${id}`}
            >
              <span className="font-display text-lg text-charcoal pr-4">{faq.question}</span>
              <span
                className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-charcoal-muted transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </span>
            </button>
            <div
              id={`faq-${id}`}
              role="region"
              aria-labelledby={`faq-btn-${id}`}
              hidden={!isOpen}
              className={isOpen ? "block bg-cream-100" : "hidden"}
            >
              <div className="px-4 pb-4 pt-0">
                <p className="text-charcoal-muted leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
