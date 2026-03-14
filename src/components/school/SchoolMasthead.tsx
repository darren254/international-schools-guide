import { CurriculumTag } from "@/components/ui/CurriculumTag";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { displayValue } from "@/lib/utils/display";
import { ShortlistActions } from "@/components/school/ShortlistActions";
import { StudentCountPopover } from "@/components/school/StudentCountPopover";

interface Campus {
  name: string;
  address: string;
}

type StudentSourceData = {
  sourceCount: number;
  topSources: { value: string; date: string | null; source: string }[];
};

interface SchoolMastheadProps {
  slug: string;
  name: string;
  verified: boolean;
  campuses: Campus[];
  locationLabel: string;
  cityName: string;
  lastUpdated: string;
  curricula: string[];
  stats: { value: string; label: string }[];
  studentSources?: StudentSourceData;
}

export function SchoolMasthead({
  slug,
  name,
  verified,
  campuses,
  locationLabel,
  cityName,
  lastUpdated,
  curricula,
  stats,
  studentSources,
}: SchoolMastheadProps) {
  const campusSummary = campuses
    .map((c) => c.name.split("(")[0].trim())
    .join(" · ");
  const locationText =
    locationLabel && locationLabel !== cityName
      ? `${locationLabel}, ${cityName}`
      : cityName;

  return (
    <section className="pt-6 pb-5">
      {/* Row 1 – Name and verification */}
      <h1 className="font-display text-display-lg md:text-display-xl font-medium tracking-tight leading-tight mb-4">
        <span>{name}</span>
        <VerifiedBadge verified={verified} />
      </h1>

      {/* Row 2 – Campus and location */}
      <p className="text-body-sm text-charcoal-muted font-body leading-relaxed mb-3">
        {campusSummary}
        <span className="ml-1">
          – {campuses.length} {campuses.length === 1 ? "campus" : "campuses"} in {locationText}
        </span>
      </p>

      {/* Row 3 – Curriculum tags and updated */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {curricula.map((c) => (
          <CurriculumTag key={c} label={c} />
        ))}
        <span className="text-label-xs text-charcoal-muted uppercase tracking-widest ml-auto hidden sm:inline">
          Updated {lastUpdated}
        </span>
      </div>

      {/* Stats band – key facts */}
      <div className="bg-warm-white border-y border-warm-border-light">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="font-display text-display-sm font-semibold block leading-none mb-1">
                {displayValue(stat.value, "—")}
                {stat.label === "Students" && studentSources && (
                  <StudentCountPopover
                    sourceCount={studentSources.sourceCount}
                    topSources={studentSources.topSources}
                  />
                )}
              </span>
              <span className="text-label-xs uppercase tracking-wider text-charcoal-muted font-body">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shortlist */}
      <div className="mt-4">
        <ShortlistActions slug={slug} />
      </div>
    </section>
  );
}
