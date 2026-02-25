import type { Metadata } from "next";
import Link from "next/link";
import { getAllInsightArticles } from "@/lib/insights/content";

export const metadata: Metadata = {
  title: "Insights | The International Schools Guide",
  description:
    "Expert analysis on school fees, admissions, rankings, curriculum and relocation for international families in Jakarta.",
  alternates: { canonical: "https://international-schools-guide.com/insights" },
};

export default function InsightsPage() {
  const articles = getAllInsightArticles();

  return (
    <>
      <section className="bg-charcoal text-cream pt-20 pb-16">
        <div className="container-site">
          <p className="text-xs uppercase tracking-widest text-cream-400 mb-4">Insights</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">Jakarta School Insights</h1>
          <p className="text-cream-300 text-lg md:text-xl max-w-3xl leading-relaxed">
            Rankings, fees, curriculum guides, admissions and relocation advice for international families.
          </p>
        </div>
      </section>

      <section className="container-site py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="block border border-warm-border rounded-sm p-5 bg-white hover:shadow-sm transition-shadow"
            >
              <p className="text-xs uppercase tracking-wider text-charcoal-muted mb-2">{article.categoryTag}</p>
              <h2 className="font-display text-2xl text-charcoal mb-2 leading-snug">{article.h1}</h2>
              <p className="text-sm text-charcoal-muted mb-3 line-clamp-3">
                {article.metaDescription || article.standfirst}
              </p>
              <p className="text-xs text-charcoal-muted">
                {article.date} · {article.readTime}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

