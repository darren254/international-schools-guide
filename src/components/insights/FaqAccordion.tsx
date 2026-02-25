export type FaqItem = { question: string; answer: string };

/** FAQ list with all content visible (no accordion) for SEO. */
export function FaqList({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="space-y-4">
      {faqs.map((faq) => {
        const id = faq.question.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "");
        return (
          <div key={faq.question} className="border border-warm-border rounded-sm p-4 bg-cream-200">
            <h3 className="font-display text-lg text-charcoal mb-2" id={id}>
              {faq.question}
            </h3>
            <p className="text-charcoal-muted leading-relaxed">{faq.answer}</p>
          </div>
        );
      })}
    </div>
  );
}
