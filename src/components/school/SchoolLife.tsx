import { SectionHeader } from "@/components/ui/SectionHeader";
import { FacilityIcon } from "@/components/school/FacilityIcon";
import { displayValue } from "@/lib/utils/display";
import { tierFacilities } from "@/lib/utils/facilities";

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

  const { featured, remaining } = tierFacilities(validFacilities);

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
        <>
          {/* Featured facilities: compact icon grid (mobile first) */}
          {featured.length > 0 && (
            <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
              {featured.map(({ type, label }) => (
                <div
                  key={type}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  <span className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-sm border border-warm-border bg-warm-white text-charcoal">
                    <FacilityIcon type={type} className="w-6 h-6" />
                  </span>
                  <span className="text-[0.6875rem] sm:text-[0.75rem] font-medium text-charcoal leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Remaining facilities: single inline comma-separated line */}
          {remaining.length > 0 && (
            <p className="text-[0.8125rem] text-charcoal-muted leading-relaxed mb-8">
              {remaining.join(", ")}
            </p>
          )}
        </>
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
