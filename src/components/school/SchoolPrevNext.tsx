"use client";

import Link from "next/link";
import type { SchoolNeighbour } from "@/data/schools";

type Props = {
  prev: SchoolNeighbour | null;
  next: SchoolNeighbour | null;
};

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
      <path d="M15 18L9 12L15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
      <path d="M9 6L15 12L9 18" />
    </svg>
  );
}

export function SchoolPrevNext({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Previous and next school"
      className="mt-10 pt-6 border-t border-warm-border-light flex items-center justify-between gap-4"
    >
      {prev ? (
        <Link
          href={`/international-schools/${prev.citySlug}/${prev.slug}`}
          rel="prev"
          aria-label={`Previous school: ${prev.name}`}
          className="group flex items-center gap-2 min-w-0 text-charcoal-muted hover:text-primary transition-colors"
        >
          <ChevronLeft />
          <span className="text-body-sm truncate max-w-[200px] sm:max-w-[280px]">
            {prev.name}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={`/international-schools/${next.citySlug}/${next.slug}`}
          rel="next"
          aria-label={`Next school: ${next.name}`}
          className="group flex items-center gap-2 min-w-0 text-charcoal-muted hover:text-primary transition-colors ml-auto text-right"
        >
          <span className="text-body-sm truncate max-w-[200px] sm:max-w-[280px]">
            {next.name}
          </span>
          <ChevronRight />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
