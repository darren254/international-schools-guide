import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_SCHOOL_SLUGS } from "@/data/schools";
import { ALL_DUBAI_SCHOOL_SLUGS } from "@/data/dubai-schools-profiles";
import { ExploreSchoolsClient, type SchoolListing, type LocationOption } from "../ExploreSchoolsClient";
import { LIVE_CITIES } from "@/data/cities";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import { DUBAI_SCHOOLS } from "@/data/dubai-schools";

const baseUrl = "https://international-schools-guide.com";

export function generateStaticParams() {
  return LIVE_CITIES.map((c) => ({ city: c.slug }));
}

const CITY_META: Record<string, { description: string; schoolCount: number }> = {
  jakarta: {
    description: "Browse 66 international schools in Jakarta. Compare fees, curricula, IB results, and read honest editorial reviews. Filter by area, age range, and budget.",
    schoolCount: 66,
  },
  dubai: {
    description: "Browse 172 international schools in Dubai, Sharjah, and Ajman. Compare fees, curricula, and read honest editorial reviews. Filter by area, curriculum, and budget.",
    schoolCount: 172,
  },
};

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
  const cityName = params.city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const meta = CITY_META[params.city];
  const description = meta?.description ?? `Browse international schools in ${cityName}. Compare fees, curricula, and read honest editorial reviews.`;
  return {
    title: `International Schools in ${cityName} - Fees, Reviews & Comparison`,
    description,
    alternates: { canonical: `${baseUrl}/international-schools/${params.city}` },
    openGraph: {
      title: `International Schools in ${cityName} - International Schools Guide`,
      description,
      url: `${baseUrl}/international-schools/${params.city}`,
    },
  };
}

const JAKARTA_LOCATION_OPTIONS: LocationOption[] = [
  { value: "", label: "All locations" },
  { value: "North", label: "North Jakarta" },
  { value: "South", label: "South Jakarta" },
  { value: "East", label: "East Jakarta" },
  { value: "West", label: "West Jakarta" },
  { value: "Central", label: "Central Jakarta" },
  { value: "Outside Jakarta", label: "Outside Jakarta" },
];

const DUBAI_LOCATION_OPTIONS: LocationOption[] = [
  { value: "", label: "All locations" },
  { value: "Jumeirah", label: "Jumeirah & Al Safa" },
  { value: "Al Barsha", label: "Al Barsha & South" },
  { value: "Deira", label: "Deira & East Dubai" },
  { value: "Dubai Marina", label: "Marina & Emirates Hills" },
  { value: "Silicon Oasis", label: "Silicon Oasis & Academic City" },
  { value: "Sharjah", label: "Sharjah" },
  { value: "Ajman", label: "Ajman" },
  { value: "Other Dubai", label: "Other Dubai" },
];

function getCityConfig(citySlug: string): {
  schools: SchoolListing[];
  profileSlugs: string[];
  locationOptions: LocationOption[];
} | null {
  switch (citySlug) {
    case "jakarta":
      return {
        schools: JAKARTA_SCHOOLS,
        profileSlugs: ALL_SCHOOL_SLUGS,
        locationOptions: JAKARTA_LOCATION_OPTIONS,
      };
    case "dubai":
      return {
        schools: DUBAI_SCHOOLS,
        profileSlugs: ALL_DUBAI_SCHOOL_SLUGS,
        locationOptions: DUBAI_LOCATION_OPTIONS,
      };
    default:
      return null;
  }
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

  const config = getCityConfig(params.city);
  if (!config) {
    notFound();
  }

  return (
    <>
      <ExploreSchoolsClient
        schools={config.schools}
        profileSlugs={config.profileSlugs}
        citySlug={params.city}
        cityName={cityName}
        locationOptions={config.locationOptions}
      />
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
              wide - from premium schools charging over US$35K per year to
              solid mid-range options at a fraction of the price.
            </p>
            <p className="text-[0.9375rem] text-charcoal-light leading-[1.75] mb-5">
              The dominant curricula are IB (offered at six or more schools),
              British/Cambridge, and Australian. American-style education is
              primarily available through JIS. Most top-tier schools are
              concentrated in South Jakarta - Cilandak, Pondok Indah, and
              Kemang - with a growing cluster in BSD City and South Tangerang
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
              you&apos;re self-funding, the mid-tier schools - Mentari, AIS,
              Global Jaya - offer genuine quality at significantly lower cost.
              Don&apos;t assume expensive means better. Read the profiles,
              compare the data, and visit in person.
            </p>
          </div>
        </section>
      )}
      {params.city === "dubai" && (
        <section className="container-site mt-16 pt-12 border-t border-warm-border pb-12">
          <h2 className="font-display text-display-lg font-medium mb-6">
            A Parent&apos;s Guide to International Schools in Dubai
          </h2>
          <div className="prose-hermes">
            <p className="text-[0.9375rem] text-charcoal-light leading-[1.75] mb-5">
              Dubai is home to one of the world&apos;s most competitive
              international school markets, with over 200 private schools
              serving families from more than 180 nationalities. The range
              spans budget-friendly options under US$5K per year to premium
              schools charging US$30K or more.
            </p>
            <p className="text-[0.9375rem] text-charcoal-light leading-[1.75] mb-5">
              British curriculum dominates the market, followed by IB and
              American. You&apos;ll also find Indian (CBSE/ICSE), French,
              German, and UAE Ministry of Education schools. All private
              schools are regulated and inspected by KHDA (Knowledge and
              Human Development Authority), which publishes annual ratings
              from Outstanding to Weak.
            </p>
            <p className="text-[0.9375rem] text-charcoal-light leading-[1.75] mb-5">
              Geography matters. Schools cluster around Al Barsha, Jumeirah,
              and the newer Dubai Hills and Arabian Ranches developments.
              Sharjah and Ajman offer significantly lower fees for families
              willing to commute. Dubai&apos;s school bus networks are
              extensive, but journey times during rush hour can be
              substantial.
            </p>
            <p className="text-[0.9375rem] text-charcoal-light leading-[1.75]">
              Fees in Dubai are regulated by KHDA and schools cannot increase
              them beyond approved caps. One-time fees (registration,
              enrolment) vary widely and can add significantly to first-year
              costs. Always ask for the full fee schedule including uniforms,
              transport, and activity fees before committing.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
