"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShareButton } from "@/components/share/ShareButton";
import { useShortlist } from "@/context/ShortlistContext";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import { DUBAI_SCHOOLS } from "@/data/dubai-schools";
import { SINGAPORE_SCHOOLS } from "@/data/singapore-schools";
import { BANGKOK_SCHOOLS } from "@/data/bangkok-schools";
import { HONG_KONG_SCHOOLS } from "@/data/hong-kong-schools";
import { KUALA_LUMPUR_SCHOOLS } from "@/data/kuala-lumpur-schools";
import { useCurrency } from "@/context/CurrencyContext";
import { getFeeDisplay } from "@/lib/utils/fees";
import { getCityName } from "@/app/international-schools/city-configs";

const ALL_SCHOOLS = [
  ...JAKARTA_SCHOOLS.map((s) => ({ ...s, citySlug: "jakarta" as const })),
  ...DUBAI_SCHOOLS.map((s) => ({ ...s, citySlug: "dubai" as const })),
  ...SINGAPORE_SCHOOLS.map((s) => ({ ...s, citySlug: "singapore" as const })),
  ...BANGKOK_SCHOOLS.map((s) => ({ ...s, citySlug: "bangkok" as const })),
  ...HONG_KONG_SCHOOLS.map((s) => ({ ...s, citySlug: "hong-kong" as const })),
  ...KUALA_LUMPUR_SCHOOLS.map((s) => ({ ...s, citySlug: "kuala-lumpur" as const })),
];

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
  feeLabel: string;
  feeLowUsd: number;
  feeHighUsd: number;
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
    feeLabel: getFeeDisplay(s.feeRange, s.slug),
    feeLowUsd: s.feeLowUsd,
    feeHighUsd: s.feeHighUsd,
    ageRange: s.ageRange,
    studentCount: s.studentCount,
    ibAverage: ibAvg?.value ?? "",
    ibPassRate: ibPass?.value ?? "",
  };
}

function QuickAddButton({
  label,
  slugs,
  citySlug,
  onAdd,
}: {
  label: string;
  slugs: string[];
  citySlug: string;
  onAdd: (slugs: string[], citySlug: string) => void;
}) {
  return (
    <button
      onClick={() => onAdd(slugs, citySlug)}
      className="px-4 py-2 text-xs uppercase tracking-wider rounded-sm border border-warm-border text-charcoal-muted hover:border-hermes hover:text-hermes transition-colors"
    >
      {label}
    </button>
  );
}

function ShortlistContent() {
  const searchParams = useSearchParams();
  const { shortlistedSlugs, addToShortlist, removeFromShortlist, citiesWithShortlist, shortlistedSlugsForCity } = useShortlist();
  const { fmtRange } = useCurrency();
  const urlSynced = useRef(false);

  const feeDisplay = useCallback(
    (s: ShortlistSchool) =>
      s.feeHighUsd > 0 ? `${fmtRange(s.feeLowUsd, s.feeHighUsd, "USD")}/yr` : s.feeLabel,
    [fmtRange]
  );

  useEffect(() => {
    if (urlSynced.current) return;
    const param = searchParams.get("schools");
    if (!param) {
      urlSynced.current = true;
      return;
    }
    const slugs = param.split(",").map((s) => s.trim()).filter(Boolean);
    slugs.forEach((slug) => {
      const school = ALL_SCHOOLS.find((s) => s.slug === slug);
      if (school) addToShortlist(slug, school.citySlug);
    });
    urlSynced.current = true;
  }, [searchParams, addToShortlist]);

  const handleQuickAdd = useCallback(
    (slugs: string[], citySlug: string) => {
      slugs.forEach((slug) => addToShortlist(slug, citySlug));
    },
    [addToShortlist]
  );

  const handleRemove = useCallback(
    (slug: string, citySlug: string) => {
      removeFromShortlist(slug, citySlug);
    },
    [removeFromShortlist]
  );

  const isEmpty = citiesWithShortlist.length === 0;

  const allSlugsForShare = shortlistedSlugs;

  return (
    <div className="container-site py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-2">
            My Shortlist
          </h1>
          {isEmpty ? (
            <p className="text-charcoal-muted max-w-lg">
              Add schools to your shortlist from any city listing or school profile. Shortlists are per city — compare up to 4 schools in each. Here are Jakarta&rsquo;s top 3 to get you started.
            </p>
          ) : (
            <p className="text-charcoal-muted">
              {shortlistedSlugs.length} school{shortlistedSlugs.length !== 1 ? "s" : ""} across {citiesWithShortlist.length} {citiesWithShortlist.length === 1 ? "city" : "cities"}.
            </p>
          )}
        </div>
        {!isEmpty && (
          <ShareButton variant="shortlist" schoolSlugs={allSlugsForShare} />
        )}
      </div>

      {isEmpty && (
        <div className="flex flex-wrap gap-2 mb-8">
          <QuickAddButton
            label="Top British schools"
            slugs={["british-school-jakarta", "independent-school-of-jakarta", "acg-school-jakarta"]}
            citySlug="jakarta"
            onAdd={handleQuickAdd}
          />
          <QuickAddButton
            label="Top IB schools"
            slugs={["jakarta-intercultural-school", "british-school-jakarta", "sinarmas-world-academy"]}
            citySlug="jakarta"
            onAdd={handleQuickAdd}
          />
          <QuickAddButton
            label="Highest-rated in South Jakarta"
            slugs={["jakarta-intercultural-school", "independent-school-of-jakarta", "australian-independent-school-jakarta"]}
            citySlug="jakarta"
            onAdd={handleQuickAdd}
          />
        </div>
      )}

      {!isEmpty && (
        <div className="space-y-10">
          {citiesWithShortlist.map((citySlug) => {
            const slugs = shortlistedSlugsForCity(citySlug);
            const schools = slugs
              .map((slug) => ALL_SCHOOLS.find((s) => s.slug === slug && s.citySlug === citySlug))
              .filter(Boolean)
              .map((s) => toShortlistSchool(s!));
            const cityName = getCityName(citySlug);
            const canCompare = schools.length >= 2;

            return (
              <section key={citySlug} className="border-b border-warm-border pb-10 last:border-b-0">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="font-display text-xl md:text-2xl text-charcoal">
                    {cityName}
                  </h2>
                  {canCompare && (
                    <Link
                      href={`/international-schools/${citySlug}/compare`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-hermes text-white text-[0.8125rem] font-semibold uppercase tracking-wider hover:bg-hermes-hover transition-colors"
                    >
                      Compare {schools.length} schools →
                    </Link>
                  )}
                </div>

                <ul className="space-y-3">
                  {schools.map((school) => (
                    <li
                      key={school.slug}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-warm-border-light last:border-b-0"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/international-schools/${school.citySlug}/${school.slug}/`}
                          className="font-display font-medium text-charcoal hover:text-hermes transition-colors"
                        >
                          {school.name}
                        </Link>
                        <p className="text-[0.8125rem] text-charcoal-muted mt-0.5">
                          {school.area} · {feeDisplay(school)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Link
                          href={`/international-schools/${school.citySlug}/${school.slug}/`}
                          className="text-sm font-medium text-hermes hover:text-hermes-hover transition-colors"
                        >
                          View profile
                        </Link>
                        <button
                          onClick={() => handleRemove(school.slug, school.citySlug)}
                          className="text-charcoal-muted hover:text-hermes transition-colors p-1"
                          aria-label={`Remove ${school.name} from shortlist`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="mt-3">
                  <Link
                    href={`/international-schools/${citySlug}/`}
                    className="text-sm text-hermes hover:text-hermes-hover transition-colors"
                  >
                    Browse more schools in {cityName} →
                  </Link>
                </p>
              </section>
            );
          })}
        </div>
      )}
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
