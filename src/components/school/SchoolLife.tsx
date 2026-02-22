import { SectionHeader } from "@/components/ui/SectionHeader";
import { displayValue } from "@/lib/utils/display";

interface SchoolLifeProps {
  activitiesCount: number;
  uniformRequired: boolean;
  facilities: string[];
  paragraphs: string[];
}

export function SchoolLife({
  activitiesCount,
  uniformRequired,
  facilities,
  paragraphs,
}: SchoolLifeProps) {
  const activitiesDisplay =
    activitiesCount != null && Number(activitiesCount) > 0
      ? `${activitiesCount}+`
      : "Contact the school";

  const validFacilities = facilities
    .map((f) => displayValue(f, ""))
    .filter((text) => text !== "");

  const validParagraphs = paragraphs
    .map((p) => displayValue(p, ""))
    .filter((text) => text !== "");

  return (
    <section id="school-life" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader
        label="Campus & Culture"
        title="School Life"
      />

      <div className="flex flex-col sm:flex-row gap-8 mb-8">
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-[1.375rem] font-semibold">
            {activitiesDisplay}
          </span>
          <span className="text-label-sm uppercase text-charcoal-muted">
            Extra-curricular activities
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-[1.375rem] font-semibold">
            {uniformRequired ? "Required" : "Not required"}
          </span>
          <span className="text-label-sm uppercase text-charcoal-muted">
            Uniform
          </span>
        </div>
      </div>

      <h3 className="font-display text-display-sm font-medium mb-4">
        Facilities
      </h3>

      {validFacilities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 mb-8">
          {validFacilities.map((f) => (
            <div
              key={f}
              className="flex items-center gap-2 py-3 border-b border-warm-border-light text-[0.9375rem] text-charcoal-light"
            >
              <span className="w-1 h-1 rounded-full bg-hermes flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[0.9375rem] text-charcoal-light leading-relaxed mb-8">
          Contact the school for facility details.
        </p>
      )}

      {validParagraphs.map((text, i) => (
        <p key={i} className="text-[0.9375rem] text-charcoal-light leading-relaxed mb-4">
          {text}
        </p>
      ))}
    </section>
  );
}
