import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

interface SchoolCardProps {
  name: string;
  slug: string;
  citySlug: string;
  verified: boolean;
  curricula: string[];
  area: string;
  ageRange: string;
  studentCount: string;
  feeRange: string;
  editorialSummary: string;
  imageUrl?: string;
}

export function SchoolCard({
  name,
  slug,
  citySlug,
  verified,
  curricula,
  area,
  ageRange,
  studentCount,
  feeRange,
  editorialSummary,
  imageUrl,
}: SchoolCardProps) {
  return (
    <div className="border border-warm-border-light bg-warm-white p-5 flex gap-5 group hover:border-cream-400 transition-colors">
      {/* Thumbnail */}
      <div className="hidden sm:block flex-shrink-0 w-[120px] h-[100px] bg-cream-300 overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal-muted text-[0.625rem] uppercase tracking-wider">
            Photo
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <Link
              href={`/international-schools/${citySlug}/${slug}/`}
              className="font-display text-display-sm font-semibold text-charcoal hover:text-hermes transition-colors"
            >
              {name}
            </Link>
            <VerifiedBadge verified={verified} />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {curricula.map((c) => (
            <span
              key={c}
              className="text-[0.6875rem] uppercase tracking-wider text-charcoal-muted"
            >
              {c}
            </span>
          ))}
        </div>

        <p className="text-[0.8125rem] text-charcoal-muted mb-2">
          {area} · Ages {ageRange} · {studentCount}
        </p>

        <p className="text-[0.9375rem] font-medium mb-2">{feeRange} / year</p>

        <p className="text-[0.8125rem] text-charcoal-light leading-relaxed italic">
          &ldquo;{editorialSummary}&rdquo;
        </p>

        <div className="flex items-center gap-4 mt-3">
          <button className="text-[0.75rem] text-charcoal-muted hover:text-hermes transition-colors">
            ♡
          </button>
          <Link
            href={`/international-schools/${citySlug}/${slug}/`}
            className="text-[0.75rem] font-medium uppercase tracking-wider text-hermes hover:text-hermes-hover transition-colors"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
