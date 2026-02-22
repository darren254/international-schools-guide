import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { displayValue } from "@/lib/utils/display";

interface QuickFact {
  label: string;
  value: string;
}

interface SidebarSchool {
  name: string;
  slug: string;
  meta: string;
  feeRange: string;
}

interface SidebarInsight {
  title: string;
  slug: string;
  readTime: string;
}

interface ProfileSidebarProps {
  quickFacts: QuickFact[];
  otherSchools: SidebarSchool[];
  relatedInsights: SidebarInsight[];
  citySlug: string;
}

export function ProfileSidebar({
  quickFacts,
  otherSchools,
  relatedInsights,
  citySlug,
}: ProfileSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-[88px] self-start space-y-5">
      {/* Quick Facts */}
      <div className="bg-warm-white border border-warm-border-light p-6">
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
        <div className="flex flex-col gap-2 mt-5">
          <Button variant="outline" fullWidth>
            ♡ Shortlist
          </Button>
          <Button variant="outline" fullWidth>
            + Compare
          </Button>
        </div>
      </div>

      {/* Other schools */}
      <div className="bg-warm-white border border-warm-border-light p-6">
        <h3 className="font-display text-[1.0625rem] font-semibold mb-4">
          Other Schools in South Jakarta
        </h3>
        {otherSchools.map((s) => (
          <div key={s.slug} className="py-3 border-b border-warm-border-light last:border-b-0">
            <Link
              href={`/international-schools/${citySlug}/${s.slug}/`}
              className="font-display text-base font-medium text-charcoal hover:text-hermes transition-colors"
            >
              {s.name}
            </Link>
            <p className="text-[0.75rem] text-charcoal-muted">{s.meta}</p>
            <p className="text-[0.8125rem] font-medium mt-0.5">{s.feeRange}</p>
          </div>
        ))}
      </div>

      {/* Related insights */}
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

      {/* CTA */}
      <div className="bg-warm-white border border-hermes p-6">
        <p className="font-display text-[1.0625rem] font-semibold mb-2">
          Are you from this school?
        </p>
        <p className="text-[0.8125rem] text-charcoal-muted mb-4 leading-relaxed">
          Update your data or explore featured listing opportunities.
        </p>
        <Button as="a" href="/contact/" variant="primary" fullWidth>
          Get in Touch
        </Button>
      </div>
    </aside>
  );
}
