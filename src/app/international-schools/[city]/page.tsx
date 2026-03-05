import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_SCHOOL_SLUGS } from "@/data/schools";
import { ALL_DUBAI_SCHOOL_SLUGS } from "@/data/dubai-schools-profiles";
import { ALL_SINGAPORE_SCHOOL_SLUGS } from "@/data/singapore-schools-profiles";
import { ALL_BANGKOK_SCHOOL_SLUGS } from "@/data/bangkok-schools-profiles";
import { ALL_HONG_KONG_SCHOOL_SLUGS } from "@/data/hong-kong-schools-profiles";
import { ALL_KUALA_LUMPUR_SCHOOL_SLUGS } from "@/data/kuala-lumpur-schools-profiles";
import { ExploreSchoolsClient, type SchoolListing, type LocationOption } from "../ExploreSchoolsClient";
import { LIVE_CITIES } from "@/data/cities";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import { DUBAI_SCHOOLS } from "@/data/dubai-schools";
import { SINGAPORE_SCHOOLS } from "@/data/singapore-schools";
import { BANGKOK_SCHOOLS } from "@/data/bangkok-schools";
import { HONG_KONG_SCHOOLS } from "@/data/hong-kong-schools";
import { KUALA_LUMPUR_SCHOOLS } from "@/data/kuala-lumpur-schools";

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
  const config = CITY_CONFIGS[params.city];
  const description = config?.metaDescription ?? `Browse international schools in ${cityName}. Compare fees, curricula, and read honest editorial reviews.`;
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

// ── Per-city configuration ──

interface CityPageConfig {
  schools: SchoolListing[];
  profileSlugs: string[];
  locationOptions: LocationOption[];
  metaDescription: string;
  editorialTitle: string;
  editorialParagraphs: string[];
}

const CITY_CONFIGS: Record<string, CityPageConfig> = {
  jakarta: {
    schools: JAKARTA_SCHOOLS,
    profileSlugs: ALL_SCHOOL_SLUGS,
    locationOptions: [
      { value: "", label: "All locations" },
      { value: "North", label: "North Jakarta" },
      { value: "South", label: "South Jakarta" },
      { value: "East", label: "East Jakarta" },
      { value: "West", label: "West Jakarta" },
      { value: "Central", label: "Central Jakarta" },
      { value: "Outside Jakarta", label: "Outside Jakarta" },
    ],
    metaDescription: "Browse 66 international schools in Jakarta. Compare fees, curricula, IB results, and read honest editorial reviews.",
    editorialTitle: "A Parent\u2019s Guide to International Schools in Jakarta",
    editorialParagraphs: [
      "Jakarta has one of the largest concentrations of international schools in Southeast Asia, serving a diverse expat community of diplomats, corporate executives, and entrepreneurs. The range is wide \u2014 from premium schools charging over US$35K per year to solid mid-range options at a fraction of the price.",
      "The dominant curricula are IB (offered at six or more schools), British/Cambridge, and Australian. American-style education is primarily available through JIS. Most top-tier schools are concentrated in South Jakarta \u2014 Cilandak, Pondok Indah, and Kemang \u2014 with a growing cluster in BSD City and South Tangerang offering lower fees and newer campuses.",
      "Traffic is the single biggest factor in school choice that newcomers underestimate. A school that looks 10km away on the map can be a 90-minute commute during morning rush hour. Most experienced expat families recommend choosing a school first and finding housing nearby, rather than the other way around.",
      "Corporate relocation packages typically cover JIS or BSJ. If you\u2019re self-funding, the mid-tier schools \u2014 Mentari, AIS, Global Jaya \u2014 offer genuine quality at significantly lower cost. Don\u2019t assume expensive means better. Read the profiles, compare the data, and visit in person.",
    ],
  },
  dubai: {
    schools: DUBAI_SCHOOLS,
    profileSlugs: ALL_DUBAI_SCHOOL_SLUGS,
    locationOptions: [
      { value: "", label: "All locations" },
      { value: "Jumeirah", label: "Jumeirah & Al Safa" },
      { value: "Al Barsha", label: "Al Barsha & South" },
      { value: "Deira", label: "Deira & East Dubai" },
      { value: "Dubai Marina", label: "Marina & Emirates Hills" },
      { value: "Silicon Oasis", label: "Silicon Oasis & Academic City" },
      { value: "Sharjah", label: "Sharjah" },
      { value: "Ajman", label: "Ajman" },
      { value: "Other Dubai", label: "Other Dubai" },
    ],
    metaDescription: "Browse 172 international schools in Dubai, Sharjah, and Ajman. Compare fees, curricula, and read honest editorial reviews.",
    editorialTitle: "A Parent\u2019s Guide to International Schools in Dubai",
    editorialParagraphs: [
      "Dubai is home to one of the world\u2019s most competitive international school markets, with over 200 private schools serving families from more than 180 nationalities. The range spans budget-friendly options under US$5K per year to premium schools charging US$30K or more.",
      "British curriculum dominates the market, followed by IB and American. You\u2019ll also find Indian (CBSE/ICSE), French, German, and UAE Ministry of Education schools. All private schools are regulated and inspected by KHDA (Knowledge and Human Development Authority), which publishes annual ratings from Outstanding to Weak.",
      "Geography matters. Schools cluster around Al Barsha, Jumeirah, and the newer Dubai Hills and Arabian Ranches developments. Sharjah and Ajman offer significantly lower fees for families willing to commute.",
      "Fees in Dubai are regulated by KHDA and schools cannot increase them beyond approved caps. One-time fees (registration, enrolment) vary widely and can add significantly to first-year costs. Always ask for the full fee schedule including uniforms, transport, and activity fees before committing.",
    ],
  },
  singapore: {
    schools: SINGAPORE_SCHOOLS,
    profileSlugs: ALL_SINGAPORE_SCHOOL_SLUGS,
    locationOptions: [
      { value: "", label: "All locations" },
      { value: "Central", label: "Central Singapore" },
      { value: "East", label: "East Singapore" },
      { value: "West", label: "West Singapore" },
      { value: "North", label: "North Singapore" },
      { value: "Sentosa & South", label: "Sentosa & South" },
      { value: "Other Singapore", label: "Other" },
    ],
    metaDescription: "Browse 64 international schools in Singapore. Compare fees, curricula, and read honest editorial reviews.",
    editorialTitle: "A Parent\u2019s Guide to International Schools in Singapore",
    editorialParagraphs: [
      "Singapore is Asia\u2019s premier education hub, home to around 70 international schools serving a cosmopolitan expat community. The market is mature, well-regulated, and competitive \u2014 with fees ranging from around US$13K to over US$40K per year.",
      "British and IB curricula dominate, but you\u2019ll also find American, Australian, Canadian, French, German, Japanese, and Korean options. Most premium schools cluster around the Tanglin, Bukit Timah, and Holland Village corridor in the central region.",
      "Singapore\u2019s compact geography means commute times are rarely a dealbreaker, but school bus costs can add significantly to the annual bill. Most schools have waitlists for popular year groups, so apply early \u2014 ideally 12\u201318 months before your intended start date.",
      "The Ministry of Education regulates international schools and caps local student enrolment. This means most schools have a genuinely international student body, which is a key draw for expat families.",
    ],
  },
  bangkok: {
    schools: BANGKOK_SCHOOLS,
    profileSlugs: ALL_BANGKOK_SCHOOL_SLUGS,
    locationOptions: [
      { value: "", label: "All locations" },
      { value: "Sukhumvit", label: "Sukhumvit Corridor" },
      { value: "Silom & Sathorn", label: "Silom & Sathorn" },
      { value: "Charoenkrung", label: "Charoenkrung / Riverside" },
      { value: "North Bangkok", label: "North Bangkok" },
      { value: "West Bangkok", label: "West Bangkok" },
      { value: "Other Bangkok", label: "Other Bangkok" },
    ],
    metaDescription: "Browse 96 international schools in Bangkok. Compare fees, curricula, and read honest editorial reviews.",
    editorialTitle: "A Parent\u2019s Guide to International Schools in Bangkok",
    editorialParagraphs: [
      "Bangkok is one of Southeast Asia\u2019s largest international school markets, with over 100 schools serving a diverse expat community. Fees range from under US$5K to over US$30K per year, making it one of the best-value destinations for international education.",
      "British and IB curricula are the most common, but American, Australian, French, German, Japanese, and Swiss options are also well represented. The premium schools cluster along the Sukhumvit corridor \u2014 particularly around Thonglor, Ekkamai, and Phrom Phong \u2014 while more affordable options can be found in outer Bangkok.",
      "Traffic is Bangkok\u2019s defining challenge for school choice. A school 15km away can take 90 minutes in morning rush hour. Most experienced expat families choose their school first and find housing nearby.",
      "Bangkok offers exceptional value compared to Singapore or Hong Kong. Many schools that would cost US$30K+ in those cities charge US$15\u201320K here, with comparable facilities and teaching quality.",
    ],
  },
  "hong-kong": {
    schools: HONG_KONG_SCHOOLS,
    profileSlugs: ALL_HONG_KONG_SCHOOL_SLUGS,
    locationOptions: [
      { value: "", label: "All locations" },
      { value: "Hong Kong Island", label: "Hong Kong Island" },
      { value: "Kowloon", label: "Kowloon" },
      { value: "New Territories", label: "New Territories" },
      { value: "Other HK", label: "Other" },
    ],
    metaDescription: "Browse 80 international schools in Hong Kong. Compare fees, curricula, and read honest editorial reviews.",
    editorialTitle: "A Parent\u2019s Guide to International Schools in Hong Kong",
    editorialParagraphs: [
      "Hong Kong is one of Asia\u2019s most established international school markets, with around 80 schools serving a large and diverse expat community. Annual fees typically range from US$12K to over US$30K.",
      "IB and British curricula dominate, but Canadian, American, Australian, French, German, Japanese, and Korean options are also available. The most sought-after schools are concentrated on Hong Kong Island and in Kowloon Tong.",
      "Waitlists are a defining feature of the Hong Kong market. The most popular schools have multi-year waiting lists, and families often register at birth. Debentures (capital bonds) are common at premium schools and can be a significant upfront cost.",
      "The compact geography means most schools are accessible within 30\u201345 minutes by school bus, but housing costs near premium schools are among the highest in the world.",
    ],
  },
  "kuala-lumpur": {
    schools: KUALA_LUMPUR_SCHOOLS,
    profileSlugs: ALL_KUALA_LUMPUR_SCHOOL_SLUGS,
    locationOptions: [
      { value: "", label: "All locations" },
      { value: "KL City", label: "KL City & Bangsar" },
      { value: "Mont Kiara & Hartamas", label: "Mont Kiara & Hartamas" },
      { value: "Ampang & East", label: "Ampang & East KL" },
      { value: "Subang & West", label: "Subang & West KL" },
      { value: "South KL", label: "Putrajaya & South" },
      { value: "Other KL", label: "Other" },
    ],
    metaDescription: "Browse 112 international schools in Kuala Lumpur. Compare fees, curricula, and read honest editorial reviews.",
    editorialTitle: "A Parent\u2019s Guide to International Schools in Kuala Lumpur",
    editorialParagraphs: [
      "Kuala Lumpur is one of Southeast Asia\u2019s best-value international school markets, with over 100 schools offering fees from under US$4K to around US$25K per year \u2014 a fraction of what comparable schools charge in Singapore or Hong Kong.",
      "British and IB curricula are the most popular, but you\u2019ll also find American, Australian, and Canadian options. The highest concentration of premium international schools is in Mont Kiara, Hartamas, and Damansara Heights.",
      "KL\u2019s traffic can be challenging, but the city\u2019s highway network and growing rail system make most schools accessible within 30\u201345 minutes. Many international schools offer bus services.",
      "Malaysia\u2019s MM2H visa programme has made KL increasingly popular with families seeking long-term residency. The combination of affordable fees, high-quality schools, and low cost of living makes it one of the most attractive destinations for self-funding expat families.",
    ],
  },
};

export default function CityPage({
  params,
}: {
  params: { city: string };
}) {
  const cityName = params.city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const config = CITY_CONFIGS[params.city];
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
      <section className="container-site mt-16 pt-12 border-t border-warm-border pb-12">
        <h2 className="font-display text-display-lg font-medium mb-6">
          {config.editorialTitle}
        </h2>
        <div className="prose-primary">
          {config.editorialParagraphs.map((p, i) => (
            <p key={i} className={`text-body-sm text-charcoal-light leading-[1.75] ${i < config.editorialParagraphs.length - 1 ? "mb-5" : ""}`}>
              {p}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
