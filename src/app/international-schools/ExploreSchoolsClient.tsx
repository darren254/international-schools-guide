"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SchoolCard } from "@/components/school/SchoolCard";
import {
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
  schools: JakartaSchoolListing[];
  profileSlugs: string[];
}

export function ExploreSchoolsClient({ schools, profileSlugs }: ExploreSchoolsClientProps) {
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
  }, [schools, curriculum, location, feeSort]);

  return (
    <div className="container-site">
      <nav className="py-5 text-[0.8125rem] text-charcoal-muted" aria-label="Breadcrumb">
        <span className="text-charcoal">International Schools</span>
      </nav>

      <section className="pb-6 border-b border-warm-border">
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-medium tracking-tight leading-tight mb-2">
          Explore Schools
        </h1>
        <p className="text-[0.9375rem] text-charcoal-muted mb-6">
          {schools.length} international schools in Jakarta. Use the filters below to narrow by curriculum or location, and sort by fees (high to low or low to high).
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-label-xs uppercase text-charcoal-muted tracking-wider mr-1">Curriculum</span>
            {CURRICULUM_OPTIONS.map((opt) => (
              <button
                key={opt.value || "all"}
                onClick={() => setCurriculum(opt.value)}
                className={`px-3 py-1.5 text-[0.8125rem] rounded-sm border transition-colors ${
                  curriculum === opt.value
                    ? "bg-hermes text-white border-hermes"
                    : "bg-warm-white border-warm-border text-charcoal-light hover:border-charcoal-muted hover:text-charcoal"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-label-xs uppercase text-charcoal-muted tracking-wider mr-1">Location</span>
            {LOCATION_OPTIONS.map((opt) => (
              <button
                key={opt.value || "all"}
                onClick={() => setLocation(opt.value)}
                className={`px-3 py-1.5 text-[0.8125rem] rounded-sm border transition-colors ${
                  location === opt.value
                    ? "bg-hermes text-white border-hermes"
                    : "bg-warm-white border-warm-border text-charcoal-light hover:border-charcoal-muted hover:text-charcoal"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-label-xs uppercase text-charcoal-muted tracking-wider">Fees</span>
            <button
              onClick={() => setFeeSort("high-low")}
              className={`px-3 py-1.5 text-[0.8125rem] rounded-sm border transition-colors ${
                feeSort === "high-low"
                  ? "bg-hermes text-white border-hermes"
                  : "bg-warm-white border-warm-border text-charcoal-light hover:border-charcoal-muted"
              }`}
            >
              High → Low
            </button>
            <button
              onClick={() => setFeeSort("low-high")}
              className={`px-3 py-1.5 text-[0.8125rem] rounded-sm border transition-colors ${
                feeSort === "low-high"
                  ? "bg-hermes text-white border-hermes"
                  : "bg-warm-white border-warm-border text-charcoal-light hover:border-charcoal-muted"
              }`}
            >
              Low → High
            </button>
          </div>
        </div>
      </section>

      <div className="py-6">
        <p className="text-[0.8125rem] text-charcoal-muted mb-4">
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

      <section className="pt-8 pb-12 border-t border-warm-border">
        <h2 className="font-display text-display-sm font-medium mb-3">Browse by city</h2>
        <p className="text-[0.9375rem] text-charcoal-muted mb-4">
          Jakarta is the first city we&apos;ve built out. More cities coming soon.
        </p>
        <Link
          href="/international-schools/jakarta/"
          className="inline-block font-medium text-hermes hover:text-hermes-hover transition-colors"
        >
          View all Jakarta schools →
        </Link>
      </section>
    </div>
  );
}
