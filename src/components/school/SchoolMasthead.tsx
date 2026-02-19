import { CurriculumTag } from "@/components/ui/CurriculumTag";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Button } from "@/components/ui/Button";

interface Campus {
  name: string;
  address: string;
}

interface SchoolMastheadProps {
  name: string;
  verified: boolean;
  campuses: Campus[];
  lastUpdated: string;
  curricula: string[];
  stats: { value: string; label: string }[];
}

export function SchoolMasthead({
  name,
  verified,
  campuses,
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

      {/* Campus summary — compact */}
      <p className="text-[0.8125rem] text-charcoal-muted leading-relaxed mb-3">
        {campuses.map((c, i) => (
          <span key={c.name}>
            {i > 0 && <span className="mx-1.5 text-cream-400">·</span>}
            <span className="text-charcoal-light font-medium">{c.name.split("(")[0].trim()}</span>
          </span>
        ))}
        <span className="ml-1">— {campuses.length} campuses in South Jakarta</span>
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

      {/* Stats bar */}
      <div className="flex flex-wrap gap-6 sm:gap-10 py-4 border-y border-warm-border-light">
        {stats.map((stat) => (
          <div key={stat.label}>
            <span className="font-display text-[1.25rem] font-semibold block leading-none mb-0.5">
              {stat.value}
            </span>
            <span className="text-[0.6875rem] uppercase tracking-wider text-charcoal-muted">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <Button variant="outline">♡ Shortlist</Button>
        <Button variant="outline">+ Compare</Button>
      </div>
    </section>
  );
}
