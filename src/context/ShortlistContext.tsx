"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "isg-shortlist";
const MAX_PER_CITY = 4;

/** Per-city shortlist: citySlug -> array of school slugs (max 4 per city). */
export type ShortlistByCity = Record<string, string[]>;

type ShortlistContextValue = {
  /** All shortlisted slugs across all cities (for header count, etc.) */
  shortlistedSlugs: string[];
  /** Shortlist for a single city. Use for city page and compare view. */
  shortlistedSlugsForCity: (citySlug: string) => string[];
  addToShortlist: (slug: string, citySlug: string) => void;
  removeFromShortlist: (slug: string, citySlug: string) => void;
  /** Toggle in a city. If citySlug omitted, removes from whichever city has it (e.g. header). */
  toggleShortlist: (slug: string, citySlug?: string) => void;
  /** True if slug is shortlisted in any city */
  isShortlisted: (slug: string) => boolean;
  /** True if slug is shortlisted in the given city */
  isShortlistedInCity: (slug: string, citySlug: string) => boolean;
  /** City slugs that have at least one shortlisted school */
  citiesWithShortlist: string[];
};

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

function loadFromStorage(): ShortlistByCity {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Legacy: was a flat array; cannot infer city, start fresh
      return {};
    }
    if (parsed && typeof parsed === "object") {
      const result: ShortlistByCity = {};
      for (const [city, slugs] of Object.entries(parsed)) {
        if (typeof city === "string" && Array.isArray(slugs)) {
          result[city] = slugs.filter((x) => typeof x === "string").slice(0, MAX_PER_CITY);
        }
      }
      return result;
    }
    return {};
  } catch {
    return {};
  }
}

function saveToStorage(data: ShortlistByCity) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const [shortlistByCity, setShortlistByCity] = useState<ShortlistByCity>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setShortlistByCity(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(shortlistByCity);
  }, [shortlistByCity, hydrated]);

  const shortlistedSlugs = useMemo(
    () => Array.from(new Set(Object.values(shortlistByCity).flat())),
    [shortlistByCity]
  );

  const shortlistedSlugsForCity = useCallback(
    (citySlug: string) => shortlistByCity[citySlug] ?? [],
    [shortlistByCity]
  );

  const addToShortlist = useCallback((slug: string, citySlug: string) => {
    setShortlistByCity((prev) => {
      const list = prev[citySlug] ?? [];
      if (list.includes(slug)) return prev;
      if (list.length >= MAX_PER_CITY) return prev;
      return { ...prev, [citySlug]: [...list, slug] };
    });
  }, []);

  const removeFromShortlist = useCallback((slug: string, citySlug: string) => {
    setShortlistByCity((prev) => {
      const list = prev[citySlug];
      if (!list) return prev;
      const next = list.filter((s) => s !== slug);
      if (next.length === 0) {
        const { [citySlug]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [citySlug]: next };
    });
  }, []);

  const toggleShortlist = useCallback((slug: string, citySlug?: string) => {
    if (citySlug) {
      setShortlistByCity((prev) => {
        const list = prev[citySlug] ?? [];
        const has = list.includes(slug);
        if (has) {
          const next = list.filter((s) => s !== slug);
          if (next.length === 0) {
            const { [citySlug]: _, ...rest } = prev;
            return rest;
          }
          return { ...prev, [citySlug]: next };
        }
        if (list.length >= MAX_PER_CITY) return prev;
        return { ...prev, [citySlug]: [...list, slug] };
      });
    } else {
      // Remove from whichever city has it
      setShortlistByCity((prev) => {
        for (const [c, list] of Object.entries(prev)) {
          if (list.includes(slug)) {
            const next = list.filter((s) => s !== slug);
            if (next.length === 0) {
              const { [c]: _, ...rest } = prev;
              return rest;
            }
            return { ...prev, [c]: next };
          }
        }
        return prev;
      });
    }
  }, []);

  const isShortlisted = useCallback(
    (slug: string) => shortlistedSlugs.includes(slug),
    [shortlistedSlugs]
  );

  const isShortlistedInCity = useCallback(
    (slug: string, citySlug: string) => (shortlistByCity[citySlug] ?? []).includes(slug),
    [shortlistByCity]
  );

  const citiesWithShortlist = useMemo(
    () => Object.keys(shortlistByCity).filter((c) => (shortlistByCity[c]?.length ?? 0) > 0),
    [shortlistByCity]
  );

  const value = useMemo(
    () => ({
      shortlistedSlugs,
      shortlistedSlugsForCity,
      addToShortlist,
      removeFromShortlist,
      toggleShortlist,
      isShortlisted,
      isShortlistedInCity,
      citiesWithShortlist,
    }),
    [
      shortlistedSlugs,
      shortlistedSlugsForCity,
      addToShortlist,
      removeFromShortlist,
      toggleShortlist,
      isShortlisted,
      isShortlistedInCity,
      citiesWithShortlist,
    ]
  );

  return (
    <ShortlistContext.Provider value={value}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) {
    throw new Error("useShortlist must be used within ShortlistProvider");
  }
  return ctx;
}

export function useShortlistOptional() {
  return useContext(ShortlistContext);
}
