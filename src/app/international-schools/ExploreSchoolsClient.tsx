"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SchoolCard } from "@/components/school/SchoolCard";
import {
  JAKARTA_SCHOOLS,
  getLocationFilter,
  getCurriculumFilterLabels,
  type LocationFilter,
  type JakartaSchoolListing,
} from "@/data/jakarta-schools";
import { extractHighestFee, extractLowestFee } from "@/lib/utils/fees";

const CURRICULUM_OPTIONS = [
  { value: "", label: "All curricula" },
  { value: "IB", label: "IB" },
  { value: "British / Cambridge", label: "British / Cambridge" },
  { value: "Australian", label: "Australian" },
  { value: "American / AP", label: "American / AP" },
  { value: "Singapore", label: "Singapore" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Korean", label: "Korean" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "Other", label: "Other" },
];

const LOCATION_OPTIONS: { value: "" | LocationFilter; label: string }[] = [
  { value: "", label: "All locations" },
  { value: "North", label: "North Jakarta" },
  { value: "South", label: "South Jakarta" },
  { value: "East", label: "East Jakarta" },
  { value: "West", label: "West Jakarta" },
  { value: "Central", label: "Central Jakarta" },
  { value: "Outside Jakarta", label: "Outside Jakarta" },
];

type FeeSort = "high-low" | "low-high";

function schoolMatchesCurriculum(school: JakartaSchoolListing, curriculumFilter: string): boolean {
  if (!curriculumFilter) return true;
  const labels = getCurriculumFilterLabels(school.curricula);
  return labels.some((l) => l === curriculumFilter);
}

function schoolMatchesLocation(school: JakartaSchoolListing, locationFilter: LocationFilter | ""): boolean {
  if (!locationFilter) return true;
  return getLocationFilter(school.area) === locationFilter;
}

interface ExploreSchoolsClientProps {
  profileSlugs: string[];
}

export function ExploreSchoolsClient({ profileSlugs }: ExploreSchoolsClientProps) {
  const schools = JAKARTA_SCHOOLS;
  const [curriculum, setCurriculum] = useState("");
  const [location, setLocation] = useState<"" | LocationFilter>("");
  const [feeSort, setFeeSort] = useState<FeeSort>("high-low");

  const profileSet = useMemo(() => new Set(profileSlugs), [profileSlugs]);

  const filteredAndSorted = useMemo(() => {
    let list = schools.filter(
      (s) => schoolMatchesCurriculum(s, curriculum) && schoolMatchesLocation(s, location)
    );
    const sortMultiplier = feeSort === "high-low" ? -1 : 1;
    list = [...list].sort((a, b) => {
      const feeA = extractHighestFee(a.feeRange);
      const feeB = extractHighestFee(b.feeRange);
      if (feeA !== feeB) return (feeA - feeB) * sortMultiplier;
      return (extractLowestFee(a.feeRange) - extractLowestFee(b.feeRange)) * sortMultiplier;
    });
    return list;
  }, [curriculum, location, feeSort]);

  return (
    <div className="container-site">
      <nav className="py-5 text-[0.8125rem] text-charcoal-muted" aria-label="Breadcrumb">
        <span className="text-charcoal">International Schools</span>
      </nav>

      <section className="pb-6 border-b border-warm-border">
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-medium tracking-tight leading-tight mb-1.5">
          Explore Schools
        </h1>
        <p className="text-[0.9375rem] text-charcoal-muted mb-4 font-body">
          {schools.length} schools in Jakarta. Filter by curriculum or location; sort by fees.
        </p>

        {/* Single tight row: curriculum pills left, location dropdown right, sort as text links */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted font-body mr-1">Curriculum</span>
            {CURRICULUM_OPTIONS.map((opt) => (
              <button
                key={opt.value || "all"}
                onClick={() => setCurriculum(opt.value)}
                className={`px-2 py-0.5 text-[0.6875rem] uppercase tracking-wider font-body transition-colors whitespace-nowrap border ${
                  curriculum === opt.value
                    ? "border-charcoal text-charcoal bg-cream-300"
                    : "border-warm-border text-charcoal-muted hover:text-charcoal hover:border-charcoal-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <label htmlFor="location-filter" className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted font-body">
              Location
            </label>
            <select
              id="location-filter"
              value={location}
              onChange={(e) => setLocation(e.target.value as "" | LocationFilter)}
              className="bg-cream border border-warm-border text-[0.8125rem] text-charcoal font-body py-1.5 pl-2 pr-7 appearance-none cursor-pointer focus:outline-none focus:border-charcoal-muted"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237A756E' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 6px center",
              }}
            >
              {LOCATION_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto border-l border-warm-border pl-4">
            <span className="text-[0.6875rem] uppercase tracking-widest text-charcoal-muted font-body">Fees</span>
            <button
              onClick={() => setFeeSort("high-low")}
              className={`text-[0.75rem] font-body uppercase tracking-wider ${
                feeSort === "high-low" ? "text-charcoal" : "text-charcoal-muted hover:text-charcoal"
              }`}
            >
              High → Low
            </button>
            <span className="text-charcoal-muted/50">/</span>
            <button
              onClick={() => setFeeSort("low-high")}
              className={`text-[0.75rem] font-body uppercase tracking-wider ${
                feeSort === "low-high" ? "text-charcoal" : "text-charcoal-muted hover:text-charcoal"
              }`}
            >
              Low → High
            </button>
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
              citySlug="jakarta"
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
          Jakarta is the first city we&apos;ve built out. More cities coming soon.
        </p>
        <Link
          href="/international-schools/jakarta/"
          className="text-[0.9375rem] font-medium text-hermes hover:text-hermes-hover transition-colors"
        >
          View all Jakarta schools →
        </Link>
      </section>
    </div>
  );
}
