import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllInsightArticles } from "@/lib/insights/content";
import type { InsightArticle } from "@/lib/insights/content";
import { getInsightImageUrl } from "@/lib/insights/images";
import { LIVE_CITIES } from "@/data/cities";

export const metadata: Metadata = {
  title: "Insights | The International Schools Guide",
  description:
    "Expert analysis on school fees, admissions, rankings, curriculum and relocation for international families in Jakarta.",
  alternates: { canonical: "https://international-schools-guide.com/insights" },
};

const EDITORS_PICKS_SLUGS = [
  "best-international-schools-jakarta",
  "international-school-fees-jakarta",
  "best-british-schools-jakarta",
  "best-international-schools-south-jakarta",
  "affordable-international-schools-jakarta",
];

const MOST_READ_SLUGS = [
  "best-international-schools-jakarta",
  "international-school-fees-jakarta",
  "best-british-schools-jakarta",
  "best-international-schools-south-jakarta",
  "affordable-international-schools-jakarta",
];

function bySlugMap(articles: InsightArticle[]) {
  return new Map(articles.map((a) => [a.slug, a]));
}

function pickArticles(slugs: string[], map: Map<string, InsightArticle>) {
  return slugs.map((s) => map.get(s)).filter((a): a is InsightArticle => Boolean(a));
}

function displayDate(raw: string) {
  return raw.replace(/^Originally published:\s*/i, "").trim();
}

/** Hero: large image, big headline, standfirst, category, date */
function HeroCard({ article, priority = false }: { article: InsightArticle; priority?: boolean }) {
  const src = getInsightImageUrl(article.slug, "card") ?? getInsightImageUrl(article.slug, "hero");
  return (
    <Link href={`/insights/${article.slug}`} className="group block">
      <div className="aspect-[16/10] md:aspect-[16/9] bg-cream-200 rounded-sm overflow-hidden mb-4">
        {src ? (
          <Image
            src={src}
            alt=""
            width={960}
            height={540}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full bg-cream-300" aria-hidden />
        )}
      </div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-hermes font-semibold mb-2">{article.categoryTag}</p>
      <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-charcoal leading-tight mb-3 group-hover:text-hermes transition-colors">
        {article.h1}
      </h2>
      <p className="text-charcoal-muted text-base md:text-lg leading-relaxed mb-2 line-clamp-3">
        {article.standfirst || article.metaDescription}
      </p>
      <p className="text-xs text-charcoal-muted">
        {displayDate(article.date)} · {article.readTime}
      </p>
    </Link>
  );
}

/** Compact: category + headline + date only, border-bottom */
function CompactCard({ article }: { article: InsightArticle }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="block py-3 border-b border-warm-border-light last:border-b-0 group"
    >
      <p className="text-[10px] uppercase tracking-wider text-charcoal-muted mb-1">{article.categoryTag}</p>
      <h3 className="font-display text-[0.9375rem] md:text-base text-charcoal leading-snug group-hover:text-hermes transition-colors line-clamp-2">
        {article.h1}
      </h3>
      <p className="text-[11px] text-charcoal-muted mt-1">{displayDate(article.date)}</p>
    </Link>
  );
}

/** Medium: small image, headline, category, date */
function MediumCard({ article }: { article: InsightArticle }) {
  const src = getInsightImageUrl(article.slug, "card") ?? getInsightImageUrl(article.slug, "hero");
  return (
    <Link href={`/insights/${article.slug}`} className="group block">
      <div className="aspect-[16/10] bg-cream-200 rounded-sm overflow-hidden mb-2">
        {src ? (
          <Image
            src={src}
            alt=""
            width={400}
            height={250}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-cream-300" aria-hidden />
        )}
      </div>
      <p className="text-[10px] uppercase tracking-wider text-charcoal-muted mb-1">{article.categoryTag}</p>
      <h3 className="font-display text-base md:text-lg text-charcoal leading-snug group-hover:text-hermes transition-colors line-clamp-2">
        {article.h1}
      </h3>
      <p className="text-[11px] text-charcoal-muted mt-1">{displayDate(article.date)} · {article.readTime}</p>
    </Link>
  );
}

function CardImage({
  slug,
  alt,
  className,
  priority = false,
}: {
  slug: string;
  alt: string;
  className: string;
  priority?: boolean;
}) {
  const src = getInsightImageUrl(slug, "card") ?? getInsightImageUrl(slug, "hero");
  if (!src) return <div className={`${className} bg-cream-200`} aria-hidden />;
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={250}
      className={`${className} object-cover`}
      priority={priority}
    />
  );
}

export default function InsightsPage() {
  const articles = getAllInsightArticles();
  const slugMap = bySlugMap(articles);

  // Pillar: "Best International Schools in [City]" per live city (slug = best-international-schools-{citySlug})
  const pillarSlugs = LIVE_CITIES.map((c) => `best-international-schools-${c.slug}`);
  const allPillarArticles = pillarSlugs
    .map((slug) => slugMap.get(slug))
    .filter((a): a is InsightArticle => Boolean(a));

  // Hero = first pillar or first article
  const hero = allPillarArticles[0] ?? articles[0];

  // Pillar row: all pillars (hero may repeat as first card — acceptable for front page)
  const pillarRowArticles = allPillarArticles;

  // Secondaries = next 4 (other pillars, then any) — text-only compact cards
  const secondaryCandidates = [
    ...allPillarArticles.slice(1),
    ...articles.filter((a) => a.slug !== hero.slug && !allPillarArticles.some((p) => p.slug === a.slug)),
  ];
  const secondaries = secondaryCandidates.slice(0, 4);

  const editorsPicks = pickArticles(EDITORS_PICKS_SLUGS, slugMap);
  const mostRead = pickArticles(MOST_READ_SLUGS, slugMap);

  const shownInTop = new Set([
    hero.slug,
    ...secondaries.map((a) => a.slug),
    ...allPillarArticles.map((a) => a.slug),
    ...editorsPicks.map((a) => a.slug),
    ...mostRead.map((a) => a.slug),
  ]);
  const latest = articles.filter((a) => !shownInTop.has(a.slug)).slice(0, 24);

  // Mixed grid: each article is medium (has image) or compact (text-only)
  const latestMixed = latest.map((article) => ({
    article,
    variant: (getInsightImageUrl(article.slug, "card") ?? getInsightImageUrl(article.slug, "hero"))
      ? ("medium" as const)
      : ("compact" as const),
  }));

  return (
    <>
      {/* Hero strip */}
      <section className="bg-charcoal text-cream pt-12 md:pt-16 pb-8 md:pb-10 border-b-4 border-hermes">
        <div className="container-site">
          <p className="text-xs uppercase tracking-[0.18em] text-cream-400 mb-2">Insights</p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-2">International Schools Guide</h1>
          <p className="text-cream-300 text-base md:text-lg max-w-2xl">
            Briefings on schools, fees, admissions and relocation for international families.
          </p>
        </div>
      </section>

      <div className="container-site py-8 md:py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 xl:gap-12">
          <div>
            {/* 1. Hero + secondary stories */}
            <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8 pb-8 md:pb-10 border-b border-warm-border">
              <div>
                <HeroCard article={hero} priority />
              </div>
              <div className="flex flex-col gap-0 border-l-0 lg:border-l border-warm-border lg:pl-8">
                <p className="text-[10px] uppercase tracking-wider text-charcoal-muted mb-3 lg:mb-4">Latest</p>
                {secondaries.map((article) => (
                  <CompactCard key={article.slug} article={article} />
                ))}
              </div>
            </section>

            {/* 2. Pillar row — Best in [City] */}
            {pillarRowArticles.length > 0 && (
              <section className="py-8 md:py-10 border-b border-warm-border">
                <h2 className="font-display text-xl md:text-2xl text-charcoal mb-5">
                  Best international schools by city
                </h2>
                <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 overflow-x-auto sm:overflow-visible gap-4 sm:gap-5 pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
                  {pillarRowArticles.map((article) => {
                    const city = LIVE_CITIES.find((c) => article.slug === `best-international-schools-${c.slug}`);
                    const cityName = city?.name ?? article.city;
                    return (
                      <Link key={article.slug} href={`/insights/${article.slug}`} className="group block min-w-[85vw] sm:min-w-0 snap-start shrink-0 sm:shrink">
                        <div className="aspect-[16/10] bg-cream-200 rounded-sm overflow-hidden mb-2">
                          <CardImage slug={article.slug} alt={article.h1} className="w-full h-full" />
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-hermes font-semibold mb-1">
                          {cityName}
                        </p>
                        <h3 className="font-display text-base md:text-lg text-charcoal leading-snug group-hover:text-hermes transition-colors line-clamp-2">
                          {article.h1}
                        </h3>
                        <p className="text-[11px] text-charcoal-muted mt-1">
                          {displayDate(article.date)} · {article.readTime}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3. Latest analysis — mixed density grid */}
            <section className="py-8 md:py-10">
              <h2 className="font-display text-xl md:text-2xl text-charcoal mb-5 border-t-2 border-charcoal pt-4">
                Latest analysis
              </h2>
              {/* Desktop: asymmetric grid. Mobile: single column. */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 md:gap-y-8">
                {latestMixed.map(({ article, variant }) =>
                  variant === "medium" ? (
                    <div key={article.slug} className="md:min-h-0">
                      <MediumCard article={article} />
                    </div>
                  ) : (
                    <div key={article.slug} className="md:flex md:flex-col">
                      <CompactCard article={article} />
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* Sidebar — desktop only, scrolls with page (FT-style, no sticky) */}
          <aside className="xl:block hidden">
            <div className="space-y-8">
              <section className="border border-warm-border rounded-sm p-4 bg-cream-200">
                <h2 className="font-display text-xl text-charcoal mb-4 border-b border-warm-border pb-2">
                  Editor&apos;s picks
                </h2>
                <ol className="space-y-3">
                  {editorsPicks.map((article, index) => (
                    <li key={article.slug} className="border-b border-warm-border pb-3 last:border-b-0 last:pb-0">
                      <Link href={`/insights/${article.slug}`} className="block group">
                        <p className="text-xs text-charcoal-muted mb-1">Pick {index + 1}</p>
                        <p className="font-display text-base text-charcoal leading-snug group-hover:text-hermes transition-colors">
                          {article.h1}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="border border-warm-border rounded-sm p-4 bg-cream-200">
                <h2 className="font-display text-xl text-charcoal mb-4 border-b border-warm-border pb-2">
                  Most read
                </h2>
                <ol className="space-y-3">
                  {mostRead.map((article, index) => (
                    <li key={article.slug} className="border-b border-warm-border pb-3 last:border-b-0 last:pb-0">
                      <Link href={`/insights/${article.slug}`} className="block group">
                        <p className="text-xs text-charcoal-muted mb-1">#{index + 1}</p>
                        <p className="font-display text-base text-charcoal leading-snug group-hover:text-hermes transition-colors">
                          {article.h1}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </aside>
        </div>

        {/* Mobile: sidebar below main */}
        <div className="xl:hidden mt-10 pt-10 border-t border-warm-border grid grid-cols-1 sm:grid-cols-2 gap-8">
          <section className="border border-warm-border rounded-sm p-4 bg-cream-200">
            <h2 className="font-display text-xl text-charcoal mb-4 border-b border-warm-border pb-2">
              Editor&apos;s picks
            </h2>
            <ol className="space-y-3">
              {editorsPicks.map((article, index) => (
                <li key={article.slug} className="border-b border-warm-border pb-3 last:border-b-0 last:pb-0">
                  <Link href={`/insights/${article.slug}`} className="block group">
                    <p className="text-xs text-charcoal-muted mb-1">Pick {index + 1}</p>
                    <p className="font-display text-base text-charcoal leading-snug group-hover:text-hermes transition-colors">
                      {article.h1}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
          <section className="border border-warm-border rounded-sm p-4 bg-cream-200">
            <h2 className="font-display text-xl text-charcoal mb-4 border-b border-warm-border pb-2">
              Most read
            </h2>
            <ol className="space-y-3">
              {mostRead.map((article, index) => (
                <li key={article.slug} className="border-b border-warm-border pb-3 last:border-b-0 last:pb-0">
                  <Link href={`/insights/${article.slug}`} className="block group">
                    <p className="text-xs text-charcoal-muted mb-1">#{index + 1}</p>
                    <p className="font-display text-base text-charcoal leading-snug group-hover:text-hermes transition-colors">
                      {article.h1}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}
