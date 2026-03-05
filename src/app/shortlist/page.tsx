"use client";

import { Suspense, useEffect, useRef, useCallback } from "react";
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
import { LIVE_CITIES } from "@/data/cities";
import { CityCardImage } from "@/components/home/CityCardImage";
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

/** Quick-add presets: Jakarta curated + one "Popular in [City]" per other live city. */
const QUICK_ADD_PRESETS: { citySlug: string; label: string; slugs: string[] }[] = (() => {
  const list: { citySlug: string; label: string; slugs: string[] }[] = [
    { citySlug: "jakarta", label: "Top British schools", slugs: ["british-school-jakarta", "independent-school-of-jakarta", "acg-school-jakarta"] },
    { citySlug: "jakarta", label: "Top IB schools", slugs: ["jakarta-intercultural-school", "british-school-jakarta", "sinarmas-world-academy"] },
    { citySlug: "jakarta", label: "Highest-rated South Jakarta", slugs: ["jakarta-intercultural-school", "independent-school-of-jakarta", "australian-independent-school-jakarta"] },
  ];
  const byCity = ALL_SCHOOLS.reduce<Record<string, string[]>>((acc, s) => {
    if (!acc[s.citySlug]) acc[s.citySlug] = [];
    acc[s.citySlug].push(s.slug);
    return acc;
  }, {});
  LIVE_CITIES.forEach((city) => {
    if (city.slug === "jakarta") return;
    const slugs = (byCity[city.slug] ?? []).slice(0, 3);
    if (slugs.length >= 2) list.push({ citySlug: city.slug, label: `Popular in ${city.name}`, slugs });
  });
  return list;
})();

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
      type="button"
      onClick={() => onAdd(slugs, citySlug)}
      className="px-4 py-2.5 text-[0.8125rem] font-medium uppercase tracking-wider rounded-sm border-2 border-primary text-primary bg-primary-light/15 hover:bg-primary-light/25 transition-colors"
    >
      {label}
    </button>
  );
}

/** Compact city tile for "Explore another city" (with-schools state). */
function CompactCityGrid() {
  return (
    <section className="pt-10 mt-10 border-t border-warm-border">
      <h3 className="font-display text-lg text-charcoal mb-4">Explore another city</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {LIVE_CITIES.map((city) => (
          <Link
            key={city.slug}
            href={`/international-schools/${city.slug}/`}
            className="group flex flex-col rounded-sm overflow-hidden border border-warm-border hover:border-primary bg-cream-50 transition-colors"
          >
            <div className="aspect-[4/3] relative bg-cream-300 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/cities/${city.slug}.webp${city.slug === "jakarta" ? "?v=2" : ""}`}
                alt=""
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="p-2 text-center font-display text-sm font-medium text-charcoal group-hover:text-primary truncate">
              {city.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ShortlistContent() {
  const searchParams = useSearchParams();
  const { shortlistedSlugs, addToShortlist, removeFromShortlist, citiesWithShortlist, shortlistedSlugsForCity } =
    useShortlist();
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
    const slugs = param
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-2">
            My Shortlist
          </h1>
          {isEmpty ? (
            <p className="text-charcoal-muted max-w-lg text-[0.9375rem] md:text-base">
              Browse schools in a city, tap the heart on ones you like, then come back here to compare them side by side. Shortlists are per city — up to 4 schools per city.
            </p>
          ) : (
            <p className="text-charcoal-muted text-[0.9375rem] md:text-base">
              {shortlistedSlugs.length} school{shortlistedSlugs.length !== 1 ? "s" : ""} across{" "}
              {citiesWithShortlist.length} {citiesWithShortlist.length === 1 ? "city" : "cities"}.
            </p>
          )}
        </div>
        {!isEmpty && (
          <ShareButton variant="shortlist" schoolSlugs={allSlugsForShare} />
        )}
      </div>

      {isEmpty && (
        <>
          {/* City picker — same visual style as home */}
          <section className="bg-warm-white border-y border-warm-border-light py-8 md:py-12 rounded-sm">
            <h2 className="font-display text-xl md:text-2xl text-charcoal mb-6 text-center md:text-left">
              Which city are you exploring?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {LIVE_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/international-schools/${city.slug}/`}
                  className="group border-2 border-primary rounded-sm overflow-hidden hover:shadow-lg transition-all duration-200 bg-cream-50 flex flex-col h-full"
                >
                  <CityCardImage city={city} photoCredit={city.photoCredit} />
                  <div className="p-3 md:p-4 flex flex-col min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1 min-w-0">
                      <span className="font-display text-display-sm font-medium text-charcoal truncate">
                        {city.name}
                      </span>
                      <span
                        className="text-label-xs uppercase text-charcoal-muted shrink-0 truncate max-w-[45%]"
                        title={city.country}
                      >
                        {city.country}
                      </span>
                    </div>
                    <p className="text-[0.8125rem] text-charcoal-muted leading-snug">
                      {city.schoolCount ?? "—"}+ schools
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick-start suggestions */}
          <section className="mt-8 md:mt-12">
            <h2 className="font-display text-lg md:text-xl text-charcoal mb-3">
              Not sure where to start?
            </h2>
            <p className="text-[0.8125rem] text-charcoal-muted mb-4 max-w-lg">
              Add a few top picks to your shortlist with one tap, then browse to add more or remove any.
            </p>
            <div className="flex flex-wrap gap-3">
              {QUICK_ADD_PRESETS.map((preset) => (
                <QuickAddButton
                  key={`${preset.citySlug}-${preset.label}`}
                  label={preset.label}
                  slugs={preset.slugs}
                  citySlug={preset.citySlug}
                  onAdd={handleQuickAdd}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {!isEmpty && (
        <>
          <div className="space-y-10">
            {citiesWithShortlist.map((citySlug) => {
              const slugs = shortlistedSlugsForCity(citySlug);
              const schools = slugs
                .map((slug) => ALL_SCHOOLS.find((s) => s.slug === slug && s.citySlug === citySlug))
                .filter(Boolean)
                .map((s) => toShortlistSchool(s!));
              const cityName = getCityName(citySlug);

              return (
                <section key={citySlug} className="border-b border-warm-border pb-10 last:border-b-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="font-display text-xl md:text-2xl text-charcoal">
                      {cityName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/international-schools/${citySlug}/`}
                        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                      >
                        Browse more {cityName} schools →
                      </Link>
                    </div>
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
                            className="font-display font-medium text-charcoal hover:text-primary transition-colors"
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
                            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                          >
                            View profile
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemove(school.slug, school.citySlug)}
                            className="text-charcoal-muted hover:text-primary transition-colors p-1"
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
                </section>
              );
            })}
          </div>

          <CompactCityGrid />
        </>
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
