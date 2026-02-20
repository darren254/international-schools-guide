import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Expert analysis on international school fees, exam results, admissions trends, and expat education across Asia. Independent research for families.",
  alternates: { canonical: "https://international-schools-guide.com/insights" },
  openGraph: {
    title: "Insights — International Schools Guide",
    description:
      "Expert analysis on international school fees, exam results, admissions trends, and expat education across Asia. Independent research for families.",
    url: "https://international-schools-guide.com/insights",
  },
};

// ═══════════════════════════════════════════════════════
// HARDCODED CONTENT — wire to CMS later
// ═══════════════════════════════════════════════════════

interface Article {
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  imageAlt: string;
}

const HERO_ARTICLE: Article = {
  slug: "jakarta-fee-increases-2026-27",
  title: "Jakarta Schools Announce 2026–27 Fee Increases: What Parents Need to Know",
  summary:
    "Annual tuition at Jakarta's top international schools is rising 4–8% for 2026–27. We break down the changes school by school, compare the real cost over a full K–12 journey, and explain what's driving the increases.",
  category: "FEES",
  date: "12 Feb 2026",
  readTime: "8 min read",
  imageAlt: "Jakarta school campus aerial view",
};

const FEATURED_PAIR: Article[] = [
  {
    slug: "ib-results-jakarta-2025",
    title: "2025 IB Diploma Results: How Did Jakarta Schools Perform?",
    summary:
      "JIS, BSJ, and Mentari all posted strong IB results this year. We compare averages, pass rates, top scorers, and what the numbers actually tell parents.",
    category: "RESULTS",
    date: "28 Jan 2026",
    readTime: "6 min read",
    imageAlt: "Students celebrating exam results",
  },
  {
    slug: "new-british-school-bsd-city",
    title: "New International School Opening in BSD City, Tangerang",
    summary:
      "A British curriculum school backed by a UK education group is set to open in August 2026, adding competition in Greater Jakarta's southern corridor.",
    category: "NEWS",
    date: "5 Feb 2026",
    readTime: "4 min read",
    imageAlt: "New school construction site",
  },
];

const TOPIC_GRID: Article[] = [
  {
    slug: "best-international-schools-jakarta",
    title: "Best International Schools in Jakarta (2025) - The Expat Family Guide",
    summary:
      "Jakarta has 66 international schools serving expat families. Compare fees, curricula, and locations. Honest guide to JIS, BSJ, AIS, and 60+ other options.",
    category: "GUIDE",
    date: "20 Feb 2026",
    readTime: "15 min read",
    imageAlt: "Jakarta international schools guide",
  },
  {
    slug: "choosing-international-school-jakarta",
    title: "How to Choose an International School in Jakarta",
    summary:
      "Curriculum, fees, commute, community — a structured framework for the biggest decision expat families make.",
    category: "GUIDE",
    date: "20 Jan 2026",
    readTime: "12 min read",
    imageAlt: "Family visiting school campus",
  },
  {
    slug: "fees-comparison-southeast-asia-2025",
    title: "International School Fees in Southeast Asia: 2025 Comparison",
    summary:
      "We compared annual fees at 50 schools across Jakarta, Singapore, Bangkok, and KL.",
    category: "FEES",
    date: "15 Jan 2026",
    readTime: "10 min read",
    imageAlt: "Southeast Asia map with school data",
  },
  {
    slug: "ib-vs-a-levels-which-is-right",
    title: "IB vs A-Levels: Which Curriculum Is Right for Your Child?",
    summary:
      "Two of the most popular international curricula compared — workload, university recognition, and what parents say.",
    category: "GUIDE",
    date: "8 Jan 2026",
    readTime: "9 min read",
    imageAlt: "Student studying at desk",
  },
  {
    slug: "expat-family-relocation-jakarta",
    title: "Relocating to Jakarta with Children: The School Question",
    summary:
      "A practical timeline for families arriving in Jakarta — when to apply, what to visit, and how to shortlist.",
    category: "GUIDE",
    date: "2 Jan 2026",
    readTime: "7 min read",
    imageAlt: "Family arriving in Jakarta",
  },
];

const LATEST_ARTICLES: Article[] = [
  {
    slug: "best-international-schools-jakarta",
    title: "Best International Schools in Jakarta (2025) - The Expat Family Guide",
    summary:
      "Jakarta has 66 international schools serving expat families. Compare fees, curricula, and locations. Honest guide to JIS, BSJ, AIS, and 60+ other options.",
    category: "GUIDE",
    date: "20 Feb 2026",
    readTime: "15 min read",
    imageAlt: "Jakarta international schools guide",
  },
  {
    slug: "singapore-school-fees-2026",
    title: "Singapore International School Fees Are Now the Highest in Asia",
    summary:
      "Average annual tuition at top-tier Singapore international schools has crossed US$40K. We look at what's behind the trend and where value still exists.",
    category: "FEES",
    date: "18 Dec 2025",
    readTime: "7 min read",
    imageAlt: "Singapore school campus",
  },
  {
    slug: "admissions-timeline-jakarta-2026",
    title: "Jakarta International School Admissions: 2026–27 Key Dates",
    summary:
      "Application deadlines, assessment windows, and offer timelines for the top Jakarta schools — updated for the 2026–27 intake.",
    category: "ADMISSIONS",
    date: "12 Dec 2025",
    readTime: "5 min read",
    imageAlt: "School admissions desk",
  },
  {
    slug: "teacher-retention-international-schools",
    title: "Teacher Turnover at International Schools: Why It Matters",
    summary:
      "High staff turnover is one of the biggest hidden quality indicators. We explain what to look for and which Jakarta schools retain teachers best.",
    category: "INTELLIGENCE",
    date: "5 Dec 2025",
    readTime: "8 min read",
    imageAlt: "Teachers in staff room",
  },
  {
    slug: "bangkok-vs-jakarta-international-schools",
    title: "Bangkok vs Jakarta: Where Are International Schools Better Value?",
    summary:
      "Two of Southeast Asia's biggest expat hubs compared on fees, quality, curriculum choice, and lifestyle for families.",
    category: "COMPARISON",
    date: "28 Nov 2025",
    readTime: "10 min read",
    imageAlt: "Bangkok and Jakarta city comparison",
  },
  {
    slug: "what-ib-score-needed-top-universities",
    title: "What IB Score Do You Actually Need for a Top University?",
    summary:
      "We looked at published offers from 30 leading universities. The numbers are more nuanced than most schools tell you.",
    category: "RESULTS",
    date: "20 Nov 2025",
    readTime: "6 min read",
    imageAlt: "University campus",
  },
  {
    slug: "learning-support-international-schools-asia",
    title: "Learning Support at International Schools: What to Ask Before You Enrol",
    summary:
      "Not all schools offer the same level of learning support. Here's how to assess provision before committing to fees.",
    category: "GUIDE",
    date: "15 Nov 2025",
    readTime: "7 min read",
    imageAlt: "Student receiving learning support",
  },
];

const TOPICS = [
  "All",
  "Fees",
  "Results",
  "Admissions",
  "Guides",
  "News",
  "Comparisons",
  "Intelligence",
];

// Category colour helper
function categoryColour(cat: string): string {
  switch (cat.toUpperCase()) {
    case "FEES":
      return "text-hermes";
    case "RESULTS":
      return "text-emerald-700";
    case "NEWS":
      return "text-blue-700";
    case "GUIDE":
      return "text-amber-700";
    case "ADMISSIONS":
      return "text-violet-700";
    case "INTELLIGENCE":
      return "text-rose-700";
    case "COMPARISON":
      return "text-cyan-700";
    default:
      return "text-charcoal-muted";
  }
}

// ═══════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════

function ImagePlaceholder({ alt, className = "" }: { alt: string; className?: string }) {
  return (
    <div className={`bg-cream-200 flex items-center justify-center ${className}`}>
      <span className="text-xs text-charcoal-muted/40 uppercase tracking-wide text-center px-4">
        {alt}
      </span>
    </div>
  );
}

function ArticleCardLarge({ article }: { article: Article }) {
  return (
    <Link href={`/insights/${article.slug}`} className="group block card-title-hover">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-sm overflow-hidden border border-warm-border hover:shadow-md transition-shadow">
        <ImagePlaceholder alt={article.imageAlt} className="aspect-[16/10] lg:aspect-auto lg:min-h-[360px]" />
        <div className="p-6 lg:p-10 flex flex-col justify-center">
          <span className={`text-xs font-semibold uppercase tracking-widest ${categoryColour(article.category)} mb-3`}>
            {article.category}
          </span>
          <h3 className="font-display text-2xl lg:text-3xl text-charcoal mb-4 transition-colors leading-tight">
            {article.title}
          </h3>
          <p className="text-charcoal-muted text-base leading-relaxed mb-6">
            {article.summary}
          </p>
          <div className="flex items-center gap-3 text-xs text-charcoal-muted">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCardMedium({ article }: { article: Article }) {
  return (
    <Link href={`/insights/${article.slug}`} className="group block card-title-hover">
      <div className="bg-white rounded-sm overflow-hidden border border-warm-border hover:shadow-md transition-shadow h-full">
        <ImagePlaceholder alt={article.imageAlt} className="aspect-[16/10]" />
        <div className="p-5 lg:p-6">
          <span className={`text-xs font-semibold uppercase tracking-widest ${categoryColour(article.category)} mb-2 block`}>
            {article.category}
          </span>
          <h3 className="font-display text-xl lg:text-2xl text-charcoal mb-3 transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-charcoal-muted text-sm leading-relaxed mb-4 line-clamp-3">
            {article.summary}
          </p>
          <div className="flex items-center gap-3 text-xs text-charcoal-muted">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCardSmall({ article }: { article: Article }) {
  return (
    <Link href={`/insights/${article.slug}`} className="group block card-title-hover">
      <div className="bg-white rounded-sm overflow-hidden border border-warm-border hover:shadow-md transition-shadow h-full">
        <ImagePlaceholder alt={article.imageAlt} className="aspect-[16/10]" />
        <div className="p-4 lg:p-5">
          <span className={`text-xs font-semibold uppercase tracking-widest ${categoryColour(article.category)} mb-2 block`}>
            {article.category}
          </span>
          <h3 className="font-display text-lg text-charcoal mb-2 transition-colors leading-snug">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-charcoal-muted">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCardHorizontal({ article }: { article: Article }) {
  return (
    <Link href={`/insights/${article.slug}`} className="group block card-title-hover">
      <div className="grid grid-cols-3 gap-0 bg-white rounded-sm overflow-hidden border border-warm-border hover:shadow-md transition-shadow">
        <ImagePlaceholder alt={article.imageAlt} className="aspect-square col-span-1" />
        <div className="col-span-2 p-4 lg:p-5 flex flex-col justify-center">
          <span className={`text-xs font-semibold uppercase tracking-widest ${categoryColour(article.category)} mb-1.5`}>
            {article.category}
          </span>
          <h3 className="font-display text-base lg:text-lg text-charcoal mb-2 transition-colors leading-snug">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-charcoal-muted">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════

export default function InsightsPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-charcoal text-cream pt-20 pb-16">
        <div className="container-site">
          <p className="text-xs uppercase tracking-widest text-cream-400 mb-4">
            Insights &amp; Analysis
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            Our Insights
          </h1>
          <p className="text-cream-300 text-lg md:text-xl max-w-2xl leading-relaxed">
            Independent research, fee analysis, and expert guides — written for
            parents navigating international school decisions across Asia.
          </p>
        </div>
      </section>

      {/* ─── This Week's Highlights ─── */}
      <section className="container-site pt-14 pb-10">
        <h2 className="text-xs uppercase tracking-widest text-charcoal-muted mb-8">
          This Week&apos;s Highlights
        </h2>

        {/* Hero article — full-width card */}
        <div className="mb-8">
          <ArticleCardLarge article={HERO_ARTICLE} />
        </div>

        {/* Two medium articles side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_PAIR.map((a) => (
            <ArticleCardMedium key={a.slug} article={a} />
          ))}
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="container-site">
        <hr className="border-warm-border" />
      </div>

      {/* ─── Topic row of 4 ─── */}
      <section className="container-site py-10">
        <h2 className="text-xs uppercase tracking-widest text-charcoal-muted mb-8">
          Essential Reading
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOPIC_GRID.map((a) => (
            <ArticleCardSmall key={a.slug} article={a} />
          ))}
        </div>
      </section>

      {/* ─── Topic filter band ─── */}
      <section className="bg-cream-100 border-y border-warm-border">
        <div className="container-site py-6">
          <div className="flex flex-wrap gap-3">
            {TOPICS.map((t, i) => (
              <button
                key={t}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-charcoal text-cream"
                    : "bg-white text-charcoal border border-warm-border hover:border-charcoal"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Latest ─── */}
      <section className="container-site py-14">
        <h2 className="text-xs uppercase tracking-widest text-charcoal-muted mb-8">
          Our Latest
        </h2>

        {/* First row: 2-col medium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {LATEST_ARTICLES.slice(0, 2).map((a) => (
            <ArticleCardMedium key={a.slug} article={a} />
          ))}
        </div>

        {/* Remaining: horizontal list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {LATEST_ARTICLES.slice(2).map((a) => (
            <ArticleCardHorizontal key={a.slug} article={a} />
          ))}
        </div>

        {/* Load more */}
        <div className="text-center">
          <button className="px-8 py-3 border border-charcoal text-charcoal text-sm font-medium rounded-full hover:bg-charcoal hover:text-cream transition-colors">
            Load more articles
          </button>
        </div>
      </section>

      {/* ─── Newsletter CTA ─── */}
      <section className="bg-charcoal text-cream py-16">
        <div className="container-site text-center max-w-xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            Stay informed
          </h2>
          <p className="text-cream-300 mb-8 leading-relaxed">
            Fee updates, new school openings, results analysis — delivered to
            your inbox every fortnight. No spam. Unsubscribe anytime.
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
