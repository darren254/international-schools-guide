/**
 * Dubai school profiles: generates SchoolProfile objects from listing + fee data.
 * Mirrors the Jakarta minimal profile pattern in schools.ts.
 */

import { DUBAI_SCHOOLS, type DubaiSchoolListing } from "@/data/dubai-schools";
import { DUBAI_FEE_DATA, DUBAI_AED_TO_USD } from "@/data/dubai-school-profiles";
import type { SchoolProfile, FeeRow, OneTimeFee } from "@/data/schools";
import { extractHighestFee } from "@/lib/utils/fees";

const AED_EXCHANGE_RATE_DATE = "28 Feb 2026";

function buildFeeRows(slug: string): FeeRow[] {
  const data = DUBAI_FEE_DATA[slug];
  if (!data?.feeRows?.length) return [];

  return data.feeRows.map((fr) => {
    return {
      gradeLevel: fr.grade,
      ages: `Age ${fr.age}`,
      tuition: fr.amountAed,
      capital: 0,
      totalEarlyBird: fr.amountAed,
      totalStandard: fr.amountAed,
    };
  });
}

function buildOneTimeFees(slug: string): OneTimeFee[] {
  const data = DUBAI_FEE_DATA[slug];
  if (!data?.oneTimeFees) return [];

  return Object.entries(data.oneTimeFees)
    .filter(([, amount]) => amount > 0)
    .map(([name, amount]) => ({ name, amount }));
}

function createDubaiProfile(L: DubaiSchoolListing): SchoolProfile {
  const feeData = DUBAI_FEE_DATA[L.slug];
  const address = feeData?.address || L.area;
  const lat = feeData?.lat ?? 25.2;
  const lng = feeData?.lng ?? 55.3;
  const website = L.website || feeData?.website || "";
  const feeRows = buildFeeRows(L.slug);
  const oneTimeFees = buildOneTimeFees(L.slug);

  const highK = extractHighestFee(L.feeRange);
  const hasFeeData = feeRows.length > 0;

  const feeNote = hasFeeData
    ? `Fees shown in AED (UAE Dirham). 1 USD ≈ ${DUBAI_AED_TO_USD} AED. Contact the school for the full fee schedule.`
    : L.feeRange === "Contact school"
      ? "Fees not publicly disclosed. Contact the school for current fee schedule."
      : `Approximate annual fee range: ${L.feeRange}. Contact the school for the full fee schedule.`;

  return {
    slug: L.slug,
    citySlug: "dubai",
    name: L.name,
    shortName: L.name
      .replace(/ Dubai$/, "")
      .replace(/ Dubai-Sharjah-Ajman$/, "")
      .split(" ")
      .slice(0, 3)
      .join(" "),
    verified: L.verified,
    metaTitle: `${L.name} - Fees, Review & Admissions | Dubai`,
    metaDescription: `${L.name} (${L.area}). ${L.editorialSummary.slice(0, 140)}`,
    campuses: [
      { name: "Main Campus", address, grades: L.ageRange, lat, lng },
    ],
    lastUpdated: "February 2026",
    curricula: L.curricula,
    stats: [
      { value: L.studentCount, label: "Students" },
      { value: L.ageRange, label: "Age Range" },
      { value: L.area, label: "Location" },
      { value: L.feeRange, label: "Annual Fees" },
    ],
    head: { name: "School leadership", since: 0, bio: "Contact the school for details." },
    photoAlts: [L.name, "Campus", "Students"],
    intelligence: {
      verdict: L.editorialSummary,
      paragraphs: [L.editorialSummary],
      positives: [],
      considerations: [],
    },
    fees: {
      academicYear: "2025–2026",
      feeCurrency: "AED",
      rows: hasFeeData
        ? feeRows
        : [
            {
              gradeLevel: "All grades",
              ages: L.ageRange,
              tuition: highK > 0 ? Math.round(highK * 1000 * DUBAI_AED_TO_USD) : 0,
              capital: 0,
              totalEarlyBird: highK > 0 ? Math.round(highK * 1000 * DUBAI_AED_TO_USD) : 0,
              totalStandard: highK > 0 ? Math.round(highK * 1000 * DUBAI_AED_TO_USD) : 0,
            },
          ],
      oneTime: oneTimeFees,
      note: feeNote,
    },
    academics: {
      results: L.examResults,
      paragraphs: L.examResults.length
        ? [`Key results: ${L.examResults.map((r) => `${r.label} ${r.value}`).join(", ")}.`]
        : [],
    },
    studentBody: {
      paragraphs: [
        "Dubai's international schools serve a highly diverse student body drawn from over 180 nationalities. Contact the school for current enrolment details.",
      ],
    },
    schoolLife: {
      activitiesCount: 0,
      uniformRequired: true,
      facilities: [],
      paragraphs: [
        "Contact the school for details on co-curricular activities and facilities.",
      ],
    },
    contact: {
      phone: L.phone ?? "",
      email: L.email ?? "",
      website,
    },
    sidebar: {
      quickFacts: [
        { label: "Location", value: L.area },
        { label: "Curriculum", value: L.curricula.slice(0, 3).join(", ") },
        { label: "Students", value: L.studentCount },
        { label: "Ages", value: L.ageRange },
        { label: "Fees", value: L.feeRange },
        ...(feeData?.maxClassSize ? [{ label: "Max Class Size", value: feeData.maxClassSize }] : []),
      ],
      otherSchools: [],
      relatedInsights: [],
    },
    jsonLd: {
      description: L.editorialSummary,
      foundingDate: "",
      numberOfStudents: L.studentCount,
    },
  };
}

const DUBAI_PROFILES_MAP: Record<string, SchoolProfile> = Object.fromEntries(
  DUBAI_SCHOOLS.map((s) => [s.slug, createDubaiProfile(s)])
);

// ═══════════════════════════════════════════════════════
// EDITORIAL OVERRIDES — full profiles for schools with
// real intelligence data. These replace the auto-generated
// placeholder fields while preserving fee data.
// ═══════════════════════════════════════════════════════

if (DUBAI_PROFILES_MAP["jumeirah-english-speaking-school"]) {
  const jess = DUBAI_PROFILES_MAP["jumeirah-english-speaking-school"];

  jess.name = "Jumeirah English Speaking School (JESS AR)";
  jess.shortName = "JESS AR";
  jess.metaTitle = "Jumeirah English Speaking School (JESS AR) - Fees, IB Results & Review | Dubai";
  jess.metaDescription = "JESS Arabian Ranches profile - KHDA Outstanding, IB average 37-38, 77% GCSE 9-7, fees AED 54K-105K/year. Independent editorial review for parents.";
  jess.lastUpdated = "March 2026";
  jess.curricula = ["British National Curriculum", "IB Diploma", "BTEC"];
  jess.stats = [
    { value: "~1,600", label: "Students" },
    { value: "3–18", label: "Age Range" },
    { value: "70", label: "Nationalities" },
    { value: "US$15K – US$28K", label: "Annual Fees" },
  ];

  jess.head = {
    name: "Mark Ford",
    since: 2019,
    bio: "Mark Ford has led JESS Arabian Ranches since 2019. He joined from a senior leadership role within the JESS group and has overseen the school's sustained KHDA Outstanding ratings.",
  };

  jess.photoAlts = [
    "JESS Arabian Ranches campus",
    "Students in the classroom",
    "Swimming pool and sports facilities",
    "Open-air campus design",
  ];

  jess.intelligence = {
    verdict:
      "If you live in Arabian Ranches and your child is academically strong, JESS AR is a very strong pick - IB results that match or beat pricier competitors, a community that works because everyone lives around the corner, and teachers who stay. If you're in JLT or the Marina, the commute kills it.",
    paragraphs: [
      "JESS Arabian Ranches is where the Arabian Ranches crowd ends up. Kids cycle to the gates, parents see each other at the community centre, and school friendships double as neighbourhood friendships. That closeness is the whole identity. The numbers are hard to argue with: an IB Diploma average of 37-38, multiple perfect 45s, and 77% of GCSEs graded 9-7. Sixth form fees of AED 105K sit below several Dubai schools producing comparable IB results, and primary at AED 65K is noticeably cheaper than the AED 80K-90K bracket at rival British schools.",
      "Teacher turnover sits at 9.6%, which in Dubai terms is exceptional - most schools churn through a quarter of their staff every year. That stability shows in the classroom. Teachers know your child across years, not just within them. KHDA has rated the school Outstanding consistently, with English, maths, and science called out as Outstanding across all phases. The student body is majority British with 70 nationalities represented, and 12.5% of students have SEND needs - a sign the school takes inclusion seriously rather than just talking about it.",
      "The catch is geography. Arabian Ranches is not central Dubai. From JVC, Business Bay, or anywhere on the Palm, you're looking at 35-45 minutes each way, and the roads around the Ranches still fill up at drop-off. The community feel cuts both ways. Long-term residents describe a village inside a city. A minority - particularly in secondary - find the social scene tight enough to feel claustrophobic. KHDA rated wellbeing Very Good rather than Outstanding, and flagged inconsistency between primary and sixth form teaching. Still strong, but not flawless.",
    ],
    positives: [
      "IB Diploma average of 37-38 with 100% pass rate and multiple perfect 45s in recent years. At AED 105K for sixth form, that's competitive with schools charging AED 120K-130K for similar IB outcomes. Primary fees of AED 65K are well below the top-tier British school average.",
      "77% of GCSEs graded 9-7 in 2023-24 - not a cherry-picked top set, but the full cohort. BTEC students hit 85% Distinction alongside the academic routes.",
      "KHDA Outstanding, sustained across multiple inspection cycles. English, maths, and science rated Outstanding in every phase.",
      "Staff turnover at 9.6% - one of the lowest in Dubai. Teachers stay, which means they know your child properly, not just for a year.",
      "Genuinely inclusive: 12.5% of students have SEND needs and 17% receive EAL support. This isn't a school that quietly filters out children who need more.",
      "University destinations include LSE, UCL, Harvard, Imperial, Durham, UC Berkeley, and St Andrews. The pipeline to strong UK and US universities is well-established.",
      "For Arabian Ranches residents, the convenience is hard to beat. Kids walk or cycle. The school is part of the neighbourhood, not a 40-minute commute away from it.",
    ],
    considerations: [
      "Location is the dealbreaker for most families outside Arabian Ranches. From JLT, Business Bay, or the Marina, you're looking at 35-45 minutes each way at school run times. The surrounding roads have improved but still back up.",
      "Admissions are competitive. Don't assume a space is available mid-year or even for the following September. Register early and have a backup.",
      "KHDA rated wellbeing Very Good, not Outstanding. Pastoral systems are solid but the inspectors see room to develop - worth asking what's changed since the last report.",
      "The tight-knit Ranches community can feel insular in secondary. If your child is joining from outside the neighbourhood, ask current parents honestly about how easy it is to break in socially.",
      "Primary-to-sixth-form teaching consistency was flagged in the most recent inspection. The DP results are excellent, but the quality of day-to-day teaching isn't uniform across every phase.",
    ],
  };

  jess.academics = {
    results: [
      { value: "37–38", label: "IB Diploma Average (2025)" },
      { value: "100%", label: "IB Pass Rate" },
      { value: "77%", label: "GCSE 9–7 (2023–24)" },
      { value: "85%", label: "BTEC Distinction" },
    ],
    paragraphs: [
      "JESS AR runs the British National Curriculum from EYFS through GCSE, then offers the IB Diploma and BTEC in sixth form. That combination - British structure through to 16, then IB or vocational routes - gives families genuine flexibility at the exit point without switching schools.",
      "The IB average of 37-38 puts JESS AR level with or ahead of several Dubai schools charging AED 110K-130K. Multiple students have scored a perfect 45 in recent years. GCSE results are equally strong: 77% graded 9-7 across the full cohort, not a selective subset.",
      "University destinations include LSE, UCL, Harvard, Imperial, Durham, UC Berkeley, and St Andrews. The school produces consistent UK and US placements, with a growing number heading to European and Australian universities.",
    ],
  };

  jess.studentBody = {
    paragraphs: [
      "The school community leans British, with roughly 70 nationalities represented. A significant proportion of families are long-term Arabian Ranches residents - the school and the neighbourhood are closely intertwined. 50 Emirati students are enrolled.",
      "12.5% of students have SEND needs, and 17% receive EAL support. Staff turnover is 9.6%, which is exceptionally low by Dubai standards and reflects a stable, experienced teaching team.",
    ],
    inspection: {
      date: "2023–24",
      body: "KHDA / DSIB",
      rating: "Outstanding",
      findings:
        "Outstanding ratings sustained across multiple cycles. English, maths, and science rated Outstanding in all phases. Wellbeing rated Very Good. Inspectors recommended further consistency between primary and sixth form teaching quality.",
    },
  };

  jess.schoolLife = {
    activitiesCount: 0,
    uniformRequired: true,
    facilities: [
      "9-acre campus",
      "Swimming pools",
      "Auditorium",
      "Open-air campus design",
      "Sports fields",
    ],
    paragraphs: [
      "The campus sits inside the Arabian Ranches development, which gives it a character most Dubai schools don't have. It's not behind a highway wall or in a commercial zone. Kids from the surrounding villas walk or cycle in.",
      "The parent community overlaps with the neighbourhood community, which means school events have an easy, informal quality. For families living in the Ranches, the school is part of daily life rather than a destination you drive to.",
    ],
  };

  jess.sidebar = {
    quickFacts: [
      { label: "Location", value: "Arabian Ranches" },
      { label: "Curriculum", value: "British, IB Diploma, BTEC" },
      { label: "Students", value: "~1,600" },
      { label: "Ages", value: "3–18" },
      { label: "Nationalities", value: "70" },
      { label: "IB Average", value: "37–38" },
      { label: "KHDA Rating", value: "Outstanding" },
      { label: "Fees", value: "AED 54,129 – AED 104,544" },
      { label: "Max Class Size", value: "24" },
      { label: "Staff Turnover", value: "9.6%" },
    ],
    otherSchools: [],
    relatedInsights: [],
  };

  jess.jsonLd = {
    description:
      "KHDA Outstanding British-curriculum and IB Diploma school in Arabian Ranches, Dubai. IB average 37-38, 77% GCSE 9-7, 70 nationalities.",
    foundingDate: "",
    numberOfStudents: "1600",
  };
}

export const DUBAI_SCHOOL_PROFILES = DUBAI_PROFILES_MAP;
export const ALL_DUBAI_SCHOOL_SLUGS = Object.keys(DUBAI_PROFILES_MAP);
