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

export const DUBAI_SCHOOL_PROFILES = DUBAI_PROFILES_MAP;
export const ALL_DUBAI_SCHOOL_SLUGS = Object.keys(DUBAI_PROFILES_MAP);
