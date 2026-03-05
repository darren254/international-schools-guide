"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function BackToResults() {
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("helpMeChooseQuery");
    setHasResults(!!stored);
  }, []);

  if (!hasResults) return null;

  return (
    <Link
      href="/#help-me-choose"
      className="inline-flex items-center gap-1 text-sm text-charcoal-muted hover:text-primary transition-colors mb-4"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18L9 12L15 6" />
      </svg>
      Back to results
    </Link>
  );
}
