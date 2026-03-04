import { CurriculumTag } from "@/components/ui/CurriculumTag";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { displayValue } from "@/lib/utils/display";
import { ShortlistActions } from "@/components/school/ShortlistActions";

interface Campus {
  name: string;
  address: string;
}

interface SchoolMastheadProps {
  slug: string;
  name: string;
  verified: boolean;
  campuses: Campus[];
  /** Neighbourhood/area (e.g. "Dover", "Arabian Ranches"); from profile Location. */
  locationLabel: string;
  /** Display city name (e.g. "Singapore", "Dubai"). */
  cityName: string;
  lastUpdated: string;
  curricula: string[];
  stats: { value: string; label: string }[];
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
}: SchoolMastheadProps) {
  return (
    <section className="pt-6 pb-5">
      <h1 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-tight leading-tight mb-2">
        {name}
        <VerifiedBadge verified={verified} />
      </h1>

      {/* Campus summary - compact */}
      <p className="text-[0.8125rem] text-charcoal-muted leading-relaxed mb-3">
        {campuses.map((c, i) => (
          <span key={c.name}>
            {i > 0 && <span className="mx-1.5 text-cream-400">·</span>}
            <span className="text-charcoal-light font-medium">{c.name.split("(")[0].trim()}</span>
          </span>
        ))}
        <span className="ml-1">
          – {campuses.length} {campuses.length === 1 ? "campus" : "campuses"} in{" "}
          {locationLabel && locationLabel !== cityName ? `${locationLabel}, ${cityName}` : cityName}
        </span>
      </p>

      {/* Curricula + updated */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {curricula.map((c) => (
          <CurriculumTag key={c} label={c} />
        ))}
        <span className="text-[0.6875rem] text-charcoal-muted uppercase tracking-widest ml-auto hidden sm:inline">
          Updated {lastUpdated}
        </span>
      </div>

      {/* Stats bar - never show null or 0 to visitors */}
      <div className="flex flex-wrap gap-6 sm:gap-10 py-4 border-y border-warm-border-light">
        {stats.map((stat) => (
          <div key={stat.label}>
            <span className="font-display text-[1.25rem] font-semibold block leading-none mb-0.5">
              {displayValue(stat.value, "—")}
            </span>
            <span className="text-[0.6875rem] uppercase tracking-wider text-charcoal-muted">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4">
        <ShortlistActions slug={slug} />
      </div>
    </section>
  );
}
