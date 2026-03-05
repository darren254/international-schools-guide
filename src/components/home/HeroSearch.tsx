"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type CityLink = {
  slug: string;
  name: string;
  live: boolean;
  comingNext?: boolean;
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function HeroSearch({ cities }: { cities: CityLink[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const liveCities = cities.filter((c) => c.live);
  const matches = useMemo(() => {
    if (!query.trim()) return liveCities;
    const q = normalize(query);
    return liveCities.filter(
      (c) =>
        normalize(c.name).includes(q) ||
        normalize(c.slug).replace(/-/g, " ").includes(q)
    );
  }, [query, liveCities]);

  const goToCity = useCallback(
    (slug: string) => {
      setOpen(false);
      setQuery("");
      router.push(`/international-schools/${slug}/`);
    },
    [router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matches.length > 0) {
      goToCity(matches[highlightIndex]?.slug ?? matches[0].slug);
    }
  };

  useEffect(() => {
    setHighlightIndex(0);
  }, [query, matches.length]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((i) => (i + 1) % Math.max(1, matches.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((i) => (i - 1 + matches.length) % Math.max(1, matches.length));
      } else if (e.key === "Enter" && matches.length > 0) {
        goToCity(matches[highlightIndex]?.slug ?? matches[0].slug);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, matches, highlightIndex, goToCity]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="hero-city-input" className="sr-only">
            City name
          </label>
          <input
            id="hero-city-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="e.g. Jakarta, Singapore, Bangkok"
            className="w-full min-h-[48px] px-4 py-3 border border-warm-border bg-cream text-charcoal font-body text-base placeholder:text-charcoal-muted focus:outline-none focus:border-charcoal-muted rounded-none"
            autoComplete="off"
            aria-expanded={open}
            aria-controls="hero-city-listbox"
            aria-activedescendant={
              open && matches[highlightIndex]
                ? `hero-city-option-${matches[highlightIndex].slug}`
                : undefined
            }
            role="combobox"
            aria-autocomplete="list"
          />
          {open && matches.length > 0 && (
            <ul
              id="hero-city-listbox"
              role="listbox"
              className="absolute top-full left-0 right-0 mt-1 bg-warm-white border border-warm-border shadow-lg z-50 max-h-[240px] overflow-y-auto"
            >
              {matches.map((city, i) => (
                <li
                  key={city.slug}
                  id={`hero-city-option-${city.slug}`}
                  role="option"
                  aria-selected={i === highlightIndex}
                  onMouseEnter={() => setHighlightIndex(i)}
                  className={`px-4 py-3 text-body-sm font-body cursor-pointer transition-colors ${
                    i === highlightIndex ? "bg-cream-200 text-charcoal" : "text-charcoal-light hover:bg-cream-100"
                  }`}
                  onClick={() => goToCity(city.slug)}
                >
                  {city.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="min-h-[48px] px-8 py-3 bg-primary text-white text-body-sm font-semibold uppercase tracking-wider hover:bg-primary-hover transition-colors rounded-none shrink-0"
        >
          Show schools
        </button>
      </form>

      <p className="text-center text-sm text-charcoal-muted mt-6">
        Or choose a city below
      </p>
    </div>
  );
}
