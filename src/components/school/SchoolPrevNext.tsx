"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { SchoolNeighbour } from "@/data/schools";

type Props = {
  prev: SchoolNeighbour | null;
  next: SchoolNeighbour | null;
  position: number;
  total: number;
  cityName: string;
};

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="shrink-0"
    >
      <path d={direction === "left" ? "M15 18L9 12L15 6" : "M9 6L15 12L9 18"} />
    </svg>
  );
}

function navUrl(n: SchoolNeighbour) {
  return `/international-schools/${n.citySlug}/${n.slug}`;
}

export function SchoolPrevNextBar({ prev, next, position, total, cityName }: Props) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement)?.isContentEditable) return;

      if (e.key === "ArrowLeft" && prev) {
        e.preventDefault();
        window.location.href = navUrl(prev);
      } else if (e.key === "ArrowRight" && next) {
        e.preventDefault();
        window.location.href = navUrl(next);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prev, next]);

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Browse schools"
      className="flex items-center justify-between gap-2 py-2 border-b border-warm-border-light text-body-sm text-charcoal-muted"
    >
      {prev ? (
        <Link
          href={navUrl(prev)}
          rel="prev"
          aria-label={`Previous: ${prev.name}`}
          className="flex items-center gap-1.5 hover:text-primary transition-colors min-w-0"
        >
          <Arrow direction="left" />
          <span className="hidden sm:inline truncate max-w-[180px]">{prev.name}</span>
          <span className="sm:hidden">Prev</span>
        </Link>
      ) : (
        <span className="w-12" />
      )}

      <span className="text-[12px] tracking-wide text-charcoal-muted/70 whitespace-nowrap">
        {position} of {total} in {cityName}
      </span>

      {next ? (
        <Link
          href={navUrl(next)}
          rel="next"
          aria-label={`Next: ${next.name}`}
          className="flex items-center gap-1.5 hover:text-primary transition-colors min-w-0"
        >
          <span className="hidden sm:inline truncate max-w-[180px]">{next.name}</span>
          <span className="sm:hidden">Next</span>
          <Arrow direction="right" />
        </Link>
      ) : (
        <span className="w-12" />
      )}
    </nav>
  );
}

export function SchoolPrevNextBottom({ prev, next }: { prev: SchoolNeighbour | null; next: SchoolNeighbour | null }) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Previous and next school"
      className="mt-10 pt-6 border-t border-warm-border-light flex items-center justify-between gap-4"
    >
      {prev ? (
        <Link
          href={navUrl(prev)}
          rel="prev"
          aria-label={`Previous school: ${prev.name}`}
          className="group flex items-center gap-2 min-w-0 text-charcoal-muted hover:text-primary transition-colors"
        >
          <Arrow direction="left" />
          <span className="text-body-sm truncate max-w-[200px] sm:max-w-[280px]">
            {prev.name}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={navUrl(next)}
          rel="next"
          aria-label={`Next school: ${next.name}`}
          className="group flex items-center gap-2 min-w-0 text-charcoal-muted hover:text-primary transition-colors ml-auto text-right"
        >
          <span className="text-body-sm truncate max-w-[200px] sm:max-w-[280px]">
            {next.name}
          </span>
          <Arrow direction="right" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
