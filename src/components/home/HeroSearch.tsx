"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useShortlist } from "@/context/ShortlistContext";
import { parseQuery, searchSchools, type SchoolResult } from "@/lib/help-me-choose/query-parser";
import { hasPublishableFee } from "@/lib/utils/fees";

const PROMPT_STARTERS = [
  "British schools in Jakarta under $20K",
  "Best IB schools for secondary in Jakarta",
  "Affordable schools near BSD City",
  "Schools with strong SEN support in Jakarta",
];

type CityLink = {
  slug: string;
  name: string;
  live: boolean;
  comingNext?: boolean;
};

function ShortlistBtn({ slug }: { slug: string }) {
  const { isShortlisted, toggleShortlist } = useShortlist();
  const active = isShortlisted(slug);
  return (
    <button
      onClick={() => toggleShortlist(slug)}
      className={`text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors ${
        active ? "text-hermes" : "text-charcoal-muted hover:text-hermes"
      }`}
    >
      {active ? "✓ Listed" : "Shortlist +"}
    </button>
  );
}

export function HeroSearch({ cities }: { cities: CityLink[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SchoolResult[] | null>(null);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<"empty" | "gibberish" | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("helpMeChooseQuery");
      if (stored) {
        setQuery(stored);
        const parsed = parseQuery(stored);
        const found = searchSchools(parsed);
        if (found.length > 0) {
          setSummary(parsed.summary.replace("matching", String(found.length)));
          setResults(found);
        }
      }
    } catch { /* sessionStorage unavailable */ }
  }, []);

  const runSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    if (trimmed.length < 3 || /^[^a-zA-Z]*$/.test(trimmed)) {
      setError("gibberish");
      setResults(null);
      setSummary("");
      return;
    }

    const parsed = parseQuery(trimmed);
    const found = searchSchools(parsed);

    if (found.length === 0) {
      setError("empty");
      setResults(null);
      setSummary("");
      return;
    }

    setError(null);
    setSummary(parsed.summary.replace("matching", String(found.length)));
    setResults(found);
    try { sessionStorage.setItem("helpMeChooseQuery", trimmed); } catch { /* noop */ }
  }, []);

  const handleSubmit = () => runSearch(query);
  const handlePrompt = (prompt: string) => {
    setQuery(prompt);
    runSearch(prompt);
  };
  const clearResults = () => {
    setResults(null);
    setError(null);
    setSummary("");
    setQuery("");
    try { sessionStorage.removeItem("helpMeChooseQuery"); } catch { /* noop */ }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input bar */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tell us what you're looking for..."
          className="w-full bg-warm-white border border-warm-border rounded-sm px-5 py-4 pr-24 text-[0.9375rem] text-charcoal placeholder:text-charcoal-muted/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-hermes-light focus:border-hermes transition-all"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <button
          onClick={handleSubmit}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-hermes text-white px-5 py-2 text-sm font-medium uppercase tracking-wider hover:bg-hermes-hover transition-colors rounded-sm"
        >
          Search
        </button>
      </div>

      {/* Prompt starters (only when no results) */}
      {!results && !error && (
        <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs text-charcoal-muted">
          {PROMPT_STARTERS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handlePrompt(prompt)}
              className="border border-warm-border rounded-sm px-3 py-1.5 hover:border-charcoal-muted hover:text-charcoal transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Gibberish / unclear input */}
      {error === "gibberish" && (
        <div className="mt-6 p-5 border border-warm-border rounded-sm bg-cream-50 text-center">
          <p className="text-sm text-charcoal-muted mb-3">
            We couldn&rsquo;t understand that query. Here are some examples of what you can search for:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {PROMPT_STARTERS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePrompt(prompt)}
                className="text-xs border border-warm-border rounded-sm px-3 py-1.5 hover:border-hermes hover:text-hermes transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {error === "empty" && (
        <div className="mt-6 p-5 border border-warm-border rounded-sm bg-cream-50 text-center">
          <p className="text-sm text-charcoal mb-2">
            We couldn&rsquo;t find schools matching that query.
          </p>
          <p className="text-xs text-charcoal-muted mb-4">
            Try being more specific about curriculum, location or budget — or browse all schools.
          </p>
          <Link
            href="/international-schools/jakarta/"
            className="text-sm font-medium text-hermes hover:text-hermes-hover transition-colors"
          >
            Browse all Jakarta schools →
          </Link>
        </div>
      )}

      {/* Results */}
      {results && results.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-charcoal">{summary}</p>
            <button
              onClick={clearResults}
              className="text-xs text-charcoal-muted hover:text-hermes transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {results.map((school) => (
              <div
                key={school.slug}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border border-warm-border rounded-sm bg-warm-white hover:bg-cream-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-charcoal truncate">{school.name}</span>
                    <div className="flex gap-1 flex-shrink-0">
                      {school.curriculumLabels.map((c) => (
                        <span key={c} className="text-[9px] uppercase tracking-wider text-charcoal-muted bg-cream-200 px-1.5 py-0.5 rounded-sm">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-charcoal-muted">
                    <span className={hasPublishableFee(school.feeDisplay) ? "font-medium text-charcoal" : ""}>{school.feeDisplay}</span>
                    <span>{school.area}</span>
                    {school.ibAverage && <span>IB avg {school.ibAverage}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={`/international-schools/jakarta/${school.slug}/`}
                    className="text-xs font-medium text-hermes hover:text-hermes-hover transition-colors whitespace-nowrap"
                  >
                    View Profile →
                  </Link>
                  <ShortlistBtn slug={school.slug} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Browse by city (always visible) */}
      <p className="text-sm text-charcoal-muted mt-6">
        Or browse by city:{" "}
        {cities.map((city, i) => (
          <span key={city.slug}>
            {i > 0 && <span className="mx-1.5 text-cream-400">·</span>}
            {city.live ? (
              <Link
                href={`/international-schools/${city.slug}/`}
                className="text-hermes hover:text-hermes-hover transition-colors"
              >
                {city.name}
              </Link>
            ) : (
              <span
                className={city.comingNext ? "text-charcoal-muted" : "text-charcoal-muted/70"}
                title={city.comingNext ? "Coming next" : "Coming soon"}
              >
                {city.name}
              </span>
            )}
          </span>
        ))}
      </p>

      {/* Secondary CTAs */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Link
          href="/compare"
          className="border border-charcoal text-charcoal px-6 py-2.5 text-sm font-medium uppercase tracking-wider hover:bg-charcoal hover:text-cream transition-colors rounded-sm"
        >
          Compare Schools
        </Link>
        <Link
          href="/shortlist"
          className="border border-charcoal text-charcoal px-6 py-2.5 text-sm font-medium uppercase tracking-wider hover:bg-charcoal hover:text-cream transition-colors rounded-sm"
        >
          Start Your Shortlist
        </Link>
      </div>
    </div>
  );
}
