import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News — International Schools Guide",
  description:
    "The latest news on international schools in Jakarta and across Asia. Independent reporting on admissions, rankings, openings, and the education market.",
};

// ═══════════════════════════════════════════════════════
// HARDCODED CONTENT — wire to CMS later
// ═══════════════════════════════════════════════════════

interface NewsArticle {
  slug: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  imageAlt: string;
  tags?: string[];
}

// Category colour helper — matches insights page
function categoryColour(cat: string): string {
  switch (cat.toUpperCase()) {
    case "FEES":
      return "text-hermes";
    case "RANKINGS":
      return "text-emerald-700";
    case "NEWS":
      return "text-blue-700";
    case "OPENINGS":
      return "text-amber-700";
    case "ADMISSIONS":
      return "text-violet-700";
    case "MARKET":
      return "text-rose-700";
    case "REGULATION":
      return "text-cyan-700";
    default:
      return "text-charcoal-muted";
  }
}

// ─── Lead story ───
const LEAD_STORY: NewsArticle = {
  slug: "isj-claims-top-ranking-jakarta",
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
};

// ─── Top stories (appear below lead) ───
const TOP_STORIES: NewsArticle[] = [
  {
    slug: "jis-fee-increase-2026-27",
    title: "Jakarta Intercultural School confirms 6% fee rise for 2026–27",
    summary:
      "JIS becomes the latest Jakarta school to announce above-inflation fee increases, citing infrastructure investment and teacher retention costs.",
    author: "Editorial",
    date: "15 February 2026",
    readTime: "2 min read",
    category: "FEES",
    imageAlt: "JIS campus aerial view",
  },
  {
    slug: "new-british-school-bsd-city-opening",
    title: "New British school confirmed for BSD City with August 2026 opening",
    summary:
      "A UK education group has secured permits for a British curriculum school in Greater Jakarta's southern corridor, adding to competition in Tangerang.",
    author: "Editorial",
    date: "12 February 2026",
    readTime: "2 min read",
    category: "OPENINGS",
    imageAlt: "BSD City development area",
  },
  {
    slug: "mentari-ib-results-record",
    title: "Mentari Intercultural School posts record IB results",
    summary:
      "The mid-range IB school reports its highest-ever diploma average of 34.2, narrowing the gap with more established competitors.",
    author: "Editorial",
    date: "10 February 2026",
    readTime: "2 min read",
    category: "RANKINGS",
    imageAlt: "Students celebrating results",
  },
  {
    slug: "jakarta-admissions-2026-oversubscribed",
    title: "Three Jakarta international schools report oversubscribed Year 7 intake",
    summary:
      "JIS, BSJ, and ACG all report waitlists for secondary entry in 2026–27, prompting earlier application timelines.",
    author: "Editorial",
    date: "8 February 2026",
    readTime: "2 min read",
    category: "ADMISSIONS",
    imageAlt: "School admissions office",
  },
];

// ─── Editor's Picks ───
const EDITORS_PICKS: NewsArticle[] = [
  {
    slug: "choosing-international-school-jakarta",
    title: "How to Choose an International School in Jakarta: The Complete Guide",
    summary: "",
    author: "Editorial",
    date: "20 January 2026",
    readTime: "12 min read",
    category: "GUIDE",
    imageAlt: "Family visiting school",
  },
  {
    slug: "ib-vs-a-levels-which-is-right",
    title: "IB vs A-Levels: Which Curriculum Is Right for Your Child?",
    summary: "",
    author: "Editorial",
    date: "8 January 2026",
    readTime: "9 min read",
    category: "GUIDE",
    imageAlt: "Student studying",
  },
  {
    slug: "fees-comparison-southeast-asia-2025",
    title: "International School Fees Across Southeast Asia: 2025 Comparison",
    summary: "",
    author: "Editorial",
    date: "15 January 2026",
    readTime: "10 min read",
    category: "FEES",
    imageAlt: "Southeast Asia map",
  },
];

// ─── Most Read ───
const MOST_READ: { slug: string; title: string }[] = [
  {
    slug: "isj-claims-top-ranking-jakarta",
    title: "Independent School of Jakarta claims top ranking on international schools platform",
  },
  {
    slug: "jis-fee-increase-2026-27",
    title: "Jakarta Intercultural School confirms 6% fee rise for 2026–27",
  },
  {
    slug: "ib-vs-a-levels-which-is-right",
    title: "IB vs A-Levels: Which Curriculum Is Right for Your Child?",
  },
  {
    slug: "choosing-international-school-jakarta",
    title: "How to Choose an International School in Jakarta",
  },
  {
    slug: "singapore-school-fees-2026",
    title: "Singapore International School Fees Are Now the Highest in Asia",
  },
];

// ─── Spotlight / Feature ───
const SPOTLIGHT: NewsArticle = {
  slug: "teacher-retention-international-schools",
  title: "Teacher Turnover at International Schools: Why It Matters",
  summary:
    "High staff turnover is one of the biggest hidden quality indicators. We explain what to look for and which Jakarta schools retain teachers best.",
  author: "Editorial",
  date: "5 December 2025",
  readTime: "8 min read",
  category: "MARKET",
  imageAlt: "Teachers in staff room",
};

// ─── More News grid ───
const MORE_NEWS: NewsArticle[] = [
  {
    slug: "singapore-school-fees-2026",
    title: "Singapore International School Fees Cross US$40K Average",
    summary:
      "Top-tier Singapore schools now charge more than any other Asian city. Where does value still exist?",
    author: "Editorial",
    date: "18 December 2025",
    readTime: "7 min read",
    category: "FEES",
    imageAlt: "Singapore school campus",
  },
  {
    slug: "indonesia-education-regulation-2026",
    title: "Indonesia Tightens Rules on International School Naming",
    summary:
      "New regulations require schools using 'international' in their name to meet specific accreditation and staffing thresholds.",
    author: "Editorial",
    date: "3 February 2026",
    readTime: "3 min read",
    category: "REGULATION",
    imageAlt: "Indonesian government building",
  },
  {
    slug: "expat-numbers-jakarta-2026",
    title: "Expat Numbers in Jakarta Rise 12% Year-on-Year",
    summary:
      "Indonesia's easing of visa rules and IKN development drive increased international family arrivals, boosting school demand.",
    author: "Editorial",
    date: "1 February 2026",
    readTime: "3 min read",
    category: "MARKET",
    imageAlt: "Jakarta skyline",
  },
  {
    slug: "acg-school-jakarta-expansion",
    title: "ACG School Jakarta Announces Senior Campus Expansion",
    summary:
      "The Inspired Group school will add new science labs and a sixth-form centre as it pushes for IB Diploma authorisation.",
    author: "Editorial",
    date: "28 January 2026",
    readTime: "2 min read",
    category: "OPENINGS",
    imageAlt: "School construction",
  },
  {
    slug: "bangkok-vs-jakarta-schools",
    title: "Bangkok vs Jakarta: Where Are International Schools Better Value?",
    summary:
      "Two of Southeast Asia's biggest expat hubs compared on fees, quality, curriculum choice, and lifestyle.",
    author: "Editorial",
    date: "28 November 2025",
    readTime: "10 min read",
    category: "MARKET",
    imageAlt: "City comparison",
  },
  {
    slug: "learning-support-international-schools",
    title: "Learning Support at International Schools: What to Ask Before You Enrol",
    summary:
      "Not all schools offer the same level of learning support. Here's how to assess provision before committing.",
    author: "Editorial",
    date: "15 November 2025",
    readTime: "7 min read",
    category: "ADMISSIONS",
    imageAlt: "Student receiving support",
  },
];

// ═══════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════

function ImagePlaceholder({
  alt,
  className = "",
}: {
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-cream-200 flex items-center justify-center ${className}`}
    >
      <span className="text-xs text-charcoal-muted/40 uppercase tracking-wide text-center px-4">
        {alt}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════

export default function NewsPage() {
  return (
    <>
      {/* ─── Thin header band ─── */}
      <section className="border-b border-warm-border bg-cream-50">
        <div className="container-site py-5">
          <h1 className="font-display text-3xl md:text-4xl text-charcoal">
            News
          </h1>
        </div>
      </section>

      {/* ─── Top Stories + Editor's Picks ─── */}
      <section className="container-site pt-10 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left: Top Stories (8 cols) */}
          <div className="lg:col-span-8">
            <h2 className="text-xs uppercase tracking-widest text-charcoal-muted mb-6 font-semibold">
              Top Stories
            </h2>

            {/* Lead story — large card */}
            <Link
              href={`/news/${LEAD_STORY.slug}`}
              className="group block card-title-hover mb-8"
            >
              <div className="border-b border-warm-border pb-8">
                <ImagePlaceholder
                  alt={LEAD_STORY.imageAlt}
                  className="aspect-[16/9] mb-5 rounded-sm"
                />
                <span
                  className={`text-xs font-semibold uppercase tracking-widest ${categoryColour(LEAD_STORY.category)} mb-2 block`}
                >
                  {LEAD_STORY.category}
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-charcoal mb-3 leading-tight transition-colors">
                  {LEAD_STORY.title}
                </h3>
                <p className="text-charcoal-muted leading-relaxed mb-3 max-w-2xl">
                  {LEAD_STORY.summary}
                </p>
                <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                  <span className="font-medium text-charcoal">
                    {LEAD_STORY.author}
                  </span>
                  <span>·</span>
                  <span>{LEAD_STORY.date}</span>
                  <span>·</span>
                  <span>{LEAD_STORY.readTime}</span>
                </div>
              </div>
            </Link>

            {/* Secondary stories — compact list */}
            <div className="space-y-0 divide-y divide-warm-border">
              {TOP_STORIES.map((story) => (
                <Link
                  key={story.slug}
                  href={`/news/${story.slug}`}
                  className="group block card-title-hover py-5 first:pt-0"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-3">
                      <span
                        className={`text-xs font-semibold uppercase tracking-widest ${categoryColour(story.category)} mb-1.5 block`}
                      >
                        {story.category}
                      </span>
                      <h3 className="font-display text-lg md:text-xl text-charcoal mb-2 leading-snug transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-charcoal-muted text-sm leading-relaxed line-clamp-2 mb-2">
                        {story.summary}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                        <span>{story.date}</span>
                        <span>·</span>
                        <span>{story.readTime}</span>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:col-span-1">
                      <ImagePlaceholder
                        alt={story.imageAlt}
                        className="aspect-square rounded-sm"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Editor's Picks + Most Read (4 cols) */}
          <aside className="lg:col-span-4 lg:border-l lg:border-warm-border lg:pl-8">
            {/* Editor's Picks */}
            <div className="mb-10">
              <h2 className="text-xs uppercase tracking-widest text-charcoal-muted mb-6 font-semibold flex items-center gap-2">
                <span className="w-4 h-0.5 bg-hermes inline-block"></span>
                Editor&apos;s Picks
              </h2>
              <div className="space-y-0 divide-y divide-warm-border">
                {EDITORS_PICKS.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/insights/${article.slug}`}
                    className="group block card-title-hover py-4 first:pt-0"
                  >
                    <span
                      className={`text-xs font-semibold uppercase tracking-widest ${categoryColour(article.category)} mb-1 block`}
                    >
                      {article.category}
                    </span>
                    <h3 className="font-display text-base text-charcoal leading-snug transition-colors mb-1">
                      {article.title}
                    </h3>
                    <span className="text-xs text-charcoal-muted">
                      {article.readTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Most Read */}
            <div>
              <h2 className="text-xs uppercase tracking-widest text-charcoal-muted mb-6 font-semibold flex items-center gap-2">
                <span className="w-4 h-0.5 bg-hermes inline-block"></span>
                Most Read
              </h2>
              <ol className="space-y-0 divide-y divide-warm-border">
                {MOST_READ.map((article, i) => (
                  <li key={article.slug}>
                    <Link
                      href={`/news/${article.slug}`}
                      className="group block card-title-hover py-3.5 first:pt-0 flex items-start gap-4"
                    >
                      <span className="font-display text-2xl text-cream-300 leading-none pt-0.5 min-w-[28px]">
                        {i + 1}
                      </span>
                      <h3 className="font-display text-sm text-charcoal leading-snug transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="container-site">
        <hr className="border-warm-border" />
      </div>

      {/* ─── Spotlight / Feature ─── */}
      <section className="container-site py-10">
        <h2 className="text-xs uppercase tracking-widest text-charcoal-muted mb-6 font-semibold flex items-center gap-2">
          <span className="w-4 h-0.5 bg-hermes inline-block"></span>
          Spotlight
        </h2>
        <Link
          href={`/insights/${SPOTLIGHT.slug}`}
          className="group block card-title-hover"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream-50 border border-warm-border rounded-sm overflow-hidden">
            <ImagePlaceholder
              alt={SPOTLIGHT.imageAlt}
              className="aspect-[16/10] md:aspect-auto md:min-h-[280px]"
            />
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <span
                className={`text-xs font-semibold uppercase tracking-widest ${categoryColour(SPOTLIGHT.category)} mb-2 block`}
              >
                {SPOTLIGHT.category}
              </span>
              <h3 className="font-display text-xl md:text-2xl text-charcoal mb-3 leading-snug transition-colors">
                {SPOTLIGHT.title}
              </h3>
              <p className="text-charcoal-muted text-sm leading-relaxed mb-4">
                {SPOTLIGHT.summary}
              </p>
              <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                <span>{SPOTLIGHT.date}</span>
                <span>·</span>
                <span>{SPOTLIGHT.readTime}</span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ─── Divider ─── */}
      <div className="container-site">
        <hr className="border-warm-border" />
      </div>

      {/* ─── More News grid ─── */}
      <section className="container-site py-10">
        <h2 className="text-xs uppercase tracking-widest text-charcoal-muted mb-8 font-semibold">
          More News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0 divide-y md:divide-y-0 divide-warm-border">
          {MORE_NEWS.map((story) => (
            <Link
              key={story.slug}
              href={`/news/${story.slug}`}
              className="group block card-title-hover py-6 md:py-0 md:mb-8"
            >
              <ImagePlaceholder
                alt={story.imageAlt}
                className="aspect-[16/10] mb-4 rounded-sm hidden md:flex"
              />
              <span
                className={`text-xs font-semibold uppercase tracking-widest ${categoryColour(story.category)} mb-1.5 block`}
              >
                {story.category}
              </span>
              <h3 className="font-display text-lg text-charcoal mb-2 leading-snug transition-colors">
                {story.title}
              </h3>
              <p className="text-charcoal-muted text-sm leading-relaxed line-clamp-2 mb-2">
                {story.summary}
              </p>
              <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                <span>{story.date}</span>
                <span>·</span>
                <span>{story.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center pt-4">
          <button className="px-8 py-3 border border-charcoal text-charcoal text-sm font-medium rounded-full hover:bg-charcoal hover:text-cream transition-colors">
            Load more
          </button>
        </div>
      </section>

      {/* ─── Newsletter CTA ─── */}
      <section className="bg-charcoal text-cream py-16">
        <div className="container-site text-center max-w-xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            Don&apos;t miss a story
          </h2>
          <p className="text-cream-300 mb-8 leading-relaxed">
            School news, fee updates, and market intelligence — delivered to
            your inbox every fortnight.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-sm bg-white/10 border border-white/20 text-cream placeholder:text-cream-400 focus:outline-none focus:border-hermes"
            />
            <button className="px-6 py-3 bg-hermes text-white font-semibold rounded-sm hover:bg-hermes-hover transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-cream-400 mt-4">
            Join 2,400+ expat parents already subscribed
          </p>
        </div>
      </section>
    </>
  );
}
