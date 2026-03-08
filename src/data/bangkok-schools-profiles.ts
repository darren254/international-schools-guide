/**
 * Bangkok school profiles: generates SchoolProfile objects from listing + fee data.
 */

import { BANGKOK_SCHOOLS, type BangkokSchoolListing } from "@/data/bangkok-schools";
import { BANGKOK_FEE_DATA, BANGKOK_RATE } from "@/data/bangkok-school-profiles";
import type { SchoolProfile, FeeRow, OneTimeFee } from "@/data/schools";
import { extractHighestFee } from "@/lib/utils/fees";

function buildFeeRows(slug: string): FeeRow[] {
  const data = BANGKOK_FEE_DATA[slug];
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
  const data = BANGKOK_FEE_DATA[slug];
  if (!data?.oneTimeFees) return [];
  return Object.entries(data.oneTimeFees)
    .filter(([, amount]) => amount > 0)
    .map(([name, amount]) => ({ name, amount }));
}

function createProfile(L: BangkokSchoolListing): SchoolProfile {
  const feeData = BANGKOK_FEE_DATA[L.slug];
  const address = feeData?.address || L.area;
  const lat = feeData?.lat ?? 13.75;
  const lng = feeData?.lng ?? 100.52;
  const website = L.website || feeData?.website || "";
  const feeRows = buildFeeRows(L.slug);
  const oneTimeFees = buildOneTimeFees(L.slug);
  const highK = extractHighestFee(L.feeRange);
  const hasFeeData = feeRows.length > 0;
  const feeNote = hasFeeData
    ? "Fees shown in THB. 1 USD ≈ 35.0 THB. Contact the school for the full fee schedule."
    : L.feeRange === "Contact school"
      ? "Fees not publicly disclosed. Contact the school for current fee schedule."
      : `Approximate annual fee range: ${L.feeRange}. Contact the school for the full fee schedule.`;
  return {
    slug: L.slug,
    citySlug: "bangkok",
    name: L.name,
    shortName: L.name.split(" ").slice(0, 3).join(" "),
    verified: L.verified,
    metaTitle: `${L.name} - Fees, Review & Admissions | Bangkok`,
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
      feeCurrency: "THB",
      rows: hasFeeData ? feeRows : [{ gradeLevel: "All grades", ages: L.ageRange, tuition: highK > 0 ? Math.round(highK * 1000 * 35.0) : 0, capital: 0, totalEarlyBird: highK > 0 ? Math.round(highK * 1000 * 35.0) : 0, totalStandard: highK > 0 ? Math.round(highK * 1000 * 35.0) : 0 }],
      oneTime: oneTimeFees,
      note: feeNote,
    },
    academics: { results: L.examResults, paragraphs: L.examResults.length ? [`Key results: ${L.examResults.map((r) => `${r.label} ${r.value}`).join(", ")}.`] : [] },
    studentBody: { paragraphs: ["Bangkok's international schools serve a diverse community of expat and local families. Contact the school for current enrolment details."] },
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
  BANGKOK_SCHOOLS.map((s) => [s.slug, createProfile(s)])
);

// ═══════════════════════════════════════════════════════
// EDITORIAL OVERRIDES — Intelligence from briefing adaptation
// See scripts/intelligence-briefings/bangkok.json
// ═══════════════════════════════════════════════════════

function applyBangkokIntelligence(
  slug: string,
  intelligence: SchoolProfile["intelligence"]
): void {
  const p = PROFILES_MAP[slug];
  if (p) p.intelligence = intelligence;
}

applyBangkokIntelligence("wellington-college-international-school", {
  verdict:
    "Purpose-built British school (opened 2018) with impressive facilities; Sixth Form launched 2024. Predominantly Thai/Chinese-Thai intake; no published exam results yet. Ask about staff turnover and management.",
  paragraphs: [
    "Wellington Bangkok has two pools (50m and 25m), 600-seat theatre, sports pitches and running track. Parents describe a happy, thriving environment and approachable management. Student body is predominantly wealthy Thai and Chinese-Thai.",
    "Staff turnover is flagged in multiple sources; Reddit and ITF note management concerns. For-profit structure. No published exam results; A-Level results not available until 2026 at earliest. Location is remote; 45–60 minutes from central Bangkok.",
  ],
  positives: [
    "Outstanding campus and facilities. British pathway IGCSE to A-Level. Small primary class sizes with teaching assistants.",
  ],
  considerations: [
    "No published exam results; A-Levels too new to assess. Predominantly Thai/Chinese-Thai; English not default social language. Staff turnover and management concerns raised. Remote location.",
  ],
});

applyBangkokIntelligence("international-school", {
  verdict:
    "Consistently ranked among Bangkok's top two or three international schools; strong IB results and genuine diversity. Leadership crisis in 2025 (head suspended) - ask about current leadership and staff retention.",
  paragraphs: [
    "ISB has around 1,700 students from 60+ nationalities (Americans ~30%, Thais 24%). IB 2025 average 34, 16% scoring 40+. Campus in Nichada Thani; parent reviews praise learning support, EAL and facilities.",
    "In November 2025 the Head of School was suspended following a harassment incident; teacher forums describe chaos and resignations. Substance use has come up in parent discussions about the senior years. Ask about pastoral support and expectations for older students. Cost is very high including registration and Nichada housing.",
  ],
  positives: [
    "Strong IB results; 60+ nationalities. Excellent learning support and EAL. American curriculum flexibility (IB, AP, ISB Diploma). Strong university placement.",
  ],
  considerations: [
    "Leadership crisis 2025; ask about current leadership and staff retention. Substance use has been raised in discussions - ask how the school supports older students. Very high total cost. Isolated location.",
  ],
});

applyBangkokIntelligence("shrewsbury-international-school", {
  verdict:
    "The most academically decorated British school in Bangkok; outstanding Riverside campus with boat to BTS. Corporate culture and large class sizes are the trade-offs.",
  paragraphs: [
    "Shrewsbury delivers the best published British results in Bangkok: 2025 IGCSE 46% A*, 74% A*/A; A-Level 39% A*, 65% A*/A. Riverside campus has two pools, tennis courts, sports hall, recital hall, 15+ music rooms.",
    "Student body is 70–75% Thai. Teacher and parent reviews describe a corporate, cold atmosphere; class sizes above 20. Central location and boat service are pluses.",
  ],
  positives: [
    "Best published British exam results in Bangkok. Outstanding Riverside campus; boat to BTS. Formal UK affiliation with Shrewsbury School.",
  ],
  considerations: [
    "70–75% Thai; English not default social language. Corporate/cold culture noted. Class sizes above 20; very high fees.",
  ],
});

applyBangkokIntelligence("nist-international-school", {
  verdict:
    "Bangkok's most internationally diverse top-tier IB school; not-for-profit and parent-governed. Total cost exceeds headline fee; ask about extras and social pressure.",
  paragraphs: [
    "NIST has 75% international students, 90+ nationalities; English is the social language. 2024 IB average 36, 29% scoring 40+; 2025 100% pass, 28% at 40+. Founded 1992 with UN partnership.",
    "Total cost is significantly above tuition - trips and activities add up. Compact vertical Sukhumvit campus with space constraints. Ask about keeping up with affluent families and optional costs.",
  ],
  positives: [
    "Exceptional IB results; 75% international, 90+ nationalities. Not-for-profit, parent-governed. Central Asok with BTS/MRT. Strong teacher pay and retention.",
  ],
  considerations: [
    "Very high total cost beyond tuition. Compact campus. Competitive admissions and waitlists. Elite bubble and high-spend social environment.",
  ],
});

applyBangkokIntelligence("king-s-college-international-school", {
  verdict:
    "Opened 2020; strong early IGCSE results and Wimbledon affiliation. No A-Level results yet; teacher turnover and management concerns are consistent themes. Predominantly Thai intake.",
  paragraphs: [
    "King's College Bangkok has strong early IGCSE (e.g. 86% A*/A Maths, 91% sciences in 2025). BSO inspection March 2024 positive; Olympic-size pool. Around 30 nationalities.",
    "Reddit and teacher forums are notably negative on management: high turnover, heavy workload, Thai executive committee prioritising enrolment. Student body ~95% affluent Thai. No published A-Level results yet.",
  ],
  positives: [
    "Strong early IGCSE results; excellent facilities. Wimbledon affiliation. Premium teacher salaries; BSO positive.",
  ],
  considerations: [
    "No A-Level results yet. Teacher turnover and management concerns. ~95% Thai; car-dependent location. New school, limited track record.",
  ],
});

applyBangkokIntelligence("harrows-international-school", {
  verdict:
    "The closest thing to a traditional British boarding school in Southeast Asia; 25-year track record and exceptional campus. Don Mueang location and workload are the main trade-offs.",
  paragraphs: [
    "Harrow Bangkok has a 35-acre lakeside campus and strong results: 65% A*-A IGCSE, 51–71% A*-A A-Level, 91% to first-choice universities. More than two-thirds of students are Thai; recruitment materials state this plainly.",
    "Don Mueang is about 45 minutes from central Bangkok in light traffic. Teacher workload is high; first-year staff required to live on campus. Ask about retention and boarding duties.",
  ],
  positives: [
    "Premier reputation; 25-year track record. Exceptional 35-acre campus with boarding village. Strong results and 91% to first-choice universities. Scholarships up to 30%.",
  ],
  considerations: [
    "70%+ Thai; not diverse for expat children. Remote Don Mueang location; no public transport. Demanding workload; first-year staff on campus. Admissions described as idiosyncratic.",
  ],
});

applyBangkokIntelligence("brighton-college", {
  verdict:
    "Genuine Brighton College UK affiliation; Krungthep Kreetha is the purpose-built campus (2016) with strong IGCSE and A-Level results. Brighton College Bangkok also has a separate Vibhavadi campus, which we list as a separate school.",
  paragraphs: [
    "Krungthep Kreetha campus is purpose-built with strong IGCSE results; 50-rai site with 650-seat theatre, 50m pool. Running at 400–550 students in a school built for 1,500. Families should confirm they are looking at this campus rather than Vibhavadi.",
    "Exam cohort sizes not always disclosed; strong percentages may reflect small groups. Under-capacity at Krungthep Kreetha raises sustainability questions.",
  ],
  positives: [
    "Genuine Brighton College UK affiliation; ISI inspections. Purpose-built campus and facilities. 100% A-Level pass, 75% A*-B (2024). Selective admissions.",
  ],
  considerations: [
    "Brighton College Bangkok has two campuses (this is Krungthep Kreetha). Under-capacity here may have sustainability implications.",
  ],
});

applyBangkokIntelligence("brighton-college-bangkok-vibhavadi", {
  verdict:
    "Brighton College Bangkok's Vibhavadi campus (2023–2024 rebrand of St Stephen's International School). Same UK affiliation as the Krungthep Kreetha campus, which we list as a separate school.",
  paragraphs: [
    "Vibhavadi offers the Brighton College curriculum and brand; some families who were at St Stephen's left during the rebrand. Contact the school for current leadership, results and facilities.",
    "Brighton College Bangkok has two campuses in Bangkok; this profile is for Vibhavadi only.",
  ],
  positives: [
    "Genuine Brighton College UK affiliation. British curriculum. Same brand as Krungthep Kreetha campus.",
  ],
  considerations: [
    "Rebrand from St Stephen's drew some parent criticism. Brighton College Bangkok has two campuses—confirm which you are visiting.",
  ],
});

applyBangkokIntelligence("basis-international-school", {
  verdict:
    "American curriculum school with strong facilities. Ask about teacher retention and workload.",
  paragraphs: [
    "BASIS Bangkok offers American curriculum with a rigorous academic focus. Facilities and programme are strong.",
    "Teacher workload and turnover sometimes come up. Ask about retention and support.",
  ],
  positives: [
    "American curriculum; strong facilities. Good academic reputation.",
  ],
  considerations: [
    "High fees. Ask about teacher retention and workload.",
  ],
});

applyBangkokIntelligence("concordian-international-school", {
  verdict:
    "Trilingual IB school (English, Chinese, Thai) in Samut Prakan. Strong programme; location and fee structure are trade-offs.",
  paragraphs: [
    "Concordian runs a trilingual IB programme with a distinct identity. Facilities and academic programme are well regarded.",
    "Location in Samut Prakan is not central. Entrance and capital fees are high. Ask about language balance and support.",
  ],
  positives: [
    "Trilingual IB programme. Strong academic reputation. Good facilities.",
  ],
  considerations: [
    "Samut Prakan location. High one-time and capital fees. Confirm language fit.",
  ],
});

applyBangkokIntelligence("bangkok-patana-school", {
  verdict:
    "Leading IB school with a long track record and strong results. Fees and competitive admissions are the main barriers.",
  paragraphs: [
    "Bangkok Patana is one of Bangkok's top IB schools with strong results and a large campus. Consistently highly regarded by parents and advisers.",
    "Fees are at the top end; entrance fee and capital assessment add significantly. Ask about admissions timeline and waitlists.",
  ],
  positives: [
    "Leading IB school; strong track record. Excellent facilities and programme.",
  ],
  considerations: [
    "Very high fees. Competitive admissions. Verify total cost including capital.",
  ],
});

applyBangkokIntelligence("kis-international-school", {
  verdict:
    "IB World School with a good reputation. Ask about campus (Huai Khwang vs Reignwood Park) and teacher retention.",
  paragraphs: [
    "KIS offers the full IB continuum. Results and programme are solid; community is diverse.",
    "Two campuses - confirm which you are considering. Teacher retention sometimes raised. Ask about pastoral support.",
  ],
  positives: [
    "Full IB programme. Good reputation. Sibling discounts.",
  ],
  considerations: [
    "Confirm campus. Ask about retention and support.",
  ],
});

applyBangkokIntelligence("dbs-denla-british-school", {
  verdict:
    "British curriculum school in Nonthaburi with strong results and facilities. Ask about workload and retention.",
  paragraphs: [
    "DBS Denla offers British curriculum through to A-Level. Results and facilities are well regarded; lunch and ASAs included.",
    "Teacher workload and turnover sometimes come up. Location in Nonthaburi is not central. Ask about retention.",
  ],
  positives: [
    "Strong British curriculum and results. Good facilities. Lunch and ASAs included.",
  ],
  considerations: [
    "Nonthaburi location. Ask about teacher workload and retention.",
  ],
});

applyBangkokIntelligence("the-american-school-of-bangkok-green-valley-campus", {
  verdict:
    "American and IB curriculum on the Green Valley campus. Ask about teacher retention and leadership.",
  paragraphs: [
    "ASB Green Valley offers American curriculum and IB. Campus and programme are well established.",
    "Independent commentary is mixed. Ask about retention and pastoral support.",
  ],
  positives: [
    "American and IB pathways. Established campus.",
  ],
  considerations: [
    "Ask about teacher retention and leadership. Verify fee structure.",
  ],
});

applyBangkokIntelligence("bangkok-international-preparatory-secondary-school", {
  verdict:
    "British curriculum school in Sukhumvit with strong results. Tuition includes meals and 1:1 devices. Ask about teacher retention.",
  paragraphs: [
    "Bangkok Prep runs British curriculum with strong IGCSE and A-Level results. Parents praise the programme and inclusion of meals and devices.",
    "Teacher pay and turnover have been raised in forums. Ask about current retention and support.",
  ],
  positives: [
    "British curriculum; strong results. Meals and 1:1 devices included. Convenient Sukhumvit location.",
  ],
  considerations: [
    "Ask about teacher retention. Verify total cost.",
  ],
});
// Display name: full name is in bangkok-schools.ts; shortName for masthead
const bangkokPrep = PROFILES_MAP["bangkok-international-preparatory-secondary-school"];
if (bangkokPrep) bangkokPrep.shortName = "BKK Prep";

applyBangkokIntelligence("verso-international-school", {
  verdict:
    "American curriculum school in Samut Prakan. Campus is transitioning to Wycombe Abbey International School Bangkok from August 2026 - confirm future arrangements before enrolling.",
  paragraphs: [
    "Verso offers American curriculum on a modern campus. The school is closing June 2026 and the campus is transitioning to Wycombe Abbey International School Bangkok from August 2026.",
    "If considering enrolment, confirm transition details, continuity for current students, and whether Wycombe Abbey will serve your year group and curriculum needs.",
  ],
  positives: [
    "American curriculum. Modern campus. Clear transition timeline to Wycombe Abbey.",
  ],
  considerations: [
    "Closing June 2026; campus becoming Wycombe Abbey. Confirm arrangements for your cohort before committing.",
  ],
});

applyBangkokIntelligence("bromsgrove-international-school-thailand", {
  verdict:
    "British curriculum school with a good track record. Ask about teacher retention and workload.",
  paragraphs: [
    "Bromsgrove Thailand offers British curriculum through to A-Level. Facilities and programme are well regarded.",
    "Teacher workload and retention sometimes come up. Ask about current leadership and support.",
  ],
  positives: [
    "British curriculum; good track record. Sibling discounts. Range of fee points.",
  ],
  considerations: [
    "Ask about teacher retention and workload. Location - verify commute.",
  ],
});

applyBangkokIntelligence("berkeley-international-school", {
  verdict:
    "American curriculum school with strong facilities. Ask about teacher retention and pastoral support.",
  paragraphs: [
    "Berkeley offers American curriculum through to Grade 12. Campus and programme are well regarded.",
    "Independent commentary is limited. Ask about retention and how the school supports different learner needs.",
  ],
  positives: [
    "American curriculum. Strong facilities. Good reputation.",
  ],
  considerations: [
    "Ask about teacher retention. Verify fee structure and inclusions.",
  ],
});

// Batch 21-30 from briefing emails (Mar 2026)
applyBangkokIntelligence("ruamrudee-international-school", {
  verdict:
    "IB school with fees including lunch; sibling discount. Ask about cohort results and university support.",
  paragraphs: [
    "Ruamrudee offers IB in Bangkok with 2026/2027 fees ฿538K–790K/year including lunch. Briefing data was limited; verify results and retention with the school.",
  ],
  positives: ["IB programme. Fees include lunch. Registration ฿200K; sibling discount ฿15K/semester."],
  considerations: ["Confirm full fee breakdown and exam results. Ask about pastoral support."],
});

applyBangkokIntelligence("st-andrews-international-school-sukhumvit-107", {
  verdict:
    "Nord Anglia school on Sukhumvit 107; fees include ECAs and books. Ask about enrolment fee and consistency across Nord Anglia Bangkok campuses.",
  paragraphs: [
    "St Andrews Sukhumvit 107 runs IB and British curriculum with fees ฿362K–769K (2025/2026) including ECAs and books. Briefing content was limited; contact the school for current outcomes.",
  ],
  positives: ["IB and British curriculum. Fees include ECAs and books. Nord Anglia group. Sukhumvit 107 location."],
  considerations: ["Enrolment fee ฿70K–180K. Verify consistency with other St Andrews campuses."],
});

applyBangkokIntelligence("st-andrews-international-school-sathorn", {
  verdict:
    "Primary campus in Sathorn; fees ฿562K–709K. Ask about secondary pathway and transition to other St Andrews sites.",
  paragraphs: [
    "St Andrews Sathorn offers primary education with 2025/2026 fees ฿562K–709K. Enrolment ฿120K/child or ฿180K/family. Briefing data was limited.",
  ],
  positives: ["Sathorn location. Nord Anglia primary campus. Enrolment covers family."],
  considerations: ["Primary only; confirm secondary pathway. Verify fee inclusions."],
});

applyBangkokIntelligence("d-prep-international-school", {
  verdict:
    "IB school in Samut Prakan; registration ฿150K, deposit ฿50K. Food ฿45K/year extra. Ask about retention and DP results.",
  paragraphs: [
    "D-Prep runs IB in Samut Prakan with 2025/2026 fees ฿440K–677K. Briefing content was limited; verify results and teacher stability.",
  ],
  positives: ["IB programme. Samut Prakan campus. Sibling discounts possible."],
  considerations: ["Registration ฿150K; deposit ฿50K. Food ฿45K/year extra. Samut Prakan location."],
});

applyBangkokIntelligence("ascot-international-school", {
  verdict:
    "British curriculum; enrolment ฿100K/child. Sibling discounts 10–20%. Ask about IGCSE and A-Level results.",
  paragraphs: [
    "Ascot offers British curriculum with 2025 fees ฿273K–594K. Briefing data was limited; confirm results and pastoral support with the school.",
  ],
  positives: ["British curriculum. Sibling discounts 10–20%. Enrolment ฿100K."],
  considerations: ["High enrolment fee. Verify exam results and retention."],
});

applyBangkokIntelligence("charter-international-school", {
  verdict:
    "British curriculum in Prawet; fees include lunch and ASAs. Sibling discounts 10–15%. Ask about IGCSE and retention.",
  paragraphs: [
    "Charter runs British curriculum in Prawet with 2025/2026 fees ฿285K–594K including lunch and ASAs. Briefing content was limited.",
  ],
  positives: ["British curriculum. Fees include lunch and ASAs. Sibling discounts 10–15%. Prawet location."],
  considerations: ["Verify full fee breakdown. Ask about exam results and teacher retention."],
});

applyBangkokIntelligence("wells-international-school", {
  verdict:
    "IB World School (PYP/MYP/DP) with three campuses; campus development fee ฿130K. Ask about which campus and consistency.",
  paragraphs: [
    "Wells runs the full IB continuum across three Sukhumvit campuses with fees ฿276K–576K. Briefing data was limited; verify results and campus-specific experience.",
  ],
  positives: ["Full IB continuum. Three campuses. Campus development fee ฿130K."],
  considerations: ["Confirm which campus and compare. Ask about retention and DP results."],
});

applyBangkokIntelligence("garden-international-school", {
  verdict:
    "British curriculum in Sathorn; enrolment ฿60K–120K, deposit ฿40K. Ask about IGCSE and A-Level results and retention.",
  paragraphs: [
    "Garden International School Bangkok offers British curriculum in Sathorn. Fees ฿260K–514K/year (3 terms). Briefing content was limited.",
  ],
  positives: ["British curriculum. Sathorn location. Enrolment ฿60K–120K; deposit ฿40K."],
  considerations: ["Verify fee structure and exam results. Ask about teacher retention."],
});

applyBangkokIntelligence("kpis-international-school", {
  verdict:
    "Fees include meals and tech; enrolment ฿100K, booking deposit ฿100K. Ask about curriculum and retention.",
  paragraphs: [
    "KPIS offers 2025/2026 fees ฿348K–544K including meals and tech. Briefing data was limited; contact the school for current outcomes.",
  ],
  positives: ["Fees include meals and tech. Enrolment ฿100K; booking deposit ฿100K."],
  considerations: ["Confirm curriculum and exam pathway. Ask about retention."],
});

export const BANGKOK_SCHOOL_PROFILES = PROFILES_MAP;
export const ALL_BANGKOK_SCHOOL_SLUGS = Object.keys(PROFILES_MAP);
