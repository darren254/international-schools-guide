"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useShortlist } from "@/context/ShortlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import type { SchoolListing } from "@/app/international-schools/ExploreSchoolsClient";
import { getCurriculumFilterLabels } from "@/data/jakarta-schools";

interface CompareViewProps {
  citySlug: string;
  cityName: string;
  schools: SchoolListing[];
}

const COMPARE_ROWS: { key: string; label: string; render: (s: SchoolListing) => string }[] = [
  { key: "area", label: "Area", render: (s) => s.area },
  { key: "curricula", label: "Curriculum", render: (s) => getCurriculumFilterLabels(s.curricula).join(", ") },
  { key: "summary", label: "Summary", render: (s) => s.editorialSummary },
];

export function CompareViewClient({ citySlug, cityName, schools }: CompareViewProps) {
  const { shortlistedSlugsForCity } = useShortlist();
  const { fmtRange, exchangeRateDate } = useCurrency();
  const [mobileIndex, setMobileIndex] = useState(0);

  const slugs = shortlistedSlugsForCity(citySlug);
  const compareSchools = useMemo(
    () => slugs.map((slug) => schools.find((s) => s.slug === slug)).filter(Boolean) as SchoolListing[],
    [slugs, schools]
  );

  useEffect(() => {
    setMobileIndex(0);
  }, [citySlug]);

  if (compareSchools.length < 2) {
    return (
      <div className="container-site py-12 text-center">
        <h1 className="font-display text-2xl md:text-3xl text-charcoal mb-4">
          Compare schools in {cityName}
        </h1>
        <p className="text-charcoal-muted mb-6 max-w-md mx-auto">
          Add at least 2 schools to your shortlist from the {cityName} listing, then come back here to compare them side by side.
        </p>
        <Link
          href={`/international-schools/${citySlug}/`}
          className="inline-block px-6 py-3 bg-hermes text-white text-sm font-semibold uppercase tracking-wider hover:bg-hermes-hover transition-colors"
        >
          View schools in {cityName}
        </Link>
      </div>
    );
  }

  const feeDisplay = (s: SchoolListing) =>
    s.feeHighUsd > 0 ? `${fmtRange(s.feeLowUsd, s.feeHighUsd, "USD")}/yr` : (s.feeRange || "—");

  return (
    <div className="container-site py-8 md:py-12">
      <nav className="text-[0.8125rem] text-charcoal-muted mb-6" aria-label="Breadcrumb">
        <Link href="/international-schools/" className="hover:text-hermes transition-colors">
          International Schools
        </Link>
        <span className="mx-1.5 opacity-50">›</span>
        <Link href={`/international-schools/${citySlug}/`} className="hover:text-hermes transition-colors">
          {cityName}
        </Link>
        <span className="mx-1.5 opacity-50">›</span>
        <span className="text-charcoal">Compare</span>
      </nav>

      <h1 className="font-display text-2xl md:text-3xl text-charcoal mb-2">
        Compare {compareSchools.length} schools in {cityName}
      </h1>
      <p className="text-[0.875rem] text-charcoal-muted mb-6 font-body">
        Fees in approximate equivalent. Rates updated periodically ({exchangeRateDate}).
      </p>

      {/* Desktop: side-by-side columns */}
      <div className="hidden md:block overflow-x-auto mb-12">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-16 z-10 bg-warm-white">
            <tr className="border-b-2 border-charcoal">
              <th className="text-left py-3 px-4 text-[11px] uppercase tracking-wider text-charcoal-muted font-medium w-[140px]" />
              {compareSchools.map((school) => (
                <th key={school.slug} className="text-left py-3 px-4 align-top max-w-[200px]">
                  <Link
                    href={`/international-schools/${citySlug}/${school.slug}/`}
                    className="font-display text-base font-medium text-charcoal hover:text-hermes transition-colors leading-snug"
                  >
                    {school.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-cream-50">
              <td className="py-3 px-4 text-[11px] uppercase tracking-wider text-charcoal-muted font-medium">
                Annual fees
              </td>
              {compareSchools.map((school) => (
                <td key={school.slug} className="py-3 px-4 border-l border-warm-border-light font-medium text-charcoal">
                  {feeDisplay(school)}
                </td>
              ))}
            </tr>
            {COMPARE_ROWS.map((row) => (
              <tr key={row.key} className="bg-warm-white">
                <td className="py-3 px-4 text-[11px] uppercase tracking-wider text-charcoal-muted font-medium align-top">
                  {row.label}
                </td>
                {compareSchools.map((school) => (
                  <td
                    key={school.slug}
                    className="py-3 px-4 text-charcoal-light leading-relaxed align-top border-l border-warm-border-light"
                  >
                    {row.render(school)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-warm-border">
              <td className="py-3 px-4" />
              {compareSchools.map((school) => (
                <td key={school.slug} className="py-3 px-4 border-l border-warm-border-light">
                  <Link
                    href={`/international-schools/${citySlug}/${school.slug}/`}
                    className="text-sm font-medium text-hermes hover:text-hermes-hover transition-colors"
                  >
                    View profile →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile: swipeable card stack */}
      <div className="md:hidden mb-12">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
          >
            {compareSchools.map((school) => (
              <div key={school.slug} className="w-full flex-shrink-0 px-1">
                <div className="border border-warm-border rounded-sm p-5 bg-cream-50">
                  <Link
                    href={`/international-schools/${citySlug}/${school.slug}/`}
                    className="font-display text-lg font-medium text-charcoal hover:text-hermes transition-colors leading-snug block mb-4"
                  >
                    {school.name}
                  </Link>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block mb-0.5">
                        Annual fees
                      </span>
                      <span className="text-sm font-medium text-charcoal">{feeDisplay(school)}</span>
                    </div>
                    {COMPARE_ROWS.map((row) => (
                      <div key={row.key}>
                        <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block mb-0.5">
                          {row.label}
                        </span>
                        <span className="text-sm text-charcoal-light">{row.render(school)}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/international-schools/${citySlug}/${school.slug}/`}
                    className="inline-block mt-5 text-sm font-medium text-hermes hover:text-hermes-hover transition-colors"
                  >
                    View profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setMobileIndex((i) => Math.max(0, i - 1))}
            disabled={mobileIndex === 0}
            className="text-charcoal-muted disabled:opacity-30 transition-opacity p-1"
            aria-label="Previous school"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18L9 12L15 6" />
            </svg>
          </button>
          <div className="flex gap-1.5">
            {compareSchools.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === mobileIndex ? "bg-hermes" : "bg-cream-400"
                }`}
                aria-label={`Go to school ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setMobileIndex((i) => Math.min(compareSchools.length - 1, i + 1))}
            disabled={mobileIndex >= compareSchools.length - 1}
            className="text-charcoal-muted disabled:opacity-30 transition-opacity p-1"
            aria-label="Next school"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18L15 12L9 6" />
            </svg>
          </button>
        </div>

        <p className="text-center text-[0.75rem] text-charcoal-muted mt-3 font-body">
          {compareSchools.map((s) => s.name).join(" · ")}
        </p>
      </div>

      <p className="text-center">
        <Link
          href={`/international-schools/${citySlug}/`}
          className="text-sm text-hermes hover:text-hermes-hover transition-colors font-medium"
        >
          ← Back to {cityName} schools
        </Link>
      </p>
    </div>
  );
}
