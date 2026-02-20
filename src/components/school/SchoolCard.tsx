"use client";

import { useState } from "react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

interface ExamResult {
  label: string; // e.g. "IB Average", "A*–A at A-Level", "AP Pass Rate"
  value: string; // e.g. "35.8", "62%", "89%"
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
  feeRange: string;
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
  feeRange,
  examResults,
  editorialSummary,
  imageUrl,
  hasProfile = false,
}: SchoolCardProps) {
  const [shortlisted, setShortlisted] = useState(false);

  return (
    <article className="border border-warm-border bg-warm-white overflow-hidden font-body">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-[200px] sm:min-h-[180px] flex-shrink-0 bg-cream-300 relative">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full min-h-[140px] sm:min-h-full flex items-center justify-center text-charcoal-muted/30 text-[0.625rem] uppercase tracking-widest">
              Photo
            </div>
          )}
          {/* Subtle bookmark — outline only, no fill */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setShortlisted(!shortlisted);
            }}
            className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center text-charcoal-muted/60 hover:text-charcoal-muted transition-colors"
            aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={shortlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        {/* Content — generous padding, editorial density */}
        <div className="flex-1 min-w-0 p-6 sm:p-7">
          {/* Name as hierarchy anchor + verified */}
          <div className="flex items-start justify-between gap-3 mb-2">
            {hasProfile ? (
              <Link
                href={`/international-schools/${citySlug}/${slug}/`}
                className="card-title-hover block"
              >
                <span className="card-title font-display text-display-sm font-medium text-charcoal leading-tight">
                  {name}
                </span>
              </Link>
            ) : (
              <span className="font-display text-display-sm font-medium text-charcoal leading-tight">
                {name}
              </span>
            )}
            {verified && <VerifiedBadge verified={verified} />}
          </div>

          <p className="text-[0.8125rem] text-charcoal-muted mb-3 font-body">
            {area} · Ages {ageRange} · {studentCount} students
          </p>

          <p className="text-[0.875rem] text-charcoal-light leading-relaxed mb-4 font-body">
            {editorialSummary}
          </p>

          {/* Curricula: subtle, uppercase, letter-spaced, muted — not bright pills */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
            {curricula.map((c) => (
              <span
                key={c}
                className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Bottom row: fees + exam results + link */}
          <div className="flex items-center justify-between pt-4 border-t border-warm-border">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted mb-0.5 font-body">
                  Annual Fees
                </p>
                <p className="text-[0.9375rem] font-medium text-charcoal font-body">
                  {feeRange}
                </p>
              </div>
              {examResults?.map((result, i) => (
                <div key={i} className="pl-6 border-l border-warm-border">
                  <p className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted mb-0.5 font-body">
                    {result.label}
                  </p>
                  <p className="text-[0.9375rem] font-medium text-charcoal font-body">
                    {result.value}
                  </p>
                </div>
              ))}
            </div>
            {hasProfile ? (
              <Link
                href={`/international-schools/${citySlug}/${slug}/`}
                className="text-[0.75rem] font-medium uppercase tracking-wider text-charcoal-muted hover:text-hermes transition-colors font-body"
              >
                Full profile →
              </Link>
            ) : (
              <span className="text-[0.75rem] font-medium uppercase tracking-wider text-charcoal-muted/50 font-body">
                Profile coming soon
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
