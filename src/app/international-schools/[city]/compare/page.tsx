import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompareViewClient } from "./CompareViewClient";
import { getCitySchools, getCityName, isValidCitySlug } from "../../city-configs";
import { LIVE_CITIES } from "@/data/cities";

const baseUrl = "https://international-schools-guide.com";

export function generateStaticParams() {
  return LIVE_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
  if (!isValidCitySlug(params.city)) {
    return { title: "Compare schools" };
  }
  const cityName = getCityName(params.city);
  return {
    title: `Compare schools in ${cityName} - International Schools Guide`,
    description: `Compare international schools in ${cityName} side by side. Fees, curriculum, and editorial summaries.`,
    alternates: { canonical: `${baseUrl}/international-schools/${params.city}/compare` },
    openGraph: {
      title: `Compare schools in ${cityName} - International Schools Guide`,
      url: `${baseUrl}/international-schools/${params.city}/compare`,
    },
  };
}

export default function CityComparePage({
  params,
}: {
  params: { city: string };
}) {
  if (!isValidCitySlug(params.city)) {
    notFound();
  }
  const schools = getCitySchools(params.city);
  const cityName = getCityName(params.city);
  if (!schools) {
    notFound();
  }

  return (
    <CompareViewClient
      citySlug={params.city}
      cityName={cityName}
      schools={schools}
    />
  );
}
