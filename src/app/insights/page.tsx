import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllInsightArticles } from "@/lib/insights/content";
import type { InsightArticle } from "@/lib/insights/content";
import { getInsightImageUrl } from "@/lib/insights/images";
import { LatestInsightsGrid } from "@/components/insights/LatestInsightsGrid";

export const metadata: Metadata = {
  title: "Insights | The International Schools Guide",
  description:
    "Expert analysis on school fees, admissions, rankings, curriculum and relocation for international families in Jakarta.",
  alternates: { canonical: "https://international-schools-guide.com/insights" },
};

const LEAD_PILLAR_SLUG = "best-international-schools-jakarta";

const PILLAR_SLUGS = [
  LEAD_PILLAR_SLUG,
  "international-school-fees-jakarta",
  "best-british-schools-jakarta",
  "best-international-schools-south-jakarta",
  "relocating-to-jakarta-with-kids",
  "total-cost-international-school-jakarta",
];

const EDITORS_PICKS_SLUGS = [
  "isj-vs-bsj",
  "questions-to-ask-on-a-school-tour",
  "international-school-accreditation-explained",
  "cambridge-vs-ib-jakarta",
  "best-international-schools-jakarta-secondary",
];

const MOST_READ_SLUGS = [
  LEAD_PILLAR_SLUG,
  "international-school-fees-jakarta",
  "best-british-schools-jakarta",
  "best-international-schools-south-jakarta",
  "affordable-international-schools-jakarta",
];

function bySlugMap(articles: InsightArticle[]) {
  return new Map(articles.map((article) => [article.slug, article]));
}

function pickArticles(slugs: string[], map: Map<string, InsightArticle>) {
  return slugs.map((slug) => map.get(slug)).filter((article): article is InsightArticle => Boolean(article));
}

function displayDate(raw: string) {
  return raw.replace(/^Originally published:\s*/i, "").trim();
}

function CardImage({ slug, alt, className, priority = false }: { slug: string; alt: string; className: string; priority?: boolean }) {
  const src = getInsightImageUrl(slug, "card");
  if (!src) {
    return <div className={`${className} bg-cream-200`} aria-hidden />;
  }
  return <Image src={src} alt={alt} width={960} height={640} className={`${className} object-cover`} priority={priority} />;
}

export default function InsightsPage() {
  const articles = getAllInsightArticles();
  const slugMap = bySlugMap(articles);
  const lead = slugMap.get(LEAD_PILLAR_SLUG) ?? articles[0];
  const pillars = pickArticles(PILLAR_SLUGS, slugMap).filter((article) => article.slug !== lead.slug);
  const editorsPicks = pickArticles(EDITORS_PICKS_SLUGS, slugMap);
  const mostRead = pickArticles(MOST_READ_SLUGS, slugMap);
  const shown = new Set([
    lead.slug,
    ...pillars.map((article) => article.slug),
    ...editorsPicks.map((article) => article.slug),
    ...mostRead.map((article) => article.slug),
  ]);
  const latest = articles.filter((article) => !shown.has(article.slug)).slice(0, 12);
  const uniqueCities = Array.from(new Set(articles.map((a) => a.city))).sort();
  const cityLabels: Record<string, string> = {
    jakarta: "Jakarta",
    singapore: "Singapore",
    bangkok: "Bangkok",
    dubai: "Dubai",
    "hong-kong": "Hong Kong",
    "kuala-lumpur": "Kuala Lumpur",
  };
  const latestSummaries = latest.map((a) => ({
    slug: a.slug,
    h1: a.h1,
    categoryTag: a.categoryTag,
    city: a.city,
    date: a.date,
    readTime: a.readTime,
    metaDescription: a.metaDescription,
    cardImage: getInsightImageUrl(a.slug, "card"),
  }));

  return (
    <>
      <section className="bg-charcoal text-cream pt-20 pb-12 border-b-4 border-hermes">
        <div className="container-site">
          <p className="text-xs uppercase tracking-[0.18em] text-cream-400 mb-4">Insights</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">International Schools Guide</h1>
          <p className="text-cream-300 text-lg md:text-xl max-w-3xl leading-relaxed">
            Briefings on schools, fees, admissions and relocation decisions for international families in Jakarta.
          </p>
        </div>
      </section>

      <section className="container-site py-12">
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-10">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-hermes font-semibold mb-3">Featured coverage</p>
            <Link href={`/insights/${lead.slug}`} className="block border-t-4 border-charcoal pt-4 pb-6">
              <CardImage slug={lead.slug} alt={lead.h1} className="w-full h-56 md:h-72 mb-4 rounded-sm" priority />
              <p className="text-xs uppercase tracking-wider text-charcoal-muted mb-2">{lead.categoryTag}</p>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-tight mb-3">{lead.h1}</h2>
              <p className="text-charcoal-muted text-lg leading-relaxed mb-4">
                {lead.standfirst || lead.metaDescription}
              </p>
              <p className="text-xs text-charcoal-muted">
                {displayDate(lead.date)} · {lead.readTime}
              </p>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t border-warm-border pt-6">
              {pillars.slice(0, 4).map((article) => (
                <Link key={article.slug} href={`/insights/${article.slug}`} className="block border-b border-warm-border pb-4">
                  <CardImage slug={article.slug} alt={article.h1} className="w-full h-36 mb-3 rounded-sm" />
                  <p className="text-[11px] uppercase tracking-[0.12em] text-charcoal-muted mb-2">Featured</p>
                  <h3 className="font-display text-2xl text-charcoal leading-snug mb-2">{article.h1}</h3>
                  <p className="text-sm text-charcoal-muted line-clamp-3">
                    {article.metaDescription || article.standfirst}
                  </p>
                </Link>
              ))}
            </div>

            {pillars.length > 4 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {pillars.slice(4).map((article) => (
                  <Link key={article.slug} href={`/insights/${article.slug}`} className="block border-b border-warm-border pb-4">
                    <CardImage slug={article.slug} alt={article.h1} className="w-full h-28 mb-3 rounded-sm" />
                    <h3 className="font-display text-xl text-charcoal leading-snug mb-2">{article.h1}</h3>
                    <p className="text-sm text-charcoal-muted line-clamp-2">
                      {article.metaDescription || article.standfirst}
                    </p>
                  </Link>
                ))}
              </div>
            )}

            <LatestInsightsGrid
              articles={latestSummaries}
              cities={uniqueCities}
              cityLabels={cityLabels}
            />
          </div>

          <aside className="xl:pl-2">
            <div className="sticky top-24 space-y-8">
              <section className="border border-warm-border rounded-sm p-4 bg-cream-200">
                <h2 className="font-display text-2xl text-charcoal mb-4 border-b border-warm-border pb-2">Editor's picks</h2>
                <ol className="space-y-3">
                  {editorsPicks.map((article, index) => (
                    <li key={article.slug} className="border-b border-warm-border pb-3 last:border-b-0 last:pb-0">
                      <Link href={`/insights/${article.slug}`} className="block">
                        <p className="text-xs text-charcoal-muted mb-1">Pick {index + 1}</p>
                        <p className="font-display text-lg text-charcoal leading-snug">{article.h1}</p>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="border border-warm-border rounded-sm p-4 bg-cream-200">
                <h2 className="font-display text-2xl text-charcoal mb-4 border-b border-warm-border pb-2">Most read</h2>
                <ol className="space-y-3">
                  {mostRead.map((article, index) => (
                    <li key={article.slug} className="border-b border-warm-border pb-3 last:border-b-0 last:pb-0">
                      <Link href={`/insights/${article.slug}`} className="block">
                        <p className="text-xs text-charcoal-muted mb-1">#{index + 1}</p>
                        <p className="font-display text-lg text-charcoal leading-snug">{article.h1}</p>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

