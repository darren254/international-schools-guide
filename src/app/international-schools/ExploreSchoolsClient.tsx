"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SchoolCard } from "@/components/school/SchoolCard";
import { getCurriculumFilterLabels, getLocationFilter } from "@/data/jakarta-schools";
import { getDubaiLocationFilter } from "@/data/dubai-schools";
import { getSingaporeLocationFilter } from "@/data/singapore-schools";
import { getBangkokLocationFilter } from "@/data/bangkok-schools";
import { getHongKongLocationFilter } from "@/data/hong-kong-schools";
import { getKualaLumpurLocationFilter } from "@/data/kuala-lumpur-schools";
import { extractHighestFee, extractLowestFee, hasPublishableFee } from "@/lib/utils/fees";
import { getSchoolImageUrl } from "@/lib/schools/images";

export interface SchoolListing {
  name: string;
  slug: string;
  verified: boolean;
  curricula: string[];
  area: string;
  ageRange: string;
  studentCount: string;
  feeRange: string;
  examResults: { label: string; value: string }[];
  editorialSummary: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface LocationOption {
  value: string;
  label: string;
}

const CURRICULUM_OPTIONS = [
  { value: "", label: "All curricula" },
  { value: "IB", label: "IB" },
  { value: "British / Cambridge", label: "British / Cambridge" },
  { value: "Australian", label: "Australian" },
  { value: "American / AP", label: "American / AP" },
  { value: "Singapore", label: "Singapore" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Indian", label: "Indian" },
  { value: "Canadian", label: "Canadian" },
  { value: "Japanese", label: "Japanese" },
  { value: "Swiss", label: "Swiss" },
  { value: "Chinese", label: "Chinese" },
  { value: "Thai", label: "Thai" },
  { value: "Other", label: "Other" },
];

type FeeSort = "high-low" | "low-high";

function getLocationBucket(area: string, citySlug: string): string {
  switch (citySlug) {
    case "dubai": return getDubaiLocationFilter(area);
    case "singapore": return getSingaporeLocationFilter(area);
    case "bangkok": return getBangkokLocationFilter(area);
    case "hong-kong": return getHongKongLocationFilter(area);
    case "kuala-lumpur": return getKualaLumpurLocationFilter(area);
    default: return getLocationFilter(area);
  }
}

function schoolMatchesCurriculum(school: SchoolListing, curriculumFilter: string): boolean {
  if (!curriculumFilter) return true;
  const labels = getCurriculumFilterLabels(school.curricula);
  return labels.some((l) => l === curriculumFilter);
}

function schoolMatchesLocation(school: SchoolListing, locationFilter: string, citySlug: string): boolean {
  if (!locationFilter) return true;
  return getLocationBucket(school.area, citySlug) === locationFilter;
}

interface ExploreSchoolsClientProps {
  schools: SchoolListing[];
  profileSlugs: string[];
  citySlug: string;
  cityName: string;
  locationOptions: LocationOption[];
}

export function ExploreSchoolsClient({
  schools,
  profileSlugs,
  citySlug,
  cityName,
  locationOptions,
}: ExploreSchoolsClientProps) {
  const [curriculum, setCurriculum] = useState("");
  const [location, setLocation] = useState("");
  const [feeSort, setFeeSort] = useState<FeeSort>("high-low");

  const profileSet = useMemo(() => new Set(profileSlugs), [profileSlugs]);

  const filteredAndSorted = useMemo(() => {
    let list = schools.filter(
      (s) => schoolMatchesCurriculum(s, curriculum) && schoolMatchesLocation(s, location, citySlug)
    );
    const sortMultiplier = feeSort === "high-low" ? -1 : 1;
    list = [...list].sort((a, b) => {
      const aHasFee = hasPublishableFee(a.feeRange);
      const bHasFee = hasPublishableFee(b.feeRange);
      if (aHasFee !== bHasFee) return aHasFee ? -1 : 1;
      if (!aHasFee) return 0;
      const feeA = extractHighestFee(a.feeRange);
      const feeB = extractHighestFee(b.feeRange);
      if (feeA !== feeB) return (feeA - feeB) * sortMultiplier;
      return (extractLowestFee(a.feeRange) - extractLowestFee(b.feeRange)) * sortMultiplier;
    });
    return list;
  }, [schools, curriculum, location, feeSort, citySlug]);

  return (
    <div className="container-site">
      <nav className="py-5 text-[0.8125rem] text-charcoal-muted" aria-label="Breadcrumb">
        <Link href="/international-schools/" className="hover:text-hermes transition-colors">
          International Schools
        </Link>
        <span className="mx-1.5 opacity-50">›</span>
        <span className="text-charcoal">{cityName}</span>
      </nav>

      <section className="pb-6 border-b border-warm-border">
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-medium tracking-tight leading-tight mb-1.5">
          International Schools in {cityName}
        </h1>
        <p className="text-[0.9375rem] text-charcoal-muted mb-4 font-body">
          {schools.length} schools · Filter by location or curriculum; sort by fees.
        </p>

        <div className="grid grid-cols-2 gap-4 py-3 md:grid-cols-3 md:gap-6">
          <div className="flex flex-col gap-1.5 md:min-w-[160px]">
            <label htmlFor="location-filter" className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted font-body">
              Location
            </label>
            <select
              id="location-filter"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="min-h-[44px] w-full bg-cream border border-warm-border text-[0.8125rem] text-charcoal font-body py-2 pl-3 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-charcoal-muted rounded-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237A756E' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
            >
              {locationOptions.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:min-w-[160px]">
            <span className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted font-body">
              Fees
            </span>
            <button
              type="button"
              onClick={() => setFeeSort((s) => (s === "high-low" ? "low-high" : "high-low"))}
              className="min-h-[44px] w-full flex items-center justify-center gap-2 border border-warm-border bg-cream text-[0.8125rem] text-charcoal font-body hover:border-charcoal-muted transition-colors focus:outline-none focus:border-charcoal-muted rounded-none"
              aria-label={feeSort === "high-low" ? "Sort fees high to low (click for low to high)" : "Sort fees low to high (click for high to low)"}
              title={feeSort === "high-low" ? "High → Low" : "Low → High"}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 7l4-4 4 4M5 11l4 4 4-4" />
              </svg>
              <span className="hidden sm:inline">{feeSort === "high-low" ? "High → Low" : "Low → High"}</span>
            </button>
          </div>

          <div className="col-span-2 flex flex-col gap-1.5 md:col-span-1 md:min-w-[160px]">
            <label htmlFor="curriculum-filter" className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted font-body">
              Curriculum
            </label>
            <select
              id="curriculum-filter"
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
              className="min-h-[44px] w-full bg-cream border border-warm-border text-[0.8125rem] text-charcoal font-body py-2 pl-3 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-charcoal-muted rounded-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237A756E' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
            >
              {CURRICULUM_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="pt-6 pb-10">
        <p className="text-[0.8125rem] text-charcoal-muted mb-4 font-body">
          Showing {filteredAndSorted.length} school{filteredAndSorted.length !== 1 ? "s" : ""}
        </p>
        <div className="space-y-4">
          {filteredAndSorted.map((school) => (
            <SchoolCard
              key={school.slug}
              citySlug={citySlug}
              hasProfile={profileSet.has(school.slug)}
              name={school.name}
              slug={school.slug}
              verified={school.verified}
              curricula={school.curricula}
              area={school.area}
              ageRange={school.ageRange}
              studentCount={school.studentCount}
              feeRange={school.feeRange}
              examResults={school.examResults}
              editorialSummary={school.editorialSummary}
              imageUrl={getSchoolImageUrl(school.slug, "card")}
            />
          ))}
        </div>
        {filteredAndSorted.length === 0 && (
          <p className="text-charcoal-muted py-8">No schools match your filters. Try changing curriculum or location.</p>
        )}
      </div>

      <section className="pt-10 pb-12 border-t border-warm-border">
        <h2 className="font-display text-display-sm font-medium mb-2">Browse by city</h2>
        <p className="text-[0.9375rem] text-charcoal-muted mb-3">
          More cities coming soon.
        </p>
        <Link
          href="/international-schools/"
          className="text-[0.9375rem] font-medium text-hermes hover:text-hermes-hover transition-colors"
        >
          International schools →
        </Link>
      </section>
    </div>
  );
}
