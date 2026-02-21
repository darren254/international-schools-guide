"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { extractHighestFee, getFeeDisplay, hasPublishableFee } from "@/lib/utils/fees";
import { ShareButton } from "@/components/share/ShareButton";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import { SCHOOL_PROFILES } from "@/data/schools";

interface CompareSchool {
  slug: string;
  name: string;
  shortName: string;
  verified: boolean;
  area: string;
  founded: string;
  type: string;
  curricula: string[];
  ageRange: string;
  studentCount: string;
  nationalities: string;
  feeRange: string;
  feeFromUSD: number;
  examResults: { label: string; value: string }[];
  accreditation: string;
  facilities: string[];
  classSize: string;
  editorialVerdict: string;
}

const SHORT_NAMES: Record<string, string> = {
  "jakarta-intercultural-school": "JIS",
  "british-school-jakarta": "BSJ",
  "australian-independent-school-jakarta": "AIS",
  "mentari-intercultural-school-jakarta": "Mentari",
  "acg-school-jakarta": "ACG",
  "sekolah-pelita-harapan": "SPH",
  "global-jaya-school": "Global Jaya",
  "binus-school-serpong": "Binus",
  "independent-school-of-jakarta": "ISJ",
  "sinarmas-world-academy": "SWA",
  "nord-anglia-school-jakarta": "NAS Jakarta",
  "new-zealand-school-jakarta": "NZSJ",
  "jakarta-nanyang-school": "JNY",
};

function getQuickFact(profile: { sidebar: { quickFacts: { label: string; value: string }[] } }, label: string): string {
  return profile.sidebar.quickFacts.find((f) => f.label === label)?.value ?? "";
}

function toCompareSchool(s: (typeof JAKARTA_SCHOOLS)[0]): CompareSchool {
  const shortName = SHORT_NAMES[s.slug] ?? s.name.split(" ").slice(0, 2).join(" ");
  const displayFee = getFeeDisplay(s.feeRange, s.slug);
  const highK = extractHighestFee(displayFee);
  const profile = SCHOOL_PROFILES[s.slug];
  return {
    slug: s.slug,
    name: s.name,
    shortName,
    verified: s.verified,
    area: s.area,
    founded: profile ? getQuickFact(profile, "Founded") : "",
    type: profile ? getQuickFact(profile, "Type") || "Co-ed" : "Co-ed",
    curricula: s.curricula,
    ageRange: s.ageRange,
    studentCount: s.studentCount,
    nationalities: profile ? getQuickFact(profile, "Nationalities") : "",
    feeRange: displayFee,
    feeFromUSD: highK * 1000,
    examResults: s.examResults,
    accreditation: profile ? getQuickFact(profile, "Accreditation") : "",
    facilities: profile?.schoolLife?.facilities ?? [],
    classSize: profile ? getQuickFact(profile, "Class Size") : "",
    editorialVerdict: s.editorialSummary,
  };
}

const ALL_SCHOOLS: CompareSchool[] = JAKARTA_SCHOOLS.map(toCompareSchool);

// Comparison rows definition (render may return string or ReactNode for fee note)
const COMPARE_ROWS: { key: string; label: string; render: (s: CompareSchool) => React.ReactNode }[] = [
  { key: "area", label: "Location", render: (s) => s.area },
  { key: "founded", label: "Founded", render: (s) => s.founded },
  { key: "type", label: "Type", render: (s) => s.type },
  { key: "curricula", label: "Curricula", render: (s) => s.curricula.join(", ") },
  { key: "ageRange", label: "Age Range", render: (s) => s.ageRange },
  { key: "studentCount", label: "Students", render: (s) => s.studentCount },
  { key: "nationalities", label: "Nationalities", render: (s) => s.nationalities },
  {
    key: "feeRange",
    label: "Annual Fees",
    render: (s) =>
      !hasPublishableFee(s.feeRange) ? (
        <span>
          {s.feeRange}
          <span className="block text-[0.75rem] text-charcoal-muted mt-1 font-normal">
            This school does not publish tuition fees — contact the school directly.
          </span>
        </span>
      ) : (
        s.feeRange
      ),
  },
  { key: "examResults", label: "Exam Results", render: (s) => s.examResults.map((r) => `${r.label}: ${r.value}`).join(" · ") },
  { key: "accreditation", label: "Accreditation", render: (s) => s.accreditation },
  { key: "classSize", label: "Class Size", render: (s) => s.classSize },
  { key: "facilities", label: "Key Facilities", render: (s) => s.facilities.join(", ") },
  { key: "verdict", label: "Our Verdict", render: (s) => s.editorialVerdict },
];

function CompareContent() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(true);
  const [urlParsed, setUrlParsed] = useState(false);

  // Sort schools by highest fee (descending); schools without published fees always at bottom
  const sortedSchools = useMemo(() => {
    return [...ALL_SCHOOLS].sort((a, b) => {
      const aHasFee = hasPublishableFee(a.feeRange);
      const bHasFee = hasPublishableFee(b.feeRange);
      if (aHasFee !== bHasFee) return aHasFee ? -1 : 1;
      if (!aHasFee) return 0;
      const feeA = extractHighestFee(a.feeRange);
      const feeB = extractHighestFee(b.feeRange);
      return feeB - feeA;
    });
  }, []);

  // Pre-select schools from ?schools=slug1,slug2,slug3 and show table immediately
  useEffect(() => {
    if (urlParsed) return;
    const param = searchParams.get("schools");
    if (!param) {
      setUrlParsed(true);
      return;
    }
    const slugs = param.split(",").map((x) => x.trim()).filter(Boolean);
    const valid = slugs.filter((slug) => sortedSchools.some((sc) => sc.slug === slug));
    if (valid.length >= 2) {
      setSelected(valid);
      setShowPicker(false);
    }
    setUrlParsed(true);
  }, [searchParams, sortedSchools, urlParsed]);

  const selectedSchools = selected
    .map((slug) => sortedSchools.find((s) => s.slug === slug)!)
    .filter(Boolean);

  const toggleSchool = (slug: string) => {
    if (selected.includes(slug)) {
      setSelected(selected.filter((s) => s !== slug));
    } else if (selected.length < 4) {
      setSelected([...selected, slug]);
    }
  };

  const removeSchool = (slug: string) => {
    setSelected(selected.filter((s) => s !== slug));
    if (mobileIndex > 0) setMobileIndex(mobileIndex - 1);
  };

  return (
    <div className="container-site">
      {/* Breadcrumb */}
      <nav className="py-5 text-[0.8125rem] text-charcoal-muted" aria-label="Breadcrumb">
        <Link href="/international-schools/" className="hover:text-hermes transition-colors">
          International Schools
        </Link>
        <span className="mx-1.5 opacity-50">›</span>
        <span className="text-charcoal">Compare</span>
      </nav>

      {/* Header */}
      <section className="pb-6">
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-medium tracking-tight leading-tight mb-2">
          Compare Schools
        </h1>
        <p className="text-[0.9375rem] text-charcoal-muted mb-4">
          Select up to 4 schools to compare side by side.{" "}
          {selected.length > 0 && (
            <span className="text-hermes font-medium">{selected.length} selected</span>
          )}
        </p>
        {selected.length >= 2 && (
          <ShareButton variant="comparison" schoolSlugs={selected} />
        )}
      </section>

      {/* School picker */}
      {showPicker && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-label-sm uppercase text-charcoal-muted tracking-wider">
              Choose Schools
            </p>
            {selected.length >= 2 && (
              <button
                onClick={() => setShowPicker(false)}
                className="text-sm text-hermes hover:text-hermes-hover transition-colors font-medium"
              >
                Compare {selected.length} schools →
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
            {sortedSchools.map((school) => {
              const isSelected = selected.includes(school.slug);
              const isDisabled = !isSelected && selected.length >= 4;
              return (
                <button
                  key={school.slug}
                  onClick={() => !isDisabled && toggleSchool(school.slug)}
                  disabled={isDisabled}
                  className={`text-left p-4 border rounded-sm transition-all flex flex-col min-h-[7.5rem] ${
                    isSelected
                      ? "border-hermes bg-hermes-light/50"
                      : isDisabled
                      ? "border-warm-border bg-cream-200 opacity-50 cursor-not-allowed"
                      : "border-warm-border bg-warm-white hover:border-charcoal-muted"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-[0.9375rem] font-medium leading-tight">
                        {school.shortName}
                      </p>
                      <p className="text-[0.75rem] text-charcoal-muted mt-0.5">
                        {school.feeRange}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        isSelected ? "bg-hermes border-hermes" : "border-warm-border"
                      }`}
                    >
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {school.curricula.slice(0, 2).map((c) => (
                      <span key={c} className="text-[0.625rem] uppercase tracking-wider text-charcoal-muted">
                        {c}
                      </span>
                    ))}
                    {school.curricula.length > 2 && (
                      <span className="text-[0.625rem] text-charcoal-muted">+{school.curricula.length - 2}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Comparison table — only show when 2+ schools selected */}
      {selectedSchools.length >= 2 && (
        <>
          {/* Back to picker */}
          {!showPicker && (
            <button
              onClick={() => setShowPicker(true)}
              className="text-sm text-charcoal-muted hover:text-hermes transition-colors mb-6"
            >
              ← Change schools
            </button>
          )}

          {/* ═══ DESKTOP: side-by-side table ═══ */}
          <div className="hidden md:block mb-16 overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Header with school names */}
              <thead>
                <tr>
                  <th className="w-[160px] p-0" />
                  {selectedSchools.map((school) => (
                    <th
                      key={school.slug}
                      className="text-left p-4 border-b-2 border-hermes align-top"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/international-schools/jakarta/${school.slug}/`}
                            className="font-display text-display-sm font-medium text-charcoal hover:text-hermes transition-colors leading-tight block"
                          >
                            {school.name}
                          </Link>
                          {school.verified && (
                            <span className="text-[0.625rem] uppercase tracking-wider text-verified bg-verified-bg px-1.5 py-0.5 rounded-sm mt-1 inline-block">
                              Verified
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeSchool(school.slug)}
                          className="text-charcoal-muted hover:text-hermes transition-colors flex-shrink-0 mt-1"
                          aria-label="Remove"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.key} className={i % 2 === 0 ? "bg-warm-white" : ""}>
                    <td className="p-4 text-[0.75rem] uppercase tracking-wider text-charcoal-muted font-medium align-top whitespace-nowrap">
                      {row.label}
                    </td>
                    {selectedSchools.map((school) => (
                      <td
                        key={school.slug}
                        className={`p-4 text-[0.875rem] text-charcoal-light leading-relaxed align-top border-l border-warm-border-light ${
                          row.key === "feeRange" || row.key === "verdict" ? "font-medium text-charcoal" : ""
                        }`}
                      >
                        {row.render(school)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* View full profiles */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-warm-border">
              {selectedSchools.map((school) => (
                <Link
                  key={school.slug}
                  href={`/international-schools/jakarta/${school.slug}/`}
                  className="text-[0.8125rem] font-medium text-hermes hover:text-hermes-hover transition-colors"
                >
                  {school.shortName} full profile →
                </Link>
              ))}
            </div>
          </div>

          {/* ═══ MOBILE: swipeable cards ═══ */}
          <div className="md:hidden mb-12">
            {/* Tabs for switching between schools */}
            <div className="flex border-b border-warm-border mb-6 overflow-x-auto">
              {selectedSchools.map((school, i) => (
                <button
                  key={school.slug}
                  onClick={() => setMobileIndex(i)}
                  className={`px-4 py-3 text-[0.8125rem] font-medium whitespace-nowrap border-b-2 transition-colors ${
                    i === mobileIndex
                      ? "border-hermes text-hermes"
                      : "border-transparent text-charcoal-muted"
                  }`}
                >
                  {school.shortName}
                </button>
              ))}
            </div>

            {/* Active school card */}
            {selectedSchools[mobileIndex] && (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-display text-display-sm font-medium">
                      {selectedSchools[mobileIndex].name}
                    </h2>
                    {selectedSchools[mobileIndex].verified && (
                      <span className="text-[0.625rem] uppercase tracking-wider text-verified bg-verified-bg px-1.5 py-0.5 rounded-sm mt-1 inline-block">
                        Verified
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeSchool(selectedSchools[mobileIndex].slug)}
                    className="text-charcoal-muted hover:text-hermes transition-colors p-1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-0">
                  {COMPARE_ROWS.map((row, i) => (
                    <div
                      key={row.key}
                      className={`py-3.5 ${i < COMPARE_ROWS.length - 1 ? "border-b border-warm-border-light" : ""}`}
                    >
                      <p className="text-[0.6875rem] uppercase tracking-wider text-charcoal-muted mb-1">
                        {row.label}
                      </p>
                      <p className={`text-[0.9375rem] leading-relaxed ${
                        row.key === "feeRange" || row.key === "verdict"
                          ? "font-medium text-charcoal"
                          : "text-charcoal-light"
                      }`}>
                        {row.render(selectedSchools[mobileIndex])}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/international-schools/jakarta/${selectedSchools[mobileIndex].slug}/`}
                  className="inline-block mt-6 bg-hermes text-white px-6 py-3 text-sm font-medium uppercase tracking-wider hover:bg-hermes-hover transition-colors"
                >
                  View Full Profile →
                </Link>

                {/* Swipe hint */}
                <p className="text-[0.75rem] text-charcoal-muted text-center mt-6">
                  Tap the school names above to compare
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {selected.length < 2 && !showPicker && (
        <div className="text-center py-16">
          <p className="text-charcoal-muted mb-4">Select at least 2 schools to compare.</p>
          <button
            onClick={() => setShowPicker(true)}
            className="text-hermes hover:text-hermes-hover transition-colors text-sm font-medium"
          >
            Choose schools →
          </button>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="container-site py-16 text-charcoal-muted">Loading…</div>}>
      <CompareContent />
    </Suspense>
  );
}
