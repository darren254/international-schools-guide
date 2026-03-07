import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SchoolMasthead } from "@/components/school/SchoolMasthead";
import { HeadOfSchool } from "@/components/school/HeadOfSchool";
import { PhotoStrip } from "@/components/school/PhotoStrip";
import { Intelligence } from "@/components/school/Intelligence";
import { FeesTable } from "@/components/school/FeesTable";
import { AcademicResults } from "@/components/school/AcademicResults";
import { StudentBody } from "@/components/school/StudentBody";
import { SchoolLife } from "@/components/school/SchoolLife";
import { CampusMap } from "@/components/school/CampusMap";
import { ContactSection } from "@/components/school/ContactSection";
import { ProfileSidebar } from "@/components/school/ProfileSidebar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  SCHOOL_PROFILES,
  ALL_SCHOOL_SLUGS,
} from "@/data/schools";
import { extractLowestFee, extractHighestFee } from "@/lib/utils/fees";
import type { CurrencyCode } from "@/lib/currency/rates";
import { getSchoolImageUrl, getSchoolOgImageUrl } from "@/lib/schools/images";
import { getHeadImageUrl, getHeadOverride } from "@/lib/schools/head-images";
import photoStripUnique from "@/data/school-photo-strip-unique.json";
import { BackToResults } from "@/components/home/BackToResults";

const PHOTO_STRIP_LABELS = ["campus", "facilities", "students", "campus"] as const;

// ═══════════════════════════════════════════════════════
// STATIC PARAMS - generates a page for every school slug
// ═══════════════════════════════════════════════════════

export function generateStaticParams() {
  return ALL_SCHOOL_SLUGS.map((slug) => ({
    city: SCHOOL_PROFILES[slug].citySlug,
    school: slug,
  }));
}

// ═══════════════════════════════════════════════════════
// METADATA - dynamic per school
// ═══════════════════════════════════════════════════════

const BASE_URL = "https://international-schools-guide.com";

const COUNTRY_CODES: Record<string, string> = {
  jakarta: "ID",
  dubai: "AE",
  singapore: "SG",
  bangkok: "TH",
  "hong-kong": "HK",
  "kuala-lumpur": "MY",
};

export function generateMetadata({
  params,
}: {
  params: { city: string; school: string };
}): Metadata {
  const school = SCHOOL_PROFILES[params.school];
  if (!school) return { title: "School Not Found" };

  const canonical = `${BASE_URL}/international-schools/${school.citySlug}/${params.school}`;
  const ogImage = getSchoolOgImageUrl(params.school);
  const ogImageUrl = ogImage ? `${BASE_URL}${ogImage}` : `${BASE_URL}/og-default.png`;
  return {
    title: school.metaTitle,
    description: school.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: school.metaTitle,
      description: school.metaDescription,
      url: canonical,
      type: "profile",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: school.name }],
    },
  };
}

// ═══════════════════════════════════════════════════════
// PAGE - one template, many schools
// ═══════════════════════════════════════════════════════

export default function SchoolProfilePage({
  params,
}: {
  params: { city: string; school: string };
}) {
  const s = SCHOOL_PROFILES[params.school];
  if (!s) return notFound();
  if (params.city !== s.citySlug) return notFound();

  const canonicalUrl = `${BASE_URL}/international-schools/${s.citySlug}/${params.school}`;
  const cityName = s.citySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const feeStat = s.stats.find((st) => st.label === "Annual Fees");
  const feeRangeStr = feeStat?.value ?? "";
  const lowK = extractLowestFee(feeRangeStr);
  const highK = extractHighestFee(feeRangeStr);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "International Schools", item: `${BASE_URL}/international-schools` },
      { "@type": "ListItem", position: 2, name: cityName, item: `${BASE_URL}/international-schools/${s.citySlug}` },
      { "@type": "ListItem", position: 3, name: s.name, item: canonicalUrl },
    ],
  };

  const educationalOrgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: s.name,
    description: s.jsonLd.description,
    url: s.contact.website || canonicalUrl,
    ...(getSchoolImageUrl(s.slug, "profile") ? { image: `${BASE_URL}${getSchoolImageUrl(s.slug, "profile")}` } : {}),
    telephone: s.contact.phone || undefined,
    email: s.contact.email || undefined,
    address: s.campuses.map((c) => ({
      "@type": "PostalAddress",
      name: c.name,
      streetAddress: c.address,
      addressLocality: cityName,
      addressCountry: COUNTRY_CODES[s.citySlug] ?? "ID",
    })),
    foundingDate: s.jsonLd.foundingDate || undefined,
    numberOfStudents: s.jsonLd.numberOfStudents || undefined,
    ...(s.curricula?.length ? { curriculum: s.curricula.join(", ") } : {}),
    ...(feeRangeStr && (lowK > 0 || highK > 0)
      ? {
          priceRange: feeRangeStr,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: lowK > 0 ? String(lowK * 1000) : undefined,
            highPrice: highK > 0 ? String(highK * 1000) : undefined,
          },
        }
      : {}),
  };

  return (
    <div className="container-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BackToResults />
      <Breadcrumb
        items={[
          { label: "International Schools", href: "/international-schools/" },
          { label: cityName, href: `/international-schools/${s.citySlug}/` },
          { label: s.name },
        ]}
      />

      {/* Masthead */}
      <SchoolMasthead
        slug={s.slug}
        name={s.name}
        verified={s.verified}
        campuses={s.campuses.map((c) => ({
          name: c.name,
          address: c.address,
        }))}
        locationLabel={s.stats.find((st) => st.label === "Location")?.value ?? ""}
        cityName={s.citySlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")}
        lastUpdated={s.lastUpdated}
        curricula={s.curricula}
        stats={s.stats}
      />

      {/* Head of School */}
      <HeadOfSchool
        name={(() => {
          const override = getHeadOverride(s.slug);
          return override ? override.name : s.head.name;
        })()}
        since={s.head.since}
        bio={s.head.bio}
        photoUrl={getSchoolImageUrl(s.slug, "head") ?? getHeadImageUrl(s.slug)}
        credentials={getHeadOverride(s.slug)?.title}
      />

      {/* Photo Strip — content-deduplicated (by hash); placeholders for missing/duplicate slots */}
      <PhotoStrip
        images={(() => {
          const uniqueUrls = (photoStripUnique as { slugs: Record<string, string[]> }).slugs[s.slug];
          if (uniqueUrls && uniqueUrls.length > 0) {
            return PHOTO_STRIP_LABELS.map((label, i) => ({
              alt: `${s.name} ${label}`,
              src: uniqueUrls[i],
            }));
          }
          const variants = ["profile", "photo1", "photo2", "photo3"] as const;
          const seen = new Set<string>();
          return variants.map((variant) => {
            const src = getSchoolImageUrl(s.slug, variant);
            const isDuplicate = src != null && seen.has(src);
            if (src) seen.add(src);
            return {
              alt: `${s.name} ${PHOTO_STRIP_LABELS[variants.indexOf(variant)]}`,
              src: isDuplicate ? undefined : src,
            };
          });
        })()}
      />

      {/* Sticky section nav */}
      <nav className="sticky top-16 z-40 bg-cream border-b border-warm-border -mx-5 md:-mx-8 px-5 md:px-8 overflow-x-auto">
        <div className="flex gap-6 py-3 text-label-sm uppercase tracking-wider whitespace-nowrap">
          {[
            { label: "Review", href: "#intelligence" },
            { label: "Fees", href: "#fees" },
            { label: "Academics", href: "#academics" },
            { label: "Community", href: "#student-body" },
            { label: "Campus", href: "#school-life" },
            { label: "Location", href: "#location" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-charcoal-muted hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Main content + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14 pt-10 pb-10">
        {/* Main column */}
        <div className="min-w-0">
          {/* The Intelligence */}
          <Intelligence
            verdict={s.intelligence.verdict}
            paragraphs={s.intelligence.paragraphs}
            positives={s.intelligence.positives}
            considerations={s.intelligence.considerations}
          />

          {/* ── Warm band: Fees ── */}
          <div className="section-band -mx-5 md:-mx-8 px-5 md:px-8 pb-2 bg-warm-white border-y border-warm-border-light">
            <FeesTable
              academicYear={s.fees.academicYear}
              feeCurrency={s.fees.feeCurrency as CurrencyCode}
              fees={s.fees.rows}
              oneTimeFees={s.fees.oneTime}
              note={s.fees.note}
            />
          </div>

          {/* Academic Results */}
          <AcademicResults
            results={s.academics.results}
            paragraphs={s.academics.paragraphs}
          />

          {/* ── Warm band: Student Body ── */}
          <div className="section-band -mx-5 md:-mx-8 px-5 md:px-8 pb-2 bg-warm-white border-y border-warm-border-light">
            <StudentBody
              paragraphs={s.studentBody.paragraphs}
              inspection={s.studentBody.inspection}
            />
          </div>

          {/* School Life */}
          <SchoolLife
            activitiesCount={s.schoolLife.activitiesCount}
            uniformRequired={s.schoolLife.uniformRequired}
            facilities={s.schoolLife.facilities}
            paragraphs={s.schoolLife.paragraphs}
          />

          {/* Location */}
          <CampusMap
            campuses={s.campuses}
            currentSchoolName={s.name}
            citySlug={s.citySlug}
            otherSchools={s.sidebar.otherSchools
              .map((os) => {
                const profile = SCHOOL_PROFILES[os.slug];
                const first = profile?.campuses?.find(
                  (c) => typeof c.lat === "number" && typeof c.lng === "number" && c.lat !== 0 && c.lng !== 0
                );
                if (!first) return null;
                return {
                  name: os.name,
                  slug: os.slug,
                  meta: os.meta,
                  feeRange: os.feeRange,
                  lat: first.lat,
                  lng: first.lng,
                };
              })
              .filter((x): x is NonNullable<typeof x> => x != null)}
          />

          {/* Contact */}
          <ContactSection
            phone={s.contact.phone}
            email={s.contact.email}
            website={s.contact.website}
          />
        </div>

        {/* Sidebar */}
        <ProfileSidebar
          slug={s.slug}
          citySlug={s.citySlug}
          quickFacts={s.sidebar.quickFacts}
          relatedInsights={s.sidebar.relatedInsights}
        />
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(educationalOrgJsonLd),
        }}
      />
    </div>
  );
}
