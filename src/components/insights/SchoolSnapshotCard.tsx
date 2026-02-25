import Link from "next/link";
import type { SchoolProfile } from "@/data/schools";

interface SchoolSnapshotCardProps {
  school: SchoolProfile;
}

export function SchoolSnapshotCard({ school }: SchoolSnapshotCardProps) {
  const feeStat = school.stats.find((s) => s.label.toLowerCase().includes("fee"));
  const ibFact = school.sidebar?.quickFacts?.find((f) =>
    f.label.toLowerCase().includes("ib")
  );
  const curriculum = school.curricula.slice(0, 2).join(" / ");

  return (
    <Link
      href={`/international-schools/${school.citySlug}/${school.slug}/`}
      className="block bg-data rounded-sm overflow-hidden text-white hover:bg-data/90 transition-colors group"
    >
      <div className="aspect-[16/10] bg-data/80 flex items-center justify-center" aria-hidden>
        <svg
          className="w-12 h-12 text-white/40"
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
      </div>
      <div className="p-4">
      <p className="font-display text-lg font-semibold mb-2">{school.name}</p>
      <div className="h-px bg-white/30 mb-3" aria-hidden />
      <dl className="space-y-1 text-sm font-sans">
        {curriculum && (
          <div>
            <dt className="sr-only">Curriculum</dt>
            <dd className="text-white/90">{curriculum}</dd>
          </div>
        )}
        {feeStat && (
          <div>
            <dt className="sr-only">Fees</dt>
            <dd className="text-white/90">{feeStat.value}</dd>
          </div>
        )}
        {ibFact && (
          <div>
            <dt className="sr-only">IB</dt>
            <dd className="text-white/90">{ibFact.label}: {ibFact.value}</dd>
          </div>
        )}
      </dl>
      <p className="mt-3 text-sm font-medium text-white/95 group-hover:text-white flex items-center gap-1">
        View full profile
        <span aria-hidden>→</span>
      </p>
      </div>
    </Link>
  );
}
