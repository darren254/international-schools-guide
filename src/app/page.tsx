import type { Metadata } from "next";
import Link from "next/link";
import { CITIES, LIVE_CITIES, TOTAL_SCHOOLS_LIVE } from "@/data/cities";
import { HeroSearch } from "@/components/home/HeroSearch";
import { CityCardImage } from "@/components/home/CityCardImage";

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

export default function HomePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_WEBSITE) }}
      />

      {/* ─── Hero ─── */}
      <section
        id="help-me-choose"
        className="min-h-[85vh] md:min-h-0 pt-20 pb-10 md:pt-28 md:pb-16 text-center px-4 flex flex-col justify-center"
      >
        <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-medium tracking-tight leading-[1.1] mb-8 max-w-3xl mx-auto">
          Where are you moving?
        </h1>

        <HeroSearch cities={CITIES.map((c) => ({ slug: c.slug, name: c.name, live: c.live, comingNext: c.comingNext }))} />
      </section>

      {/* ─── City tiles (6) ─── */}
      <section className="bg-warm-white border-y border-warm-border-light pt-8 pb-12 md:pt-16 md:pb-16">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {CITIES.slice(0, 6).map((city) => {
              const content = (
                <>
                  <CityCardImage
                    city={city}
                    photoCredit={city.photoCredit}
                  />
                  <div className="p-3 md:p-4 flex flex-col min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1 min-w-0">
                      <span className="font-display text-display-sm font-medium text-charcoal truncate">
                        {city.name}
                      </span>
                      <span
                        className="text-label-xs uppercase text-charcoal-muted shrink-0 truncate max-w-[45%]"
                        title={city.country}
                      >
                        {city.country}
                      </span>
                    </div>
                    <p className="text-[0.8125rem] text-charcoal-muted leading-snug">
                      {city.schoolCount ?? "—"}+ schools
                    </p>
                  </div>
                </>
              );

              const wrapperClasses = city.live
                ? "group border-2 border-hermes rounded-sm overflow-hidden hover:shadow-lg transition-all duration-200 bg-cream-50 flex flex-col h-full"
                : "group border border-charcoal-muted/40 rounded-sm overflow-hidden bg-cream-50 transition-all duration-200 flex flex-col h-full";

              return city.live ? (
                <Link
                  key={city.slug}
                  href={`/international-schools/${city.slug}/`}
                  className={wrapperClasses}
                >
                  {content}
                </Link>
              ) : (
                <div key={city.slug} className={wrapperClasses}>
                  {content}
                </div>
              );
            })}
          </div>

          <p className="text-center text-[0.9375rem] text-charcoal-muted mt-8 font-body">
            Independent profiles for {TOTAL_SCHOOLS_LIVE}+ international schools across {LIVE_CITIES.length} cities.
          </p>

          <p className="text-center mt-4">
            <Link
              href="/cities"
              className="text-sm font-medium text-hermes hover:text-hermes-hover transition-colors"
            >
              See all cities →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
