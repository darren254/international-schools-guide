"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SchoolCard } from "@/components/school/SchoolCard";
import { ShareButton } from "@/components/share/ShareButton";
import { useShortlist } from "@/context/ShortlistContext";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import { ALL_SCHOOL_SLUGS } from "@/data/schools";

const profileSet = new Set(ALL_SCHOOL_SLUGS);

function ShortlistContent() {
  const searchParams = useSearchParams();
  const { shortlistedSlugs, addToShortlist } = useShortlist();
  const urlSynced = useRef(false);

  // Once per mount: if URL has ?schools=, add those to shortlist so shared links restore state
  useEffect(() => {
    if (urlSynced.current) return;
    const param = searchParams.get("schools");
    if (!param) {
      urlSynced.current = true;
      return;
    }
    const slugs = param.split(",").map((s) => s.trim()).filter(Boolean);
    slugs.forEach((slug) => addToShortlist(slug));
    urlSynced.current = true;
  }, [searchParams, addToShortlist]);

  const slugsToShow = (() => {
    const param = searchParams.get("schools");
    if (param) {
      const fromUrl = param.split(",").map((s) => s.trim()).filter(Boolean);
      if (fromUrl.length > 0) return fromUrl;
    }
    return shortlistedSlugs;
  })();

  const schools = slugsToShow
    .map((slug) => JAKARTA_SCHOOLS.find((s) => s.slug === slug))
    .filter(Boolean) as typeof JAKARTA_SCHOOLS;

  return (
    <div className="container-site">
      <nav className="py-5 text-[0.8125rem] text-charcoal-muted" aria-label="Breadcrumb">
        <Link href="/international-schools/" className="hover:text-hermes transition-colors">
          International Schools
        </Link>
        <span className="mx-1.5 opacity-50">›</span>
        <span className="text-charcoal">Shortlist</span>
      </nav>

      <section className="pb-6 border-b border-warm-border">
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-medium tracking-tight leading-tight mb-1.5">
          My shortlist
        </h1>
        <p className="text-[0.9375rem] text-charcoal-muted mb-4">
          {schools.length === 0
            ? "Schools you add from the browse page will appear here. Add schools using the bookmark or + Compare on any school card."
            : `${schools.length} school${schools.length !== 1 ? "s" : ""} · Compare them side by side or open full profiles.`}
        </p>
        {schools.length > 0 && (
          <ShareButton variant="shortlist" schoolSlugs={slugsToShow} />
        )}
      </section>

      <div className="pt-6 pb-10">
        {schools.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link
              href={`/compare?schools=${slugsToShow.slice(0, 4).join(",")}`}
              className="text-sm font-medium text-hermes hover:text-hermes-hover transition-colors uppercase tracking-wider"
            >
              Compare up to 4 schools →
            </Link>
          </div>
        )}
        <div className="space-y-4">
          {schools.map((school) => (
            <SchoolCard
              key={school.slug}
              citySlug="jakarta"
              hasProfile={profileSet.has(school.slug)}
              name={school.name}
              slug={school.slug}
              verified={school.verified}
              curricula={school.curricula}
              area={school.area}
              ageRange={school.ageRange}
              studentCount={school.studentCount}
              feeRange={school.feeRange}
              examResults={school.examResults}
              editorialSummary={school.editorialSummary}
            />
          ))}
        </div>
        {schools.length === 0 && (
          <Link
            href="/international-schools/jakarta"
            className="inline-block mt-4 text-hermes hover:text-hermes-hover font-medium text-sm uppercase tracking-wider"
          >
            Browse Jakarta schools →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ShortlistPage() {
  return (
    <Suspense fallback={<div className="container-site py-16 text-charcoal-muted">Loading…</div>}>
      <ShortlistContent />
    </Suspense>
  );
}
