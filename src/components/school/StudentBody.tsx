import { SectionHeader } from "@/components/ui/SectionHeader";
import { displayValue } from "@/lib/utils/display";

interface InspectionData {
  date: string;
  body: string;
  rating: string;
  findings: string;
}

interface StudentBodyProps {
  paragraphs: string[];
  inspection?: InspectionData;
}

function hasInspectionContent(inspection: InspectionData): boolean {
  const { date, body, rating, findings } = inspection;
  return [date, body, rating, findings].some(
    (v) => v != null && String(v).trim() !== "" && String(v).toLowerCase() !== "null"
  );
}

export function StudentBody({ paragraphs, inspection }: StudentBodyProps) {
  const showInspection = inspection && hasInspectionContent(inspection);

  return (
    <section id="student-body" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader
        label="Community"
        title="Student Body & Academics"
      />

      {paragraphs
        .map((p) => displayValue(p, ""))
        .filter((text) => text !== "")
        .map((text, i) => (
          <p key={i} className="text-[0.9375rem] text-charcoal-light leading-relaxed mb-4">
            {text}
          </p>
        ))}

      {showInspection && (
        <>
          <h3 className="font-display text-display-sm font-medium mt-8 mb-4">
            Inspection
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-6 bg-warm-white border border-warm-border-light mb-5">
            <div className="flex flex-col gap-1">
              <span className="text-label-xs uppercase text-charcoal-muted">
                Last Inspected
              </span>
              <span className="text-[0.9375rem] font-medium">
                {displayValue(inspection!.date, "Not available")}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-xs uppercase text-charcoal-muted">
                Inspection Body
              </span>
              <span className="text-[0.9375rem] font-medium">
                {displayValue(inspection!.body, "Not available")}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-xs uppercase text-charcoal-muted">
                Rating
              </span>
              <span className="text-[0.9375rem] font-medium">
                {displayValue(inspection!.rating, "Not available")}
              </span>
            </div>
          </div>

          <p className="text-[0.9375rem] text-charcoal-light leading-relaxed">
            {displayValue(inspection!.findings, "Contact the school for inspection details.")}
          </p>
        </>
      )}
    </section>
  );
}
