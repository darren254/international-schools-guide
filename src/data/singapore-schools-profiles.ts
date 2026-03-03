/**
 * Singapore school profiles: generates SchoolProfile objects from listing + fee data.
 */

import { SINGAPORE_SCHOOLS, type SingaporeSchoolListing } from "@/data/singapore-schools";
import { SINGAPORE_FEE_DATA, SINGAPORE_RATE } from "@/data/singapore-school-profiles";
import type { SchoolProfile, FeeRow, OneTimeFee } from "@/data/schools";
import { extractHighestFee } from "@/lib/utils/fees";

function buildFeeRows(slug: string): FeeRow[] {
  const data = SINGAPORE_FEE_DATA[slug];
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
  const data = SINGAPORE_FEE_DATA[slug];
  if (!data?.oneTimeFees) return [];
  return Object.entries(data.oneTimeFees)
    .filter(([, amount]) => amount > 0)
    .map(([name, amount]) => ({ name, amount }));
}

function createProfile(L: SingaporeSchoolListing): SchoolProfile {
  const feeData = SINGAPORE_FEE_DATA[L.slug];
  const address = feeData?.address || L.area;
  const lat = feeData?.lat ?? 1.35;
  const lng = feeData?.lng ?? 103.82;
  const website = L.website || feeData?.website || "";
  const feeRows = buildFeeRows(L.slug);
  const oneTimeFees = buildOneTimeFees(L.slug);
  const highK = extractHighestFee(L.feeRange);
  const hasFeeData = feeRows.length > 0;
  const feeNote = hasFeeData
    ? "Fees shown in SGD. 1 USD ≈ 1.34 SGD. Contact the school for the full fee schedule."
    : L.feeRange === "Contact school"
      ? "Fees not publicly disclosed. Contact the school for current fee schedule."
      : `Approximate annual fee range: ${L.feeRange}. Contact the school for the full fee schedule.`;
  return {
    slug: L.slug,
    citySlug: "singapore",
    name: L.name,
    shortName: L.name.split(" ").slice(0, 3).join(" "),
    verified: L.verified,
    metaTitle: `${L.name} - Fees, Review & Admissions | Singapore`,
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
      feeCurrency: "SGD",
      rows: hasFeeData ? feeRows : [{ gradeLevel: "All grades", ages: L.ageRange, tuition: highK > 0 ? Math.round(highK * 1000 * 1.34) : 0, capital: 0, totalEarlyBird: highK > 0 ? Math.round(highK * 1000 * 1.34) : 0, totalStandard: highK > 0 ? Math.round(highK * 1000 * 1.34) : 0 }],
      oneTime: oneTimeFees,
      note: feeNote,
    },
    academics: { results: L.examResults, paragraphs: L.examResults.length ? [`Key results: ${L.examResults.map((r) => `${r.label} ${r.value}`).join(", ")}.`] : [] },
    studentBody: { paragraphs: ["Singapore's international schools serve a highly diverse student body. Contact the school for current enrolment details."] },
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
  SINGAPORE_SCHOOLS.map((s) => [s.slug, createProfile(s)])
);

// ═══════════════════════════════════════════════════════
// EDITORIAL OVERRIDES — Intelligence from briefing adaptation
// See scripts/intelligence-briefings/singapore.json
// ═══════════════════════════════════════════════════════

function applySingaporeIntelligence(
  slug: string,
  intelligence: SchoolProfile["intelligence"]
): void {
  const p = PROFILES_MAP[slug];
  if (p) p.intelligence = intelligence;
}

applySingaporeIntelligence("tanglin-trust-school", {
  verdict:
    "One of Singapore's largest and most academically strong international schools, with a community that feels smaller than its size. Senior school has drawn more critical reviews; ask about pastoral support and bullying.",
  paragraphs: [
    "Tanglin manages to feel smaller than its 2,800+ size with a schools-within-a-school model. Facilities are first-class; parent and teacher reviews praise academic credentials, music, sport and co-curriculars. Teacher package is among the top in Singapore.",
    "Some reviews flag an undercurrent of racism and bullying in Senior School; a student described feeling like an outcast for years. The 2020 A-Level CAG controversy affected some university placements. Cost is at the top end; only 55% of parents in one survey totally agreed fees represent good value.",
  ],
  positives: [
    "Strong academic credentials and rich co-curricular offering. Community feel despite large size. Top teacher package and employer ranking.",
    "First-class facilities: rugby and football pitches, performance halls, 25m pool, film studio. Year 9 Highlands Programme in Australia.",
  ],
  considerations: [
    "Critical reviews focus on Senior School: bullying and racism raised. Ask about pastoral support and how the school handles incidents.",
    "High cost; value-for-money split in parent surveys. 2020 A-Level controversy - ask about current assessment and university support.",
  ],
});

applySingaporeIntelligence("stamford-american-international-school", {
  verdict:
    "Large IB and American-curriculum school with two campuses; part of Cognita. Good for families who want scale and choice; ask about consistency between campuses and teacher retention.",
  paragraphs: [
    "SAIS runs from pre-nursery through Grade 12 with IB and American pathways. Two campuses; facilities and programme breadth are strengths. Parent feedback is mixed by campus and section.",
    "Teacher turnover and workload come up in forums. Ask about retention and how the two campuses compare in practice.",
  ],
  positives: [
    "Large scale and dual curriculum (IB and American). Cognita group resources. Two campuses for geographic flexibility.",
  ],
  considerations: [
    "Ask about teacher retention and workload. Consistency between campuses - speak to parents at the campus you are considering.",
  ],
});

applySingaporeIntelligence("australian-international-school", {
  verdict:
    "Australian curriculum with IB Diploma; strong for families targeting Australian universities or wanting continuity with the Australian system. Ask about recent leadership and curriculum focus.",
  paragraphs: [
    "AIS offers Australian curriculum through to IB Diploma. Facilities and programme breadth are solid; community is diverse. Well established in Singapore.",
    "Independent commentary varies by section. Ask about pastoral support and how the school supports students who are not high achievers.",
  ],
  positives: [
    "Australian curriculum continuity; IB Diploma option. Established presence and diverse community.",
  ],
  considerations: [
    "Ask about leadership stability and teacher retention. Value-for-money perceptions vary - verify fees and inclusions.",
  ],
});

applySingaporeIntelligence("nexus-international-school", {
  verdict:
    "IB World School with a strong parent community and good facilities. Teacher workload and turnover have been flagged; ask about retention and support.",
  paragraphs: [
    "Nexus offers the full IB continuum with a reputation for a welcoming, diverse community. Facilities and programme are well regarded.",
    "Teacher reviews mention workload and turnover. Ask about current retention and how the school supports staff.",
  ],
  positives: [
    "Full IB continuum. Welcoming community and good facilities. Sibling discounts.",
  ],
  considerations: [
    "Teacher workload and turnover raised in reviews. Ask about retention and leadership stability.",
  ],
});

applySingaporeIntelligence("united-world-college-of-south-east-asia-dover-campus", {
  verdict:
    "Premier IB World School on the 11-hectare Dover campus. Consistently strong results and community; cost and competitive admissions are the main barriers.",
  paragraphs: [
    "UWCSEA Dover is one of Singapore's top IB schools with a long track record and strong university placements. The campus and programme are widely praised.",
    "Fees and development levy are at the top end; admissions are competitive. Ask about waitlists and financial assistance if relevant.",
  ],
  positives: [
    "Premier IB school; strong results and global recognition. 11-hectare campus and extensive facilities.",
  ],
  considerations: [
    "Very high total cost. Competitive admissions - apply early and have a backup.",
  ],
});

applySingaporeIntelligence("overseas-family-school", {
  verdict:
    "IB World School with a more accessible fee point than many Singapore IB schools. Teacher conditions and turnover have been raised; ask about retention and support.",
  paragraphs: [
    "OFS offers the full IB continuum and has a large, diverse community. Fees are lower than Tanglin or UWCSEA for comparable IB.",
    "Teacher pay and turnover come up in forums. Ask about current retention and how the school supports staff and students.",
  ],
  positives: [
    "Full IB at a more accessible price. Large and diverse community.",
  ],
  considerations: [
    "Teacher turnover and conditions flagged. Ask about retention and pastoral support.",
  ],
});

applySingaporeIntelligence("singapore-american-school", {
  verdict:
    "One of Asia's largest American schools with AP curriculum and a 55-acre Woodlands campus. Strong for American curriculum families; location and scale are trade-offs.",
  paragraphs: [
    "SAS has 4,000+ students and a 55-acre campus. AP curriculum and American system; facilities and programme breadth are exceptional. Consistently highly regarded.",
    "Woodlands location is not central; scale can feel overwhelming for some. Fees are at the top end. Ask about admissions timeline and waitlists.",
  ],
  positives: [
    "One of the largest American schools in Asia; 55-acre campus. Strong AP programme and facilities.",
  ],
  considerations: [
    "Woodlands location - assess commute. Very large scale. Competitive admissions.",
  ],
});

applySingaporeIntelligence("etonhouse-international-school-orchard", {
  verdict:
    "Boutique IB and British curriculum school in central Orchard; also runs Broadrick (primary). Management culture and facilities constraints come up in reviews - ask about both campuses.",
  paragraphs: [
    "EtonHouse Orchard sits next to St Regis with IGCSE, A-Level and IB. Small scale means individual attention is plausible. Parents praise differentiated support; IB results are not published after the first year.",
    "Facilities are constrained (city-centre sites). Teacher reviews describe the group as a stepping stone; management culture has been criticised. Ask about current leadership and staff retention.",
  ],
  positives: [
    "Central Orchard location; boutique scale. IGCSE and A-Level results (school-reported) respectable. Mandarin Immersion at Broadrick.",
  ],
  considerations: [
    "IB averages not published after inaugural year. Facilities limited; teacher turnover and management culture raised. Ask about retention.",
  ],
});

applySingaporeIntelligence("one-world-international-school", {
  verdict:
    "All-inclusive fees and IB Diploma at a lower price point; Nanyang campus in Jurong West. Teacher commentary is notably negative - ask about retention and working conditions.",
  paragraphs: [
    "OWIS offers all-inclusive fees (uniforms, devices, trips, co-curriculars) and IB Diploma. STEM and robotics are praised. IB average 32 (2025) is above global but below Singapore average.",
    "Teacher reviews describe a revolving door, low pay and poor management. Location in Jurong West is remote from central and east. Ask about current retention and campus-specific experience.",
  ],
  positives: [
    "All-inclusive fee structure. IB Diploma at a more accessible price. Small class sizes and optional bilingual primary.",
  ],
  considerations: [
    "Teacher pay and turnover heavily criticised. Jurong West location remote for many. IB average below Singapore norm - factor in if targeting selective universities.",
  ],
});

applySingaporeIntelligence("middleton-international-school", {
  verdict:
    "Among the most affordable British-curriculum schools in Singapore; warm community feel. Ask about fee payment terms and how the school handles late or disputed payments.",
  paragraphs: [
    "Middleton offers Cambridge IGCSE and A-Level at the budget end. Parent reviews are consistently warm; small class sizes and diversity are praised. Tampines campus has a grass field.",
    "One detailed account alleged aggressive fee-collection (legal threats, class suspension). Teacher pay is low (Indeed 2.0/5). IGCSE results are school-reported. Ask about payment terms and staff retention.",
  ],
  positives: [
    "Affordable British curriculum; warm community. Small class sizes and diverse student body. A-Levels and second campus (West Coast) add options.",
  ],
  considerations: [
    "Ask about fee payment terms and consequences - one account cited legal and suspension threats. Teacher pay and turnover flagged. Budget positioning affects peer group.",
  ],
});

applySingaporeIntelligence("invictus-international-school", {
  verdict:
    "Affordable Cambridge IGCSE and A-Level across three campuses; experience varies by campus. Ask about the campus you are considering and about fee payment and suspension policy.",
  paragraphs: [
    "Invictus offers British curriculum at a lower price; Dempsey Hill and Bukit Timah get more positive feedback than Centrium Square. Teacher reviews cite workload and turnover.",
    "At least one parent reported student suspension for fees more than five days late. Ask about payment terms and campus-specific experience.",
  ],
  positives: [
    "Affordable Cambridge pathway; three campuses. Positive accounts at Dempsey Hill and Bukit Timah; teacher quality and diversity praised.",
  ],
  considerations: [
    "Campus experience varies - speak to parents at your campus. Payment-suspension policy reported; ask in admissions. Teacher workload and turnover raised.",
  ],
});

applySingaporeIntelligence("chatsworth-international-school", {
  verdict:
    "IB World School with a solid reputation; fees mid-tier. Ask about recent leadership and teacher retention.",
  paragraphs: [
    "Chatsworth runs the full IB continuum with a good track record. Community and location are practical for many families.",
    "Independent commentary is limited. Ask about pastoral support and how the school supports different learner needs.",
  ],
  positives: [
    "Full IB programme; mid-tier fees. Established presence in Singapore.",
  ],
  considerations: [
    "Ask about teacher retention and leadership. Verify fee inclusions.",
  ],
});

applySingaporeIntelligence("international-community-school", {
  verdict:
    "Christian American school with a strong community feel. Ask about curriculum fit and pastoral support.",
  paragraphs: [
    "ICS offers American curriculum in a Christian context. Parents praise the environment and support.",
    "Verify that the Christian ethos and American curriculum fit your family. Ask about teacher retention.",
  ],
  positives: [
    "Strong community and Christian ethos. American curriculum.",
  ],
  considerations: [
    "Ensure fit with faith-based approach. Ask about retention and fees.",
  ],
});

applySingaporeIntelligence("dulwich-college", {
  verdict:
    "British school with IB Diploma; strong facilities and reputation. Ask about pastoral support and workload.",
  paragraphs: [
    "Dulwich Singapore offers British curriculum through to IB Diploma. Campus and programme are well regarded; results are strong.",
    "Teacher workload and turnover sometimes come up. Ask about current retention and support.",
  ],
  positives: [
    "British curriculum and IB Diploma. Strong facilities and Dulwich name.",
  ],
  considerations: [
    "High fees. Ask about teacher retention and pastoral support.",
  ],
});

applySingaporeIntelligence("canadian-international-school", {
  verdict:
    "Canadian and IB curriculum with bilingual options; two campuses. Ask about campus differences and teacher retention.",
  paragraphs: [
    "CIS offers Canadian curriculum and IB with bilingual streams. Large and diverse; facilities are strong.",
    "Experience can vary by campus and stream. Ask about retention and how the bilingual programme works in practice.",
  ],
  positives: [
    "Canadian and IB pathways; bilingual options. Strong facilities and sibling discounts.",
  ],
  considerations: [
    "Ask about campus and stream differences. Verify fee structure.",
  ],
});

applySingaporeIntelligence("gess", {
  verdict:
    "German and European school with IB Diploma; good for families wanting European languages or the German system. Ask about language support and non-German track.",
  paragraphs: [
    "GESS offers German and European curriculum plus IB Diploma. Strong for German-speaking families and those wanting European options.",
    "Non-German families should confirm language and track options. Ask about teacher retention.",
  ],
  positives: [
    "German and European curriculum; IB Diploma. Good for European language continuity.",
  ],
  considerations: [
    "Confirm fit if not German-speaking. Ask about track options and fees.",
  ],
});

applySingaporeIntelligence("iss-international-school", {
  verdict:
    "IB World School with a long history; fees span a wide range. Ask about section differences and support.",
  paragraphs: [
    "ISS runs the full IB continuum. Programme and community are well established.",
    "Experience can vary by section and campus. Ask about pastoral support and teacher retention.",
  ],
  positives: [
    "Full IB programme; long-established. Range of fee points.",
  ],
  considerations: [
    "Ask about section and campus differences. Verify support for different needs.",
  ],
});

applySingaporeIntelligence("hwa-international-school", {
  verdict:
    "IB World School (PYP/MYP/DP) with a strong academic focus. Ask about pastoral support and workload.",
  paragraphs: [
    "HWA offers the full IB continuum. Results and programme are well regarded.",
    "Academic pressure and workload sometimes come up. Ask about support and balance.",
  ],
  positives: [
    "Full IB continuum. Strong academic reputation. Sibling discounts.",
  ],
  considerations: [
    "Ask about workload and pastoral support. Verify fee inclusions.",
  ],
});

applySingaporeIntelligence("nps-international-school", {
  verdict:
    "Indian and IB curriculum (CBSE/IGCSE/IB); strong for Indian expat families. Ask about track choice and language support.",
  paragraphs: [
    "NPS offers CBSE, IGCSE and IB under one roof; modern Punggol campus. Self-reported IB results are strong; independent commentary from non-Indian communities is thin.",
    "Curriculum complexity means choosing the right track at entry; late switches are constrained. All results are self-reported. Good for Indian families; ask about fit if not Indian.",
  ],
  positives: [
    "Multiple pathways (CBSE, IGCSE, IB); modern campus. Strong self-reported results. Good for Indian expat families.",
  ],
  considerations: [
    "Choose track at entry; switching later is limited. Results are school-reported. Ask about non-Indian family experience.",
  ],
});

export const SINGAPORE_SCHOOL_PROFILES = PROFILES_MAP;
export const ALL_SINGAPORE_SCHOOL_SLUGS = Object.keys(PROFILES_MAP);
