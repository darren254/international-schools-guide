import { SectionHeader } from "@/components/ui/SectionHeader";

interface ResultCard {
  value: string;
  label: string;
}

interface AcademicResultsProps {
  results: ResultCard[];
  paragraphs: string[];
}

export function AcademicResults({ results, paragraphs }: AcademicResultsProps) {
  return (
    <section className="mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader
        label="Academic Performance"
        title="Academic Results"
        id="academics"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {results.map((r) => (
          <div
            key={r.label}
            className="p-6 bg-warm-white border border-warm-border-light"
          >
            <span className="font-display text-[2rem] font-semibold block mb-1">
              {r.value}
            </span>
            <span className="text-label-sm uppercase text-charcoal-muted">
              {r.label}
            </span>
          </div>
        ))}
      </div>

      {paragraphs.map((p, i) => (
        <p key={i} className="text-[0.9375rem] text-charcoal-light leading-relaxed mb-4">
          {p}
        </p>
      ))}
    </section>
  );
}
