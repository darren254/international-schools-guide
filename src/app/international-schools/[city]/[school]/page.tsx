import type { Metadata } from "next";
import Link from "next/link";
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
import {
  SCHOOL_PROFILES,
  ALL_SCHOOL_SLUGS,
  EXCHANGE_RATE,
  EXCHANGE_RATE_DATE,
} from "@/data/schools";

// ═══════════════════════════════════════════════════════
// STATIC PARAMS — generates a page for every school slug
// ═══════════════════════════════════════════════════════

export function generateStaticParams() {
  return ALL_SCHOOL_SLUGS.map((slug) => ({
    city: SCHOOL_PROFILES[slug].citySlug,
    school: slug,
  }));
}

// ═══════════════════════════════════════════════════════
// METADATA — dynamic per school
// ═══════════════════════════════════════════════════════

export function generateMetadata({
  params,
}: {
  params: { city: string; school: string };
}): Metadata {
  const school = SCHOOL_PROFILES[params.school];
  if (!school) return { title: "School Not Found" };

  return {
    title: school.metaTitle,
    description: school.metaDescription,
  };
}

// ═══════════════════════════════════════════════════════
// PAGE — one template, many schools
// ═══════════════════════════════════════════════════════

export default function SchoolProfilePage({
  params,
}: {
  params: { city: string; school: string };
}) {
  const s = SCHOOL_PROFILES[params.school];
  if (!s) return notFound();

  return (
    <div className="container-site">
      {/* Breadcrumb */}
      <nav
        className="py-5 text-[0.8125rem] text-charcoal-muted"
        aria-label="Breadcrumb"
      >
        <Link
          href="/international-schools/"
          className="hover:text-hermes transition-colors"
        >
          International Schools
        </Link>
        <span className="mx-1.5 opacity-50">›</span>
        <Link
          href={`/international-schools/${s.citySlug}/`}
          className="hover:text-hermes transition-colors"
        >
          {s.citySlug.charAt(0).toUpperCase() + s.citySlug.slice(1)}
        </Link>
        <span className="mx-1.5 opacity-50">›</span>
        <span className="text-charcoal">{s.name}</span>
      </nav>

      {/* Masthead */}
      <SchoolMasthead
        name={s.name}
        verified={s.verified}
        campuses={s.campuses.map((c) => ({
          name: c.name,
          address: c.address,
        }))}
        lastUpdated={s.lastUpdated}
        curricula={s.curricula}
        stats={s.stats}
      />

      {/* Head of School */}
      <HeadOfSchool
        name={s.head.name}
        since={s.head.since}
        bio={s.head.bio}
      />

      {/* Photo Strip */}
      <PhotoStrip
        images={s.photoAlts.map((alt) => ({ alt }))}
      />

      {/* Sticky section nav */}
      <nav className="sticky top-16 z-40 bg-cream border-b border-warm-border -mx-5 md:-mx-8 px-5 md:px-8 overflow-x-auto">
        <div className="flex gap-6 py-3 text-[0.75rem] uppercase tracking-wider whitespace-nowrap">
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
              className="text-charcoal-muted hover:text-hermes transition-colors"
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
              exchangeRate={EXCHANGE_RATE}
              exchangeRateDate={EXCHANGE_RATE_DATE}
              feeCurrency={s.fees.feeCurrency}
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
          <CampusMap campuses={s.campuses} />

          {/* Contact */}
          <ContactSection
            phone={s.contact.phone}
            email={s.contact.email}
            website={s.contact.website}
          />
        </div>

        {/* Sidebar */}
        <ProfileSidebar
          citySlug={s.citySlug}
          quickFacts={s.sidebar.quickFacts}
          otherSchools={s.sidebar.otherSchools}
          relatedInsights={s.sidebar.relatedInsights}
        />
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: s.name,
            description: s.jsonLd.description,
            url: s.contact.website,
            telephone: s.contact.phone,
            email: s.contact.email,
            address: s.campuses.map((c) => ({
              "@type": "PostalAddress",
              name: c.name,
              streetAddress: c.address,
              addressLocality: s.citySlug.charAt(0).toUpperCase() + s.citySlug.slice(1),
              addressCountry: "ID",
            })),
            foundingDate: s.jsonLd.foundingDate,
            numberOfStudents: s.jsonLd.numberOfStudents,
          }),
        }}
      />
    </div>
  );
}
