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

function applyDubaiIntelligence(
  slug: string,
  intelligence: SchoolProfile["intelligence"]
): void {
  const p = DUBAI_PROFILES_MAP[slug];
  if (p) p.intelligence = intelligence;
}

applyDubaiIntelligence("brighton-college-dubai", {
  verdict:
    "British franchise with strong exam results and BSO Outstanding; fee premium and British-heavy demographic. KHDA Very Good (Arabic/Islamic drag).",
  paragraphs: [
    "Brighton College Dubai is co-ed British independent style: blazers, house system, strong IGCSE/A-Level results (2025: 45% 9-8 at IGCSE, ~50% A*-A at A-Level). BSO Outstanding.",
    "Second most expensive day school in Dubai; 58.5% British passports. Al Ain Road location; sixth form smaller than some rivals. Leadership stable under Simon Crane since 2019.",
  ],
  positives: [
    "Strong exam results; BSO Outstanding. Small-ish roll; Brighton Diploma breadth. High SEND inclusion; transparent results.",
  ],
  considerations: [
    "KHDA Very Good not Outstanding. British-heavy demographic. Location and traffic; historical facility-delivery frustration.",
  ],
});

applyDubaiIntelligence("gems-world-academy", {
  verdict:
    "Full IB continuum with strong results (2025 avg 33) and exceptional facilities; KHDA Very Good and low parent satisfaction (2.4/5). GEMS for-profit ownership.",
  paragraphs: [
    "GWA runs PYP through DP/CP; 2025 IB average 33, 95% pass. Planetarium, Olympic pool, 400m track. Very Good KHDA since 2015; teaching consistency in Maths and Arabic flagged.",
    "Most expensive day school in batch; parent feedback on satisfaction is mixed. Some parents mention materialist culture and the no-homework policy.",
  ],
  positives: [
    "IB results above world average; full IB continuum. Outstanding facilities; Singapore Math in Primary. Strong KG and early years (KHDA).",
  ],
  considerations: [
    "Very Good not Outstanding; 2.4/5 parent satisfaction. Inconsistent teaching (Maths, Arabic). GEMS commercial focus; materialism complaints.",
  ],
});

applyDubaiIntelligence("dubai-college", {
  verdict:
    "Selective British secondary-only (Y7–13); top-tier GCSE/A-Level results and KHDA Outstanding every year since 2010–11. Best raw results in Dubai.",
  paragraphs: [
    "DC is secondary-only, selective. 2025 GCSE 94.7% at 9–7, average 8.4; A-Level 74% A*-A, 93.6% A*-B. Cambridge value-added placed DC in top 1% globally. Outstanding across English, Maths, Science, Teaching, Leadership.",
    "~50% British; no primary. New Head Tomas Duckling Jan 2025. Historic 2009 KHDA dispute and 2011 fraud (AED 15.77M) in public record.",
  ],
  positives: [
    "Best GCSE/A-Level results in Dubai; top 1% value-added. Unbroken KHDA Outstanding. Strong pastoral care; reasonable fees vs outcomes.",
  ],
  considerations: [
    "Secondary-only; need primary strategy. Selective; British-heavy. New headship; historic controversies.",
  ],
});

applyDubaiIntelligence("nord-anglia-international-school-dubai", {
  verdict:
    "Large British-curriculum school (3,080+ students) with KHDA Outstanding and strong IB/GCSE results; rapid growth and parent satisfaction drop (60% positivity). Leadership transition 2025.",
  paragraphs: [
    "NAS Dubai offers IB DP (avg 36.2 in 2024) and A-Levels; GCSE 63% 7–9. Outstanding 2022–23; 320 SoD, Outstanding inclusion. New Principal Kenny Duncan Sept 2025.",
    "Scale and growth concerns; mother tongue programme cut. Wellbeing and pastoral support are worth asking about; some parents have raised concerns. Value-for-money 39% vs UAE 52%.",
  ],
  positives: [
    "KHDA Outstanding; strong IB and GCSE. Flexible sixth form (IB, A-Levels, BTEC). Outstanding SEND; 97 nationalities; 1:11 ratio.",
  ],
  considerations: [
    "3,080 students; satisfaction dropped to 60%. Leadership transition; mother tongue cut. Ask about wellbeing and pastoral support. For-profit operator.",
  ],
});

applyDubaiIntelligence("jumeirah-college", {
  verdict:
    "GEMS secondary-only school with ten consecutive KHDA Outstanding ratings and strong A-Level/GCSE results. Jumeirah location; no IB pathway.",
  paragraphs: [
    "JC runs IGCSE to A-Level only; 2023–24 Outstanding. 68% GCSE 9–7, 47% A*-A at A-Level, 100% pass. New Principal Nick Brain Aug 2023; previous era described as turbulent.",
    "Some Y11 not admitted to sixth form on grades. Fee ambiguity (AED 98,681 vs 112,000 quoted). GEMS for-profit.",
  ],
  positives: [
    "Ten consecutive KHDA Outstanding. Strong A-Level/GCSE; Outstanding pastoral care. Central Jumeirah; recent Sixth Form Centre and facilities.",
  ],
  considerations: [
    "GEMS ownership; no IB. Secondary-only. Fee clarification needed; some Y11 refused sixth form. Arabic/Islamic weaker.",
  ],
});

applyDubaiIntelligence("gems-wellington-international-school", {
  verdict:
    "12 consecutive KHDA Outstanding ratings; strong IB (2025 avg 36) and IGCSE. Only 40% of parents say fees represent value; class-size and crowding complaints.",
  paragraphs: [
    "WIS has ~2,900 students; Al Sufouh location. IB 2025: 36 avg, 98% pass, 59% at 35+. IGCSE 2024: 61% 9–7. Every core KHDA indicator Outstanding except Arabic/Islamic. New Principal Andrew Jenkins Aug 2025 (internal succession).",
    "Parents we've spoken to are split on value for money; about two-thirds would recommend. Class sizes and crowding are worth asking about.",
  ],
  positives: [
    "12 consecutive Outstanding; IB 36 well above world average. Outstanding SEND; convenient location. IB DP + CP options.",
  ],
  considerations: [
    "Low value-for-money and recommendation scores. Class sizes and crowding. GEMS reputation; high fees.",
  ],
});

applyDubaiIntelligence("gems-dubai-american-academy", {
  verdict:
    "Only US-curriculum school with consistent KHDA Outstanding; US Diploma + IB DP dual pathway. Overcapacity and very low value-for-money perception (14%); new superintendent 2025.",
  paragraphs: [
    "DAA offers AP and IB DP; 2024 IB avg 34, 95% pass; 67% of graduates hold both US Diploma and IB. Outstanding SEND (320+). New middle school block and wellbeing centre 2024–25; ASU university credits for seniors.",
    "3,088 students on capacity for 2,750; 56% of parents considered moving (double UAE average). Student enjoyment below UAE average. Dr Helen Pereira-Raso from Sept 2025.",
  ],
  positives: [
    "Only US school with 11 cycles Outstanding. US + IB dual pathway; ASU credits. Outstanding SEND; exceptional facilities.",
  ],
  considerations: [
    "14% value for money; 56% considered moving. Overcapacity; enjoyment below average. New superintendent; GEMS culture.",
  ],
});

applyDubaiIntelligence("deira-international-school", {
  verdict:
    "Outstanding KHDA, strong IB (2025 avg 34.2) and IGCSE on 80,000m² campus; not-for-profit Al-Futtaim. Festival City location; teacher turnover and value-for-money mixed.",
  paragraphs: [
    "DIS: 2025 IB 100% pass, avg 34.2; IGCSE 56% 9–7. Outstanding for inclusion, parent engagement, governance. Demographics skew Arab/Emirati; 80+ nationalities.",
    "Teacher turnover was reported around 29% in 2022; parents are mixed on value for money and some feel tutoring is needed. Location not ideal for Marina/JBR/Dubai Hills.",
  ],
  positives: [
    "Outstanding KHDA; not-for-profit. Strong IB and IGCSE; exceptional campus for fee level. Outstanding SEND; 80% would recommend.",
  ],
  considerations: [
    "Teacher turnover; value-for-money split. Festival City location. Pastoral care and how the school handles incidents are worth asking about.",
  ],
});

applyDubaiIntelligence("safa-community-school", {
  verdict:
    "Outstanding KHDA and BSO; strong A-Level (57% A*-A) and IGCSE, non-selective with good value-added. Selective entry to Senior School (Y10–13); traffic and parking complaints.",
  paragraphs: [
    "SCS: 2025 A-Level 57% A*-A, 84% A*-B; IGCSE 66% 9–7. Opened 2014; first Outstanding 2023. Low teacher turnover; 94% would recommend. Purpose-built Senior School (Y10–13).",
    "Admission to Senior School not guaranteed; selective for Y10+. Umm Suqeim Road traffic; Ramadan shorter hours noted.",
  ],
  positives: [
    "94% recommendation; Outstanding KHDA/BSO. Top-tier A-Level/IGCSE at lower fees. Non-selective with strong value-added; free SEND provision.",
  ],
  considerations: [
    "Selective Senior School entry. Traffic/parking. British only (no IB). Rapid growth.",
  ],
});

applyDubaiIntelligence("dubai-english-speaking-college", {
  verdict:
    "Not-for-profit secondary with ten consecutive KHDA Outstanding; strong value-added at GCSE and A-Level. Academic City location; English/Maths progress dropped to Very Good 2023–24.",
  paragraphs: [
    "DESC: A-Level 2025 44.5% A*-A, 93.5% A*-C; GCSE 59.8% 9–7. Value-added +1.65 grades above CAT4 prediction. Teacher turnover below 10%; 246 A-Level students 2025. Leadership transition: Andy Gibbs departed 2026, Christopher Vizzard CEO, Matthew Cotgrove Headteacher.",
    "Academic City not central; no IB (A-Level/BTEC only). English and Maths progress Very Good not Outstanding in latest inspection.",
  ],
  positives: [
    "Not-for-profit; 10th consecutive Outstanding. Exceptional value-added; low teacher turnover. Inclusive BTEC; strong university outcomes.",
  ],
  considerations: [
    "Academic City location. English/Maths progress downgrade. Leadership succession; no IB.",
  ],
});

applyDubaiIntelligence("dubai-international-academy-emirates-hills", {
  verdict:
    "Outstanding KHDA IB school with DP average 35–36 at lower fees than GWA; strong value proposition. Large school; Emirates Hills location.",
  paragraphs: [
    "DIA Emirates Hills: 2024–25 IB avg 35–36, 100% pass; MYP eAssessment 43/56. First IB school to achieve and retain Outstanding. 482,000 sq ft campus; ~2,800 students, 80–90 nationalities.",
    "Class sizes 24–28; teacher pressure noted. IB-only; no GCSE pathway. Independent parent feedback is limited.",
  ],
  positives: [
    "Outstanding KHDA; IB 35–36 at lower fees than GWA. Full IB continuum; strong destinations. Stable leadership; Emirates Hills campus.",
  ],
  considerations: [
    "Large school; large classes. IB-only. Location for non-Emirates Hills families. Innoventures for-profit.",
  ],
});

applyDubaiIntelligence("swiss-international-scientific-school", {
  verdict:
    "Only bilingual English-French/English-German IB school in UAE; boarding option. KHDA Very Good at top fee tier; staff retention and workplace culture are worth asking about.",
  paragraphs: [
    "SISD: full IB continuum, bilingual streams, boarding from Y7. 2024 IB avg 33.2, 100% pass. Nord Anglia from July 2023. KHDA Outstanding for curriculum, personal development, parent relations.",
    "Very Good overall KHDA; parent satisfaction sits around the mid-range. We've heard mixed things about management and workload; worth asking about if that matters to you. Principal Ruth Burke departing; Pauline Nord Aug 2026.",
  ],
  positives: [
    "Only bilingual IB option in UAE; boarding. Full IB continuum; strong European/US/UK destinations. Outstanding elements in KHDA.",
  ],
  considerations: [
    "Very Good at highest fees. Staff retention and workplace culture worth asking about; parent satisfaction mixed. Leadership transition; discount structure opaque.",
  ],
});

applyDubaiIntelligence("dubai-british-school-jumeirah-park", {
  verdict:
    "First KHDA Outstanding 2023–24 and BSO Outstanding 2025; strong A-Level/GCSE and award-winning performing arts. British-only; post-16 consistency flagged.",
  paragraphs: [
    "DBSJP: 2025 A-Level 50% A*-A, 85% A*-B; GCSE 51% 9–7, 97% 9–4. Outstanding for SoD. 87% would recommend; 4.2/5. Jumeirah Park/Islands/Meadows hub.",
    "No IB; first-time Outstanding; post-16 teaching consistency and Arabic/Islamic improvement recommended.",
  ],
  positives: [
    "KHDA + BSO Outstanding. Strong A-Level/GCSE; best theatre/dance/performing arts. Outstanding inclusion; 87% recommend.",
  ],
  considerations: [
    "British only; first-time Outstanding. Post-16 and Arabic/Islamic flagged. Fee tier high.",
  ],
});

applyDubaiIntelligence("greenfield-international-school", {
  verdict:
    "Full IB continuum with strong value-for-money and 88% parent approval; KHDA Very Good. Dubai Investment Park location; DP phase Outstanding.",
  paragraphs: [
    "Greenfield: IB 2025 avg 32, 2024 33, 2023 35.03; 98–100% pass. DP teaching and curriculum Outstanding per KHDA. Outstanding pastoral, safeguarding, parental engagement. ~1,550 students, 80+ nationalities.",
    "Very Good overall; MYP/PYP structure and differentiation flagged. 30–40 min from central Dubai.",
  ],
  positives: [
    "Best value full-IB in guide; 4.4/5 parent approval. DP Outstanding; above-world IB averages. Calm Green Community campus.",
  ],
  considerations: [
    "Very Good not Outstanding. Remote location. MYP/PYP consistency; differentiation recommendations.",
  ],
});

// Batch 26-30 from briefing emails (Mar 2026; Dubai 21-25 EML had different format)
applyDubaiIntelligence("regent-international-school", {
  verdict:
    "British curriculum; affordable fees. Ask about campus, results and retention.",
  paragraphs: [
    "Regent International School briefing data was limited; verify fees, curriculum and KHDA rating with the school. Multiple Regent campuses may exist; confirm which one you are considering.",
  ],
  positives: ["British curriculum. Affordable segment. Sibling discounts possible."],
  considerations: ["Confirm which Regent campus. Verify fee structure and retention."],
});

applyDubaiIntelligence("jebel-ali-school", {
  verdict:
    "British curriculum in Jebel Ali. Ask about KHDA rating, results and retention.",
  paragraphs: [
    "Jebel Ali School briefing content was limited; contact the school for current fees, results and pastoral provision.",
  ],
  positives: ["British curriculum. Jebel Ali location."],
  considerations: ["Confirm KHDA rating and fee structure. Ask about retention."],
});

applyDubaiIntelligence("arcadia-school", {
  verdict:
    "Jumeirah campus; 2025/2026 discounted fees AED 50K–81K. Includes textbooks. Ask about retention and consistency.",
  paragraphs: [
    "Arcadia School offers discounted fees AED 50K–81K including textbooks. Briefing data was limited; verify KHDA rating and outcomes.",
  ],
  positives: ["Fees include textbooks. Jumeirah location. Sibling discounts 5–10%."],
  considerations: ["Confirm discount terms and full fee schedule. Ask about retention."],
});

applyDubaiIntelligence("universal-american-school", {
  verdict:
    "American curriculum; ask about KHDA rating, AP/college counselling and retention.",
  paragraphs: [
    "Universal American School briefing content was limited; contact the school for current fees, results and pastoral support.",
  ],
  positives: ["American curriculum. Established presence."],
  considerations: ["Verify fee structure and KHDA rating. Ask about retention."],
});

applyDubaiIntelligence("hartland-international-school", {
  verdict:
    "British curriculum; ask about KHDA rating, IGCSE/A-Level results and retention.",
  paragraphs: [
    "Hartland International School briefing data was limited; verify fees, results and teacher stability with the school.",
  ],
  positives: ["British curriculum. Part of a wider group."],
  considerations: ["Confirm KHDA rating and fee structure. Ask about retention."],
});

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
