import type { Metadata } from "next";
import Link from "next/link";
import { CITIES, LIVE_CITIES, TOTAL_SCHOOLS_LIVE } from "@/data/cities";
import { HeroSearch } from "@/components/home/HeroSearch";

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
      <section id="help-me-choose" className="pt-20 pb-12 md:pt-28 md:pb-16 text-center px-4">
        <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-medium tracking-tight leading-[1.1] mb-8 max-w-3xl mx-auto">
          Where are you moving?
        </h1>

        <HeroSearch cities={CITIES.map((c) => ({ slug: c.slug, name: c.name, live: c.live, comingNext: c.comingNext }))} />
      </section>

      {/* ─── City tiles (6) ─── */}
      <section className="bg-warm-white border-y border-warm-border-light py-12 md:py-16">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {CITIES.slice(0, 6).map((city) => {
              const content = (
                <>
                  <div className="aspect-[16/8] bg-cream-300 group-hover:bg-cream-400 transition-colors relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/cities/${city.slug}.webp${city.slug === "jakarta" ? "?v=2" : ""}`}
                      alt={`${city.name} skyline`}
                      className="w-full h-full object-cover school-image absolute inset-0"
                      loading="lazy"
                      width={800}
                      height={400}
                    />
                    {city.slug === "jakarta" && (
                      <a
                        href="https://www.pexels.com/@javaistan/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-1.5 right-2 text-[10px] text-white/90 hover:text-white font-body no-underline z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                      >
                        Photo: Javaistan / Pexels
                      </a>
                    )}
                    {city.live && (
                      <span className="absolute top-2 right-2 bg-hermes text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded z-10">
                        Live
                      </span>
                    )}
                    {!city.live && city.comingNext && (
                      <span className="absolute top-2 right-2 bg-charcoal text-white text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded z-10">
                        Coming next
                      </span>
                    )}
                    {!city.live && !city.comingNext && (
                      <span className="absolute top-2 right-2 text-[10px] uppercase tracking-wider text-charcoal-muted bg-warm-white/90 px-2.5 py-1 rounded z-10 font-semibold">
                        Soon
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="font-display text-display-sm font-medium text-charcoal">
                        {city.name}
                      </span>
                      <span className="text-label-xs uppercase text-charcoal-muted shrink-0">
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
