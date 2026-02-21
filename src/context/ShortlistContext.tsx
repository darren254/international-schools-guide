"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "isg-shortlist";

type ShortlistContextValue = {
  shortlistedSlugs: string[];
  addToShortlist: (slug: string) => void;
  removeFromShortlist: (slug: string) => void;
  toggleShortlist: (slug: string) => void;
  isShortlisted: (slug: string) => boolean;
};

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveToStorage(slugs: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // ignore
  }
}

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const [shortlistedSlugs, setShortlistedSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setShortlistedSlugs(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(shortlistedSlugs);
  }, [shortlistedSlugs, hydrated]);

  const addToShortlist = useCallback((slug: string) => {
    setShortlistedSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const removeFromShortlist = useCallback((slug: string) => {
    setShortlistedSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const toggleShortlist = useCallback((slug: string) => {
    setShortlistedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const isShortlisted = useCallback(
    (slug: string) => shortlistedSlugs.includes(slug),
    [shortlistedSlugs]
  );

  const value = useMemo(
    () => ({
      shortlistedSlugs,
      addToShortlist,
      removeFromShortlist,
      toggleShortlist,
      isShortlisted,
    }),
    [shortlistedSlugs, addToShortlist, removeFromShortlist, toggleShortlist, isShortlisted]
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
