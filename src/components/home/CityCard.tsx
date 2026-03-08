import Link from "next/link";
import { CITIES } from "@/data/cities";
import { CityCardImage } from "@/components/home/CityCardImage";

type City = (typeof CITIES)[0];

/**
 * Single city card: image + name, country, tagline, stats, curricula.
 * Used on /cities and on the homepage for consistent layout (especially mobile).
 */
export function CityCard({ city }: { city: City }) {
  const content = (
    <>
      <CityCardImage
        city={city}
        photoCredit={city.photoCredit}
      />
      <div className="p-5">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="font-display text-display-sm group-hover:text-primary transition-colors">
            {city.name}
          </h3>
          <span className="text-label-xs uppercase text-charcoal-muted">
            {city.country}
          </span>
        </div>
        <p className="text-sm text-charcoal-light leading-relaxed mb-3">
          {city.tagline ?? ""}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-xs text-charcoal-muted mb-3">
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
          <p
            className={`text-label-sm uppercase tracking-wider mt-3 ${
              city.comingNext ? "text-primary" : "text-charcoal-muted/70"
            }`}
          >
            {city.comingNext ? "Coming next" : "Coming soon"}
          </p>
        )}
      </div>
    </>
  );

  return city.live ? (
    <Link
      href={`/international-schools/${city.slug}/`}
      className="group border-2 border-primary rounded-sm overflow-hidden hover:border-primary-hover transition-colors bg-cream-50 block"
    >
      {content}
    </Link>
  ) : (
    <div
      className="border border-charcoal-muted/40 rounded-sm overflow-hidden bg-cream-50"
      title="Coming soon"
    >
      {content}
    </div>
  );
}
