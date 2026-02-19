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
}: SchoolCardProps) {
  const [shortlisted, setShortlisted] = useState(false);

  return (
    <div className="border border-warm-border rounded-sm bg-warm-white overflow-hidden group hover:border-charcoal-muted/40 transition-colors">
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
            <div className="w-full h-full min-h-[140px] sm:min-h-full flex items-center justify-center text-charcoal-muted/40 text-[0.625rem] uppercase tracking-wider">
              Photo
            </div>
          )}
          {/* Shortlist button on image */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setShortlisted(!shortlisted);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={shortlisted ? "#E8722A" : "none"}
              stroke={shortlisted ? "#E8722A" : "#7A756E"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-5">
          {/* Name + verified */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <Link
              href={`/international-schools/${citySlug}/${slug}/`}
              className="font-display text-display-sm font-medium text-charcoal hover:text-hermes transition-colors leading-tight"
            >
              {name}
            </Link>
            {verified && <VerifiedBadge verified={verified} />}
          </div>

          {/* Location + stats */}
          <p className="text-[0.8125rem] text-charcoal-muted mb-3">
            {area} · Ages {ageRange} · {studentCount} students
          </p>

          {/* Editorial summary */}
          <p className="text-[0.875rem] text-charcoal-light leading-relaxed mb-4">
            {editorialSummary}
          </p>

          {/* Curricula tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {curricula.map((c) => (
              <span
                key={c}
                className="text-label-xs uppercase text-hermes bg-hermes-light px-2 py-0.5 rounded-sm"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Bottom row: fees + exam results + link */}
          <div className="flex items-center justify-between pt-3 border-t border-warm-border-light">
            <div className="flex items-center gap-5">
              <div>
                <p className="text-[0.6875rem] uppercase tracking-wider text-charcoal-muted mb-0.5">
                  Annual Fees
                </p>
                <p className="text-[0.9375rem] font-medium text-charcoal">
                  {feeRange}
                </p>
              </div>
              {examResults?.map((result, i) => (
                <div key={i} className="pl-5 border-l border-warm-border-light">
                  <p className="text-[0.6875rem] uppercase tracking-wider text-charcoal-muted mb-0.5">
                    {result.label}
                  </p>
                  <p className="text-[0.9375rem] font-medium text-charcoal">
                    {result.value}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href={`/international-schools/${citySlug}/${slug}/`}
              className="text-[0.75rem] font-medium uppercase tracking-wider text-hermes hover:text-hermes-hover transition-colors"
            >
              View details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
