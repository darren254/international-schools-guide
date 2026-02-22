import { SectionHeader } from "@/components/ui/SectionHeader";
import { displayValue } from "@/lib/utils/display";

interface ResultCard {
  value: string;
  label: string;
}

interface AcademicResultsProps {
  results: ResultCard[];
  paragraphs: string[];
}

function hasValidContent(results: ResultCard[], paragraphs: string[]): boolean {
  const hasResult = results.some(
    (r) => displayValue(r.value, "") !== "" || displayValue(r.label, "") !== ""
  );
  const hasParagraph = paragraphs.some((p) => displayValue(p, "") !== "");
  return hasResult || hasParagraph;
}

export function AcademicResults({ results, paragraphs }: AcademicResultsProps) {
  const validParagraphs = paragraphs
    .map((p) => displayValue(p, ""))
    .filter((text) => text !== "");

  if (!hasValidContent(results, paragraphs)) {
    return (
      <section id="academics" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
        <SectionHeader
          label="Academic Performance"
          title="Academic Results"
        />
        <p className="text-[0.9375rem] text-charcoal-light leading-relaxed">
          Contact the school for exam and qualification details.
        </p>
      </section>
    );
  }

  return (
    <section id="academics" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader
        label="Academic Performance"
        title="Academic Results"
      />

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {results.map((r, i) => (
            <div
              key={i}
              className="p-6 bg-warm-white border border-warm-border-light"
            >
              <span className="font-display text-[2rem] font-semibold block mb-1">
                {displayValue(r.value, "Not available")}
              </span>
              <span className="text-label-sm uppercase text-charcoal-muted">
                {displayValue(r.label, "—")}
              </span>
            </div>
          ))}
        </div>
      )}

      {validParagraphs.map((text, i) => (
        <p key={i} className="text-[0.9375rem] text-charcoal-light leading-relaxed mb-4">
          {text}
        </p>
      ))}
    </section>
  );
}
