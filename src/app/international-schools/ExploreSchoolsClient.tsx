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

      <section className="pb-8">
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-medium tracking-tight leading-tight mb-1.5">
          Explore Schools
        </h1>
        <p className="text-[0.9375rem] text-charcoal-muted mb-5">
          {schools.length} schools in Jakarta. Filter by curriculum or location; sort by fees.
        </p>

        {/* Filter bar — single panel so chips wrap in a grid and avoid orphan lines */}
        <div className="bg-warm-white border border-warm-border rounded-sm p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 sm:gap-6">
            <div>
              <p className="text-label-xs uppercase text-charcoal-muted tracking-wider mb-2.5">Curriculum</p>
              <div className="flex flex-wrap gap-2">
                {CURRICULUM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value || "all"}
                    onClick={() => setCurriculum(opt.value)}
                    className={`px-2.5 py-1 text-[0.75rem] rounded-sm border transition-colors whitespace-nowrap ${
                      curriculum === opt.value
                        ? "bg-hermes text-white border-hermes"
                        : "bg-white border-warm-border text-charcoal-light hover:border-charcoal-muted hover:text-charcoal"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-label-xs uppercase text-charcoal-muted tracking-wider mb-2.5">Location</p>
              <div className="flex flex-wrap gap-2">
                {LOCATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value || "all"}
                    onClick={() => setLocation(opt.value)}
                    className={`px-2.5 py-1 text-[0.75rem] rounded-sm border transition-colors whitespace-nowrap ${
                      location === opt.value
                        ? "bg-hermes text-white border-hermes"
                        : "bg-white border-warm-border text-charcoal-light hover:border-charcoal-muted hover:text-charcoal"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-warm-border-light flex flex-wrap items-center gap-2">
            <p className="text-label-xs uppercase text-charcoal-muted tracking-wider">Sort by fees</p>
            <button
              onClick={() => setFeeSort("high-low")}
              className={`px-2.5 py-1 text-[0.75rem] rounded-sm border transition-colors ${
                feeSort === "high-low"
                  ? "bg-hermes text-white border-hermes"
                  : "bg-white border-warm-border text-charcoal-light hover:border-charcoal-muted"
              }`}
            >
              High → Low
            </button>
            <button
              onClick={() => setFeeSort("low-high")}
              className={`px-2.5 py-1 text-[0.75rem] rounded-sm border transition-colors ${
                feeSort === "low-high"
                  ? "bg-hermes text-white border-hermes"
                  : "bg-white border-warm-border text-charcoal-light hover:border-charcoal-muted"
              }`}
            >
              Low → High
            </button>
          </div>
        </div>
      </section>

      <div className="pt-2 pb-10">
        <p className="text-[0.8125rem] text-charcoal-muted mb-3">
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
