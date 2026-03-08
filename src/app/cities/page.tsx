import type { Metadata } from "next";
import Link from "next/link";
import { CITIES } from "@/data/cities";
import { CityCard } from "@/components/home/CityCard";

export const metadata: Metadata = {
  title: "Browse International Schools by City | The International Schools Guide",
  description:
    "Browse international school guides by city. Jakarta is live now; Singapore coming next. Bangkok, Dubai, Hong Kong, Kuala Lumpur and more coming soon.",
  alternates: { canonical: "https://international-schools-guide.com/cities" },
};

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
