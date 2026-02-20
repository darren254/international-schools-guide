import type { Metadata } from "next";
import Link from "next/link";
import { SchoolCard } from "@/components/school/SchoolCard";
import { FilterSidebar } from "@/components/school/FilterSidebar";
import { SortBar } from "@/components/school/SortBar";
import { ALL_SCHOOL_SLUGS } from "@/data/schools";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import { extractHighestFee } from "@/lib/utils/fees";

const PROFILE_SLUGS = new Set(ALL_SCHOOL_SLUGS);

export function generateStaticParams() {
  return [{ city: "jakarta" }];
}

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
    "Browse 66 international schools in Jakarta. Compare fees, curricula, IB results, and read honest editorial reviews. Filter by area, age range, and budget.",
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

  // Sort schools by highest fee (descending) - default sort order
  const sortedSchools = [...JAKARTA_SCHOOLS].sort((a, b) => {
    const feeA = extractHighestFee(a.feeRange);
    const feeB = extractHighestFee(b.feeRange);
    return feeB - feeA; // Descending order (high to low)
  });

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
          {JAKARTA_SCHOOLS.length} schools · Multiple curricula · Fees from US$1.6K/yr
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
          <SortBar totalSchools={sortedSchools.length} />

          <div className="space-y-4">
            {sortedSchools.map((school) => (
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
