import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_SCHOOL_SLUGS } from "@/data/schools";
import { ExploreSchoolsClient } from "../ExploreSchoolsClient";
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
  const cityName = params.city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `International Schools in ${cityName} — Fees, Reviews & Comparison`,
    description:
      "Browse 66 international schools in Jakarta. Compare fees, curricula, IB results, and read honest editorial reviews. Filter by area, age range, and budget.",
    alternates: { canonical: `${baseUrl}/international-schools/${params.city}` },
    openGraph: {
      title: `International Schools in ${cityName} — International Schools Guide`,
      description:
        "Browse 66 international schools in Jakarta. Compare fees, curricula, IB results, and read honest editorial reviews. Filter by area, age range, and budget.",
      url: `${baseUrl}/international-schools/${params.city}`,
    },
  };
}

export default function CityPage({
  params,
}: {
  params: { city: string };
}) {
  const cityName = params.city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Only Jakarta has school data for now
  if (params.city !== "jakarta") {
    notFound();
  }

  return (
    <>
      <ExploreSchoolsClient
        profileSlugs={ALL_SCHOOL_SLUGS}
        citySlug={params.city}
        cityName={cityName}
      />
      {/* City editorial content — Jakarta only for now */}
      {params.city === "jakarta" && (
        <section className="container-site mt-16 pt-12 border-t border-warm-border pb-12">
          <h2 className="font-display text-display-lg font-medium mb-6">
            A Parent&apos;s Guide to International Schools in Jakarta
          </h2>
          <div className="prose-hermes">
            <p className="text-[0.9375rem] text-charcoal-light leading-[1.75] mb-5">
              Jakarta has one of the largest concentrations of international
              schools in Southeast Asia, serving a diverse expat community of
              diplomats, corporate executives, and entrepreneurs. The range is
              wide — from premium schools charging over US$35K per year to
              solid mid-range options at a fraction of the price.
            </p>
            <p className="text-[0.9375rem] text-charcoal-light leading-[1.75] mb-5">
              The dominant curricula are IB (offered at six or more schools),
              British/Cambridge, and Australian. American-style education is
              primarily available through JIS. Most top-tier schools are
              concentrated in South Jakarta — Cilandak, Pondok Indah, and
              Kemang — with a growing cluster in BSD City and South Tangerang
              offering lower fees and newer campuses.
            </p>
            <p className="text-[0.9375rem] text-charcoal-light leading-[1.75] mb-5">
              Traffic is the single biggest factor in school choice that
              newcomers underestimate. A school that looks 10km away on the
              map can be a 90-minute commute during morning rush hour. Most
              experienced expat families recommend choosing a school first and
              finding housing nearby, rather than the other way around.
            </p>
            <p className="text-[0.9375rem] text-charcoal-light leading-[1.75]">
              Corporate relocation packages typically cover JIS or BSJ. If
              you&apos;re self-funding, the mid-tier schools — Mentari, AIS,
              Global Jaya — offer genuine quality at significantly lower cost.
              Don&apos;t assume expensive means better. Read the profiles,
              compare the data, and visit in person.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
