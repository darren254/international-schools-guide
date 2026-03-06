import type { Metadata } from "next";
import Link from "next/link";
import { CITIES } from "@/data/cities";
import { CityCardImage } from "@/components/home/CityCardImage";

export const metadata: Metadata = {
  title: "Browse International Schools by City | The International Schools Guide",
  description:
    "Browse international school guides by city. Jakarta is live now; Singapore coming next. Bangkok, Dubai, Hong Kong, Kuala Lumpur and more coming soon.",
  alternates: { canonical: "https://international-schools-guide.com/cities" },
};

function CityCard({
  city,
}: {
  city: (typeof CITIES)[0];
}) {
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
          <p className={`text-label-sm uppercase tracking-wider mt-3 ${
            city.comingNext ? "text-primary" : "text-charcoal-muted/70"
          }`}>
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

export default function CitiesPage() {
  return (
    <div className="container-site py-12 md:py-16">
      <h1 className="font-display text-display-lg mb-3">
        Browse by city
      </h1>
      <p className="text-charcoal-muted text-lg mb-10 max-w-2xl">
        Choose a city to find the right fit for your family.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CITIES.map((city) => (
          <CityCard key={city.slug} city={city} />
        ))}
      </div>
    </div>
  );
}
