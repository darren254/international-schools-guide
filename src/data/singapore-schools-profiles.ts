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

applySingaporeIntelligence("xcl-world-academy", {
  verdict:
    "Strong facilities and full IB with optional IGCSE; Yishun location and value-for-money concerns. Teacher pay and morale flagged in forums.",
  paragraphs: [
    "XCL World Academy has an impressive purpose-built campus (50m pool, Design Centre, 750-seat auditorium) at roughly 60% capacity. Full IB with IGCSE flexibility; 2024 IB average 35.0, 2025 33.2. Bilingual English-Mandarin option in Early Years.",
    "Yishun is inconvenient for many expat areas. WhichSchoolAdvisor: 42% say fees represent value, 50% would recommend. Teacher reviews cite low pay, morale, and profit focus.",
  ],
  positives: [
    "Outstanding campus facilities; full IB with IGCSE flexibility. 60+ nationalities; strong sports academy. Bilingual option in Early Years.",
  ],
  considerations: [
    "Yishun location; only 42% value-for-money. Teacher pay and morale raised in reviews. 60% capacity.",
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
    "A small, IB-only school with a long track record in Singapore. It suits families who value a warm, low-key community over flashy facilities or big-school branding; if you want top-tier facilities or the most competitive exam profile, compare carefully.",
  paragraphs: [
    "ISS runs the full IB continuum (PYP through Diploma) plus an American-style high school diploma track. EAL and personalised support are strengths; several families report good progress from low English to solid IB outcomes. Public exam data for the last two years is limited; ask the school for recent Diploma averages, pass rates and university destinations.",
    "The Preston Road hilltop campus is green and heritage-feel, but facilities are routinely described as tired and in need of investment. Teacher-side reports suggest resources and salaries lag some competitors, which may affect recruitment and the pace of upgrades. Experiences can vary by section and by teacher; at least one family has described a very poor relationship with a specific teacher.",
    "Overall ISS suits families who prioritise community, inclusion and smaller scale over facilities and brand. Visit during a normal school day and ask to see your child's section; primary and secondary can feel different.",
  ],
  positives: [
    "Warm, inclusive feel; many parents describe it as a village where teachers know students by name and children make friends easily.",
    "Full IB continuum plus high school diploma pathway; continuity for mobile families and flexibility for different routes to graduation.",
    "Strong EAL support and willingness to take students with varied backgrounds; smaller size suits children who might be overwhelmed in very large schools.",
  ],
  considerations: [
    "Facilities on the Preston Road campus are routinely described as tired or in need of significant investment; don't expect the newest sports or arts complexes.",
    "Teacher-side reports suggest resources and salaries lag some competitors; may affect recruitment, retention and the pace of campus upgrades.",
    "Parent reviews are mixed: many describe a caring environment, but at least one family reports a very poor relationship with a specific teacher. Experiences can depend heavily on individual staff.",
    "ISS is seen more as a mid-tier, community-oriented option than as one of Singapore's headline academic schools; factor that in if you are targeting the most competitive university pathways.",
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

// Batch 21-30 from briefing emails (Mar 2026)
applySingaporeIntelligence("north-london-collegiate-school", {
  verdict:
    "Strong IB results from a young campus, but teacher-forum reports on culture and turnover are concerning. Ask about staff retention and the Jan 2026 FT piece.",
  paragraphs: [
    "NLCS Singapore opened in 2020 and has delivered IB averages in the mid-to-high 30s with strong 40+ rates. The Depot Road campus has a 700-seat performing arts centre and 50m pool; WhichSchoolAdvisor notes it feels slightly cramped with no room to expand.",
    "Teacher forums paint a troubling picture: allegations of toxic leadership, high turnover, Saturday working, and pay around 20% below Tanglin. PDPC fined the school S$10,000 in 2022 for data security. The FT reported on safeguarding and workplace concerns in Jan 2026; expansion plans have been scaled back.",
  ],
  positives: [
    "IB Diploma averages in the mid-to-high 30s from the first three cohorts; strong 40+ rates. Purpose-built campus with 700-seat performing arts centre and 50m pool.",
    "100% parent recommendation in WhichSchoolAdvisor survey. University offers to Oxbridge, Imperial, US Ivies. Central Queenstown/Buona Vista location.",
  ],
  considerations: [
    "Multiple consistent allegations of poor staff culture and high turnover on teacher forums. FT investigation (Jan 2026) on safeguarding and workplace concerns. Campus cramped with no room to grow; among the most expensive in Singapore.",
  ],
});

applySingaporeIntelligence("brighton-college", {
  verdict:
    "If you want a deliberately small, British, academically focused school with strong pastoral attention in primary and lower secondary, and you like the Brighton UK ethos, put it on your shortlist. If you need a long-proven IBDP track record, a huge range of senior subject combinations, or lower fees, compare larger, more established campuses first.",
  paragraphs: [
    "Among Singapore parents and independent reviewers, Brighton College (Singapore) is seen as a small, academically selective British school that combines the Brighton UK brand with an intimate, prep-style environment and access to large-scale facilities through its partnership with AIS. Families who choose it tend to like the low class sizes, strong focus on core literacy and numeracy, and the clear British identity: EYFS then National Curriculum for England leading to IGCSE/GCSE and, in time, Sixth Form.",
    "The school is still relatively young compared to long-established Singapore internationals. Reviews note that it is growing up quickly: adding GCSE, building out senior spaces and evolving leadership. Some see that as exciting; others as a work in progress. Recent parent-feature pieces and social media comments highlight a welcoming admissions and communication culture. Several families say they felt well looked after from the first enquiry and that leadership is accessible and responsive.",
    "The small size is repeatedly framed as a strength for younger children and new-to-Singapore families. Children are known by name; teachers know the siblings; the campus feels calm rather than overwhelming. On the flip side, parents conscious of long-term options sometimes worry about joining while the Senior School is still developing and while the public exam track record for Years 11–13 is only just emerging.",
    "Independent reviewers emphasise that fees sit firmly in the premium bracket, on par with other top-tier British schools. Brighton leans into a selective, academically focused positioning rather than trying to be all things to all families. That means strong stretch and ambition for able pupils; families with children who need significant learning support or a very broad, US-style high school programme may find a better fit elsewhere. Overall sentiment from parent interviews and commentary is that Brighton College (Singapore) feels like a well-run, still-growing British school best suited to families who value small scale, clear academic structure and the UK connection enough to accept a newer senior phase and a premium price tag.",
  ],
  positives: [
    "Intimate scale and small classes give a prep-school feel where children and families are known personally.",
    "Strong British character: EYFS in early years and National Curriculum for England, with a clear path to GCSEs and future A-levels. Early and specialist teaching in key subjects, including structured English and maths and meaningful Mandarin rather than token language lessons.",
    "Partnership with AIS gives access to large, shared facilities: full sports halls, fields, 8-lane pool and a professional theatre, while keeping Brighton's own campus relatively compact.",
    "Leadership is described as visible and approachable; parents in interviews praise communication, the sense of community, and values like kindness and curiosity.",
  ],
  considerations: [
    "Premium fee level: tuition and compulsory facility fees put Brighton at the top end of Singapore's international school market.",
    "Senior phase is still young. GCSEs have only recently started; Year 11 opens in 2026 and Sixth Form is planned but not yet established, so long-term exam track record is limited.",
    "Selective admissions and structured academic expectations may not suit children who need a more flexible or alternative pathway, or those requiring extensive learning support. Smaller roll means a narrower peer group compared with mega-campuses; some families prefer the buzz and breadth of very large schools.",
    "As a relatively new school, elements of campus build-out and programme development are still evolving year by year.",
  ],
});

// Brighton College Singapore: override head, academics, student body, school life
const brightonProfile = PROFILES_MAP["brighton-college"];
if (brightonProfile) {
  brightonProfile.head = {
    name: "Nick Davies",
    since: 0,
    bio: "Nick Davies is Head of College, with Gavin Clark heading the Prep School; both are frequently mentioned in recent independent reviews as visible, hands-on leaders focused on academic stretch and community. Founding Headmaster Paul Wilson led the school through its opening phase before leadership transitioned as the school expanded beyond primary.",
  };
  brightonProfile.academics = {
    results: [],
    paragraphs: [
      "Brighton College (Singapore) follows the English National Curriculum with a clear pathway to IGCSE/GCSE in the Senior School. Years 10 are open and Year 11 is due to open in 2026, with Sixth Form planned thereafter. Independent reviews describe the school as academically selective but not harshly so, aiming for bright, curious pupils and offering structured pathways (such as PCP and PCS) for students developing their English.",
      "Because the Senior School is still young, there is not yet a long public record of GCSE and A-level outcomes comparable to older Singapore schools. The academic strategy is described as clear and confident. Reviewers highlight small classes, early specialist teaching and a timetable that has been adjusted as the school learns what works best.",
    ],
  };
  brightonProfile.studentBody = {
    paragraphs: [
      "The school currently enrols pupils from Pre-Nursery (around 18 months) to Year 10, with Year 11 and then Sixth Form on the way. It has grown from a small primary into a through-school structure. The student body is described as international but with a noticeable British contingent, reflecting both the brand and the curriculum.",
      "Parents in recent interviews speak positively about the sense of belonging their children feel, citing strong teacher commitment, a caring ethos and effective communication via a detailed parent portal and regular updates. For many families relocating from the UK or familiar with Brighton College there, the brand provides reassurance.",
    ],
    inspection: {
      date: "",
      body: "Brighton College (Singapore) operates in line with Singapore's private education regulations and, like other international schools, is subject to local quality-assurance frameworks. External reviewers characterise the school as well run with visible leadership and a clear trajectory as it expands its Senior School.",
      rating: "",
      findings: "Operates under Singapore private education regulations; subject to local quality-assurance frameworks. External reviewers characterise the school as well run with visible leadership.",
    },
  };
  brightonProfile.schoolLife = {
    activitiesCount: 0,
    uniformRequired: true,
    facilities: [],
    paragraphs: [
      "The campus is modern and purpose-built, with bright, calm classrooms and specialist spaces developing for Senior School (such as quiet study rooms and black-box drama). Access to extensive sports and performance facilities comes via the partnership with AIS. As the school grows, more senior-phase spaces are being added in stages, including sixth-form-style areas and expanded assembly and drama facilities.",
      "Culture-wise, Brighton is described as values-driven, with repeated emphasis on kindness, confidence and curiosity, and on pupils feeling known and supported. Co-curricular life draws on both the school's own programmes and shared AIS facilities, offering a breadth of sport and arts while keeping a relatively small day-to-day community feel.",
    ],
  };
  brightonProfile.campuses[0].address =
    "1 Chuan Lane, Singapore 554299. East of Singapore, on a shared education campus with the Australian International School; ready access to AIS fields, pool and theatre. Well connected to major residential districts by road; many families factor in proximity to central Singapore.";
  brightonProfile.fees.note =
    "Fees 2025–2026, SGD, per pupil, three-term year (incl. 9% GST). Facility fee S$3,633/year for all pupils. Application S$1,085 (non-refundable); Enrolment S$4,010; Development Fund S$3,610 (refundable only in narrowly defined circumstances). EAL Intermediate S$2,878/term if required. Sibling discounts: 5% (2nd child), 10% (3rd and 4th). Invoices issued three times a year in advance; tuition and facility fees pro-rated to month of start. 100% refund of course and facility fees only if written withdrawal received by cut-off dates before term start; no refund after term starts. Application, Enrolment and Development Fund generally non-refundable.";
}

applySingaporeIntelligence("the-winstedt-school", {
  verdict:
    "Specialist school for learning differences and neurodiversity; therapy included in fees. No published cohort outcomes; the Winstedt Diploma is not IB or A-level.",
  paragraphs: [
    "Winstedt serves children with learning differences, autism, ADHD and dyslexia, or those who struggled in mainstream settings. Small classes, in-class therapy twice a week and pull-out support are included in the headline fee. Parents consistently praise anxiety reduction and renewed love of learning; campus is at Upper Boon Keng Road in Kallang.",
    "The school does not publish IGCSE distributions, diploma outcomes or university destination lists. The WASC-accredited Winstedt Diploma is accepted by US universities but students targeting UK or Singapore universities will likely need SAT/AP. Among the most expensive in this batch.",
  ],
  positives: [
    "Differentiated-learning model with integrated therapy in fees. Consistently positive parent feedback; HoneyKids Gold for Best School for Learning Support 2024. EduTrust certified. Sibling discount 25%. Kallang, walkable from two MRT stations.",
  ],
  considerations: [
    "No publicly available cohort-level academic outcomes. Winstedt Diploma is not IB or A-level equivalent. Small school limits peer range and extracurricular breadth.",
  ],
});

applySingaporeIntelligence("dover-court-international-school", {
  verdict:
    "Inclusive three-pathway model and consistent IB mid-30s from open admissions. Nord Anglia ownership and post-acquisition benefit cuts come up in teacher forums.",
  paragraphs: [
    "Dover Court has been in Singapore since 1972 and joined Nord Anglia in 2014. The 12-acre Dover Road campus draws consistently positive parent feedback; the three-pathway inclusion model (standard, adapted with ASDAN/BTEC, specialist with therapists) is a real differentiator. IB Class of 2025 averaged 36 with 100% pass; Class of 2023 averaged 35 with 96% pass.",
    "Teacher forums report reduced housing and health benefits after the Nord Anglia acquisition. Pathway 2/3 fees are high and not prominently signposted; building fund fee SGD 3,135/year is on top of tuition.",
  ],
  positives: [
    "Three-pathway inclusion model. Consistent IB mid-30s with 100% pass from open-admissions intake. BTEC Business alongside IB. 12-acre campus; community feel cited by long-term families. New Sixth Form Centre planned 2025-26.",
  ],
  considerations: [
    "Benefits and compensation concerns in teacher forums post Nord Anglia acquisition. Pathway 2/3 fees high and not clearly signposted. Building Fund Fee SGD 3,135/year recurring.",
  ],
});

applySingaporeIntelligence("dynamics-international-school", {
  verdict:
    "British curriculum school in Orchard. Fees not publicly listed; contact the school for details and current programme.",
  paragraphs: [
    "Dynamics offers British curriculum in central Orchard. Independent briefing data was slim; verify fees, results and pastoral support directly with the school.",
  ],
  positives: [],
  considerations: ["Fees not publicly listed. Ask for full fee schedule and any one-off charges."],
});

applySingaporeIntelligence("sir-manasseh-meyer-international-school", {
  verdict:
    "Small British-curriculum school in Sembawang with a strong community feel and fees below SGD 30K. Stops at IGCSE; no Sixth Form.",
  paragraphs: [
    "SMMIS runs from Nursery through Grade 10 in Sembawang, about 25 minutes from the city. Founded with a Jewish community mission but admits all backgrounds. WhichSchoolAdvisor found 96% would recommend; parents cite teachers knowing every student by name and leadership that is responsive and open to feedback.",
    "The school stops at Grade 10 (IGCSE). In 2024 and 2025 school-reported results showed 100% and 91% A-C respectively; these are surfaced by WhichSchoolAdvisor, not independently audited.",
  ],
  positives: [
    "Small, all-through to IGCSE; fees below SGD 30K including daily hot meal. Consistently warm parent reviews; class sizes around 18. Purpose-built campus from 2016.",
  ],
  considerations: [
    "No Sixth Form; students need to move for A-levels or IB. Sembawang location may suit north-side families best.",
  ],
});

applySingaporeIntelligence("insworld-institute", {
  verdict:
    "IGCSE and A-Levels in a small setting; annualised tuition and term-based fees. Ask about class sizes and university support.",
  paragraphs: [
    "Insworld offers British curriculum for ages 12-18. Briefing data was limited; contact the school for current fees, results and pastoral provision.",
  ],
  positives: ["IGCSE and A-Level pathway. Central Singapore location."],
  considerations: ["Verify fee structure (application and enrolment fees) and exam results."],
});

applySingaporeIntelligence("international-french-school", {
  verdict:
    "French curriculum school in Ang Mo Kio; leads to French Baccalaureate. Ask about the international stream and language support for non-Francophone families.",
  paragraphs: [
    "IFS offers French curriculum from age 2 to 18. Briefing content was limited; families should confirm fees, entry requirements and how the international section works.",
  ],
  positives: ["French curriculum and Baccalaureate. Ang Mo Kio campus."],
  considerations: ["Confirm fit if your child is not French-speaking; ask about EAL or international stream."],
});

applySingaporeIntelligence("integrated-international-school", {
  verdict:
    "Inclusive school with mainstream and support tracks; strong parent feedback on pastoral care. Ask about the balance of mainstream vs support and fee structure.",
  paragraphs: [
    "IIS runs mainstream and support tracks for diverse learners. Parent reviews praise caring teachers and differentiated support; verify current leadership and how pathways work in practice.",
  ],
  positives: ["Inclusive model; mainstream and support tracks. Consistently positive parent feedback on care and engagement."],
  considerations: ["Confirm fee structure and what is included. Ask about transition between tracks if needed."],
});

export const SINGAPORE_SCHOOL_PROFILES = PROFILES_MAP;
export const ALL_SINGAPORE_SCHOOL_SLUGS = Object.keys(PROFILES_MAP);
