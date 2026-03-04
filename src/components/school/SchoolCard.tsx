"use client";

import Link from "next/link";
import { useShortlistOptional } from "@/context/ShortlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

interface ExamResult {
  label: string;
  value: string;
}

interface SchoolCardProps {
  name: string;
  slug: string;
  citySlug: string;
  verified: boolean;
  curricula: string[];
  area: string;
  ageRange: string;
  studentCount: string;
  feeLowUsd: number;
  feeHighUsd: number;
  feeLabel?: string;
  examResults?: ExamResult[];
  editorialSummary: string;
  imageUrl?: string;
  hasProfile?: boolean;
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
  feeLowUsd,
  feeHighUsd,
  feeLabel,
  examResults,
  editorialSummary,
  imageUrl,
  hasProfile = false,
}: SchoolCardProps) {
  const shortlist = useShortlistOptional();
  const { fmtRange } = useCurrency();
  const shortlisted = shortlist ? shortlist.isShortlistedInCity(slug, citySlug) : false;
  const cityList = shortlist ? shortlist.shortlistedSlugsForCity(citySlug) : [];
  const canAdd = cityList.length < 4 || shortlisted;
  const handleShortlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    shortlist?.toggleShortlist(slug, citySlug);
  };

  const hasFees = feeLowUsd > 0 || feeHighUsd > 0;
  const feeDisplay = hasFees
    ? `${fmtRange(feeLowUsd, feeHighUsd, "USD")}/yr`
    : (feeLabel || "Fees not published");

  const profileHref = hasProfile ? `/international-schools/${citySlug}/${slug}/` : undefined;

  const inner = (
    <>
      <div className="w-full sm:w-[300px] sm:min-w-[300px] sm:aspect-[4/3] aspect-[4/3] flex-shrink-0 bg-cream-300 relative overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full min-h-[140px] sm:min-h-full flex items-center justify-center text-charcoal-muted/30 text-[0.625rem] uppercase tracking-widest">
            Photo
          </div>
        )}
        <button
          type="button"
          onClick={handleShortlist}
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center text-charcoal-muted/60 hover:text-charcoal-muted transition-colors z-10"
          aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={shortlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      <div className="flex-1 min-w-0 p-6 sm:p-7 flex flex-col min-h-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="card-title font-display text-display-sm font-medium text-charcoal leading-tight">
            {name}
          </span>
          {verified && <VerifiedBadge verified={verified} />}
        </div>
        <p className="text-[0.8125rem] text-charcoal-muted mb-3 font-body">
          {area} · Ages {ageRange} · {studentCount} students
        </p>
        <p className="text-[0.875rem] text-charcoal-light leading-relaxed mb-4 font-body">
          {editorialSummary}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4 mt-auto">
          {curricula.map((c) => (
            <span key={c} className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted">
              {c}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-warm-border">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted mb-0.5 font-body">
                Annual Fees
              </p>
              <p className="text-[0.9375rem] font-medium text-charcoal font-body">{feeDisplay}</p>
            </div>
            {examResults?.map((result, i) => (
              <div key={i} className="pl-6 border-l border-warm-border">
                <p className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted mb-0.5 font-body">
                  {result.label}
                </p>
                <p className="text-[0.9375rem] font-medium text-charcoal font-body">{result.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {shortlist && (
              <button
                type="button"
                onClick={handleShortlist}
                disabled={!canAdd && !shortlisted}
                className="text-[0.75rem] font-semibold uppercase tracking-wider text-charcoal-muted hover:text-hermes transition-colors font-body disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-charcoal-muted"
              >
                {shortlisted ? "In shortlist" : "Shortlist +"}
              </button>
            )}
            {hasProfile ? (
              <span className="text-[0.75rem] font-medium uppercase tracking-wider text-hermes font-body">
                Full profile →
              </span>
            ) : (
              <span className="text-[0.75rem] font-medium uppercase tracking-wider text-charcoal-muted/50 font-body">
                Profile coming soon
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <article className="border border-warm-border bg-warm-white overflow-hidden font-body">
      {profileHref ? (
        <Link href={profileHref} className="block group">
          <div className="flex flex-col sm:flex-row cursor-pointer">{inner}</div>
        </Link>
      ) : (
        <div className="flex flex-col sm:flex-row cursor-pointer group">{inner}</div>
      )}
    </article>
  );
}
