import type { Metadata } from "next";
import Link from "next/link";
import { SchoolCard } from "@/components/school/SchoolCard";
import { FilterSidebar } from "@/components/school/FilterSidebar";
import { SortBar } from "@/components/school/SortBar";
import { ALL_SCHOOL_SLUGS } from "@/data/schools";

// Schools with full profile pages
const PROFILE_SLUGS = new Set(ALL_SCHOOL_SLUGS);

// Static params for export — add cities as we build them
export function generateStaticParams() {
  return [{ city: "jakarta" }];
}

// ═══════════════════════════════════════════════════════
// HARDCODED JAKARTA DATA — wire to DB after approval
// ═══════════════════════════════════════════════════════

const JAKARTA_SCHOOLS = [
  {
    name: "Jakarta Intercultural School",
    slug: "jakarta-intercultural-school",
    verified: true,
    curricula: ["IB PYP", "IB MYP", "IB DP", "AP"],
    area: "South Jakarta",
    ageRange: "3–18",
    studentCount: "2,500+",
    feeRange: "US$17K – US$36K",
    examResults: [
      { label: "IB Average", value: "35.8" },
      { label: "IB Pass Rate", value: "97.5%" },
    ],
    editorialSummary:
      "The big, established name — the school most corporate packages are written around. Strong university placements, huge range of activities, but expensive and the campus is ageing.",
  },
  {
    name: "British School Jakarta",
    slug: "british-school-jakarta",
    verified: true,
    curricula: ["English National", "IGCSE", "A-Levels"],
    area: "South Jakarta",
    ageRange: "3–18",
    studentCount: "1,800+",
    feeRange: "US$18K – US$32K",
    examResults: [
      { label: "A*–A at A-Level", value: "62%" },
      { label: "9–7 at IGCSE", value: "58%" },
    ],
    editorialSummary:
      "The strongest British option in Jakarta. Modern Bintaro campus, solid A-Level results, and a strong expat community. Popular with British and European families.",
  },
  {
    name: "Australian Independent School Jakarta",
    slug: "australian-independent-school-jakarta",
    verified: false,
    curricula: ["Australian", "IB DP"],
    area: "South Jakarta",
    ageRange: "3–18",
    studentCount: "900+",
    feeRange: "US$12K – US$22K",
    examResults: [
      { label: "IB Average", value: "33.5" },
    ],
    editorialSummary:
      "Smaller and more personal than JIS or BSJ. Australian curriculum with IB Diploma option in senior years. Strong community feel and good value relative to the top tier.",
  },
  {
    name: "Mentari Intercultural School Jakarta",
    slug: "mentari-intercultural-school-jakarta",
    verified: false,
    curricula: ["IB PYP", "IB MYP", "IB DP"],
    area: "South Jakarta",
    ageRange: "3–18",
    studentCount: "600+",
    feeRange: "US$8K – US$16K",
    examResults: [
      { label: "IB Average", value: "32.1" },
      { label: "IB Pass Rate", value: "95%" },
    ],
    editorialSummary:
      "A mid-range IB school that punches above its weight. Smaller classes, attentive staff, and significantly cheaper than JIS. Good option for self-funding families who want IB.",
  },
  {
    name: "ACG School Jakarta",
    slug: "acg-school-jakarta",
    verified: false,
    curricula: ["IB PYP", "IB MYP", "IB DP"],
    area: "South Jakarta",
    ageRange: "3–18",
    studentCount: "400+",
    feeRange: "US$14K – US$24K",
    examResults: [
      { label: "IB Average", value: "34.0" },
      { label: "IB Pass Rate", value: "96%" },
    ],
    editorialSummary:
      "Part of the Inspired group. Modern campus, full IB programme, and growing reputation. Smaller than the big three but investing heavily in facilities and faculty.",
  },
  {
    name: "Sekolah Pelita Harapan",
    slug: "sekolah-pelita-harapan",
    verified: false,
    curricula: ["IB PYP", "IB MYP", "IB DP"],
    area: "West Jakarta (Lippo Village)",
    ageRange: "3–18",
    studentCount: "2,000+",
    feeRange: "US$6K – US$14K",
    examResults: [
      { label: "IB Average", value: "31.4" },
      { label: "IB Pass Rate", value: "92%" },
    ],
    editorialSummary:
      "The largest Christian international school in Jakarta. Multiple campuses across the city. Strong community and faith-based values. Significantly more affordable than top-tier schools.",
  },
  {
    name: "Global Jaya School",
    slug: "global-jaya-school",
    verified: false,
    curricula: ["IB PYP", "IB MYP", "IB DP"],
    area: "South Tangerang (BSD)",
    ageRange: "3–18",
    studentCount: "800+",
    feeRange: "US$6K – US$12K",
    examResults: [
      { label: "IB Average", value: "30.8" },
      { label: "IB Pass Rate", value: "90%" },
    ],
    editorialSummary:
      "A solid IB school in BSD City with a diverse student body. Good value for money and a genuine international atmosphere. The commute from central Jakarta is the main trade-off.",
  },
  {
    name: "Binus School Serpong",
    slug: "binus-school-serpong",
    verified: false,
    curricula: ["Cambridge", "IGCSE", "A-Levels"],
    area: "South Tangerang",
    ageRange: "3–18",
    studentCount: "1,200+",
    feeRange: "US$5K – US$10K",
    examResults: [
      { label: "A*–A at IGCSE", value: "45%" },
      { label: "A*–A at A-Level", value: "40%" },
    ],
    editorialSummary:
      "Part of the Bina Nusantara group — strong in STEM and technology. Cambridge curriculum, modern campus, and competitive fees. Predominantly Indonesian student body with growing international intake.",
  },
  {
    name: "The Independent School of Jakarta",
    slug: "independent-school-of-jakarta",
    verified: true,
    curricula: ["British Curriculum", "IGCSEs", "A-Levels"],
    area: "South Jakarta (Pondok Pinang)",
    ageRange: "2–13",
    studentCount: "200",
    feeRange: "US$9.2K – US$30K",
    examResults: [
      { label: "Class Size", value: "Max 16" },
    ],
    editorialSummary:
      "A small British prep school in Pondok Pinang, part of The Schools Trust. Staff recruited from well-regarded UK schools, class sizes capped at 16. Currently ages 2–13 only, so families need a senior school plan. Strong fit for those who want the British independent school feel.",
  },
];

const CURRICULA_OPTIONS = [
  { label: "IB (any)", value: "ib", count: 6 },
  { label: "British / Cambridge", value: "british", count: 3 },
  { label: "Australian", value: "australian", count: 1 },
  { label: "American / AP", value: "american", count: 1 },
];

const AREA_OPTIONS = [
  { label: "South Jakarta", value: "south-jakarta", count: 5 },
  { label: "Central Jakarta", value: "central-jakarta", count: 0 },
  { label: "BSD / South Tangerang", value: "bsd", count: 2 },
  { label: "West Jakarta / Lippo Village", value: "west-jakarta", count: 1 },
];

export const metadata: Metadata = {
  title: "International Schools in Jakarta — Fees, Reviews & Comparison",
  description:
    "Browse 47 international schools in Jakarta. Compare fees, curricula, IB results, and read honest editorial reviews. Filter by area, age range, and budget.",
};

export default function CityPage({
  params,
}: {
  params: { city: string };
}) {
  const cityName = params.city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="container-site">
      {/* Breadcrumb */}
      <nav className="py-5 text-[0.8125rem] text-charcoal-muted" aria-label="Breadcrumb">
        <Link
          href="/international-schools/"
          className="hover:text-hermes transition-colors"
        >
          International Schools
        </Link>
        <span className="mx-1.5 opacity-50">›</span>
        <span className="text-charcoal">{cityName}</span>
      </nav>

      {/* City hero */}
      <section className="pb-8 border-b border-warm-border">
        <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-medium tracking-tight leading-tight mb-3">
          International Schools in {cityName}
        </h1>
        <p className="text-[0.9375rem] text-charcoal-muted">
          {JAKARTA_SCHOOLS.length} schools · 8 curricula · Fees from US$5K/yr
        </p>
      </section>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 py-8">
        {/* Filters sidebar — sticky on desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-[88px]">
            <FilterSidebar
              curricula={CURRICULA_OPTIONS}
              areas={AREA_OPTIONS}
            />
          </div>
        </aside>

        {/* Mobile filter button */}
        <div className="lg:hidden mb-4">
          <button className="w-full py-3 border border-warm-border text-[0.8125rem] uppercase tracking-wider text-charcoal-light hover:border-charcoal-muted transition-colors">
            Filters
          </button>
        </div>

        {/* School listings */}
        <div>
          <SortBar totalSchools={JAKARTA_SCHOOLS.length} />

          <div className="space-y-4">
            {JAKARTA_SCHOOLS.map((school) => (
              <SchoolCard
                key={school.slug}
                citySlug={params.city}
                hasProfile={PROFILE_SLUGS.has(school.slug)}
                {...school}
              />
            ))}
          </div>

          {/* City editorial content below listings */}
          <section className="mt-16 pt-12 border-t border-warm-border">
            <h2 className="font-display text-display-lg font-medium mb-6">
              A Parent&apos;s Guide to International Schools in Jakarta
            </h2>

            <div className="prose-hermes">
              <p className="text-[0.9375rem] text-charcoal-light leading-[1.75] mb-5">
                Jakarta has one of the largest concentrations of international
                schools in Southeast Asia, serving a diverse expat community of
                diplomats, corporate executives, and entrepreneurs. The range is
                wide — from premium schools charging over US$35K per year to
                solid mid-range options at a fraction of the price.
              </p>

              <p className="text-[0.9375rem] text-charcoal-light leading-[1.75] mb-5">
                The dominant curricula are IB (offered at six or more schools),
                British/Cambridge, and Australian. American-style education is
                primarily available through JIS. Most top-tier schools are
                concentrated in South Jakarta — Cilandak, Pondok Indah, and
                Kemang — with a growing cluster in BSD City and South Tangerang
                offering lower fees and newer campuses.
              </p>

              <p className="text-[0.9375rem] text-charcoal-light leading-[1.75] mb-5">
                Traffic is the single biggest factor in school choice that
                newcomers underestimate. A school that looks 10km away on the
                map can be a 90-minute commute during morning rush hour. Most
                experienced expat families recommend choosing a school first and
                finding housing nearby, rather than the other way around.
              </p>

              <p className="text-[0.9375rem] text-charcoal-light leading-[1.75]">
                Corporate relocation packages typically cover JIS or BSJ. If
                you&apos;re self-funding, the mid-tier schools — Mentari, AIS,
                Global Jaya — offer genuine quality at significantly lower cost.
                Don&apos;t assume expensive means better. Read the profiles,
                compare the data, and visit in person.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
