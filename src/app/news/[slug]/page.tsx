import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://international-schools-guide.com";

// Static params for export - add articles as we publish them
export function generateStaticParams() {
  return [{ slug: "isj-claims-top-ranking-jakarta" }];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const canonical = `${BASE_URL}/news/${slug}`;
  return {
    title: "ISJ claims top ranking on international schools platform",
    description:
      "The British preparatory school serving students aged 2–13 has been named number one in Jakarta by what it describes as the world's leading platform.",
    alternates: { canonical },
    openGraph: {
      title: "Independent School of Jakarta claims top ranking - International Schools Guide",
      description:
        "The British preparatory school serving students aged 2–13 has been named number one in Jakarta by what it describes as the world's leading platform.",
      url: canonical,
      type: "article",
    },
  };
}

// ═══════════════════════════════════════════════════════
// ARTICLE DATA - will come from CMS/DB later
// ═══════════════════════════════════════════════════════

const ARTICLE = {
  title:
    "Independent School of Jakarta claims top ranking on international schools platform",
  summary:
    "The British preparatory school serving students aged 2–13 has been named number one in Jakarta by what it describes as the world's leading platform.",
  author: "Mia Windsor",
  date: "17 February 2026",
  readTime: "1 min read",
  category: "RANKINGS",
  imageAlt: "Independent School of Jakarta campus grounds",
  tags: ["Jakarta", "British curriculum", "school rankings"],
  source: {
    label:
      "The Independent School of Jakarta Ranked #1 in Jakarta on World's Leading International Schools Platform",
    outlet: "Florida Today",
  },
  keyFacts: [
    "Independent School of Jakarta ranked first in Jakarta",
    "British international prep school for ages 2–13",
    "Ranking from unnamed international schools platform",
  ],
};

const RELATED = [
  {
    slug: "choosing-international-school-jakarta",
    title: "How to Choose an International School in Jakarta",
    date: "20 January 2026",
    readTime: "12 min read",
  },
  {
    slug: "ib-vs-a-levels-which-is-right",
    title: "IB vs A-Levels: Which Curriculum Is Right for Your Child?",
    date: "8 January 2026",
    readTime: "9 min read",
  },
  {
    slug: "jis-fee-increase-2026-27",
    title: "Jakarta Intercultural School confirms 6% fee rise for 2026–27",
    date: "15 February 2026",
    readTime: "2 min read",
  },
];

// ═══════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════

export default function ArticlePage() {
  return (
    <>
      {/* ─── Back link ─── */}
      <div className="container-site pt-6">
        <Link
          href="/news"
          className="text-sm text-charcoal-muted hover:text-hermes transition-colors inline-flex items-center gap-1"
        >
          <span>←</span> Back to News
        </Link>
      </div>

      {/* ─── Article ─── */}
      <article className="container-site pt-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main content - 8 cols */}
          <div className="lg:col-span-8">
            {/* Category badge */}
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3 block">
              {ARTICLE.category}
            </span>

            {/* Headline */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-charcoal leading-tight mb-4">
              {ARTICLE.title}
            </h1>

            {/* Standfirst */}
            <p className="text-lg text-charcoal-muted leading-relaxed mb-6 max-w-2xl">
              {ARTICLE.summary}
            </p>

            {/* Byline */}
            <div className="flex items-center gap-3 text-sm text-charcoal-muted border-b border-warm-border pb-6 mb-8">
              <span className="font-medium text-charcoal">
                {ARTICLE.author}
              </span>
              <span>·</span>
              <time>{ARTICLE.date}</time>
              <span>·</span>
              <span>{ARTICLE.readTime}</span>
            </div>

            {/* Key Facts box */}
            <div className="bg-cream-50 border border-warm-border rounded-sm p-5 mb-8">
              <h2 className="text-xs uppercase tracking-widest text-charcoal-muted font-semibold mb-3">
                Key Facts
              </h2>
              <ul className="space-y-2">
                {ARTICLE.keyFacts.map((fact, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-charcoal leading-relaxed"
                  >
                    <span className="text-hermes mt-0.5">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            {/* Article body */}
            <div className="prose-custom space-y-5 text-charcoal leading-relaxed">
              <p>
                The Independent School of Jakarta has been ranked first in
                Jakarta on what it describes as the world&apos;s leading
                international schools platform, according to a press release
                published by Florida Today.
              </p>
              <p>
                The school, a British international preparatory institution
                serving children aged 2 to 13, did not name the platform
                responsible for the ranking in the available material. The press
                release described the campus as modern and located in leafy
                surroundings.
              </p>
              <p>
                The announcement comes as international schools in Jakarta
                compete for position in a crowded market. Several platforms now
                publish school rankings and league tables, though their
                methodologies and criteria vary significantly. Some weight
                academic results, while others factor in facilities, teacher
                qualifications, or parent satisfaction surveys.
              </p>
              <p>
                The Independent School of Jakarta follows the British curriculum
                and operates as a preparatory school, meaning students typically
                move to secondary schools elsewhere after Year 8. This model
                differs from through-schools such as Jakarta Intercultural School
                or British School Jakarta, which educate students from early
                years through to university entrance.
              </p>
              <p>
                The school did not provide detail on the ranking criteria or the
                number of Jakarta schools assessed. Florida Today published the
                statement as a press release on 15 February.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-warm-border">
              {ARTICLE.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-cream-100 text-charcoal-muted text-xs rounded-full border border-warm-border"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Source attribution */}
            <div className="mt-6 p-4 bg-cream-50 border-l-2 border-cream-300 text-sm text-charcoal-muted">
              <span className="font-medium">Commentary on:</span>{" "}
              {ARTICLE.source.label} - via {ARTICLE.source.outlet}
            </div>
          </div>

          {/* Sidebar - 4 cols */}
          <aside className="lg:col-span-4">
            {/* More News */}
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xs uppercase tracking-widest text-charcoal-muted font-semibold mb-5 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-hermes inline-block"></span>
                More News
              </h2>
              <div className="space-y-0 divide-y divide-warm-border">
                {RELATED.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/news/${article.slug}`}
                    className="group block card-title-hover py-4 first:pt-0"
                  >
                    <h3 className="font-display text-base text-charcoal leading-snug transition-colors mb-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                      <span>{article.date}</span>
                      <span>·</span>
                      <span>{article.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 p-5 bg-charcoal rounded-sm text-cream">
                <h3 className="font-display text-lg mb-2">Stay informed</h3>
                <p className="text-cream-300 text-sm mb-4 leading-relaxed">
                  School news and fee updates - delivered fortnightly.
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 rounded-sm bg-white/10 border border-white/20 text-cream text-sm placeholder:text-cream-400 focus:outline-none focus:border-hermes mb-3"
                />
                <button className="w-full px-4 py-2 bg-hermes text-white text-sm font-semibold rounded-sm hover:bg-hermes-hover transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
