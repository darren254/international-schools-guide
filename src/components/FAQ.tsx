"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How much do international schools cost?",
    a: "International school fees vary widely by city and curriculum. In Jakarta, you can expect to pay between US$5,000 and US$36,000 per year. Singapore tends to be higher, at US$15,000\u2013$45,000. We publish verified, up-to-date fee data for every school we review so you can compare accurately.",
  },
  {
    q: "What is the IB curriculum?",
    a: "The International Baccalaureate (IB) is a globally recognised curriculum offered in over 5,000 schools worldwide. It emphasises critical thinking, intercultural understanding, and education from ages 3 to 19. Many expat families prefer IB for its portability when moving between countries.",
  },
  {
    q: "How do I choose the right international school?",
    a: "Consider curriculum fit, fee range, class sizes, IB or exam results, location, and community culture. Our independent editorial reviews and side-by-side comparison tools are designed to help you evaluate all of these without relying on school marketing.",
  },
  {
    q: "Is International Schools Guide really independent?",
    a: "Yes. We don\u2019t accept payment from schools to feature or promote them. Every profile is editorially written, and our fee data is independently verified. We exist to serve families, not schools.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-cream py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-display-lg text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-warm-border">
          {faqs.map((faq, i) => (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-[0.9375rem] font-semibold pr-4 text-charcoal">
                  {faq.q}
                </span>
                <span className="text-xl text-hermes flex-shrink-0">
                  {openIndex === i ? "\u2212" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <p className="text-sm text-charcoal-muted mt-3 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
