"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { displayValue } from "@/lib/utils/display";
import { ShortlistActions } from "@/components/school/ShortlistActions";

interface QuickFact {
  label: string;
  value: string;
}

interface SidebarInsight {
  title: string;
  slug: string;
  readTime: string;
}

interface ProfileSidebarProps {
  slug: string;
  quickFacts: QuickFact[];
  relatedInsights: SidebarInsight[];
  citySlug: string;
}

function cityDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function ProfileSidebar({
  slug,
  quickFacts,
  relatedInsights,
  citySlug,
}: ProfileSidebarProps) {
  const cityName = cityDisplayName(citySlug);
  const cityGuideHref = `/international-schools/${citySlug}`;

  return (
    <aside className="self-start space-y-5">
      <div className="lg:sticky lg:top-[88px] bg-warm-white border border-warm-border-light border-t-2 border-t-charcoal p-6">
        <h3 className="font-display text-[1.0625rem] font-semibold mb-5">
          Quick Facts
        </h3>
        {quickFacts.map((f) => (
          <div
            key={f.label}
            className="flex justify-between py-2 border-b border-warm-border-light last:border-b-0 text-[0.8125rem]"
          >
            <span className="text-charcoal-muted">{f.label}</span>
            <span className="font-medium">{displayValue(f.value, "Not available")}</span>
          </div>
        ))}
        <div className="mt-5">
          <ShortlistActions slug={slug} fullWidth layout="column" />
        </div>
      </div>

      <div className="bg-warm-white border border-warm-border-light p-6">
        <h3 className="font-display text-[1.0625rem] font-semibold mb-4">
          {cityName} Schools Guide
        </h3>
        <p className="text-[0.8125rem] text-charcoal-muted mb-4">
          Compare schools, fees and curricula in {cityName}.
        </p>
        <Link
          href={cityGuideHref}
          className="font-display text-base font-medium text-hermes hover:text-hermes-hover transition-colors"
        >
          View all schools in {cityName} →
        </Link>
      </div>

      <div className="bg-warm-white border border-warm-border-light p-6">
        <h3 className="font-display text-[1.0625rem] font-semibold mb-4">
          Related Insights
        </h3>
        {relatedInsights.map((insight) => (
          <div key={insight.slug} className="py-3 border-b border-warm-border-light last:border-b-0">
            <Link
              href={`/insights/${insight.slug}/`}
              className="font-display text-base font-medium text-hermes hover:text-hermes-hover transition-colors"
            >
              {insight.title}
            </Link>
            <p className="text-[0.75rem] text-charcoal-muted">{insight.readTime}</p>
          </div>
        ))}
      </div>

      <div className="bg-warm-white border border-hermes p-6">
        <p className="font-display text-[1.0625rem] font-semibold mb-2">
          Are you from this school?
        </p>
        <p className="text-[0.8125rem] text-charcoal-muted mb-4 leading-relaxed">
          Accurate, up-to-date information matters to families. Update your listing or get in touch about featured opportunities.
        </p>
        <Button as="a" href="/contact/" variant="primary" fullWidth>
          Get in Touch
        </Button>
      </div>
    </aside>
  );
}
