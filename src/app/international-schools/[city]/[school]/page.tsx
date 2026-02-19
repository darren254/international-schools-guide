import type { Metadata } from "next";
import Link from "next/link";
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

// ═══════════════════════════════════════════════════════
// HARDCODED JIS DATA — wire to DB after template approval
// ═══════════════════════════════════════════════════════

const EXCHANGE_RATE = 16800; // IDR per USD — will be fetched from exchangeRates table
const EXCHANGE_RATE_DATE = "19 Feb 2026";

export const metadata: Metadata = {
  title: "Jakarta Intercultural School (JIS) — Fees, IB Results & Review",
  description:
    "Jakarta Intercultural School profile — fees from US$17K–US$36K/year, IB average 35.8, 2,500+ students, 60+ nationalities. Honest editorial review for expat parents.",
};

export default function JISProfilePage() {
  return (
    <div className="container-site">
      {/* Breadcrumb */}
      <nav className="py-5 text-[0.8125rem] text-charcoal-muted" aria-label="Breadcrumb">
        <Link href="/international-schools/" className="hover:text-hermes transition-colors">
          International Schools
        </Link>
        <span className="mx-1.5 opacity-50">›</span>
        <Link href="/international-schools/jakarta/" className="hover:text-hermes transition-colors">
          Jakarta
        </Link>
        <span className="mx-1.5 opacity-50">›</span>
        <span className="text-charcoal">Jakarta Intercultural School</span>
      </nav>

      {/* Masthead */}
      <SchoolMasthead
        name="Jakarta Intercultural School"
        verified={true}
        campuses={[
          {
            name: "Cilandak Campus (Secondary)",
            address: "Jl. Terogong Raya No. 33, Cilandak, Jakarta Selatan 12430",
          },
          {
            name: "Cilandak Campus (Early Childhood)",
            address: "Jl. Terogong Raya, Cilandak, Jakarta Selatan 12430",
          },
          {
            name: "Pattimura Campus (Elementary K–5)",
            address: "Jl. Pattimura Blok 1 No. 2, Kebayoran Baru, Jakarta Selatan 12110",
          },
        ]}
        lastUpdated="February 2026"
        curricula={["IB Primary Years", "IB Middle Years", "IB Diploma", "AP"]}
        stats={[
          { value: "2,500+", label: "Students" },
          { value: "3–18", label: "Age Range" },
          { value: "60+", label: "Nationalities" },
          { value: "US$17K – US$36K", label: "Annual Fees" },
        ]}
      />

      {/* Head of School */}
      <HeadOfSchool
        name="Dr. Tarek Razik"
        since={2022}
        bio="Dr. Tarek Razik has led JIS since 2022. He holds a doctorate in Educational Leadership from Columbia University and has over 25 years of experience in international schools, including previous headships in the Middle East and Africa."
      />

      {/* Photo Strip */}
      <PhotoStrip
        images={[
          { alt: "Cilandak campus aerial" },
          { alt: "Olympic swimming pool" },
          { alt: "Performing arts centre" },
          { alt: "Science laboratory" },
        ]}
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
            verdict="If your company is paying and your child is reasonably outgoing, JIS is a safe, solid choice — strong university placements, huge breadth of activities, and a genuinely international community. If you're self-funding, it's worth comparing."
            paragraphs={[
              "The word among expat families is that JIS is the big, established name — the school most corporate packages are written around and the one relocation agents mention first. Founded in 1951, it has the history, the scale, and the resources that come with being Jakarta's largest international school. Parents describe it as offering an American-influenced education with a broad international mix of students. The main Cilandak campus runs Early Childhood through High School, while Pattimura in Kebayoran Baru takes Elementary (K–5).",
              "Families who've been here a few years tend to say the strengths are real — strong university placements, a huge range of activities, and a community that feels like a small town. The flip side is that it's expensive (the most expensive in Jakarta), the campus is ageing, and at 2,500+ students it can feel impersonal if your child isn't the type to put their hand up. It suits families who want breadth of opportunity and don't mind a bigger, busier environment.",
              "The general consensus: if your company is paying and your child is reasonably outgoing, JIS is a safe and solid choice. If you're self-funding or want a smaller, more personal setup, it's worth looking at what else is out there.",
            ]}
            positives={[
              "Strong university placement track record — graduates regularly go on to well-known US, UK, and Australian universities, with a solid Ivy League and Oxbridge pipeline. Parents say the college counselling team is experienced and well-connected.",
              "Diverse student body with 60+ nationalities and no single group dominating — parents value the fact that their children mix with families from all over the world rather than one or two dominant communities.",
              "Serious sports programme through IASAS, competing against top international schools across Southeast Asia. Good range of team and individual sports, and high participation rates across the secondary school.",
              "Large-scale arts and performing arts programme — annual musicals, orchestra, and dedicated performance spaces mean students who are into drama, music, or visual arts have real outlets and resources.",
              "Well-established alumni network going back over 70 years — useful for older students thinking about university applications, internships, and career connections.",
            ]}
            considerations={[
              "At IDR 527M+ per year rising to IDR 604M for IB, JIS is comfortably the most expensive school in Jakarta. The gap between JIS and the next tier down is significant — make sure you're clear on what the premium buys you before committing.",
              "The Cilandak campus dates from the mid-1970s and parts of it are showing their age. A renovation programme is underway but it's a big site and there's still plenty of work to do. Don't expect gleaming, purpose-built facilities throughout.",
              "Traffic around the Cilandak campus at drop-off is a genuine headache. Jl. Terogong Raya backs up badly between 7:15 and 7:45 AM. Families who live in BSD or Tangerang should factor in a long commute.",
              "With 2,500+ students, JIS is a big school. Parents of quieter children sometimes say their kids can get lost in the crowd, particularly in middle school. It works well for confident, outgoing students — less so for those who need to be drawn out.",
              "The American-influenced approach — first-name basis with teachers, emphasis on student voice and choice — suits some families but feels too informal for those coming from British or more traditional Asian school cultures.",
            ]}
          />

          {/* ── Warm band: Fees ── */}
          <div className="section-band -mx-5 md:-mx-8 px-5 md:px-8 py-8 bg-warm-white border-y border-warm-border-light">
          <FeesTable
            academicYear="2025–2026"
            exchangeRate={EXCHANGE_RATE}
            exchangeRateDate={EXCHANGE_RATE_DATE}
            feeCurrency="IDR"
            fees={[
              {
                gradeLevel: "Early Years 1 & 2 (Half Day)",
                ages: "3–4 years",
                tuition: 195_450_000,
                capital: 65_360_000,
                totalEarlyBird: 286_500_000,
                totalStandard: 291_780_000,
              },
              {
                gradeLevel: "Early Years 1 & 2 (Full Day)",
                ages: "3–4 years",
                tuition: 279_450_000,
                capital: 65_360_000,
                totalEarlyBird: 370_500_000,
                totalStandard: 375_780_000,
              },
              {
                gradeLevel: "Kindergarten",
                ages: "4–5 years",
                tuition: 408_950_000,
                capital: 65_360_000,
                totalEarlyBird: 500_000_000,
                totalStandard: 505_280_000,
              },
              {
                gradeLevel: "Elementary (Grades 1–5)",
                ages: "5–11 years",
                tuition: 431_450_000,
                capital: 65_360_000,
                totalEarlyBird: 522_500_000,
                totalStandard: 527_780_000,
              },
              {
                gradeLevel: "Middle School (Grades 6–8)",
                ages: "11–14 years",
                tuition: 504_100_000,
                capital: 65_360_000,
                totalEarlyBird: 595_150_000,
                totalStandard: 600_430_000,
              },
              {
                gradeLevel: "High School (Grades 9–12)",
                ages: "14–18 years",
                tuition: 508_000_000,
                capital: 65_360_000,
                totalEarlyBird: 599_050_000,
                totalStandard: 604_330_000,
              },
              {
                gradeLevel: "JIS Learning Centre (Primary)",
                ages: "Learning support",
                tuition: 687_250_000,
                capital: 65_360_000,
                totalEarlyBird: 778_300_000,
                totalStandard: 783_580_000,
              },
              {
                gradeLevel: "JIS Learning Centre (Secondary)",
                ages: "Learning support",
                tuition: 759_900_000,
                capital: 65_360_000,
                totalEarlyBird: 850_950_000,
                totalStandard: 856_230_000,
              },
            ]}
            oneTimeFees={[
              { name: "Application Fee", amount: 5_300_000 },
              {
                name: "Enrolment Guarantee (Early Bird)",
                amount: 25_690_000,
                note: "Paid by 10 Apr 2025",
              },
              { name: "Enrolment Guarantee (Standard)", amount: 30_970_000 },
              {
                name: "Technology Fee (Elementary)",
                amount: 6_647_000,
                note: "One-time, new students",
              },
              {
                name: "Technology Fee (MS/HS)",
                amount: 23_210_000,
                note: "One-time, new students",
              },
              {
                name: "EAL Programme Fee",
                amount: 71_318_000,
                note: "One-time, if required",
              },
            ]}
            note="Fees shown are early-bird totals (including tuition, capital fee, and enrolment guarantee). Standard totals are slightly higher. Lane 3 surcharge applies to students transferring from local/international schools in Greater Jakarta (IDR 196M for Grade 10, IDR 294M for Grade 11). Transport: ~IDR 67M/year (chaperoned elementary) or ~IDR 62M/year (unchaperoned secondary)."
          />

          </div>

          {/* Academic Results */}
          <AcademicResults
            results={[
              { value: "35.8", label: "Average IB Score (2024)" },
              { value: "97.5%", label: "IB Pass Rate" },
            ]}
            paragraphs={[
              "JIS offers the full IB continuum from PYP through DP, alongside Advanced Placement courses for students preferring the American pathway. The IB Diploma average was 35.8 in 2024 with a pass rate above 97%.",
              "University destinations include US institutions (40–50% of graduates, including Ivy League and top-20), UK universities (around 25%, including Oxbridge and Russell Group), and growing numbers to Australia, Canada, and Europe. The middle school follows a modified IB MYP with American curriculum elements.",
              "Class sizes average 18–20 students. Learning support and EAL programmes are available. STEAM subjects are well-resourced with dedicated labs and maker spaces.",
            ]}
          />

          {/* ── Warm band: Student Body ── */}
          <div className="section-band -mx-5 md:-mx-8 px-5 md:px-8 py-8 bg-warm-white border-y border-warm-border-light">
          <StudentBody
            paragraphs={[
              "JIS draws a mix of expatriate children and internationally-minded Indonesian families. The student body includes children of diplomats, multinational executives, and entrepreneurs. Many students have lived in multiple countries.",
              "Indonesian students now represent about 25% of enrolment, with the remainder spread across 60+ nationalities, the largest groups being American, South Korean, Japanese, and Australian. Gender split: 52:48 male to female.",
            ]}
            inspection={{
              date: "20 May 2023",
              body: "CIS / WASC",
              rating: "Excellent",
              findings:
                "CIS/WASC joint accreditation review noted strong student learning outcomes and community engagement. The report highlighted the school's mission-driven approach and breadth of programme offerings.",
            }}
          />

          </div>

          {/* School Life */}
          <SchoolLife
            activitiesCount={180}
            uniformRequired={true}
            facilities={[
              "50-metre Olympic swimming pool",
              "800-seat performing arts centre",
              "Three gymnasiums",
              "Two libraries (50,000 volumes)",
              "Elementary & secondary science labs",
              "Design technology & robotics labs",
              "Art studios & ceramics workshop",
              "Tennis courts & multipurpose fields",
              "Black box theatre",
              "Recording studio & music rooms",
              "Two cafeterias",
            ]}
            paragraphs={[
              "JIS runs a house system across grade levels with inter-house competitions in sports, arts, and community service. 'JIS Week' in February is the main cultural event, featuring performances, food fairs, and cultural presentations reflecting the school's international mix.",
              "The school competes in IASAS (Interscholastic Association of Southeast Asian Schools) against six other leading international schools across the region, and sport is a significant part of secondary school life. The arts programme produces large-scale musicals annually and there are dedicated music, drama, and visual arts spaces.",
              "Service learning is embedded into the curriculum. The Cilandak campus has a community feel, and many families use the pool and sports facilities at weekends. The PTA is active and well-organised.",
            ]}
          />

          {/* Location — 3 campuses */}
          <CampusMap
            campuses={[
              {
                name: "Cilandak Campus (Secondary)",
                address: "Jl. Terogong Raya No. 33, Cilandak, Jakarta Selatan 12430",
                grades: "Early Childhood – High School",
                lat: -6.2832,
                lng: 106.7920,
              },
              {
                name: "Cilandak Campus (Early Childhood)",
                address: "Jl. Terogong Raya, Cilandak, Jakarta Selatan 12430",
                grades: "Early Years",
                lat: -6.2845,
                lng: 106.7910,
              },
              {
                name: "Pattimura Campus (Elementary K–5)",
                address: "Jl. Pattimura Blok 1 No. 2, Kebayoran Baru, Jakarta Selatan 12110",
                grades: "Elementary Grades 1–5",
                lat: -6.2440,
                lng: 106.7975,
              },
            ]}
          />

          {/* Contact */}
          <ContactSection
            phone="+62 21 769 2555"
            email="admissions@jisedu.or.id"
            website="https://www.jisedu.or.id"
          />
        </div>

        {/* Sidebar */}
        <ProfileSidebar
          citySlug="jakarta"
          quickFacts={[
            { label: "Founded", value: "1951" },
            { label: "Type", value: "Non-profit, Co-ed" },
            { label: "Curriculum", value: "IB + AP" },
            { label: "Students", value: "2,500+" },
            { label: "Ages", value: "3–18" },
            { label: "Nationalities", value: "60+" },
            { label: "IB Average", value: "35.8" },
            { label: "Accreditation", value: "CIS / WASC" },
            { label: "Fees", value: "US$17K – $36K" },
          ]}
          otherSchools={[
            {
              name: "British School Jakarta",
              slug: "british-school-jakarta",
              meta: "British · Ages 3–18 · Pondok Indah",
              feeRange: "US$18K – $32K / year",
            },
            {
              name: "Australian Independent School",
              slug: "australian-independent-school-jakarta",
              meta: "Australian · Ages 3–18 · Kemang",
              feeRange: "US$12K – $22K / year",
            },
            {
              name: "Mentari Intercultural School",
              slug: "mentari-intercultural-school-jakarta",
              meta: "IB · Ages 3–18 · Pondok Indah",
              feeRange: "US$8K – $16K / year",
            },
          ]}
          relatedInsights={[
            {
              title: "The Expat Guide to International Schools in Jakarta",
              slug: "expat-guide-jakarta-international-schools",
              readTime: "12 min read",
            },
            {
              title: "IB vs British Curriculum: What Jakarta Parents Need to Know",
              slug: "ib-vs-british-curriculum-jakarta",
              readTime: "8 min read",
            },
          ]}
        />
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Jakarta Intercultural School",
            description:
              "Non-profit, co-educational international school established in 1951 offering IB PYP, MYP, Diploma and AP curricula.",
            url: "https://www.jisedu.or.id",
            telephone: "+62 21 769 2555",
            email: "admissions@jisedu.or.id",
            address: [
              {
                "@type": "PostalAddress",
                name: "Cilandak Campus",
                streetAddress: "Jl. Terogong Raya No. 33, Cilandak",
                addressLocality: "Jakarta Selatan",
                postalCode: "12430",
                addressCountry: "ID",
              },
              {
                "@type": "PostalAddress",
                name: "Pattimura Campus",
                streetAddress: "Jl. Pattimura Blok 1 No. 2, Kebayoran Baru",
                addressLocality: "Jakarta Selatan",
                postalCode: "12110",
                addressCountry: "ID",
              },
            ],
            foundingDate: "1951",
            numberOfStudents: "2500",
          }),
        }}
      />
    </div>
  );
}
