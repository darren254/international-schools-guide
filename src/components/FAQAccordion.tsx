"use client";

import { useState } from "react";
import Link from "next/link";
import type { FAQItem } from "./FAQ";

export function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-warm-border">
      {faqs.map((faq, i) => (
        <div key={i} className="py-5">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between items-center text-left"
          >
            <span className="text-body-sm font-semibold pr-4 text-charcoal">
              {faq.question}
            </span>
            <span className="text-xl text-primary flex-shrink-0">
              {openIndex === i ? "\u2212" : "+"}
            </span>
          </button>
          {openIndex === i && (
            <div className="mt-3">
              <p className="text-sm text-charcoal-muted leading-relaxed">
                {faq.answer}
              </p>
              {faq.links && faq.links.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                  {faq.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-primary hover:text-primary-hover transition-colors"
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
