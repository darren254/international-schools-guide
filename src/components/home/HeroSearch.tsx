import Link from "next/link";

type CityLink = {
  slug: string;
  name: string;
  live: boolean;
  comingNext?: boolean;
};

export function HeroSearch({ cities }: { cities: CityLink[] }) {

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Browse by city */}
      <p className="text-sm text-charcoal-muted">
        Browse by city:{" "}
        {cities.map((city, i) => (
          <span key={city.slug}>
            {i > 0 && <span className="mx-1.5 text-cream-400">·</span>}
            {city.live ? (
              <Link
                href={`/international-schools/${city.slug}/`}
                className="text-hermes hover:text-hermes-hover transition-colors"
              >
                {city.name}
              </Link>
            ) : (
              <span
                className={city.comingNext ? "text-charcoal-muted" : "text-charcoal-muted/70"}
                title={city.comingNext ? "Coming next" : "Coming soon"}
              >
                {city.name}
              </span>
            )}
          </span>
        ))}
      </p>

      {/* Secondary CTAs */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Link
          href="/compare"
          className="border border-charcoal text-charcoal px-6 py-2.5 text-sm font-medium uppercase tracking-wider hover:bg-charcoal hover:text-cream transition-colors rounded-sm"
        >
          Compare Schools
        </Link>
        <Link
          href="/shortlist"
          className="border border-charcoal text-charcoal px-6 py-2.5 text-sm font-medium uppercase tracking-wider hover:bg-charcoal hover:text-cream transition-colors rounded-sm"
        >
          Start Your Shortlist
        </Link>
      </div>
    </div>
  );
}
