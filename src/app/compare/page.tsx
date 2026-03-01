"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useShortlist } from "@/context/ShortlistContext";
import { JAKARTA_SCHOOLS, getLocationFilter, getCurriculumFilterLabels } from "@/data/jakarta-schools";
import { DUBAI_SCHOOLS, getDubaiLocationFilter } from "@/data/dubai-schools";
import { SINGAPORE_SCHOOLS, getSingaporeLocationFilter } from "@/data/singapore-schools";
import { BANGKOK_SCHOOLS, getBangkokLocationFilter } from "@/data/bangkok-schools";
import { HONG_KONG_SCHOOLS, getHongKongLocationFilter } from "@/data/hong-kong-schools";
import { KUALA_LUMPUR_SCHOOLS, getKualaLumpurLocationFilter } from "@/data/kuala-lumpur-schools";
import { extractHighestFee, getFeeDisplay, hasPublishableFee } from "@/lib/utils/fees";

type SortDir = "high" | "low";

interface TableSchool {
  slug: string;
  citySlug: string;
  name: string;
  area: string;
  locationGroup: string;
  curricula: string[];
  curriculumLabels: string[];
  feeDisplay: string;
  feeHigh: number;
  studentCount: string;
}

function buildTableSchools(): TableSchool[] {
  const tagged = [
    ...JAKARTA_SCHOOLS.map((s) => ({ ...s, citySlug: "jakarta", locationGroup: getLocationFilter(s.area) })),
    ...DUBAI_SCHOOLS.map((s) => ({ ...s, citySlug: "dubai", locationGroup: getDubaiLocationFilter(s.area) })),
    ...SINGAPORE_SCHOOLS.map((s) => ({ ...s, citySlug: "singapore", locationGroup: getSingaporeLocationFilter(s.area) })),
    ...BANGKOK_SCHOOLS.map((s) => ({ ...s, citySlug: "bangkok", locationGroup: getBangkokLocationFilter(s.area) })),
    ...HONG_KONG_SCHOOLS.map((s) => ({ ...s, citySlug: "hong-kong", locationGroup: getHongKongLocationFilter(s.area) })),
    ...KUALA_LUMPUR_SCHOOLS.map((s) => ({ ...s, citySlug: "kuala-lumpur", locationGroup: getKualaLumpurLocationFilter(s.area) })),
  ];
  return tagged.map((s) => {
    const feeDisplay = getFeeDisplay(s.feeRange, s.slug);
    return {
      slug: s.slug,
      citySlug: s.citySlug,
      name: s.name,
      area: s.area,
      locationGroup: s.locationGroup,
      curricula: s.curricula,
      curriculumLabels: getCurriculumFilterLabels(s.curricula),
      feeDisplay,
      feeHigh: extractHighestFee(feeDisplay),
      studentCount: s.studentCount,
    };
  });
}

const ALL_SCHOOLS = buildTableSchools();
const ALL_LOCATIONS = Array.from(new Set(ALL_SCHOOLS.map((s) => s.locationGroup))).sort();
const ALL_CURRICULA = Array.from(
  new Set(ALL_SCHOOLS.flatMap((s) => s.curriculumLabels))
).sort();

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider rounded-sm border transition-colors ${
          selected.length > 0
            ? "border-hermes text-hermes bg-hermes-light/30"
            : "border-warm-border text-charcoal-muted hover:border-charcoal-muted"
        }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="bg-hermes text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
            {selected.length}
          </span>
        )}
        <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-warm-white border border-warm-border rounded-sm shadow-lg z-20 min-w-[180px] py-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-cream-200 transition-colors"
              >
                <span
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                    selected.includes(opt)
                      ? "bg-hermes border-hermes"
                      : "border-warm-border"
                  }`}
                >
                  {selected.includes(opt) && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ShortlistButton({ slug }: { slug: string }) {
  const { isShortlisted, toggleShortlist } = useShortlist();
  const active = isShortlisted(slug);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleShortlist(slug);
      }}
      className={`text-xs uppercase tracking-wider font-semibold transition-colors whitespace-nowrap ${
        active
          ? "text-hermes"
          : "text-charcoal-muted hover:text-hermes"
      }`}
      aria-label={active ? "Remove from shortlist" : "Add to shortlist"}
    >
      {active ? "✓ Listed" : "Shortlist +"}
    </button>
  );
}

function CompareTableContent() {
  const [curriculumFilter, setCurriculumFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [feeSort, setFeeSort] = useState<SortDir>("high");

  const resetFilters = useCallback(() => {
    setCurriculumFilter([]);
    setLocationFilter([]);
    setFeeSort("high");
  }, []);

  const hasFilters = curriculumFilter.length > 0 || locationFilter.length > 0;

  const filtered = useMemo(() => {
    let result = ALL_SCHOOLS;
    if (curriculumFilter.length > 0) {
      result = result.filter((s) =>
        curriculumFilter.some((f) => s.curriculumLabels.includes(f))
      );
    }
    if (locationFilter.length > 0) {
      result = result.filter((s) => locationFilter.includes(s.locationGroup));
    }
    return [...result].sort((a, b) => {
      const aHas = hasPublishableFee(a.feeDisplay);
      const bHas = hasPublishableFee(b.feeDisplay);
      if (aHas !== bHas) return aHas ? -1 : 1;
      if (!aHas) return 0;
      return feeSort === "high" ? b.feeHigh - a.feeHigh : a.feeHigh - b.feeHigh;
    });
  }, [curriculumFilter, locationFilter, feeSort]);

  return (
    <div className="container-site py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-2">
        Compare Schools
      </h1>
      <p className="text-charcoal-muted mb-6">
        {ALL_SCHOOLS.length} international schools across 6 cities. Filter, sort, and shortlist.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-warm-border">
        <MultiSelect
          label="Curriculum"
          options={ALL_CURRICULA}
          selected={curriculumFilter}
          onChange={setCurriculumFilter}
        />
        <MultiSelect
          label="Location"
          options={ALL_LOCATIONS}
          selected={locationFilter}
          onChange={setLocationFilter}
        />
        <button
          onClick={() => setFeeSort(feeSort === "high" ? "low" : "high")}
          className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider rounded-sm border border-warm-border text-charcoal-muted hover:border-charcoal-muted transition-colors"
        >
          Fees: {feeSort === "high" ? "High → Low" : "Low → High"}
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-xs uppercase tracking-wider text-charcoal-muted hover:text-hermes transition-colors"
          >
            Reset
          </button>
        )}
        <span className="ml-auto text-xs text-charcoal-muted">
          {filtered.length} {filtered.length === 1 ? "school" : "schools"}
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-charcoal">
              <th className="text-left py-3 px-3 text-[11px] uppercase tracking-wider text-charcoal-muted font-medium w-[22%]">School</th>
              <th className="text-left py-3 px-3 text-[11px] uppercase tracking-wider text-charcoal-muted font-medium w-[14%]">Location</th>
              <th className="text-left py-3 px-3 text-[11px] uppercase tracking-wider text-charcoal-muted font-medium w-[18%]">Curriculum</th>
              <th className="text-left py-3 px-3 text-[11px] uppercase tracking-wider text-charcoal-muted font-medium w-[18%]">Annual Fees</th>
              <th className="text-left py-3 px-3 text-[11px] uppercase tracking-wider text-charcoal-muted font-medium w-[12%]">Students</th>
              <th className="py-3 px-3 w-[10%]" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((school, i) => (
              <tr
                key={school.slug}
                className={`border-b border-warm-border-light hover:bg-cream-200/50 transition-colors ${
                  i % 2 === 0 ? "bg-warm-white" : ""
                }`}
              >
                <td className="py-3 px-3">
                  <Link
                    href={`/international-schools/${school.citySlug}/${school.slug}/`}
                    className="font-medium text-charcoal hover:text-hermes transition-colors"
                  >
                    {school.name}
                  </Link>
                </td>
                <td className="py-3 px-3 text-charcoal-muted">{school.area}</td>
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-1">
                    {school.curriculumLabels.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] uppercase tracking-wider text-charcoal-muted bg-cream-200 px-1.5 py-0.5 rounded-sm"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className={`py-3 px-3 ${hasPublishableFee(school.feeDisplay) ? "font-medium text-charcoal" : "text-charcoal-muted text-xs"}`}>
                  {school.feeDisplay}
                </td>
                <td className="py-3 px-3 text-charcoal-muted">{school.studentCount}</td>
                <td className="py-3 px-3 text-right">
                  <ShortlistButton slug={school.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filtered.map((school) => (
          <div
            key={school.slug}
            className="border border-warm-border rounded-sm p-4 bg-cream-50"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <Link
                href={`/international-schools/${school.citySlug}/${school.slug}/`}
                className="font-display text-base font-medium text-charcoal hover:text-hermes transition-colors leading-snug"
              >
                {school.name}
              </Link>
              <ShortlistButton slug={school.slug} />
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {school.curriculumLabels.map((c) => (
                <span
                  key={c}
                  className="text-[10px] uppercase tracking-wider text-charcoal-muted bg-cream-200 px-1.5 py-0.5 rounded-sm"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">Location</span>
                <span className="text-charcoal-light">{school.area}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">Fees</span>
                <span className={hasPublishableFee(school.feeDisplay) ? "font-medium text-charcoal" : "text-charcoal-muted text-xs"}>
                  {school.feeDisplay}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">Students</span>
                <span className="text-charcoal-light">{school.studentCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-charcoal-muted mb-4">No schools match your filters.</p>
          <button
            onClick={resetFilters}
            className="text-hermes hover:text-hermes-hover transition-colors text-sm font-medium"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="container-site py-16 text-charcoal-muted">Loading…</div>}>
      <CompareTableContent />
    </Suspense>
  );
}
