import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface RelatedInsight {
  title: string;
  slug: string;
  readTime: string;
}

interface RelatedContentProps {
  citySlug: string;
  cityName: string;
  relatedInsights: RelatedInsight[];
}

export function RelatedContent({
  citySlug,
  cityName,
  relatedInsights,
}: RelatedContentProps) {
  const cityGuideHref = `/international-schools/${citySlug}`;
  const hasInsights = relatedInsights.length > 0;

  return (
    <section id="related" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader label="Further Reading" title="Related Content" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-warm-white border border-warm-border-light p-6">
          <h3 className="font-display text-base font-semibold mb-3">
            {cityName} Schools Guide
          </h3>
          <p className="text-body-xs text-charcoal-muted mb-4">
            Compare schools, fees and curricula in {cityName}.
          </p>
          <Link
            href={cityGuideHref}
            className="font-display text-body-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            View all schools in {cityName} →
          </Link>
        </div>

        {hasInsights && (
          <div className="bg-warm-white border border-warm-border-light p-6">
            <h3 className="font-display text-base font-semibold mb-3">
              Related Insights
            </h3>
            {relatedInsights.map((insight) => (
              <div
                key={insight.slug}
                className="py-2.5 border-b border-warm-border-light last:border-b-0"
              >
                <Link
                  href={`/insights/${insight.slug}/`}
                  className="font-display text-body-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  {insight.title}
                </Link>
                <p className="text-label-sm text-charcoal-muted">
                  {insight.readTime}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
