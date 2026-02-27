"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type ArticleSummary = {
  slug: string;
  h1: string;
  categoryTag: string;
  city: string;
  date: string;
  readTime: string;
  metaDescription: string;
  cardImage: string | null;
};

type Props = {
  articles: ArticleSummary[];
  cities: string[];
  cityLabels: Record<string, string>;
};

function displayDate(raw: string) {
  return raw.replace(/^Originally published:\s*/i, "").trim();
}

function CardImg({ src, alt, className }: { src: string | null; alt: string; className: string }) {
  if (!src) return <div className={`${className} bg-cream-200`} aria-hidden />;
  return <Image src={src} alt={alt} width={960} height={640} className={`${className} object-cover`} />;
}

export function LatestInsightsGrid({ articles, cities, cityLabels }: Props) {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const filtered = activeCity ? articles.filter((a) => a.city === activeCity) : articles;

  return (
    <div className="mt-10">
      <h2 className="font-display text-3xl text-charcoal mb-4 border-t-2 border-charcoal pt-3">Latest analysis</h2>

      {cities.length > 1 && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs uppercase tracking-[0.14em] text-charcoal-muted font-medium">City:</span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCity(null)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm border transition-colors ${
                activeCity === null
                  ? "bg-charcoal text-cream border-charcoal"
                  : "text-charcoal-muted border-warm-border hover:border-charcoal-muted"
              }`}
            >
              All cities
            </button>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city === activeCity ? null : city)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm border transition-colors ${
                  activeCity === city
                    ? "bg-charcoal text-cream border-charcoal"
                    : "text-charcoal-muted border-warm-border hover:border-charcoal-muted"
                }`}
              >
                {cityLabels[city] ?? city}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {filtered.map((article) => (
          <Link key={article.slug} href={`/insights/${article.slug}`} className="block border-b border-warm-border pb-4">
            <CardImg src={article.cardImage} alt={article.h1} className="w-full h-28 mb-3 rounded-sm" />
            <p className="text-[11px] uppercase tracking-[0.12em] text-charcoal-muted mb-1">{article.categoryTag}</p>
            <h3 className="font-display text-xl text-charcoal leading-snug mb-2">{article.h1}</h3>
            <p className="text-xs text-charcoal-muted">
              {displayDate(article.date)} · {article.readTime}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-charcoal-muted py-8 text-center">No articles for this city yet.</p>
      )}
    </div>
  );
}
