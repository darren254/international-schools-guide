"use client";

import Link from "next/link";
import { useShortlistOptional } from "@/context/ShortlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

interface ExamResult {
  label: string;
  value: string;
}

const CARD_ONELINER_MAX = 150;

/** Derive a short one-liner from editorialSummary: first sentence, strip leading fee-only phrase, cap length. */
function getCardOneLiner(summary: string): string {
  const trimmed = summary.trim();
  if (!trimmed) return "";

  const feeLikeStart = /^(Fees |\d{4}\/\d{4} fees |\d{4} fees |Enrolment |Capital levy |Registration |Sibling |Flat fee )/i;
  let out = trimmed;

  const firstPeriod = out.search(/\.\s+/);
  const firstSentence = firstPeriod >= 0 ? out.slice(0, firstPeriod + 1).trim() : out;

  if (feeLikeStart.test(firstSentence)) {
    const rest = firstPeriod >= 0 ? out.slice(firstPeriod + 1).trim() : "";
    const nextPeriod = rest.search(/\.\s+/);
    out = nextPeriod >= 0 ? rest.slice(0, nextPeriod + 1).trim() : rest;
  } else {
    out = firstSentence;
  }

  if (out.length > CARD_ONELINER_MAX) {
    const cut = out.slice(0, CARD_ONELINER_MAX).lastIndexOf(" ");
    out = cut > 0 ? out.slice(0, cut) + "…" : out.slice(0, CARD_ONELINER_MAX) + "…";
  }
  return out;
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
  foundedYear?: string;
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
  foundedYear,
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

  const metaParts = [area, `Ages ${ageRange}`];
  if (foundedYear) metaParts.push(`Est. ${foundedYear}`);
  if (studentCount && studentCount !== "-") metaParts.push(`${studentCount} students`);
  const metaLine = metaParts.join(" · ");

  const oneLiner = getCardOneLiner(editorialSummary);

  const inner = (
    <>
      <div className="w-full sm:w-[300px] sm:min-w-[300px] sm:aspect-[4/3] aspect-[4/3] flex-shrink-0 bg-cream-300 relative overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover brightness-[1.02] contrast-[1.02] saturate-[0.98] transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full min-h-[140px] sm:min-h-full flex items-center justify-center text-charcoal-muted/30 text-label-xs uppercase tracking-widest">
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
      <div className="flex-1 min-w-0 p-6 sm:p-8 flex flex-col min-h-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="card-title font-display text-display-sm font-medium text-charcoal leading-tight">
            {name}
          </span>
          {verified && <VerifiedBadge verified={verified} />}
        </div>
        <p className="text-body-xs text-charcoal-muted mb-3 font-body">
          {metaLine}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 font-body">
          {curricula.map((c) => (
            <span key={c} className="text-label-xs uppercase tracking-widest text-charcoal-muted">
              {c}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mb-3">
          <div>
            <p className="text-label-xs uppercase tracking-widest text-charcoal-muted mb-0.5 font-body">
              Annual fees
            </p>
            <p className="text-body-sm font-medium text-charcoal font-body">{feeDisplay}</p>
          </div>
          {examResults?.map((result, i) => (
            <div key={i} className="pl-0 sm:pl-6 sm:border-l sm:border-warm-border">
              <p className="text-label-xs uppercase tracking-widest text-charcoal-muted mb-0.5 font-body">
                {result.label}
              </p>
              <p className="text-body-sm font-medium text-charcoal font-body">{result.value}</p>
            </div>
          ))}
        </div>
        {oneLiner && (
          <p className="text-sm text-charcoal-light leading-relaxed mb-4 font-body">
            {oneLiner}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-auto border-t border-warm-border">
          <div className="flex items-center gap-4">
            {shortlist && (
              <button
                type="button"
                onClick={handleShortlist}
                disabled={!canAdd && !shortlisted}
                className="text-label-sm font-semibold uppercase tracking-wider text-charcoal-muted hover:text-primary transition-colors font-body disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-charcoal-muted"
              >
                {shortlisted ? "In shortlist" : "Shortlist +"}
              </button>
            )}
            {hasProfile ? (
              <span className="text-label-sm font-medium uppercase tracking-wider text-primary font-body">
                Full profile →
              </span>
            ) : (
              <span className="text-label-sm font-medium uppercase tracking-wider text-charcoal-muted/50 font-body">
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
