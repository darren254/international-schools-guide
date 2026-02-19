import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find the Right International School — International Schools Guide",
  description:
    "Compare international schools worldwide. Fees, IB results, honest editorial reviews. Built for expat families.",
};

const FEATURED_SCHOOLS = [
  {
    name: "Jakarta Intercultural School",
    slug: "jakarta-intercultural-school",
    city: "Jakarta",
    citySlug: "jakarta",
    curricula: ["IB", "AP"],
    feeRange: "US$17K – $36K",
    ibAverage: "35.8",
    students: "2,500+",
    hook: "Jakarta's largest and most established international school",
  },
  {
    name: "British School Jakarta",
    slug: "british-school-jakarta",
    city: "Jakarta",
    citySlug: "jakarta",
    curricula: ["British", "IB"],
    feeRange: "US$18K – $32K",
    ibAverage: "34.2",
    students: "1,800+",
    hook: "Top British curriculum school with strong IB Diploma results",
  },
  {
    name: "Australian Independent School",
    slug: "australian-independent-school-jakarta",
    city: "Jakarta",
    citySlug: "jakarta",
    curricula: ["Australian", "IB"],
    feeRange: "US$12K – $22K",
    ibAverage: "33.5",
    students: "1,200+",
    hook: "Well-regarded Australian curriculum at a competitive price point",
  },
  {
    name: "Mentari Intercultural School",
    slug: "mentari-intercultural-school-jakarta",
    city: "Jakarta",
    citySlug: "jakarta",
    curricula: ["IB"],
    feeRange: "US$8K – $16K",
    ibAverage: "32.1",
    students: "850+",
    hook: "Strong IB programme with the best value fees in South Jakarta",
  },
];

const FEATURED_CITIES = [
  {
    name: "Jakarta",
    country: "Indonesia",
    slug: "jakarta",
    schoolCount: 90,
    feeRange: "US$5K – $36K / year",
    topCurricula: ["IB", "British", "Australian"],
    tagline: "Southeast Asia's largest city, home to JIS, BSJ, and 80+ international schools",
  },
  {
    name: "Singapore",
    country: "Singapore",
    slug: "singapore",
    schoolCount: 70,
    feeRange: "US$15K – $45K / year",
    topCurricula: ["IB", "British", "Singaporean"],
    tagline: "Asia's education hub with world-class IB and British curriculum schools",
  },
  {
    name: "Bangkok",
    country: "Thailand",
    slug: "bangkok",
    schoolCount: 100,
    feeRange: "US$4K – $30K / year",
    topCurricula: ["IB", "British", "American"],
    tagline: "Exceptional value with top-tier schools at a fraction of Singapore prices",
  },
  {
    name: "Dubai",
    country: "UAE",
    slug: "dubai",
    schoolCount: 200,
    feeRange: "US$6K – $35K / year",
    topCurricula: ["British", "IB", "American"],
    tagline: "The world's most competitive international school market",
  },
  {
    name: "Hong Kong",
    country: "China",
    slug: "hong-kong",
    schoolCount: 55,
    feeRange: "US$12K – $40K / year",
    topCurricula: ["IB", "British", "Canadian"],
    tagline: "Premier Asian hub blending British, IB, and local curricula",
  },
  {
    name: "Kuala Lumpur",
    country: "Malaysia",
    slug: "kuala-lumpur",
    schoolCount: 65,
    feeRange: "US$4K – $25K / year",
    topCurricula: ["British", "IB", "Australian"],
    tagline: "Outstanding value and quality — increasingly popular with expat families",
  },
];

const FEATURED_NEWS = [
  {
    label: "News",
    title: "Jakarta Schools Announce 2026–27 Fee Increases: What Parents Need to Know",
    slug: "/news/jakarta-schools-fee-increases-2026-27/",
    date: "12 Feb 2026",
    excerpt:
      "Annual tuition at Jakarta's top international schools is rising 4–8% for 2026–27. We break down the changes school by school.",
  },
  {
    label: "News",
    title: "New International School Opening in BSD City, Tangerang",
    slug: "/news/new-international-school-bsd-city-2026/",
    date: "5 Feb 2026",
    excerpt:
      "A British curriculum school backed by a UK education group is set to open in August 2026, adding competition in Greater Jakarta's southern corridor.",
  },
  {
    label: "Update",
    title: "2025 IB Diploma Results: How Did Jakarta Schools Perform?",
    slug: "/news/2025-ib-diploma-results-jakarta/",
    date: "28 Jan 2026",
    excerpt:
      "JIS, BSJ, and Mentari all posted strong IB results this year. We compare averages, pass rates, and top scorers.",
  },
];

const CURRICULA = [
  "International Baccalaureate (IB)",
  "British Curriculum",
  "American Curriculum",
  "Australian Curriculum",
  "French Curriculum",
  "Singaporean",
];

const EDITORIAL_HIGHLIGHTS = [
  {
    label: "Guide",
    title: "How to Choose an International School in Jakarta",
    slug: "/insights/choosing-international-school-jakarta/",
    excerpt:
      "Curriculum, fees, commute, community — a structured framework for the biggest decision expat families make.",
  },
  {
    label: "Fees",
    title: "International School Fees in Southeast Asia: 2025 Comparison",
    slug: "/insights/international-school-fees-southeast-asia-2025/",
    excerpt:
      "We compared annual fees at 50 schools across Jakarta, Singapore, Bangkok, and KL. Here's what we found.",
  },
  {
    label: "IB Results",
    title: "2025 IB Results: Top International Schools in Asia",
    slug: "/insights/ib-results-top-schools-asia-2025/",
    excerpt:
      "Average scores, pass rates, and 45-point scholars — the definitive regional IB rankings.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 text-center px-4">
        <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-5">
          Independent reviews · Real fee data · 20+ cities
        </p>
        <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-medium tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
          Find the right international school
        </h1>
        <p className="text-charcoal-light max-w-xl mx-auto mb-12 text-[0.9375rem] leading-relaxed">
          Honest profiles, verified fee data, and independent editorial reviews — built for expat families, not for schools.
        </p>

        {/* Search block */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-warm-white border border-warm-border rounded-sm shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-warm-border">
              <div className="px-4 py-3.5 text-left">
                <p className="text-label-xs uppercase text-charcoal-muted mb-1">City</p>
                <p className="text-sm text-charcoal">Jakarta, Singapore…</p>
              </div>
              <div className="px-4 py-3.5 text-left">
                <p className="text-label-xs uppercase text-charcoal-muted mb-1">Curriculum</p>
                <p className="text-sm text-charcoal">IB, British…</p>
              </div>
              <div className="px-4 py-3.5 text-left">
                <p className="text-label-xs uppercase text-charcoal-muted mb-1">Age</p>
                <p className="text-sm text-charcoal">Child&apos;s age</p>
              </div>
              <div className="px-4 py-3.5 flex items-end justify-center">
                <button className="w-full bg-hermes text-white px-6 py-2.5 text-sm font-medium uppercase tracking-wider hover:bg-hermes-hover transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>

          <p className="text-sm text-charcoal-muted mt-5">
            Popular:{" "}
            {["Jakarta", "Singapore", "Bangkok", "Dubai", "Tokyo", "Shanghai"].map(
              (city, i) => (
                <span key={city}>
                  {i > 0 && <span className="mx-1.5 text-cream-400">·</span>}
                  <Link
                    href={`/international-schools/${city.toLowerCase()}/`}
                    className="text-hermes hover:text-hermes-hover transition-colors"
                  >
                    {city}
                  </Link>
                </span>
              )
            )}
          </p>
        </div>
      </section>

      {/* ─── Trust strip ─── */}
      <section className="border-y border-warm-border py-8 mb-16">
        <div className="container-site">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-center text-sm text-charcoal-muted">
            <span>600+ schools profiled</span>
            <span className="text-cream-400">·</span>
            <span>20+ cities</span>
            <span className="text-cream-400">·</span>
            <span>Independent reviews</span>
            <span className="text-cream-400">·</span>
            <span>Updated weekly</span>
          </div>
        </div>
      </section>

      {/* ─── Featured Schools ─── */}
      <section className="container-site mb-20">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-2">
              Featured Schools
            </p>
            <h2 className="font-display text-display-lg">
              Most searched this month
            </h2>
          </div>
          <Link
            href="/international-schools/jakarta/"
            className="hidden md:inline-block text-sm text-hermes hover:text-hermes-hover transition-colors"
          >
            View all Jakarta schools →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURED_SCHOOLS.map((school) => (
            <Link
              key={school.slug}
              href={`/international-schools/${school.citySlug}/${school.slug}/`}
              className="group border border-warm-border rounded-sm overflow-hidden hover:border-charcoal-muted transition-colors bg-warm-white"
            >
              {/* Placeholder hero image */}
              <div className="aspect-[16/7] bg-cream-300 group-hover:bg-cream-400 transition-colors" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display text-display-sm font-medium group-hover:text-hermes transition-colors leading-tight">
                    {school.name}
                  </h3>
                  <span className="text-label-xs uppercase text-charcoal-muted whitespace-nowrap mt-1">
                    {school.city}
                  </span>
                </div>
                <p className="text-sm text-charcoal-light leading-relaxed mb-3">
                  {school.hook}
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-charcoal-muted">
                  <span>{school.feeRange} / year</span>
                  <span>IB avg {school.ibAverage}</span>
                  <span>{school.students} students</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {school.curricula.map((c) => (
                    <span
                      key={c}
                      className="text-label-xs uppercase text-hermes bg-hermes-light px-2.5 py-1 rounded-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="md:hidden text-center mt-6">
          <Link
            href="/international-schools/jakarta/"
            className="text-sm text-hermes hover:text-hermes-hover transition-colors"
          >
            View all Jakarta schools →
          </Link>
        </div>
      </section>

      {/* ─── City Guides ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-16 mb-20">
        <div className="container-site">
          <div className="text-center mb-10">
            <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-2">
              Explore by City
            </p>
            <h2 className="font-display text-display-lg">
              International school guides
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/international-schools/${city.slug}/`}
                className="group border border-warm-border rounded-sm overflow-hidden hover:border-charcoal-muted transition-colors bg-cream-50"
              >
                {/* Placeholder city image */}
                <div className="aspect-[16/8] bg-cream-300 group-hover:bg-cream-400 transition-colors" />
                <div className="p-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-display text-display-sm group-hover:text-hermes transition-colors">
                      {city.name}
                    </h3>
                    <span className="text-label-xs uppercase text-charcoal-muted">
                      {city.country}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal-light leading-relaxed mb-3">
                    {city.tagline}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-charcoal-muted mb-3">
                    <span>{city.schoolCount}+ schools</span>
                    <span>{city.feeRange}</span>
                  </div>
                  <div className="flex gap-2">
                    {city.topCurricula.map((c) => (
                      <span
                        key={c}
                        className="text-label-xs uppercase text-charcoal-muted bg-cream-200 px-2 py-0.5 rounded-sm"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Browse by curriculum ─── */}
      <section className="container-site mb-20">
        <div className="text-center mb-8">
          <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-3">
            Browse by Curriculum
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {CURRICULA.map((c) => (
            <Link
              key={c}
              href={`/international-schools/?curriculum=${encodeURIComponent(c)}`}
              className="border border-warm-border rounded-sm px-5 py-2.5 text-sm text-charcoal-light hover:border-hermes hover:text-hermes transition-colors bg-warm-white"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured News ─── */}
      <section className="container-site mb-20">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-2">
              Latest
            </p>
            <h2 className="font-display text-display-lg">
              News & updates
            </h2>
          </div>
          <Link
            href="/news/"
            className="hidden md:inline-block text-sm text-hermes hover:text-hermes-hover transition-colors"
          >
            All news →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_NEWS.map((item) => (
            <Link
              key={item.slug}
              href={item.slug}
              className="group border border-warm-border rounded-sm p-5 hover:border-charcoal-muted transition-colors bg-warm-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-label-xs uppercase text-hermes bg-hermes-light px-2.5 py-1 rounded-sm">
                  {item.label}
                </span>
                <span className="text-[0.75rem] text-charcoal-muted">{item.date}</span>
              </div>
              <h3 className="font-display text-[1.0625rem] font-medium leading-snug mb-2 group-hover:text-hermes transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                {item.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="md:hidden text-center mt-6">
          <Link
            href="/news/"
            className="text-sm text-hermes hover:text-hermes-hover transition-colors"
          >
            All news →
          </Link>
        </div>
      </section>

      {/* ─── Editorial / Insights ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-16 mb-20">
        <div className="container-site">
          <div className="text-center mb-10">
            <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-2">
              Insights
            </p>
            <h2 className="font-display text-display-lg">
              Guides for expat families
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EDITORIAL_HIGHLIGHTS.map((article) => (
              <Link
                key={article.slug}
                href={article.slug}
                className="group"
              >
                {/* Placeholder image area */}
                <div className="aspect-[16/10] bg-cream-300 rounded-sm mb-4 group-hover:bg-cream-400 transition-colors" />
                <p className="text-label-xs uppercase text-hermes mb-2">
                  {article.label}
                </p>
                <h3 className="font-display text-[1.125rem] font-medium leading-snug mb-2 group-hover:text-hermes transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="bg-charcoal text-cream py-16 mb-0">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="text-label-sm uppercase text-cream-400 tracking-wider mb-3">
              How It Works
            </p>
            <h2 className="font-display text-display-lg text-cream-50">
              We do the research, you make the decision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Browse & compare",
                desc: "Search by city, curriculum, budget, or age. Every profile includes fees, results, and our independent editorial review.",
              },
              {
                step: "02",
                title: "Shortlist your picks",
                desc: "Save schools to your shortlist and compare them side by side — tuition, curriculum, results, community fit.",
              },
              {
                step: "03",
                title: "Contact directly",
                desc: "Reach out to admissions teams with confidence. No middlemen, no commissions, no sponsored rankings.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="text-hermes font-display text-[2rem] font-medium">
                  {item.step}
                </span>
                <h3 className="font-display text-display-sm text-cream-50 mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-cream-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── For schools CTA ─── */}
      <section className="container-site py-16 text-center">
        <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-3">
          For Schools
        </p>
        <h2 className="font-display text-display-lg mb-4">
          Is your school listed?
        </h2>
        <p className="text-sm text-charcoal-light max-w-lg mx-auto mb-8 leading-relaxed">
          We profile every international school — whether or not you ask us to.
          Claim your profile to verify information, update fees, and respond to
          our editorial review.
        </p>
        <Link
          href="/for-schools/"
          className="inline-block border border-charcoal text-charcoal px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-charcoal hover:text-cream transition-colors"
        >
          Claim Your Profile
        </Link>
      </section>
    </div>
  );
}
