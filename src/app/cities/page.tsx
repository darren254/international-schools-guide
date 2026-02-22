import type { Metadata } from "next";
import Link from "next/link";
import { CITIES } from "@/data/cities";

export const metadata: Metadata = {
  title: "All Cities",
  description:
    "Browse international school guides by city. Jakarta is live now; Singapore, Bangkok, Dubai, Hong Kong, Kuala Lumpur and more coming soon.",
  alternates: { canonical: "https://international-schools-guide.com/cities" },
};

function CityCard({
  city,
}: {
  city: (typeof CITIES)[0];
}) {
  const content = (
    <>
      <div className="aspect-[16/8] bg-cream-300 group-hover:bg-cream-400 transition-colors relative">
        {!city.live && (
          <span className="absolute top-2 right-2 text-[0.6875rem] uppercase tracking-wider text-charcoal-muted bg-warm-white/90 px-2 py-1 rounded-sm">
            Coming soon
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="font-display text-display-sm group-hover:text-hermes transition-colors">
            {city.name}
          </h3>
          <span className="text-label-xs uppercase text-charcoal-muted">
            {city.country}
          </span>
        </div>
        <p className="text-sm text-charcoal-light leading-relaxed mb-3">
          {city.tagline ?? ""}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-charcoal-muted mb-3">
          <span>{city.schoolCount ?? "-"}+ schools</span>
          <span>{city.feeRange ?? ""}</span>
        </div>
        <div className="flex gap-2">
          {(city.topCurricula ?? []).map((c) => (
            <span
              key={c}
              className="text-label-xs uppercase text-charcoal-muted bg-cream-200 px-2 py-0.5 rounded-sm"
            >
              {c}
            </span>
          ))}
        </div>
        {!city.live && (
          <p className="text-[0.75rem] uppercase tracking-wider text-charcoal-muted/70 mt-3">
            Coming soon
          </p>
        )}
      </div>
    </>
  );

  return city.live ? (
    <Link
      href={`/international-schools/${city.slug}/`}
      className="group border border-warm-border rounded-sm overflow-hidden hover:border-charcoal-muted transition-colors bg-cream-50 block"
    >
      {content}
    </Link>
  ) : (
    <div
      className="border border-warm-border rounded-sm overflow-hidden bg-cream-50 opacity-80"
      title="Coming soon"
    >
      {content}
    </div>
  );
}

export default function CitiesPage() {
  return (
    <div className="container-site py-12 md:py-16">
      <h1 className="font-display text-display-lg mb-10">
        All Cities
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CITIES.map((city) => (
          <CityCard key={city.slug} city={city} />
        ))}
      </div>
    </div>
  );
}
