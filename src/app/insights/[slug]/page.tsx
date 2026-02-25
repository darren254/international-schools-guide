import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/share/ShareButton";
import { WasHelpful } from "@/components/insights/WasHelpful";
import { FaqList } from "@/components/insights/FaqAccordion";
import { SchoolSnapshotCard } from "@/components/insights/SchoolSnapshotCard";
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

function splitBodyForMidInsert(html: string): { before: string; after: string } {
  const headingMatches: { index: number; text: string }[] = [];
  const headingRegex = /<\/h2>/gi;
  let headingMatch: RegExpExecArray | null;
  while ((headingMatch = headingRegex.exec(html)) !== null) {
    headingMatches.push({ index: headingMatch.index, text: headingMatch[0] });
  }
  if (headingMatches.length >= 2) {
    const splitAt = headingMatches[1].index + headingMatches[1].text.length;
    return { before: html.slice(0, splitAt), after: html.slice(splitAt) };
  }

  const paragraphMatches: { index: number; text: string }[] = [];
  const paragraphRegex = /<\/p>/gi;
  let paragraphMatch: RegExpExecArray | null;
  while ((paragraphMatch = paragraphRegex.exec(html)) !== null) {
    paragraphMatches.push({ index: paragraphMatch.index, text: paragraphMatch[0] });
  }
  if (paragraphMatches.length >= 4) {
    const splitAt = paragraphMatches[3].index + paragraphMatches[3].text.length;
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
  const bodySplit = splitBodyForMidInsert(article.bodyHtml);
  const heroImage = getInsightImageUrl(article.slug, "hero");
  const inlineImage = getInsightImageUrl(article.slug, "inline");
  const standardAccuracyDisclaimer =
    "We work hard to make every figure, date and description on this page accurate. We don't always get it right. If you spot an error - a fee that's changed, a fact that's out of date, something we've got wrong - please tell us. Use the feedback button above or email us directly. We'll check it and update the article.";

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
              {article.breadcrumbs}
            </nav>

            <p className="text-xs uppercase tracking-widest text-charcoal-muted mb-3">{article.categoryTag}</p>
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

          <div className="max-w-[760px] mx-auto">

            {article.tldr.length > 0 && (
              <section className="bg-cream-50 border-l-4 border-hermes py-4 px-5 mt-8 mb-8 font-sans">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-3">TL;DR</p>
                <ul className="list-disc pl-5 space-y-2 text-charcoal">
                  {article.tldr.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {article.toc.length > 0 && (
              <nav className="font-sans mb-8 pb-8 border-b border-warm-border" aria-label="In this article">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-3">In this article</p>
                <ul className="space-y-2 text-sm text-charcoal">
                  {article.toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-hermes hover:underline">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <section
              className="article-content prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-charcoal prose-p:text-charcoal prose-a:text-hermes hover:prose-a:text-hermes-hover prose-li:text-charcoal"
              dangerouslySetInnerHTML={{ __html: bodySplit.before }}
            />

            {schoolCards.length > 0 && (
              <section className="my-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-3">
                  Schools mentioned in this article
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schoolCards.slice(0, 3).map((school) => (
                    <SchoolSnapshotCard key={school.slug} school={school} />
                  ))}
                </div>
              </section>
            )}

            <div className="my-8">
              <ReaderPulseWidget articleId={article.slug} />
            </div>

            {inlineImage && (
              <div className="my-8">
                <Image
                  src={inlineImage}
                  alt={`${article.h1} illustration`}
                  width={1400}
                  height={900}
                  className="w-full h-auto rounded-sm object-cover"
                />
              </div>
            )}

            {relatedArticles.length > 0 && (
              <section className="my-8 p-4 border border-warm-border rounded-sm bg-cream-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-3">
                  You might also be interested in
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/insights/${related.slug}`}
                      className="block p-3 border border-warm-border rounded-sm bg-cream-50 hover:bg-cream-300 transition-colors"
                    >
                      <p className="text-xs text-charcoal-muted mb-1">{related.categoryTag}</p>
                      <p className="font-display text-lg text-charcoal leading-snug">{related.h1}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {bodySplit.after && (
              <section
                className="article-content prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-charcoal prose-p:text-charcoal prose-a:text-hermes hover:prose-a:text-hermes-hover prose-li:text-charcoal"
                dangerouslySetInnerHTML={{ __html: bodySplit.after }}
              />
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

            {schoolCards.length > 0 && (
              <section className="mt-10">
                <h2 className="font-sans text-xl font-semibold text-charcoal mb-4 uppercase tracking-wider">
                  Explore school profiles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schoolCards.map((school) => (
                    <SchoolSnapshotCard key={school.slug} school={school} />
                  ))}
                </div>
              </section>
            )}

            <footer className="mt-12 pt-8 border-t border-warm-border text-sm text-charcoal-muted font-sans space-y-3">
              <p>{article.date}</p>
              {article.exchangeRateNote && <p>{article.exchangeRateNote}</p>}
              <p>{article.accuracyDisclaimer ?? standardAccuracyDisclaimer}</p>
              <p>
                Back to hub:{" "}
                <Link href="/insights/best-international-schools-jakarta" className="text-hermes hover:underline">
                  /insights/best-international-schools-jakarta
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </article>
    </>
  );
}

