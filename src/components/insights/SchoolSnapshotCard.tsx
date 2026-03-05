import Link from "next/link";
import type { SchoolProfile } from "@/data/schools";
import { getSchoolImageUrl } from "@/lib/schools/images";

interface SchoolSnapshotCardProps {
  school: SchoolProfile;
}

export function SchoolSnapshotCard({ school }: SchoolSnapshotCardProps) {
  const feeStat = school.stats.find((s) => s.label.toLowerCase().includes("fee"));
  const ibFact = school.sidebar?.quickFacts?.find((f) =>
    f.label.toLowerCase().includes("ib")
  );
  const curriculum = school.curricula.slice(0, 2).join(" / ");
  const imageUrl = getSchoolImageUrl(school.slug, "card");

  return (
    <Link
      href={`/international-schools/${school.citySlug}/${school.slug}/`}
      className="block bg-warm-white border border-warm-border rounded-sm overflow-hidden hover:border-charcoal-muted transition-colors group"
    >
      <div className="aspect-[16/10] bg-cream-200 border-b border-warm-border flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={school.name} className="w-full h-full object-cover brightness-[1.02] contrast-[1.02] saturate-[0.98]" loading="lazy" />
        ) : (
          <svg
            className="w-12 h-12 text-charcoal-muted/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        )}
      </div>
      <div className="p-4">
        <p className="font-display text-lg font-semibold mb-2 text-charcoal group-hover:text-primary transition-colors">
          {school.name}
        </p>
        <div className="h-px bg-warm-border mb-3" aria-hidden />
        <dl className="space-y-1 text-sm font-sans text-charcoal">
          {curriculum && (
            <div>
              <dt className="sr-only">Curriculum</dt>
              <dd className="text-charcoal-muted">{curriculum}</dd>
            </div>
          )}
          {feeStat && (
            <div>
              <dt className="sr-only">Fees</dt>
              <dd className="text-charcoal-muted">{feeStat.value}</dd>
            </div>
          )}
          {ibFact && (
            <div>
              <dt className="sr-only">IB</dt>
              <dd className="text-charcoal-muted">
                {ibFact.label}: {ibFact.value}
              </dd>
            </div>
          )}
        </dl>
        <p className="mt-3 text-sm font-medium text-primary flex items-center gap-1">
          View profile
          <span aria-hidden>→</span>
        </p>
      </div>
    </Link>
  );
}
