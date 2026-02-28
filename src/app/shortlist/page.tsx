"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShareButton } from "@/components/share/ShareButton";
import { useShortlist } from "@/context/ShortlistContext";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import { DUBAI_SCHOOLS } from "@/data/dubai-schools";
import { getFeeDisplay, hasPublishableFee } from "@/lib/utils/fees";

const ALL_SCHOOLS = [...JAKARTA_SCHOOLS.map((s) => ({ ...s, citySlug: "jakarta" })), ...DUBAI_SCHOOLS.map((s) => ({ ...s, citySlug: "dubai" }))];

const DEFAULT_SLUGS = [
  "jakarta-intercultural-school",
  "british-school-jakarta",
  "independent-school-of-jakarta",
];

interface ShortlistSchool {
  slug: string;
  citySlug: string;
  name: string;
  area: string;
  curricula: string[];
  feeDisplay: string;
  ageRange: string;
  studentCount: string;
  ibAverage: string;
  ibPassRate: string;
}

function toShortlistSchool(s: (typeof ALL_SCHOOLS)[0]): ShortlistSchool {
  const ibAvg = s.examResults.find((r) => r.label === "IB Average");
  const ibPass = s.examResults.find((r) => r.label === "IB Pass Rate");
  return {
    slug: s.slug,
    citySlug: s.citySlug,
    name: s.name,
    area: s.area,
    curricula: s.curricula,
    feeDisplay: getFeeDisplay(s.feeRange, s.slug),
    ageRange: s.ageRange,
    studentCount: s.studentCount,
    ibAverage: ibAvg?.value ?? "",
    ibPassRate: ibPass?.value ?? "",
  };
}

const COMPARE_ROWS: { key: string; label: string; render: (s: ShortlistSchool) => string }[] = [
  { key: "fees", label: "Annual Fees", render: (s) => s.feeDisplay },
  { key: "ageRange", label: "Age Range", render: (s) => s.ageRange },
  { key: "curricula", label: "Curriculum", render: (s) => s.curricula.join(", ") },
  { key: "ibAverage", label: "IB Average", render: (s) => s.ibAverage || "—" },
  { key: "ibPassRate", label: "IB Pass Rate", render: (s) => s.ibPassRate || "—" },
  { key: "studentCount", label: "Students", render: (s) => s.studentCount },
  { key: "location", label: "Location", render: (s) => s.area },
];

function QuickAddButton({ label, slugs, onAdd }: { label: string; slugs: string[]; onAdd: (slugs: string[]) => void }) {
  return (
    <button
      onClick={() => onAdd(slugs)}
      className="px-4 py-2 text-xs uppercase tracking-wider rounded-sm border border-warm-border text-charcoal-muted hover:border-hermes hover:text-hermes transition-colors"
    >
      {label}
    </button>
  );
}

function ShortlistContent() {
  const searchParams = useSearchParams();
  const { shortlistedSlugs, addToShortlist, removeFromShortlist } = useShortlist();
  const urlSynced = useRef(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    if (urlSynced.current) return;
    const param = searchParams.get("schools");
    if (!param) {
      urlSynced.current = true;
      return;
    }
    const slugs = param.split(",").map((s) => s.trim()).filter(Boolean);
    slugs.forEach((slug) => addToShortlist(slug));
    urlSynced.current = true;
  }, [searchParams, addToShortlist]);

  const slugsToShow = (() => {
    const param = searchParams.get("schools");
    if (param) {
      const fromUrl = param.split(",").map((s) => s.trim()).filter(Boolean);
      if (fromUrl.length > 0) return fromUrl;
    }
    return shortlistedSlugs;
  })();

  const schools = slugsToShow
    .map((slug) => ALL_SCHOOLS.find((s) => s.slug === slug))
    .filter(Boolean)
    .map((s) => toShortlistSchool(s!));

  const isEmpty = schools.length === 0;

  const defaultSchools = isEmpty
    ? DEFAULT_SLUGS
        .map((slug) => ALL_SCHOOLS.find((s) => s.slug === slug))
        .filter(Boolean)
        .map((s) => toShortlistSchool(s!))
    : [];

  const displaySchools = isEmpty ? defaultSchools : schools;

  const handleQuickAdd = useCallback((slugs: string[]) => {
    slugs.forEach((slug) => addToShortlist(slug));
  }, [addToShortlist]);

  const handleRemove = useCallback((slug: string) => {
    removeFromShortlist(slug);
    setMobileIndex((prev) => Math.max(0, prev - 1));
  }, [removeFromShortlist]);

  return (
    <div className="container-site py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-2">
            My Shortlist
          </h1>
          {isEmpty ? (
            <p className="text-charcoal-muted max-w-lg">
              Add schools to your shortlist from any school profile or listing page. Here are Jakarta&rsquo;s top 3 to get you started.
            </p>
          ) : (
            <p className="text-charcoal-muted">
              {schools.length} school{schools.length !== 1 ? "s" : ""} — compare side by side or open full profiles.
            </p>
          )}
        </div>
        {!isEmpty && (
          <ShareButton variant="shortlist" schoolSlugs={slugsToShow} />
        )}
      </div>

      {/* Quick-add prompts (empty state) */}
      {isEmpty && (
        <div className="flex flex-wrap gap-2 mb-8">
          <QuickAddButton
            label="Top British schools"
            slugs={["british-school-jakarta", "independent-school-of-jakarta", "acg-school-jakarta"]}
            onAdd={handleQuickAdd}
          />
          <QuickAddButton
            label="Top IB schools"
            slugs={["jakarta-intercultural-school", "british-school-jakarta", "sinarmas-world-academy"]}
            onAdd={handleQuickAdd}
          />
          <QuickAddButton
            label="Highest-rated in South Jakarta"
            slugs={["jakarta-intercultural-school", "independent-school-of-jakarta", "australian-independent-school-jakarta"]}
            onAdd={handleQuickAdd}
          />
        </div>
      )}

      {/* Desktop: side-by-side comparison table */}
      <div className="hidden md:block overflow-x-auto mb-12">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-16 z-10 bg-warm-white">
            <tr className="border-b-2 border-charcoal">
              <th className="text-left py-3 px-4 text-[11px] uppercase tracking-wider text-charcoal-muted font-medium w-[140px]" />
              {displaySchools.map((school) => (
                <th key={school.slug} className="text-left py-3 px-4 align-top">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/international-schools/${school.citySlug}/${school.slug}/`}
                      className="font-display text-base font-medium text-charcoal hover:text-hermes transition-colors leading-snug"
                    >
                      {school.name}
                    </Link>
                    {!isEmpty && (
                      <button
                        onClick={() => handleRemove(school.slug)}
                        className="text-charcoal-muted hover:text-hermes transition-colors flex-shrink-0 mt-0.5"
                        aria-label={`Remove ${school.name}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row, i) => (
              <tr key={row.key} className={i % 2 === 0 ? "bg-cream-50" : "bg-warm-white"}>
                <td className="py-3 px-4 text-[11px] uppercase tracking-wider text-charcoal-muted font-medium whitespace-nowrap align-top">
                  {row.label}
                </td>
                {displaySchools.map((school) => (
                  <td
                    key={school.slug}
                    className={`py-3 px-4 text-charcoal-light leading-relaxed align-top border-l border-warm-border-light ${
                      row.key === "fees" ? "font-medium text-charcoal" : ""
                    }`}
                  >
                    {row.render(school)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-warm-border">
              <td className="py-3 px-4" />
              {displaySchools.map((school) => (
                <td key={school.slug} className="py-3 px-4 border-l border-warm-border-light">
                  <Link
                    href={`/international-schools/${school.citySlug}/${school.slug}/`}
                    className="text-sm font-medium text-hermes hover:text-hermes-hover transition-colors"
                  >
                    Full profile →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile: swipeable cards with dot indicators */}
      <div className="md:hidden mb-12">
        {displaySchools.length > 0 && (
          <>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
              >
                {displaySchools.map((school) => (
                  <div key={school.slug} className="w-full flex-shrink-0 px-1">
                    <div className="border border-warm-border rounded-sm p-5 bg-cream-50">
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <Link
                          href={`/international-schools/${school.citySlug}/${school.slug}/`}
                          className="font-display text-lg font-medium text-charcoal hover:text-hermes transition-colors leading-snug"
                        >
                          {school.name}
                        </Link>
                        {!isEmpty && (
                          <button
                            onClick={() => handleRemove(school.slug)}
                            className="text-charcoal-muted hover:text-hermes transition-colors flex-shrink-0 p-1"
                            aria-label={`Remove ${school.name}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {COMPARE_ROWS.map((row) => (
                          <div key={row.key}>
                            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block mb-0.5">
                              {row.label}
                            </span>
                            <span className={`text-sm ${row.key === "fees" ? "font-medium text-charcoal" : "text-charcoal-light"}`}>
                              {row.render(school)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Link
                        href={`/international-schools/${school.citySlug}/${school.slug}/`}
                        className="inline-block mt-5 text-sm font-medium text-hermes hover:text-hermes-hover transition-colors"
                      >
                        Full profile →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dot indicators + swipe buttons */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setMobileIndex(Math.max(0, mobileIndex - 1))}
                disabled={mobileIndex === 0}
                className="text-charcoal-muted disabled:opacity-30 transition-opacity p-1"
                aria-label="Previous school"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18L9 12L15 6" />
                </svg>
              </button>
              <div className="flex gap-1.5">
                {displaySchools.map((s, i) => (
                  <button
                    key={s.slug}
                    onClick={() => setMobileIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === mobileIndex ? "bg-hermes" : "bg-cream-400"
                    }`}
                    aria-label={`Go to ${s.name}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setMobileIndex(Math.min(displaySchools.length - 1, mobileIndex + 1))}
                disabled={mobileIndex >= displaySchools.length - 1}
                className="text-charcoal-muted disabled:opacity-30 transition-opacity p-1"
                aria-label="Next school"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18L15 12L9 6" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ShortlistPage() {
  return (
    <Suspense fallback={<div className="container-site py-16 text-charcoal-muted">Loading…</div>}>
      <ShortlistContent />
    </Suspense>
  );
}
