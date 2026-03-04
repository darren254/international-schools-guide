/**
 * Hong Kong school profiles: generates SchoolProfile objects from listing + fee data.
 */

import { HONG_KONG_SCHOOLS, type HongKongSchoolListing } from "@/data/hong-kong-schools";
import { HONG_KONG_FEE_DATA, HONG_KONG_RATE } from "@/data/hong-kong-school-profiles";
import type { SchoolProfile, FeeRow, OneTimeFee } from "@/data/schools";
import { extractHighestFee } from "@/lib/utils/fees";

function buildFeeRows(slug: string): FeeRow[] {
  const data = HONG_KONG_FEE_DATA[slug];
  if (!data?.feeRows?.length) return [];
  return data.feeRows.map((fr) => ({
    gradeLevel: fr.grade,
    ages: `Age ${fr.age}`,
    tuition: fr.amount,
    capital: 0,
    totalEarlyBird: fr.amount,
    totalStandard: fr.amount,
  }));
}

function buildOneTimeFees(slug: string): OneTimeFee[] {
  const data = HONG_KONG_FEE_DATA[slug];
  if (!data?.oneTimeFees) return [];
  return Object.entries(data.oneTimeFees)
    .filter(([, amount]) => amount > 0)
    .map(([name, amount]) => ({ name, amount }));
}

function createProfile(L: HongKongSchoolListing): SchoolProfile {
  const feeData = HONG_KONG_FEE_DATA[L.slug];
  const address = feeData?.address || L.area;
  const lat = feeData?.lat ?? 22.3;
  const lng = feeData?.lng ?? 114.17;
  const website = L.website || feeData?.website || "";
  const feeRows = buildFeeRows(L.slug);
  const oneTimeFees = buildOneTimeFees(L.slug);
  const highK = extractHighestFee(L.feeRange);
  const hasFeeData = feeRows.length > 0;
  const feeNote = hasFeeData
    ? "Fees shown in HKD. 1 USD ≈ 7.8 HKD. Contact the school for the full fee schedule."
    : L.feeRange === "Contact school"
      ? "Fees not publicly disclosed. Contact the school for current fee schedule."
      : `Approximate annual fee range: ${L.feeRange}. Contact the school for the full fee schedule.`;
  return {
    slug: L.slug,
    citySlug: "hong-kong",
    name: L.name,
    shortName: L.name.split(" ").slice(0, 3).join(" "),
    verified: L.verified,
    metaTitle: `${L.name} - Fees, Review & Admissions | Hong Kong`,
    metaDescription: `${L.name} (${L.area}). ${L.editorialSummary.slice(0, 140)}`,
    campuses: [{ name: "Main Campus", address, grades: L.ageRange, lat, lng }],
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
    intelligence: { verdict: L.editorialSummary, paragraphs: [L.editorialSummary], positives: [], considerations: [] },
    fees: {
      academicYear: "2025–2026",
      feeCurrency: "HKD",
      rows: hasFeeData ? feeRows : [{ gradeLevel: "All grades", ages: L.ageRange, tuition: highK > 0 ? Math.round(highK * 1000 * 7.8) : 0, capital: 0, totalEarlyBird: highK > 0 ? Math.round(highK * 1000 * 7.8) : 0, totalStandard: highK > 0 ? Math.round(highK * 1000 * 7.8) : 0 }],
      oneTime: oneTimeFees,
      note: feeNote,
    },
    academics: { results: L.examResults, paragraphs: L.examResults.length ? [`Key results: ${L.examResults.map((r) => `${r.label} ${r.value}`).join(", ")}.`] : [] },
    studentBody: { paragraphs: ["Hong Kong's international schools serve a highly diverse student body drawn from across Asia and beyond. Contact the school for current enrolment details."] },
    schoolLife: { activitiesCount: 0, uniformRequired: true, facilities: [], paragraphs: ["Contact the school for details on co-curricular activities and facilities."] },
    contact: { phone: L.phone ?? "", email: L.email ?? "", website },
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
    jsonLd: { description: L.editorialSummary, foundingDate: "", numberOfStudents: L.studentCount },
  };
}

const PROFILES_MAP: Record<string, SchoolProfile> = Object.fromEntries(
  HONG_KONG_SCHOOLS.map((s) => [s.slug, createProfile(s)])
);

// ═══════════════════════════════════════════════════════
// EDITORIAL OVERRIDES — Intelligence from briefing adaptation
// See scripts/intelligence-briefings/hong-kong.json
// ═══════════════════════════════════════════════════════

function applyHongKongIntelligence(
  slug: string,
  intelligence: SchoolProfile["intelligence"]
): void {
  const p = PROFILES_MAP[slug];
  if (p) p.intelligence = intelligence;
}

applyHongKongIntelligence("chinese-international-school", {
  verdict:
    "The most expensive international school in Hong Kong and the strongest bilingual Mandarin-English programme; IB results in the global top tier. Cost and Mandarin intensity are the main trade-offs.",
  paragraphs: [
    "CIS runs a genuine bilingual Mandarin-English programme with roughly half of Primary delivered in Mandarin. 2025 IB Diploma average 38.95; 28% earn the Bilingual IB Diploma. Braemar Hill campus is purpose-built; Y10 Hangzhou residential year is part of the programme.",
    "Fees are the highest in HK; Corporate Nomination Right is HK$15M. Mandarin at Primary is not optional and is demanding. A 2011 governance crisis remains in the public record. Ask about capital and nomination structure.",
  ],
  positives: [
    "Strongest bilingual Mandarin-English programme in HK. IB results in global top tier (2025 avg 38.95, 49% at 40+). Y10 Hangzhou year; through-train Reception to Y13.",
  ],
  considerations: [
    "Highest fees in HK; aggressive fundraising noted. Mandarin intensity at Primary is formidable. 2011 governance crisis in public record. Y10 Hangzhou year non-negotiable.",
  ],
});

applyHongKongIntelligence("australian-international-school", {
  verdict:
    "IB World School with strong results (2025 average 38.6; 2022 was 41). Genuine bilingual option; Capital Note (HK$6.5M) creates a two-tier admissions system. Ask about capital and levy structure.",
  paragraphs: [
    "AISHK offers full IB continuum and bilingual Mandarin-English from age 5. Purpose-built Cyberport campus; 7:1 student-teacher ratio. Results are consistently in the global top tier.",
    "Capital Note and annual levy add significantly to cost. Student body is 70% HK locals (ethnic Chinese). Ask about admissions pathway and capital requirements.",
  ],
  positives: [
    "IB results in global top tier. Bilingual Mandarin-English from age 5. 7:1 ratio; 56,000 sqm campus. Full IB continuum.",
  ],
  considerations: [
    "Capital Note HK$6.5M creates two-tier admissions. 70% HK locals. Annual Capital Levy on top of tuition.",
  ],
});

applyHongKongIntelligence("canadian-international-school-of", {
  verdict:
    "IB World School (CDNIS) with strong programme and diverse community. Fees and capital levy are material; ask about total cost and debenture options.",
  paragraphs: [
    "CDNIS runs PYP, MYP and DP on an Aberdeen campus. Consistently well regarded for curriculum and facilities.",
    "Capital levy applies; verify total cost and any debenture or nomination requirements.",
  ],
  positives: [
    "Full IB continuum. Strong reputation. Good facilities.",
  ],
  considerations: [
    "Verify capital levy and total cost. Ask about debenture if relevant.",
  ],
});

applyHongKongIntelligence("hong-kong-international-school", {
  verdict:
    "American-curriculum school with a long track record; optional debentures and capital levy. Ask about total cost and admissions pathway.",
  paragraphs: [
    "HKIS offers American curriculum through to Grade 12. Well established and widely recognised.",
    "Fees plus capital levy; optional debentures at HK$3M–5M. Verify total cost and admissions requirements.",
  ],
  positives: [
    "American curriculum. Long track record. Strong reputation.",
  ],
  considerations: [
    "High fees and capital levy. Optional debentures - confirm total cost.",
  ],
});

applyHongKongIntelligence("yew-chung-international-school", {
  verdict:
    "One of the oldest bilingual international schools in Hong Kong; distinctive co-teaching model (one English, one Chinese teacher per class). Ask about debenture and sibling discounts.",
  paragraphs: [
    "YCIS uses a co-teaching model with two teachers per class. Clear pathway: Yew Chung curriculum to IGCSE to IB Diploma. Multiple campuses in family areas.",
    "Mandatory debenture (HK$150K–470K); sibling discounts apply. Verify total cost and campus options.",
  ],
  positives: [
    "Unique co-teaching model. Clear academic pathway; multiple campuses. Bilingual from early years.",
  ],
  considerations: [
    "Mandatory debenture; verify level and refundability. Ask about sibling discounts.",
  ],
});

applyHongKongIntelligence("kellett-school", {
  verdict:
    "British school with Outstanding BSO and strong A-Level/GCSE results. Not-for-profit; parent-led board. Bullying and social environment have been raised in parent reviews.",
  paragraphs: [
    "Kellett was Outstanding across every category in the 2023 BSO inspection. A-Level 2025: 60.6% A*-A, 95.1% A*-C; GCSE 2025: 85.1% A*-A. Sky Pitch, 25m pool, CrossFit gym, theatre.",
    "Capital levy HK$40K/year; debentures available. A-Level pathway is narrower than IB for families with uncertain destination plans. Predominantly British/European expat community.",
  ],
  positives: [
    "Outstanding BSO (2023). Strong A-Level and GCSE results. Not-for-profit; parent-led board. Strong facilities.",
  ],
  considerations: [
    "Bullying and social environment concerns in parent reviews. A-Level-only limits flexibility. British/European skew.",
  ],
});

applyHongKongIntelligence("hong-kong-academy", {
  verdict:
    "Nurturing, inclusive IB school with strong pastoral focus and open DP access; lower published IB average by design. Remote Sai Kung location and Learning Support concerns in reviews.",
  paragraphs: [
    "HKA offers a full IB continuum with an open DP policy and genuine inclusion (c.10–15% learner support). Award-winning sustainable Sai Kung campus; ~600 students, 45+ nationalities. Global Citizen Diploma offered.",
    "Published IB average ~32 (above global); debenture HK$630K and entrance fees add materially. Learning Support staffing and responsiveness have drawn criticism in 2022–24 reviews. Sai Kung is 45–60+ minutes from Central/Wanchai.",
  ],
  positives: [
    "Inclusive mainstream; open IB DP access. Global Citizen Diploma; 1:6 ratio; sustainable campus. Strong parent sentiment on care.",
  ],
  considerations: [
    "Remote Sai Kung; long commute. Learning Support quality and turnover flagged. High upfront debenture and entrance fees.",
  ],
});

applyHongKongIntelligence("stamford-american-international-school", {
  verdict:
    "American/IB school with new West Kowloon high school campus and improving IB results. Cognita ownership; parent and teacher satisfaction below peers — verify current experience.",
  paragraphs: [
    "Stamford offers American curriculum to G10 then IB DP; STEMinn programme, 1:1 devices. 2025 IB average 35 (up from 32.5 in 2023). New 75,000 sq ft West Kowloon high school from 2025.",
    "Cognita-owned; teacher burnout and commercial focus noted in forums. iSchoolAdvisor average 2.42/5. Split campuses (Ho Man Tin Pre-K–G8, West Kowloon G9–12); capital levy material.",
  ],
  positives: [
    "New West Kowloon HS campus; improving IB trend. STEMinn and bilingual option. Strong student-teacher ratio.",
  ],
  considerations: [
    "Cognita ownership; low parent satisfaction scores. Split campus at G9. Young school; thin university track record.",
  ],
});

applyHongKongIntelligence("german-swiss-international-school", {
  verdict:
    "Dual-stream school (German Abitur and British/IB English stream) with top-tier IB results (2024 average 40). Admission priority for German/Swiss/Austrian nationals; high-pressure academic culture.",
  paragraphs: [
    "GSIS runs German-medium Abitur and English IGCSE/IB streams. 2024 IB average 40, 100% pass, 66% at 40+; IGCSE 2025: 91% A*/A. Peak campus with pool, rooftop pitch, labs, theatre. BLI 'Excellent German School Abroad' (2023).",
    "No compulsory annual levy. Historical governance issues (2013, 2018, 2020); new Principal from 2024. German compulsory for English-stream from Y2. New Infrastructure Debenture introduced.",
  ],
  positives: [
    "Top-tier IB results; German stream offers Abitur and German university access. No annual levy. Strong campus and BLI seal.",
  ],
  considerations: [
    "Admission priority for German/Swiss/Austrian nationals. High homework load; competitive culture. Historical controversies; new Principal.",
  ],
});

applyHongKongIntelligence("discovery-college", {
  verdict:
    "ESF through-train IB school in Discovery Bay with strong arts, sport, and outdoor learning. Remote unless you live in DB; no IGCSE pathway.",
  paragraphs: [
    "Discovery College is one of two ESF Private Independent Schools (no catchment). EOTC and No Boundaries programmes embedded. 2025 IB average 35.2 (96% pass). Vertical campus with ETFE roof, rooftop pool, climbing wall, five drama spaces.",
    "Discovery Bay location is remote from Central/Kowloon. No IGCSE — full IB MYP only. New principal from Sept 2025. Fees above standard ESF; no government subsidy.",
  ],
  positives: [
    "Full IB continuum; above-world-average IB results. Outstanding facilities; EOTC and No Boundaries embedded. Open admissions.",
  ],
  considerations: [
    "Discovery Bay only practical if you live there. No IGCSE option. New principal; DB-centric community.",
  ],
});

applyHongKongIntelligence("south-island-school", {
  verdict:
    "ESF secondary with top-tier IB results and three-strand curriculum (academic, pastoral, Values in Action). Catchment-restricted; excellent value for fee level.",
  paragraphs: [
    "SIS is regularly cited as the pick of ESF secondaries on HK Island. IB results at or near top of ESF group; 24 places for high additional learning need. Post-16: IBDP, IBCP, SIS Advanced Diploma/BTEC.",
    "Catchment-based admissions; class sizes ~24 in Y7–9. Y12–13 fees HK$167,600; NCL costs rising. School-specific IB/destinations not published separately from ESF.",
  ],
  positives: [
    "Outstanding IB results for a non-selective school. Three-strand curriculum; formal SEN reserve. Post-16 breadth; 1:1 Mac programme; Wellbeing Hub.",
  ],
  considerations: [
    "Catchment-restricted; Kowloon families cannot apply. Larger class sizes than premium privates. NCL phasing out.",
  ],
});

applyHongKongIntelligence("the-harbour-school", {
  verdict:
    "Progressive American-curriculum school with strong AP results, 1:8 ratio, and genuine inclusion (SEN and advanced learners). Unconventional pedagogy; debenture or capital levy.",
  paragraphs: [
    "THS uses facilitators, 'missions' not homework, and experiential learning (e.g. sailboat science). 2025 AP average 4.27/5 (83% at 4+). ~50% mainstream, ~40% learning support, ~10% 1:1; 1:8 ratio with lead and co-teacher per class.",
    "Debenture HK$400K or HK$30K/year per child capital levy. US-oriented pathway; some families use as bridge school while waiting for other waitlists.",
  ],
  positives: [
    "1:8 ratio; strong AP results. Genuine inclusion; experiential curriculum. No entry exam; trial day. Consistently warm reviews.",
  ],
  considerations: [
    "Debenture or annual levy. AP-only; US-oriented. Unconventional pedagogy; 'holding school' perception in some forums.",
  ],
});

// Batch 21-30 from briefing emails (Mar 2026)
applyHongKongIntelligence("christian-alliance-international-school", {
  verdict:
    "IB and Canadian curriculum; individual capital note HK$560K. Ask about debenture and fee structure.",
  paragraphs: [
    "CAIS offers IB and Canadian curriculum with fees HK$141K–237K. Briefing data was limited; verify results and capital note terms with the school.",
  ],
  positives: ["IB and Canadian curriculum. Established presence. Individual capital note option."],
  considerations: ["Capital note HK$560K. Confirm fee inclusions and retention."],
});

applyHongKongIntelligence("international-christian-school", {
  verdict:
    "Christian American school; ask about curriculum fit and pastoral support.",
  paragraphs: [
    "ICS offers American curriculum in a Christian context. Briefing content was limited; families should confirm fit, fees and results directly.",
  ],
  positives: ["American curriculum. Christian ethos. Strong community reported."],
  considerations: ["Ensure fit with faith-based approach. Verify fee structure and retention."],
});

applyHongKongIntelligence("american-international-school", {
  verdict:
    "American curriculum with AP; Kowloon Tong. Capital levy HK$12K/year. Ask about retention and exam support.",
  paragraphs: [
    "AIS offers American curriculum and AP with fees HK$97K–180K. Briefing data was limited; contact the school for current outcomes.",
  ],
  positives: ["American curriculum and AP. Kowloon Tong. Capital levy HK$12K/year."],
  considerations: ["Verify fee breakdown. Ask about retention and university support."],
});

applyHongKongIntelligence("discovery-bay-international-school", {
  verdict:
    "British curriculum with IGCSE in Discovery Bay; school development levy HK$60K. Ask about secondary pathway and retention.",
  paragraphs: [
    "DBIS runs British curriculum in Discovery Bay with fees HK$132K–196K. Briefing content was limited; verify results and pastoral support.",
  ],
  positives: ["British curriculum and IGCSE. Discovery Bay location. School development levy HK$60K."],
  considerations: ["Discovery Bay location may suit DB residents best. Confirm levy terms and retention."],
});

applyHongKongIntelligence("renaissance-college", {
  verdict:
    "ESF through-train IB school in Ma On Shan; building levy HK$50K (Y1 entry). Ask about NCL and waitlist.",
  paragraphs: [
    "RCHK offers the full IB continuum with fees HK$148K–195K (2025/2026). Paid over 10 months. Briefing data was limited; confirm entry requirements and retention.",
  ],
  positives: ["ESF through-train IB. Ma On Shan. Building levy HK$50K for Y1 entry. Paid over 10 months."],
  considerations: ["Confirm building levy and NCL. ESF waitlists can be long; apply early."],
});

applyHongKongIntelligence("west-island-school", {
  verdict:
    "ESF secondary school; NCL sliding scale. Y10 now non-subvented. Ask about nomination rights and retention.",
  paragraphs: [
    "WIS is an ESF secondary school with fees HK$159K–181K (2025/2026). Briefing content was limited; verify NCL and entry pathway.",
  ],
  positives: ["ESF secondary. NCL sliding scale. Established IB and British curriculum."],
  considerations: ["Y10 now non-subvented. Confirm NCL and nomination rights. Apply early."],
});

applyHongKongIntelligence("island-school", {
  verdict:
    "ESF secondary in Sha Tin; NCL HK$3.8K–26K sliding scale. Optional nomination rights HK$500K. Ask about waitlist.",
  paragraphs: [
    "Island School is an ESF secondary with fees HK$159K–181K. Briefing data was limited; confirm NCL and entry requirements.",
  ],
  positives: ["ESF secondary. Sha Tin. NCL sliding scale. Optional nomination rights HK$500K."],
  considerations: ["Confirm NCL band. ESF waitlists competitive; have a backup."],
});

applyHongKongIntelligence("concordia-international-school", {
  verdict:
    "American curriculum with AP; secondary only. Ask about feeder primaries and retention.",
  paragraphs: [
    "Concordia offers American curriculum and AP for ages 12–18 with fees HK$134K–156K. Briefing content was limited.",
  ],
  positives: ["American curriculum and AP. Secondary focus. No debenture mentioned."],
  considerations: ["Secondary only; confirm feeder primaries. Verify fee structure."],
});

applyHongKongIntelligence("dsc-international-school", {
  verdict:
    "Ontario (OSSD) curriculum; fees HK$147K–168K. Ask about Canadian university pathway and retention.",
  paragraphs: [
    "DSC offers Ontario OSSD curriculum with fees HK$147K–168K. Briefing data was limited; contact the school for current outcomes.",
  ],
  positives: ["OSSD curriculum. Fees HK$147K–168K. Canadian pathway."],
  considerations: ["Confirm OSSD recognition for your target universities. Ask about retention."],
});

export const HONG_KONG_SCHOOL_PROFILES = PROFILES_MAP;
export const ALL_HONG_KONG_SCHOOL_SLUGS = Object.keys(PROFILES_MAP);
