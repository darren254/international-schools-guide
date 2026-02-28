import type { Metadata } from "next";
import Link from "next/link";
import { CITIES, LIVE_CITIES, TOTAL_SCHOOLS_LIVE } from "@/data/cities";
import { getSchoolImageUrl } from "@/lib/schools/images";
import { getInsightImageUrl } from "@/lib/insights/images";
import { HeroSearch } from "@/components/home/HeroSearch";
import SocialProofBar from "@/components/SocialProofBar";
import MidPageCTA from "@/components/MidPageCTA";
import EmailCapture from "@/components/EmailCapture";
import FAQ, { buildFAQJsonLd } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Find the Right International School",
  description:
    "Compare international schools worldwide. Verified fees, IB results, and honest editorial reviews - built for expat families, not for schools.",
  alternates: { canonical: "https://international-schools-guide.com/" },
  openGraph: {
    title: "Find the Right International School - International Schools Guide",
    description:
      "Compare international schools worldwide. Verified fees, IB results, and honest editorial reviews - built for expat families, not for schools.",
    url: "https://international-schools-guide.com/",
    siteName: "International Schools Guide",
    type: "website",
    images: [
      {
        url: "https://international-schools-guide.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "International Schools Guide - independent reviews and fee data for expat families",
      },
    ],
  },
};

const FEATURED_SCHOOLS_RAW: {
  name: string;
  slug: string;
  city: string;
  citySlug: string;
  curricula: string[];
  feeRange: string;
  ibAverage: string;
  students: string;
  hook: string;
  sponsored?: boolean;
}[] = [
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
    sponsored: false,
  },
  {
    name: "The Independent School of Jakarta",
    slug: "independent-school-of-jakarta",
    city: "Jakarta",
    citySlug: "jakarta",
    curricula: ["British", "IGCSE", "A-Levels"],
    feeRange: "US$9.2K – $30K",
    ibAverage: "-",
    students: "200",
    hook: "Small, personal British school with standout pastoral care and class sizes capped at 16",
    sponsored: false,
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
    sponsored: false,
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
    sponsored: false,
  },
];

// Use manual order instead of sorting by fees
const FEATURED_SCHOOLS = FEATURED_SCHOOLS_RAW;

// 3 most recent insights for "From the guide" (by date)
const FROM_THE_GUIDE = [
  {
    slug: "best-international-schools-jakarta",
    title: "International Schools in Jakarta - A Practical Guide for Expat Families (2026)",
    category: "Guide",
    description: "More than 60 international schools; compare fees, curricula, and locations. Honest guide to JIS, BSJ, ISJ, AIS, and 60+ options.",
  },
  {
    slug: "jakarta-international-schools-fee-report-2026",
    title: "Jakarta International Schools Fee Report — 2026 Edition",
    category: "Fees",
    description: "The definitive annual comparison of international school fees in Jakarta. Ten schools, three age bands, verified data.",
  },
  {
    slug: "ib-results-jakarta-international-schools",
    title: "IB Diploma Results at Jakarta International Schools",
    category: "Results",
    description: "Which Jakarta international schools publish IB Diploma results? Published averages, pass rates, and what the numbers mean for university admissions.",
  },
];


const JSONLD_WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "International Schools Guide",
  url: "https://international-schools-guide.com",
  description:
    "Independent reviews and verified fee data for international schools worldwide.",
  potentialAction: {
    "@type": "SearchAction",
    target:
      "https://international-schools-guide.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const JSONLD_FAQ = buildFAQJsonLd();

export default function HomePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_WEBSITE) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_FAQ) }}
      />

      {/* ─── Hero ─── */}
      <section id="help-me-choose" className="pt-20 pb-16 md:pt-28 md:pb-24 text-center px-4">
        <p className="text-label-sm uppercase text-charcoal-muted tracking-wider mb-5">
          Independent reviews · Real fee data{LIVE_CITIES.length > 1 ? ` · ${LIVE_CITIES.length}+ cities` : ""}
        </p>
        <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-medium tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
          Find the right international school
        </h1>
        <p className="text-charcoal-light max-w-xl mx-auto mb-12 text-[0.9375rem] leading-relaxed">
          Honest profiles, verified fee data, and independent editorial reviews - built for expat families, not for schools.
        </p>

        {/* Help Me Choose input + browse by city + secondary CTAs */}
        <HeroSearch cities={CITIES.map((c) => ({ slug: c.slug, name: c.name, live: c.live, comingNext: c.comingNext }))} />
      </section>

      <SocialProofBar />

      {/* ─── Trust strip ─── */}
      <section className="border-y border-warm-border py-8 mb-16">
        <div className="container-site">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-center text-sm text-charcoal-muted">
            <span>{TOTAL_SCHOOLS_LIVE} schools in {LIVE_CITIES.map((c) => c.name).join(", ")}</span>
            <span>{LIVE_CITIES.length} {LIVE_CITIES.length === 1 ? "city" : "cities"} live</span>
            <span>Independent reviews</span>
            <span>Updated weekly</span>
          </div>
        </div>
      </section>

      {/* ─── Featured Schools ─── */}
      <section className="container-site mb-20">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="font-display text-display-lg">
              Featured Schools
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
              className="group border border-warm-border rounded-sm overflow-hidden bg-warm-white transition-all duration-200 hover:shadow-lg flex flex-col"
            >
              {/* Hero image */}
              <div className="aspect-[16/7] bg-cream-300 group-hover:bg-cream-400 transition-colors relative overflow-hidden">
                {school.sponsored && (
                  <span className="absolute top-2 right-2 text-[0.6875rem] uppercase tracking-wider text-charcoal-muted z-10 bg-warm-white/90 px-2 py-1 rounded-sm">
                    Sponsored
                  </span>
                )}
                {getSchoolImageUrl(school.slug, "card") && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={getSchoolImageUrl(school.slug, "card")} 
                    alt={`${school.name} campus, ${school.city}`} 
                    className="w-full h-full object-cover school-image absolute inset-0 transition-transform duration-300 group-hover:scale-105" 
                    loading="lazy" 
                  />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display text-display-sm font-medium group-hover:text-hermes transition-colors leading-tight">
                    {school.name}
                  </h3>
                  <span className="text-label-xs uppercase text-charcoal-muted whitespace-nowrap mt-1">
                    {school.city}
                  </span>
                </div>
                <p className="text-sm text-charcoal-light leading-relaxed mb-3 flex-1">
                  {school.hook}
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-charcoal-muted mt-auto">
                  <span>{school.feeRange} / year</span>
                  <span>IB avg {school.ibAverage}</span>
                  <span>{school.students} students</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {school.curricula.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-semibold uppercase tracking-wide text-hermes bg-hermes-light px-2.5 py-1 rounded-sm"
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

      <MidPageCTA />

      {/* ─── City Guides grid (exactly 6) ─── */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CITIES.slice(0, 6).map((city) => {
              const content = (
                <>
                  <div className="aspect-[16/8] bg-cream-300 group-hover:bg-cream-400 transition-colors relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/cities/${city.slug}.webp`}
                      alt={`${city.name} skyline`}
                      className="w-full h-full object-cover school-image absolute inset-0"
                      loading="lazy"
                    />
                    {city.live && (
                      <span className="absolute top-3 right-3 bg-hermes text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded z-10">
                        Live Now
                      </span>
                    )}
                    {!city.live && city.comingNext && (
                      <span className="absolute top-3 right-3 bg-charcoal text-white text-[10px] font-semibold uppercase tracking-wide px-3 py-1 rounded z-10">
                        Coming next
                      </span>
                    )}
                    {!city.live && !city.comingNext && (
                      <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider text-charcoal-muted bg-warm-white/90 px-3 py-1 rounded z-10 font-semibold">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="font-display text-display-sm group-hover:text-hermes transition-colors">
                        {city.name}
                      </h3>
                      <span className="text-label-xs uppercase text-charcoal-muted">
                        {city.country}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal-light leading-relaxed mb-3 flex-1">
                      {city.tagline ?? ""}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-charcoal-muted mb-3">
                      <span>{city.schoolCount ?? "-"}+ schools</span>
                      <span>{city.feeRange ?? ""}</span>
                    </div>
                    <div className="flex gap-2">
                      {(city.topCurricula ?? []).map((c) => (
                        <span
                          key={c}
                          className="text-label-xs uppercase text-charcoal-muted bg-cream-200 px-2 py-0.5 rounded-sm"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    {!city.live && (
                      <div className="flex gap-2 mt-4">
                        <input
                          type="email"
                          placeholder="Your email"
                          className="flex-1 px-3 py-2 border border-warm-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-hermes-light"
                        />
                        <button className="bg-charcoal text-white px-4 py-2 rounded text-[11px] font-semibold whitespace-nowrap hover:bg-charcoal-light transition-colors">
                          Notify Me
                        </button>
                      </div>
                    )}
                  </div>
                </>
              );

              const wrapperClasses = city.live 
                ? "group border-2 border-hermes rounded-sm overflow-hidden hover:shadow-lg transition-all duration-200 bg-cream-50 flex flex-col h-full"
                : "group border border-warm-border rounded-sm overflow-hidden bg-cream-50 transition-all duration-200 flex flex-col h-full";

              return city.live ? (
                <Link
                  key={city.slug}
                  href={`/international-schools/${city.slug}/`}
                  className={wrapperClasses}
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={city.slug}
                  className={wrapperClasses}
                >
                  {content}
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-charcoal-muted mt-8">
            New city added every week — Hong Kong, Singapore, and Kuala Lumpur launching soon.
          </p>

          <p className="text-center mt-5">
            <Link
              href="/cities"
              className="text-sm font-medium text-hermes hover:text-hermes-hover transition-colors"
            >
              See all cities →
            </Link>
          </p>
        </div>
      </section>

      {/* ─── From the guide (3 most recent insights) ─── */}
      <section className="container-site mb-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-display-lg">
            From the guide
          </h2>
          <Link
            href="/insights/"
            className="hidden md:inline-block text-sm text-hermes hover:text-hermes-hover transition-colors"
          >
            All insights →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FROM_THE_GUIDE.map((article) => {
            const imageUrl = getInsightImageUrl(article.slug, "card");
            return (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="group border border-warm-border rounded-sm overflow-hidden hover:border-charcoal-muted transition-colors bg-cream-200 flex flex-col"
            >
              {imageUrl && (
                <div className="aspect-[16/9] w-full bg-cream-300 relative overflow-hidden border-b border-warm-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover school-image"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-label-xs uppercase text-hermes mb-2 block">
                  {article.category}
                </span>
                <h3 className="font-display text-[1.0625rem] font-medium leading-snug mb-2 group-hover:text-hermes transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-charcoal-light leading-relaxed mt-auto">
                  {article.description}
                </p>
              </div>
            </Link>
            );
          })}
        </div>

        <div className="md:hidden text-center mt-6">
          <Link
            href="/insights/"
            className="text-sm text-hermes hover:text-hermes-hover transition-colors"
          >
            All insights →
          </Link>
        </div>
      </section>

      {/* Duplicate news section removed — "From the guide" above covers insights */}

      <EmailCapture />

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
                desc: "Save schools to your shortlist and compare them side by side - tuition, curriculum, results, community fit.",
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

      <FAQ />

      {/* ─── For schools CTA ─── */}
      <section className="container-site py-16 text-center">
        <h2 className="font-display text-display-lg mb-4">
          Is your school listed?
        </h2>
        <p className="text-sm text-charcoal-light max-w-lg mx-auto mb-8 leading-relaxed">
          We profile every international school independently. If you spot anything outdated or incorrect, we&apos;d genuinely like to hear from you.
        </p>
        <a
          href="mailto:mia@international-schools-guide.com?subject=School%20listing%20enquiry"
          className="inline-block border border-charcoal text-charcoal px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-charcoal hover:text-cream transition-colors"
        >
          Get in touch →
        </a>
      </section>
    </div>
  );
}
