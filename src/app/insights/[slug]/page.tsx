import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/share/ShareButton";
import { WasHelpful } from "@/components/insights/WasHelpful";
import { FaqList } from "@/components/insights/FaqAccordion";
import { SchoolSnapshotCard } from "@/components/insights/SchoolSnapshotCard";
import { FloatingToc } from "@/components/insights/FloatingToc";
import { SCHOOL_PROFILES } from "@/data/schools";
import { getAllInsightArticles, getInsightArticleBySlug } from "@/lib/insights/content";
import { getInsightImageUrl } from "@/lib/insights/images";

const BASE_URL = "https://international-schools-guide.com";
const ReaderPulseWidget = dynamic(
  () => import("@/components/insights/ReaderPulseWidget").then((m) => m.ReaderPulseWidget),
  { ssr: false }
);

export async function generateStaticParams() {
  return getAllInsightArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsightArticleBySlug(slug);
  if (!article) {
    return { title: "Insight not found" };
  }

  const canonical = `${BASE_URL}/insights/${article.slug}`;
  return {
    title: article.titleTag,
    description: article.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: article.titleTag,
      description: article.metaDescription,
      url: canonical,
      type: "article",
    },
  };
}

function articleSchema(article: ReturnType<typeof getInsightArticleBySlug>) {
  if (!article) return null;
  const url = `${BASE_URL}/insights/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.h1,
    description: article.metaDescription,
    author: {
      "@type": "Person",
      name: "Mia Windsor",
      url: "https://bsky.app/profile/mia-isg.bsky.social",
    },
    datePublished: article.date.replace("Originally published:", "").trim(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

function breadcrumbsSchema(article: ReturnType<typeof getInsightArticleBySlug>) {
  if (!article) return null;
  const parts = article.breadcrumbs.split(">").map((p) => p.trim()).filter(Boolean);
  const itemListElement = parts.map((name, i) => {
    const item =
      i === 0
        ? BASE_URL
        : i === parts.length - 1
          ? `${BASE_URL}/insights/${article.slug}`
          : `${BASE_URL}/insights`;
    return { "@type": "ListItem", position: i + 1, name, item };
  });
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement };
}

function faqSchema(article: ReturnType<typeof getInsightArticleBySlug>) {
  if (!article || article.faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

function findMentionedSchools(articleHtml: string) {
  const content = articleHtml.toLowerCase();
  return Object.values(SCHOOL_PROFILES)
    .filter((school) => content.includes(school.name.toLowerCase()) || content.includes(school.shortName.toLowerCase()))
    .slice(0, 6);
}

function topicTagForSlug(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("british")) return "British";
  if (s.includes("-ib-") || s.includes("ib-") || s.includes("ib")) return "IB";
  if (s.includes("american")) return "American";
  if (s.includes("fees") || s.includes("cost") || s.includes("levy")) return "Fees";
  if (s.includes("relocating") || s.includes("living-in") || s.includes("neighbourhood") || s.includes("areas")) return "Relocation";
  if (s.includes("compare") || s.includes("-vs-")) return "Comparison";
  if (s.includes("admissions") || s.includes("apply") || s.includes("waitlist")) return "Admissions";
  return "Insights";
}

function splitBodyForMidWidget(html: string): { before: string; after: string } {
  // Prefer splitting between ranked school sections (we insert <figure class="school-section-figure"> before them).
  const figRegex = /<figure class="school-section-figure">/gi;
  const figStarts: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = figRegex.exec(html)) !== null) figStarts.push(m.index);

  if (figStarts.length >= 3) {
    const splitAt = figStarts[Math.floor(figStarts.length / 2)];
    return { before: html.slice(0, splitAt), after: html.slice(splitAt) };
  }
  if (figStarts.length === 2) {
    const splitAt = figStarts[1];
    return { before: html.slice(0, splitAt), after: html.slice(splitAt) };
  }

  // Fallback: split at the midpoint heading boundary.
  const h2Regex = /<\/h2>/gi;
  const h2Ends: number[] = [];
  while ((m = h2Regex.exec(html)) !== null) h2Ends.push(m.index + m[0].length);
  if (h2Ends.length >= 2) {
    const splitAt = h2Ends[Math.floor(h2Ends.length / 2) - 1] ?? h2Ends[Math.floor(h2Ends.length / 2)];
    return { before: html.slice(0, splitAt), after: html.slice(splitAt) };
  }

  // Last resort: after a few paragraphs.
  const pRegex = /<\/p>/gi;
  const pEnds: number[] = [];
  while ((m = pRegex.exec(html)) !== null) pEnds.push(m.index + m[0].length);
  if (pEnds.length >= 6) {
    const splitAt = pEnds[5];
    return { before: html.slice(0, splitAt), after: html.slice(splitAt) };
  }
  return { before: html, after: "" };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsightArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticles = article.relatedSlugs
    .map((relatedSlug) => getInsightArticleBySlug(relatedSlug))
    .filter((candidate): candidate is Exclude<typeof candidate, undefined> => candidate !== undefined)
    .filter((candidate) => candidate.slug !== article.slug)
    .slice(0, 3);

  const schoolCards = findMentionedSchools(article.bodyHtml);
  const heroImage = getInsightImageUrl(article.slug, "hero");
  const standardAccuracyDisclaimer =
    "We work hard to make every figure, date and description on this page accurate. We don't always get it right. If you spot an error - a fee that's changed, a fact that's out of date, something we've got wrong - please tell us. Use the feedback button above or email us directly. We'll check it and update the article.";

  const breadcrumbParts = article.breadcrumbs
    .split(">")
    .map((p) => p.trim())
    .filter(Boolean);

  const bodySplit = splitBodyForMidWidget(article.bodyHtml);

  return (
    <>
      {articleSchema(article) && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(article)) }} />
      )}
      {breadcrumbsSchema(article) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema(article)) }}
        />
      )}
      {faqSchema(article) && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(article)) }} />
      )}

      <article className="w-full">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 pt-6 pb-16">
          <div className="max-w-[760px] mx-auto">
            <nav className="text-xs text-charcoal-muted mb-4" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {breadcrumbParts.map((label, i) => {
                  const href = i === 0 ? "/" : i === 1 ? "/insights/" : undefined;
                  const isLast = i === breadcrumbParts.length - 1;
                  return (
                    <li key={`${label}-${i}`} className="flex items-center gap-x-2">
                      {href && !isLast ? (
                        <Link href={href} className="hover:text-hermes transition-colors">
                          {label}
                        </Link>
                      ) : (
                        <span>{label}</span>
                      )}
                      {!isLast && <span aria-hidden className="text-charcoal-muted">›</span>}
                    </li>
                  );
                })}
              </ol>
            </nav>

            <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-charcoal leading-tight mb-3">
              {article.h1}
            </h1>
            {article.standfirst && <p className="font-display text-xl text-charcoal-muted mb-6">{article.standfirst}</p>}

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-warm-border">
              <Image
                src="/images/mia-windsor.png"
                alt="Mia Windsor"
                width={64}
                height={64}
                className="rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="font-sans font-semibold text-charcoal">Mia Windsor</p>
                <p className="font-sans text-sm text-charcoal-muted">Managing Editor</p>
                <a
                  href="https://bsky.app/profile/mia-isg.bsky.social"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-hermes hover:underline"
                >
                  @mia-isg.bsky.social
                </a>
              </div>
            </div>

            <p className="text-sm text-charcoal-muted mb-6 font-sans">
              {article.date} · {article.readTime}
            </p>

            <ShareButton variant="article" url={`${BASE_URL}/insights/${article.slug}`} title={article.titleTag} />
          </div>

          <div className="w-full -mx-5 md:-mx-8 mt-6 mb-8">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={article.h1}
                width={1600}
                height={900}
                className="w-full h-auto object-cover"
                priority
              />
            ) : (
              <div className="w-full h-56 md:h-72 bg-cream-200" aria-hidden />
            )}
          </div>

          <div className="max-w-[1060px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,760px)_240px] gap-10 lg:gap-12">
              <div className="min-w-0">

            {article.tldr.length > 0 && (
              <section className="my-10 border-y border-warm-border py-8 font-sans">
                <p className="ft-smallcaps text-[11px] tracking-[0.18em] font-medium text-charcoal-muted mb-4">TL;DR</p>
                <ul className="list-disc pl-5 space-y-3 text-charcoal text-[0.95rem] leading-relaxed">
                  {article.tldr.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {schoolCards.length > 0 && (
              <section className="my-10">
                <p className="ft-smallcaps text-[11px] tracking-[0.18em] font-medium text-charcoal-muted mb-4">
                  Jump to a school profile
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schoolCards.map((school) => (
                    <SchoolSnapshotCard key={school.slug} school={school} />
                  ))}
                </div>
              </section>
            )}

            <section
              className="article-content prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-charcoal prose-p:text-charcoal prose-a:text-hermes hover:prose-a:text-hermes-hover prose-li:text-charcoal"
              dangerouslySetInnerHTML={{ __html: bodySplit.before }}
            />

            <div className="my-8">
              <ReaderPulseWidget articleId={article.slug} />
            </div>

            {bodySplit.after && (
              <section
                className="article-content prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-charcoal prose-p:text-charcoal prose-a:text-hermes hover:prose-a:text-hermes-hover prose-li:text-charcoal"
                dangerouslySetInnerHTML={{ __html: bodySplit.after }}
              />
            )}

            {relatedArticles.length > 0 && (
              <section className="my-10 pt-8 border-t border-warm-border">
                <p className="ft-smallcaps text-[11px] tracking-[0.18em] font-medium text-charcoal-muted mb-5">
                  You might also be interested in
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {relatedArticles.map((related) => (
                    <Link key={related.slug} href={`/insights/${related.slug}`} className="block group">
                      <p className="ft-smallcaps text-[11px] tracking-[0.18em] font-medium text-hermes mb-2">
                        {topicTagForSlug(related.slug)}
                      </p>
                      <p className="font-display text-xl text-charcoal leading-snug group-hover:text-hermes transition-colors">
                        {related.h1}
                      </p>
                      <p className="mt-2 font-sans text-sm text-charcoal-muted line-clamp-2">
                        {related.standfirst || related.metaDescription}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {article.faqs.length > 0 && (
              <section className="mt-12">
                <h2 className="font-sans text-xl font-semibold text-charcoal mb-4 uppercase tracking-wider">FAQs</h2>
                <FaqList faqs={article.faqs} />
              </section>
            )}

            <section className="mt-10 border border-warm-border rounded-sm p-5 bg-cream-200">
              <p className="font-display text-xl text-charcoal mb-2">Get our Jakarta schools update</p>
              <p className="text-charcoal-muted mb-4">
                Fees, admissions and rankings, direct to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2.5 rounded-sm border border-warm-border bg-cream-50 text-charcoal"
                />
                <button className="px-5 py-2.5 bg-hermes text-white rounded-sm hover:bg-hermes-hover transition-colors">
                  Subscribe
                </button>
              </div>
            </section>

            <WasHelpful />

            <div className="mt-10">
              <ShareButton variant="article" url={`${BASE_URL}/insights/${article.slug}`} title={article.titleTag} />
            </div>

            <section className="mt-10 p-5 border border-warm-border rounded-sm bg-cream-200">
              <p className="font-display text-xl text-charcoal mb-2">About the author</p>
              <p className="text-charcoal-muted">
                Mia Windsor is the Managing Editor of The International Schools Guide. She covers school fees, admissions, curriculum and relocation in Jakarta.
              </p>
            </section>

            <footer className="mt-12 pt-8 border-t border-warm-border text-sm text-charcoal-muted font-sans space-y-3">
              <p>{article.date}</p>
              {article.exchangeRateNote && <p>{article.exchangeRateNote}</p>}
              <p>{article.accuracyDisclaimer ?? standardAccuracyDisclaimer}</p>
              {article.slug !== "best-international-schools-jakarta" && (
                <p>
                  <Link href="/insights/" className="text-hermes hover:underline">
                    Back to Insights
                  </Link>
                </p>
              )}
            </footer>
              </div>

              {article.toc.length > 0 && (
                <aside className="hidden lg:block">
                  <nav className="sticky top-24 font-sans pt-2" aria-label="In this article">
                    <p className="ft-smallcaps text-[11px] tracking-[0.18em] font-medium text-charcoal-muted mb-4">
                      In this article
                    </p>
                    <ul className="space-y-2 text-sm text-charcoal">
                      {article.toc.map((item) => (
                        <li key={item.id}>
                          <a href={`#${item.id}`} className="hover:text-hermes transition-colors">
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </aside>
              )}
            </div>

            {article.toc.length > 0 && <FloatingToc items={article.toc} />}
          </div>
        </div>
      </article>
    </>
  );
}

