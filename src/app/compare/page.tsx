"use client";

import { useState } from "react";
import Link from "next/link";

// ═══════════════════════════════════════════════════════
// HARDCODED COMPARISON DATA — wire to DB later
// ═══════════════════════════════════════════════════════

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
  feeFromUSD: number; // for sorting
  examResults: { label: string; value: string }[];
  accreditation: string;
  facilities: string[];
  classSize: string;
  editorialVerdict: string;
}

const ALL_SCHOOLS: CompareSchool[] = [
  {
    slug: "jakarta-intercultural-school",
    name: "Jakarta Intercultural School",
    shortName: "JIS",
    verified: true,
    area: "South Jakarta (Cilandak)",
    founded: "1951",
    type: "Non-profit, Co-ed",
    curricula: ["IB PYP", "IB MYP", "IB DP", "AP"],
    ageRange: "3–18",
    studentCount: "2,500+",
    nationalities: "60+",
    feeRange: "US$17K – US$36K",
    feeFromUSD: 17000,
    examResults: [
      { label: "IB Average", value: "35.8" },
      { label: "IB Pass Rate", value: "97.5%" },
    ],
    accreditation: "CIS / WASC",
    facilities: ["Olympic pool", "800-seat theatre", "3 gyms", "2 libraries"],
    classSize: "18–20",
    editorialVerdict: "Safe, solid choice if your company is paying. Huge breadth of activities and strong university placements.",
  },
  {
    slug: "british-school-jakarta",
    name: "British School Jakarta",
    shortName: "BSJ",
    verified: true,
    area: "South Jakarta (Bintaro)",
    founded: "1974",
    type: "Non-profit, Co-ed",
    curricula: ["English National", "IGCSE", "A-Levels"],
    ageRange: "3–18",
    studentCount: "1,800+",
    nationalities: "50+",
    feeRange: "US$18K – US$32K",
    feeFromUSD: 18000,
    examResults: [
      { label: "A*–A at A-Level", value: "62%" },
      { label: "9–7 at IGCSE", value: "58%" },
    ],
    accreditation: "BSO / CIS",
    facilities: ["25m pool", "Performing arts centre", "2 gyms", "Science labs"],
    classSize: "20–22",
    editorialVerdict: "Strongest British option in Jakarta. Modern campus, strong expat community. Popular with British and European families.",
  },
  {
    slug: "australian-independent-school-jakarta",
    name: "Australian Independent School Jakarta",
    shortName: "AIS",
    verified: false,
    area: "South Jakarta (Kemang)",
    founded: "1996",
    type: "For-profit, Co-ed",
    curricula: ["Australian", "IB DP"],
    ageRange: "3–18",
    studentCount: "900+",
    nationalities: "40+",
    feeRange: "US$12K – US$22K",
    feeFromUSD: 12000,
    examResults: [
      { label: "IB Average", value: "33.5" },
    ],
    accreditation: "NEASC",
    facilities: ["Pool", "Sports hall", "Library", "Science labs"],
    classSize: "16–20",
    editorialVerdict: "Smaller and more personal. Strong community feel and good value relative to the top tier.",
  },
  {
    slug: "mentari-intercultural-school-jakarta",
    name: "Mentari Intercultural School Jakarta",
    shortName: "Mentari",
    verified: false,
    area: "South Jakarta (Pondok Indah)",
    founded: "2004",
    type: "For-profit, Co-ed",
    curricula: ["IB PYP", "IB MYP", "IB DP"],
    ageRange: "3–18",
    studentCount: "600+",
    nationalities: "35+",
    feeRange: "US$8K – US$16K",
    feeFromUSD: 8000,
    examResults: [
      { label: "IB Average", value: "32.1" },
      { label: "IB Pass Rate", value: "95%" },
    ],
    accreditation: "CIS",
    facilities: ["Pool", "Gym", "Library", "Art studios"],
    classSize: "14–18",
    editorialVerdict: "Punches above its weight. Best value IB option in South Jakarta. Smaller classes, attentive staff.",
  },
  {
    slug: "acg-school-jakarta",
    name: "ACG School Jakarta",
    shortName: "ACG",
    verified: false,
    area: "South Jakarta",
    founded: "2014",
    type: "For-profit (Inspired Group), Co-ed",
    curricula: ["IB PYP", "IB MYP", "IB DP"],
    ageRange: "3–18",
    studentCount: "400+",
    nationalities: "30+",
    feeRange: "US$14K – US$24K",
    feeFromUSD: 14000,
    examResults: [
      { label: "IB Average", value: "34.0" },
      { label: "IB Pass Rate", value: "96%" },
    ],
    accreditation: "CIS",
    facilities: ["Pool", "Sports centre", "Library", "STEAM labs"],
    classSize: "16–20",
    editorialVerdict: "Modern campus, growing reputation. Investing heavily in facilities. Worth watching.",
  },
  {
    slug: "sekolah-pelita-harapan",
    name: "Sekolah Pelita Harapan",
    shortName: "SPH",
    verified: false,
    area: "West Jakarta (Lippo Village)",
    founded: "1993",
    type: "Non-profit (Christian), Co-ed",
    curricula: ["IB PYP", "IB MYP", "IB DP"],
    ageRange: "3–18",
    studentCount: "2,000+",
    nationalities: "20+",
    feeRange: "US$6K – US$14K",
    feeFromUSD: 6000,
    examResults: [
      { label: "IB Average", value: "31.4" },
      { label: "IB Pass Rate", value: "92%" },
    ],
    accreditation: "ACSI / IBO",
    facilities: ["Pool", "Auditorium", "Sports fields", "Chapel"],
    classSize: "20–24",
    editorialVerdict: "Largest Christian international school. Strong community and faith-based values. Very affordable.",
  },
  {
    slug: "global-jaya-school",
    name: "Global Jaya School",
    shortName: "Global Jaya",
    verified: false,
    area: "South Tangerang (BSD)",
    founded: "1996",
    type: "Non-profit, Co-ed",
    curricula: ["IB PYP", "IB MYP", "IB DP"],
    ageRange: "3–18",
    studentCount: "800+",
    nationalities: "25+",
    feeRange: "US$6K – US$12K",
    feeFromUSD: 6000,
    examResults: [
      { label: "IB Average", value: "30.8" },
      { label: "IB Pass Rate", value: "90%" },
    ],
    accreditation: "CIS / IBO",
    facilities: ["Pool", "Sports hall", "Library", "Science labs"],
    classSize: "18–22",
    editorialVerdict: "Solid IB school in BSD. Good value, genuine international atmosphere. Commute from central Jakarta is the trade-off.",
  },
  {
    slug: "binus-school-serpong",
    name: "Binus School Serpong",
    shortName: "Binus",
    verified: false,
    area: "South Tangerang",
    founded: "2007",
    type: "For-profit, Co-ed",
    curricula: ["Cambridge", "IGCSE", "A-Levels"],
    ageRange: "3–18",
    studentCount: "1,200+",
    nationalities: "15+",
    feeRange: "US$5K – US$10K",
    feeFromUSD: 5000,
    examResults: [
      { label: "A*–A at IGCSE", value: "45%" },
      { label: "A*–A at A-Level", value: "40%" },
    ],
    accreditation: "Cambridge International",
    facilities: ["Sports hall", "Library", "IT labs", "Science labs"],
    classSize: "22–26",
    editorialVerdict: "Strong in STEM. Cambridge curriculum, competitive fees. Predominantly Indonesian with growing international intake.",
  },
  {
    slug: "independent-school-of-jakarta",
    name: "The Independent School of Jakarta",
    shortName: "ISJ",
    verified: true,
    area: "South Jakarta (Pondok Pinang)",
    founded: "2018",
    type: "For-profit, Co-ed",
    curricula: ["British Curriculum", "IGCSEs", "A-Levels"],
    ageRange: "2–13",
    studentCount: "200",
    nationalities: "30+",
    feeRange: "US$9.2K – US$30K",
    feeFromUSD: 9200,
    examResults: [
      { label: "Class Size", value: "Max 16" },
    ],
    accreditation: "COBIS, BSO, IAPS",
    facilities: ["Pool", "Football pitch", "Playground", "Science labs", "Art spaces", "Green grounds"],
    classSize: "Up to 16",
    editorialVerdict: "Small British prep school (ages 2–13) with UK-recruited staff, class sizes capped at 16, and strong pastoral care. Part of The Schools Trust. Families need a senior school plan from Year 8.",
  },
];

// Comparison rows definition
const COMPARE_ROWS: { key: string; label: string; render: (s: CompareSchool) => string }[] = [
  { key: "area", label: "Location", render: (s) => s.area },
  { key: "founded", label: "Founded", render: (s) => s.founded },
  { key: "type", label: "Type", render: (s) => s.type },
  { key: "curricula", label: "Curricula", render: (s) => s.curricula.join(", ") },
  { key: "ageRange", label: "Age Range", render: (s) => s.ageRange },
  { key: "studentCount", label: "Students", render: (s) => s.studentCount },
  { key: "nationalities", label: "Nationalities", render: (s) => s.nationalities },
  { key: "feeRange", label: "Annual Fees", render: (s) => s.feeRange },
  { key: "examResults", label: "Exam Results", render: (s) => s.examResults.map((r) => `${r.label}: ${r.value}`).join(" · ") },
  { key: "accreditation", label: "Accreditation", render: (s) => s.accreditation },
  { key: "classSize", label: "Class Size", render: (s) => s.classSize },
  { key: "facilities", label: "Key Facilities", render: (s) => s.facilities.join(", ") },
  { key: "verdict", label: "Our Verdict", render: (s) => s.editorialVerdict },
];

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(true);

  const selectedSchools = selected
    .map((slug) => ALL_SCHOOLS.find((s) => s.slug === slug)!)
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
        <p className="text-[0.9375rem] text-charcoal-muted">
          Select up to 4 schools to compare side by side.{" "}
          {selected.length > 0 && (
            <span className="text-hermes font-medium">{selected.length} selected</span>
          )}
        </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ALL_SCHOOLS.map((school) => {
              const isSelected = selected.includes(school.slug);
              const isDisabled = !isSelected && selected.length >= 4;
              return (
                <button
                  key={school.slug}
                  onClick={() => !isDisabled && toggleSchool(school.slug)}
                  disabled={isDisabled}
                  className={`text-left p-4 border rounded-sm transition-all ${
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
                  <div className="flex flex-wrap gap-1 mt-2">
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
