"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SchoolCard } from "@/components/school/SchoolCard";
import { FilterDropdownMulti } from "@/components/school/FilterDropdownMulti";
import { SortDropdown, type FeeSortValue } from "@/components/school/SortDropdown";
import { getCurriculumFilterLabels, getLocationFilter } from "@/data/jakarta-schools";
import { getDubaiLocationFilter } from "@/data/dubai-schools";
import { getSingaporeLocationFilter } from "@/data/singapore-schools";
import { getBangkokLocationFilter } from "@/data/bangkok-schools";
import { getHongKongLocationFilter } from "@/data/hong-kong-schools";
import { getKualaLumpurLocationFilter } from "@/data/kuala-lumpur-schools";
import { getSchoolImageUrl } from "@/lib/schools/images";
import { useShortlistOptional } from "@/context/ShortlistContext";
import { useCurrency } from "@/context/CurrencyContext";

export interface SchoolListing {
  name: string;
  slug: string;
  verified: boolean;
  curricula: string[];
  area: string;
  ageRange: string;
  studentCount: string;
  feeRange: string;
  feeLowUsd: number;
  feeHighUsd: number;
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

const CURRICULUM_PILL_LABELS = [
  "IB",
  "British / Cambridge",
  "Australian",
  "American / AP",
  "Singapore",
  "French",
  "German",
  "Indian",
  "Canadian",
  "Japanese",
  "Swiss",
  "Chinese",
  "Thai",
  "Other",
] as const;

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

function schoolMatchesCurriculum(school: SchoolListing, selected: string[]): boolean {
  if (selected.length === 0) return true;
  const labels = getCurriculumFilterLabels(school.curricula);
  return selected.some((s) => labels.includes(s));
}

function schoolMatchesLocation(school: SchoolListing, selected: string[], citySlug: string): boolean {
  if (selected.length === 0) return true;
  const bucket = getLocationBucket(school.area, citySlug);
  return selected.includes(bucket);
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
  const [curriculumFilter, setCurriculumFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [feeSort, setFeeSort] = useState<FeeSortValue>("high-low");
  const [openFilterId, setOpenFilterId] = useState<"curriculum" | "area" | "sort" | null>(null);

  const shortlist = useShortlistOptional();
  const { exchangeRateDate } = useCurrency();
  const profileSet = useMemo(() => new Set(profileSlugs), [profileSlugs]);

  const curriculumOptions = useMemo(() => {
    const present = new Set<string>();
    schools.forEach((s) => getCurriculumFilterLabels(s.curricula).forEach((l) => present.add(l)));
    return CURRICULUM_PILL_LABELS.filter((l) => present.has(l)).map((label) => ({
      value: label,
      label,
    }));
  }, [schools]);

  const locationDropdownOptions = useMemo(
    () => locationOptions.filter((opt) => opt.value !== "").map((opt) => ({ value: opt.value, label: opt.label })),
    [locationOptions]
  );

  const filteredAndSorted = useMemo(() => {
    let list = schools.filter(
      (s) =>
        schoolMatchesCurriculum(s, curriculumFilter) &&
        schoolMatchesLocation(s, locationFilter, citySlug)
    );
    const sortMultiplier = feeSort === "high-low" ? -1 : 1;
    list = [...list].sort((a, b) => {
      const aHasFee = a.feeHighUsd > 0;
      const bHasFee = b.feeHighUsd > 0;
      if (aHasFee !== bHasFee) return aHasFee ? -1 : 1;
      if (!aHasFee) return 0;
      if (a.feeHighUsd !== b.feeHighUsd) return (a.feeHighUsd - b.feeHighUsd) * sortMultiplier;
      return (a.feeLowUsd - b.feeLowUsd) * sortMultiplier;
    });
    return list;
  }, [schools, curriculumFilter, locationFilter, feeSort, citySlug]);

  const hasActiveFilters = curriculumFilter.length > 0 || locationFilter.length > 0;
  const clearFilters = () => {
    setCurriculumFilter([]);
    setLocationFilter([]);
  };

  return (
    <div className="container-site">
      <nav className="py-5 text-body-xs text-charcoal-muted" aria-label="Breadcrumb">
        <Link href="/international-schools/" className="hover:text-primary transition-colors">
          International Schools
        </Link>
        <span className="mx-1.5 opacity-50">›</span>
        <span className="text-charcoal">{cityName}</span>
      </nav>

      <section className="pb-6 border-b border-warm-border">
        <div className="mb-4">
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-medium tracking-tight leading-tight mb-1.5">
            International Schools in {cityName}
          </h1>
          <p className="text-body-sm text-charcoal-muted font-body">
            Compare fees and read honest reviews. Filter by curriculum or area; sort by fees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3 overflow-x-auto pb-1 md:overflow-visible">
          <FilterDropdownMulti
            label="Curriculum"
            options={curriculumOptions}
            selected={curriculumFilter}
            onChange={setCurriculumFilter}
            isOpen={openFilterId === "curriculum"}
            onOpenChange={(open) => setOpenFilterId(open ? "curriculum" : null)}
          />
          {locationDropdownOptions.length > 0 && (
            <FilterDropdownMulti
              label="Area"
              options={locationDropdownOptions}
              selected={locationFilter}
              onChange={setLocationFilter}
              isOpen={openFilterId === "area"}
              onOpenChange={(open) => setOpenFilterId(open ? "area" : null)}
            />
          )}
          <SortDropdown
            value={feeSort}
            onChange={setFeeSort}
            isOpen={openFilterId === "sort"}
            onOpenChange={(open) => setOpenFilterId(open ? "sort" : null)}
          />
          <span className="text-body-xs text-charcoal-muted font-body shrink-0 ml-auto">
            {filteredAndSorted.length} school{filteredAndSorted.length !== 1 ? "s" : ""}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-body-xs font-body text-charcoal-muted hover:text-primary transition-colors shrink-0"
            >
              Clear filters
            </button>
          )}
        </div>

        <p className="text-label-sm text-charcoal-muted mt-3 font-body">
          Fees in approximate equivalent. Rates updated periodically ({exchangeRateDate}).
        </p>
      </section>

      <div className="pt-6 pb-10">
        <div className="space-y-4">
          {filteredAndSorted.map((school, index) => (
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
              feeLowUsd={school.feeLowUsd}
              feeHighUsd={school.feeHighUsd}
              feeLabel={school.feeHighUsd === 0 ? school.feeRange : undefined}
              examResults={school.examResults}
              editorialSummary={school.editorialSummary}
              imageUrl={getSchoolImageUrl(school.slug, "card")}
              priority={index < 4}
            />
          ))}
        </div>
        {filteredAndSorted.length === 0 && (
          <p className="text-charcoal-muted py-8">No schools match your filters. Try changing curriculum or area.</p>
        )}
      </div>

      <section className="pt-10 pb-12 border-t border-warm-border">
        <h2 className="font-display text-display-sm font-medium mb-2">Browse by city</h2>
        <p className="text-body-sm text-charcoal-muted mb-3">
          More cities coming soon.
        </p>
        <Link
          href="/international-schools/"
          className="text-body-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          International schools →
        </Link>
      </section>
    </div>
  );
}
