/**
 * Kuala Lumpur school profiles: generates SchoolProfile objects from listing + fee data.
 */

import { KUALA_LUMPUR_SCHOOLS, type KualaLumpurSchoolListing } from "@/data/kuala-lumpur-schools";
import { KUALA_LUMPUR_FEE_DATA, KUALA_LUMPUR_RATE } from "@/data/kuala-lumpur-school-profiles";
import type { SchoolProfile, FeeRow, OneTimeFee } from "@/data/schools";
import { extractHighestFee } from "@/lib/utils/fees";

function buildFeeRows(slug: string): FeeRow[] {
  const data = KUALA_LUMPUR_FEE_DATA[slug];
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
  const data = KUALA_LUMPUR_FEE_DATA[slug];
  if (!data?.oneTimeFees) return [];
  return Object.entries(data.oneTimeFees)
    .filter(([, amount]) => amount > 0)
    .map(([name, amount]) => ({ name, amount }));
}

function createProfile(L: KualaLumpurSchoolListing): SchoolProfile {
  const feeData = KUALA_LUMPUR_FEE_DATA[L.slug];
  const address = feeData?.address || L.area;
  const lat = feeData?.lat ?? 3.14;
  const lng = feeData?.lng ?? 101.69;
  const website = L.website || feeData?.website || "";
  const feeRows = buildFeeRows(L.slug);
  const oneTimeFees = buildOneTimeFees(L.slug);
  const highK = extractHighestFee(L.feeRange);
  const hasFeeData = feeRows.length > 0;
  const feeNote = hasFeeData
    ? "Fees shown in MYR. 1 USD ≈ 4.5 MYR. Contact the school for the full fee schedule."
    : L.feeRange === "Contact school"
      ? "Fees not publicly disclosed. Contact the school for current fee schedule."
      : `Approximate annual fee range: ${L.feeRange}. Contact the school for the full fee schedule.`;
  return {
    slug: L.slug,
    citySlug: "kuala-lumpur",
    name: L.name,
    shortName: L.name.split(" ").slice(0, 3).join(" "),
    verified: L.verified,
    metaTitle: `${L.name} - Fees, Review & Admissions | Kuala Lumpur`,
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
      feeCurrency: "MYR",
      rows: hasFeeData ? feeRows : [{ gradeLevel: "All grades", ages: L.ageRange, tuition: highK > 0 ? Math.round(highK * 1000 * 4.5) : 0, capital: 0, totalEarlyBird: highK > 0 ? Math.round(highK * 1000 * 4.5) : 0, totalStandard: highK > 0 ? Math.round(highK * 1000 * 4.5) : 0 }],
      oneTime: oneTimeFees,
      note: feeNote,
    },
    academics: { results: L.examResults, paragraphs: L.examResults.length ? [`Key results: ${L.examResults.map((r) => `${r.label} ${r.value}`).join(", ")}.`] : [] },
    studentBody: { paragraphs: ["Kuala Lumpur's international schools serve a diverse community of expat and Malaysian families. Contact the school for current enrolment details."] },
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
  KUALA_LUMPUR_SCHOOLS.map((s) => [s.slug, createProfile(s)])
);

// ═══════════════════════════════════════════════════════
// EDITORIAL OVERRIDES — Intelligence from briefing adaptation
// (Batch 1: ISKL, Alice Smith, GIS, BSKL, Epsom). See scripts/intelligence-briefings/.
// ═══════════════════════════════════════════════════════

function applyKLIntelligence(
  slug: string,
  intelligence: SchoolProfile["intelligence"]
): void {
  const p = PROFILES_MAP[slug];
  if (p) p.intelligence = intelligence;
}

applyKLIntelligence("the-international-school-of", {
  verdict:
    "If you're on an Employment Pass or MM2H and can afford the highest fees in KL, ISKL is the school that comes up most consistently as the standout. Non-profit, parent-governed, strong pastoral care and a genuinely international intake. The visa restriction and cost are the main caveats.",
  paragraphs: [
    "ISKL is the clear standout in KL in both parent and teacher forums: American curriculum with an IB Diploma that over 90% of students take, non-profit and parent-owned so decisions feel educational rather than commercial. The Ampang Hilir campus is large and well-resourced; teachers are described as exceptional and retention is strong.",
    "Fees are the highest in KL and the gap isn't small. Only families on Employment Pass or MM2H can enrol, which rules out digital nomads and some short-term assignees. Some parents mention behaviour and social pressures in the upper years; ask about pastoral support and expectations for older students.",
  ],
  positives: [
    "Consistently ranked above other KL schools in parent and teacher forums. Non-profit, parent-governed structure.",
    "IB Diploma with 90%+ take-up; strong pastoral care and diversity actively managed (nationality caps).",
    "New Ampang Hilir campus, large and well-resourced. Teacher package described as best in KL.",
    "Tight-knit community; new students report feeling settled quickly.",
  ],
  considerations: [
    "Highest fees in KL. Restricted access: requires Employment Pass or MM2H.",
    "Alcohol has come up in parent discussions about the senior years. Ask how the school handles pastoral support and expectations for older students.",
    "Teacher rotation every few years is noted in some reviews; worth asking about retention.",
  ],
});

applyKLIntelligence("the-alice-smith-school", {
  verdict:
    "Strong British curriculum and track record, but the school has been through a turbulent period with leadership and staff morale. If you're considering it, ask directly about current leadership stability and staff retention.",
  paragraphs: [
    "Alice Smith has over 70 years in KL and has sat near the top of British school rankings. Strong IGCSE and A-level track record, excellent bus network, non-profit governance. The secondary campus at Equine Park is widely praised for scale and facilities.",
    "Since around 2022 the school has faced sustained criticism from staff: leadership concerns, union dissolution, legal disputes with departing staff, and a controversial proposal to drop IGCSEs (reportedly paused after parent pushback). Staff turnover has been high; ask about retention and current leadership. The school has a long-standing reputation among non-British families for feeling cliquey or British-centric.",
  ],
  positives: [
    "Non-profit governance; strong IGCSE and A-level track record over decades.",
    "Excellent bus network across KL. Secondary campus (Equine Park) is large and well-equipped.",
    "Parent community has a reputation for being organised and welcoming. Pastoral care frequently praised.",
  ],
  considerations: [
    "Staff turnover has been high; some reviews describe difficult working conditions. Ask about retention and current leadership.",
    "Long-standing reputation for feeling cliquey or British-centric among non-British families.",
    "A-levels only (no IB). Primary campus described as older and dated in some reviews.",
  ],
});

applyKLIntelligence("garden-international-school", {
  verdict:
    "A long-established British school in Mont Kiara with strong facilities and results. For-profit ownership and leadership turnover are recurring themes; location is a plus if you live in Mont Kiara, but traffic is severe.",
  paragraphs: [
    "GIS has been in Mont Kiara for over 70 years. Parents praise the teachers, extracurriculars (arts, Duke of Edinburgh), and the international community; Mont Kiara families can walk to school. IGCSE and A-level results are solid.",
    "The school is for-profit (Taylor's/KKR) and leadership turnover has been persistent - three deputy heads advertised at once in late 2025. Overcrowding and Mont Kiara traffic are well-documented complaints; some commentators flag an elitist student culture. Fees are among the highest in KL.",
  ],
  positives: [
    "Long-established with 70+ year track record. Facilities consistently praised, including Art wing and large sports complex.",
    "Strong extracurriculars: Duke of Edinburgh, house system. Good pastoral care. Walkable for Mont Kiara residents.",
    "Solid IGCSE and A-level results. Teachers well-paid by KL standards.",
  ],
  considerations: [
    "For-profit ownership (Taylor's/KKR). Leadership instability; high staff turnover noted in reviews.",
    "Overcrowding and Mont Kiara traffic are well-documented. Elitist student culture flagged by some commentators.",
    "Fees among the highest in KL.",
  ],
});

applyKLIntelligence("the-british-international-school-of", {
  verdict:
    "A strong British option with a modern campus and good results; it ranks third among KL British schools in most comparisons and the for-profit, commercial culture is noted in reviews. Worth visiting if you want British curriculum in a modern setting.",
  paragraphs: [
    "BSKL is a Nord Anglia school with English National Curriculum through IGCSE and A-level. The Bandar Utama campus is the most praised aspect - modern and well-organised. Diverse intake, good co-curriculars including Tottenham Hotspur football programme, strong IGCSE results.",
    "It's commercial and for-profit; teacher commentary mentions leadership instability and profit-driven decisions. Consistently ranked third among KL British schools. Location in Bandar Utama is awkward from central KL; fees are among the top three in KL. Some parents note a recent shift toward focusing on top-performing students.",
  ],
  positives: [
    "Modern, well-organised campus consistently praised. Strong IGCSE and A-level results.",
    "Diverse student body (~60 nationalities). Co-curricular activities well-structured; strong safeguarding and pastoral care.",
    "Nord Anglia network benefit for families already in NAE. Admin and admissions described as helpful.",
  ],
  considerations: [
    "For-profit (Nord Anglia); commercial culture flagged in some reviews. Third-ranked among KL British schools in most comparisons.",
    "Leadership instability noted; recent shift toward academic performance focus - reportedly less inclusive.",
    "Location inconvenient from central or south KL. Fees in the top three most expensive in KL.",
  ],
});

applyKLIntelligence("epsom-college-in-malaysia", {
  verdict:
    "The only boarding option in the KL orbit - strong sports, close-knit community, good university placement. Staff turnover and working conditions have been a consistent concern in reviews; if boarding is a must, visit and ask about current leadership and retention.",
  paragraphs: [
    "Epsom is a boarding school about an hour south of KL in Bandar Enstek. Students praise the teachers, community, sports facilities (La Liga, Mouratoglou Tennis partnerships), and university placement support. Buffet meals are included in fees. For day families the distance is a real barrier - car essential.",
    "Staff reviews over several years have been largely negative: workload, admin dysfunction, high turnover. Behaviour in the middle years has been flagged in some accounts. Ask about current leadership and staff retention before committing.",
  ],
  positives: [
    "Boarding school experience - house system, community, independence-building. Outstanding sports facilities and partnerships.",
    "Strong university placement support; Warwick, LSE and other top UK destinations cited.",
    "Close-knit community. Buffet meals included in fees. Multicultural student body.",
  ],
  considerations: [
    "Staff turnover has been high; some reviews describe difficult working conditions and admin. Ask about retention and current leadership.",
    "Boarding duty load and student behaviour in Years 7-11 have been raised in some reviews. Ask how the school supports both students and staff.",
    "Isolated location - about an hour from KL, car essential. Fees among the highest in Malaysia.",
  ],
});

// KL Batch 2–6: Sunway, Nexus, IGBIS, AISM, King Henry VIII, ISP, Sri KDU Subang, Fairview, HELP, ELC, Tenby SEP, Cempaka, Sri KDU Kota Damansara
applyKLIntelligence("sunway-international-school", {
  verdict:
    "The only KL school with three pathways under one roof (Canadian OSSD, Cambridge IGCSE, IB Diploma). Strong if you live near Bandar Sunway and want flexibility; the campus is new and the full K–12 track record is still short.",
  paragraphs: [
    "Sunway International School offers Canadian OSSD, Cambridge IGCSE, and IB Diploma on one campus that opened in 2023. The site is widely praised: seven acres, 25m pool, football field, GreenRE Platinum. Parents describe friendly teachers and responsive management.",
    "The school is only in its third year as full K–12; location in Bandar Sunway is a barrier from central KL or Mont Kiara. Student body skews toward the Chinese community. Ask about pastoral support and social dynamics in the upper years.",
  ],
  positives: [
    "Multi-pathway model (Canadian + Cambridge + IB) is rare in KL. New campus (2023) with strong facilities and sustainability credentials.",
    "Teacher and parent commentary broadly positive on culture and administration. Sunway-to-university pipeline may offer discounts; worth asking.",
  ],
  considerations: [
    "Very young full K–12 track record. Bandar Sunway is inconvenient from central KL or Mont Kiara. Student body increasingly Chinese-heavy; ask about diversity and EAL support.",
  ],
});

applyKLIntelligence("nexus-international-school", {
  verdict:
    "Consistently ranked alongside ISKL by teachers; strong IB results and an 80-acre Putrajaya campus. Location is the main trade-off - fine if you can commit to the commute or live nearby.",
  paragraphs: [
    "Nexus sits on 80 acres in Putrajaya with IB at the senior end (IGCSE in Years 10–11, IB Diploma and Careers in 12–13). Parents describe a genuinely international, unpretentious community; founding principal has been in post since 2008. Strong IB results including a perfect 45 in 2023.",
    "Putrajaya is quiet at weekends and a drive from Mont Kiara or Bangsar. Teacher workload is described as demanding. Year 12/13 fees attract 6% SST. Buses run to Mont Kiara and Puchong.",
  ],
  positives: [
    "Rated by teachers alongside ISKL as one of only two KL schools worth returning for. Leadership stability; strong IB results and boarding programme.",
    "80-acre campus, Olympic pool, multinational community. ECA programme four days per week.",
  ],
  considerations: [
    "Putrajaya location isolating for central expat hubs; weekends are quiet. Teacher workload and Indeed management score flagged. Ask about current boarding team stability.",
  ],
});

applyKLIntelligence("igb-international-school", {
  verdict:
    "The only school in Malaysia running all four IB programmes; results competitive with ISKL. Location in Sierramas (Sungai Buloh) and traffic on the access road are the main drawbacks.",
  paragraphs: [
    "IGBIS offers PYP, MYP, Diploma, and Career-related Programme on a campus in Sierramas. IB average 34 (2024); close-knit community and 92% expat teaching staff. Facilities include Olympic pool, FIFA turf, 534-seat theatre.",
    "The Sierramas access road is a documented bottleneck at rush hour. Indeed management score is low; small sample. For-profit (IGB Corporation). Ask about commute from your area.",
  ],
  positives: [
    "Only school in Malaysia with all four IB programmes. Consistently above-average IB results; small class sizes and strong teacher retention signals.",
    "Excellent facilities; no safeguarding or leadership controversies in the record.",
  ],
  considerations: [
    "Sierramas traffic is a real daily issue for families not nearby. Indeed management score low. IB-only - no A-level pathway. Small school (~350 students).",
  ],
});

applyKLIntelligence("australian-international-school-malaysia", {
  verdict:
    "The only NSW HSC school in Malaysia - the natural choice for Australian families or those targeting Australian universities. Strong pastoral care and teacher satisfaction; location in Seri Kembangan is the main constraint.",
  paragraphs: [
    "AISM runs the New South Wales HSC; results are strong (Top 100 NSW schools in 2021). Around 600 students on a green Seri Kembangan campus. Teachers and parents praise management support and a stress-free, close-knit atmosphere.",
    "Seri Kembangan is roughly 30 minutes from KL CBD in good traffic. NSW HSC is more specialised than IB for global university options. Value-for-money was rated lowest among categories on one review platform. For-profit (Taylor's/KKR).",
  ],
  positives: [
    "Only NSW HSC in Malaysia; strong results and pastoral care. Teacher commentary unusually positive; individualised support and compulsory ECAs.",
    "Green campus; Taylor's group may offer sibling or pathway benefits.",
  ],
  considerations: [
    "Location inconvenient for central KL. NSW HSC - check US university recognition if relevant. Ask about value and fee structure.",
  ],
});

applyKLIntelligence("king-henry-viii-college", {
  verdict:
    "British boarding from Year 6 in Cyberjaya with a striking campus. The school went through a serious ownership and payment crisis in 2022; ask directly about current governance, salary payment, and staff turnover before committing.",
  paragraphs: [
    "King Henry VIII College opened in 2018 with a Christ College Brecon link; British pathway EYFS to A-Level, boarding from Year 6. Campus has indoor pool, squash, dance studio; small class sizes and 30+ nationalities. Post-2023 reviews suggest improvement.",
    "In 2022, teacher accounts cited non-payment of salaries, tax/EPF issues, and contract changes. A 2025 leaver said problems persist. No published IGCSE or A-Level results. Ask about staff turnover and the Christ College partnership.",
  ],
  positives: [
    "Striking campus and full British pathway. Boarding from Year 6. Post-2023 reviews suggest meaningful improvement.",
  ],
  considerations: [
    "2022 ownership crisis - ask whether salaries and governance are now stable. No published exam results. Cyberjaya is less central than Mont Kiara/Bangsar.",
  ],
});

applyKLIntelligence("the-international-school-at-parkcity", {
  verdict:
    "One of the most warmly reviewed schools in KL with a strong ParkCity community feel. A 46-storey tower is being built eight metres from the primary campus until 2029 - if you are considering primary, verify impact and secondary campus separation.",
  paragraphs: [
    "ISP sits in Desa ParkCity with ISQM Gold Outstanding, EAL Gold Mark, and class sizes capped at 24. Parents consistently praise the community and sense of safety. The developer building the tower is linked to the school's board; construction is ongoing and some parents received legal notices.",
    "IPC primary curriculum is less academically intensive than Cambridge or Singapore curricula; some families supplement. New head from August 2024. No independently verified exam results. Ask about construction timeline and primary/secondary separation.",
  ],
  positives: [
    "Among the warmest parent reviews in KL; ParkCity walkability and 70–100 co-curricular activities per week. Strong accreditations and ParkCity Club access.",
  ],
  considerations: [
    "46-storey construction 8m from primary until 2029; developer served legal notices on some parents. IPC primary less intensive; registration RM 20,000 non-refundable. New leadership - too early to assess.",
  ],
});

applyKLIntelligence("sri-kdu-international-school-subang-jaya", {
  verdict:
    "Established British curriculum school in Subang Jaya at roughly half the cost of top-tier British schools. XCL ownership and teacher pay have drawn criticism; student behaviour is consistently praised.",
  paragraphs: [
    "Sri KDU Subang Jaya (since 2003, under XCL) sits in the mid-lower tier of the KL market. Published results: 2024 IGCSE 51% A*-A, 91% A*-C; A-Level 50% A*-A. Teachers describe students as well-mannered and easy to work with.",
    "Teacher pay is well below Alice Smith, GIS, or BSKL; the school is described as a stepping stone. XCL acquisition drew consistent criticism. Ask about retention and leadership.",
  ],
  positives: [
    "Fees roughly half top-tier British schools; solid published results and convenient Subang Jaya location. Student behaviour consistently praised.",
  ],
  considerations: [
    "Teacher pay and turnover flagged; XCL culture criticised. Mid-lower tier in KL comparisons. Very thin independent parent commentary.",
  ],
});

applyKLIntelligence("fairview-international-school", {
  verdict:
    "IBDP results are strong and independently verifiable (e.g. 36/45 average, joint 80th globally); fees are lower than ISKL for comparable IB. Staff culture and academic-integrity concerns have been raised repeatedly - ask about governance and support.",
  paragraphs: [
    "Fairview offers a full IB pathway with strong Diploma results; ranked #1 IB in Malaysia for five consecutive years by one adviser. Fees are substantially lower than ISKL or British schools for similar IB. Student body is predominantly mainland Chinese; high-EAL environment.",
    "Staff pay and Glassdoor reviews are notably negative; academic-integrity allegations (e.g. pressure on Extended Essay grades) recur in sources. Family ownership with non-educator in a principal role. Ask about pastoral support and English immersion.",
  ],
  positives: [
    "IBDP results strong and independently cited; full PYP–DP pathway at lower fee point. Long-established (1978).",
  ],
  considerations: [
    "Staff pay and culture heavily criticised; academic-integrity concerns raised. Mainland Chinese majority; limited ESL support noted. Facilities described as poorly maintained in some reviews.",
  ],
});

applyKLIntelligence("help-international-school", {
  verdict:
    "Affordable British curriculum in greater KL with HELP Academy's A-Level heritage and CIS accreditation. Independent commentary is thin; one retraction incident suggests asking about how the school responds to criticism.",
  paragraphs: [
    "HIS is part of the HELP group; CIS accredited, 5-star SKIPS, and shortlisted for TES Awards 2024. Parents praise qualified teachers and pastoral care; enrolment has grown. Students have gone to LSE, Cambridge, Imperial.",
    "Very little independent discussion on Reddit or expat forums. A student posted a critical review then retracted it; commenters speculated about pressure. Fee data inconsistent across sources. Ask about payment terms and leadership stability.",
  ],
  positives: [
    "Affordable British curriculum; HELP Academy A-Level heritage and CIS accreditation. Consistent praise for pastoral care and growing enrolment.",
  ],
  considerations: [
    "Thin independent commentary. Retraction incident may signal pressure on critics - ask how the school handles feedback. Verify fee data directly.",
  ],
});

applyKLIntelligence("elc-international-school", {
  verdict:
    "Traditional British curriculum at about a third of top-tier fees, with strong IGCSE results and A-Levels at Sungai Buloh. Academic pressure and management reviews are the main trade-offs; ask about nationality quotas if relevant.",
  paragraphs: [
    "ELC has run since 1987 with Gold EDT accreditation and 75–80% IGCSE A*/A over ten years. Sixth form at Sungai Buloh is rare at this price. Small campuses, 1:9 staff–student ratio; classroom teachers are praised.",
    "The curriculum is academically demanding with continuous assessment; some parents praise it, others report overwhelming pressure. Management gets consistent negative commentary from staff. A parent review alleged nationality quotas for admissions - raise directly if relevant.",
  ],
  positives: [
    "Genuinely affordable IGCSE and A-Level; sixth form at Sungai Buloh. Gold EDT Outstanding; consistent IGCSE results. Small campuses and good staff ratio.",
  ],
  considerations: [
    "Heavy academic pressure; not for children who struggle with exam-led learning. Facilities basic; management attracts negative staff reviews. Ask about admissions policy and quotas.",
  ],
});

applyKLIntelligence("tenby-school-setia-eco-park", {
  verdict:
    "Large 20-acre campus with strong published IGCSE and A-Level results under ISP ownership. Independent commentary from the ISP era is thin; teacher experience remains stressed - ask about retention and culture.",
  paragraphs: [
    "Tenby SEP has around 1,200 students (international stream) and was the first school in Asia to achieve ISP Mastering status (2024). Results: six years of Grade A at IGCSE, 83% A*-B, 100% A-Level pass. Parents with enrolled children describe happy kids.",
    "Little third-party commentary from the ISP era; historical record under previous owners was poor. Teacher reviews cite low increments, no bonus, high stress. Ask about current management and staff turnover.",
  ],
  positives: [
    "Large campus with pool and sports; strong published IGCSE and A-Level results. ISP curriculum and improvement process. 38 nationalities.",
  ],
  considerations: [
    "Thin independent commentary since ISP took over. Teacher experience stressed; \"not a real international school\" perception in some forums. Verify results independently.",
  ],
});

applyKLIntelligence("cempaka-international-school", {
  verdict:
    "One of Malaysia's oldest private international schools with strong performing arts and IGCSE results. Predominantly wealthy Malaysian intake; management and bullying concerns at Damansara campus are well documented - ask how the school responds to incidents.",
  paragraphs: [
    "Cempaka (est. 1983) has a strong alumni network, performing arts programme, and sports facilities. IGCSE results 72% A*/A (2025); CIS re-accredited 2026. Good for local Malaysian networking; not demographically international.",
    "Management is the most consistent criticism across 15 years: no increments, favouritism, poor communication. Bullying at Damansara campus has been raised in multiple 2023–2025 accounts, including allegations of cover-up. Ask about incident response and pastoral support.",
  ],
  positives: [
    "Oldest private international schools in Malaysia; strong performing arts and sports. IGCSE and A-Level results strong; Finnish curriculum option in primary.",
  ],
  considerations: [
    "Predominantly Malaysian students; not internationally diverse. Management and teacher pay heavily criticised. Bullying concerns and responsiveness issues - ask directly.",
  ],
});

applyKLIntelligence("sri-kdu-school", {
  verdict:
    "Gold ISQM school with strong IGCSE results (60% A*-A in 2025) and well-behaved students. No sixth form at this campus; XCL ownership and teacher pay are widely criticised - ask about retention and A-Level transfer to Subang Jaya.",
  paragraphs: [
    "Sri KDU Kota Damansara has been operating since 2003; first international school in Malaysia to receive Gold ISQM. Students described as well-behaved and motivated; parents praise the principal and co-curriculars. A-Levels are at the Subang Jaya campus.",
    "Teacher commentary focuses on low pay and bait-and-switch offers at contract stage; the school is described as a stepping stone. XCL acquisition cited as a turning point for the worse. Traffic around campus is severe at drop-off and pick-up.",
  ],
  positives: [
    "Strong IGCSE results; Gold ISQM first in Malaysia. Established since 2003; students well-behaved. XCL group has A-Levels at Subang Jaya for post–Year 11.",
  ],
  considerations: [
    "No sixth form here - transfer for A-Levels. Teacher pay among lowest in KL; high turnover. XCL culture and traffic are persistent issues.",
  ],
});

// Batch 21-30 from briefing emails (Mar 2026)
applyKLIntelligence("peninsula-international-school-australia", {
  verdict:
    "Australian curriculum in Shah Alam; fees RM 24K–75K. Ask about retention and how the NSW/Victorian pathway fits your plans.",
  paragraphs: [
    "Peninsula offers Australian curriculum in Shah Alam. Briefing data was limited; verify fees, results and teacher stability directly with the school.",
  ],
  positives: ["Australian curriculum. Shah Alam location. Sibling and payment discounts available."],
  considerations: ["Confirm full fee schedule and retention. Ask about secondary pathway and exam options."],
});

applyKLIntelligence("eaton-international-school", {
  verdict:
    "British curriculum in Kajang; fees from RM 16K. Compulsory meal plan for Early Years. Ask about class sizes and IGCSE support.",
  paragraphs: [
    "Eaton runs British curriculum in Kajang with sibling discounts. Briefing content was limited; contact the school for current fees, results and pastoral provision.",
  ],
  positives: ["British curriculum. Kajang campus. Sibling discounts 5–10%. Compulsory meal plan for Early Years."],
  considerations: ["Kajang location; assess commute. Verify fee inclusions and one-off charges."],
});

applyKLIntelligence("ucsi-international-school", {
  verdict:
    "British curriculum in Cheras; 3 terms/year. Ask about campus options (Springhill, Subang Jaya) and retention.",
  paragraphs: [
    "UCSI International School KL offers British curriculum with multiple campus options. Fee and result details were limited in the briefing; confirm directly with the school.",
  ],
  positives: ["British curriculum. Multiple campuses. Tech fee included in some tiers. 3 terms/year."],
  considerations: ["Confirm which campus you are considering and compare experience. Ask about retention and results."],
});

applyKLIntelligence("hibiscus-international-school", {
  verdict:
    "British curriculum in Segambut; 5% full-year discount, sibling discounts up to 15%. Ask about IGCSE results and class sizes.",
  paragraphs: [
    "Hibiscus runs British curriculum in Segambut. Briefing data was limited; verify fees, results and pastoral support with the school.",
  ],
  positives: ["British curriculum. Segambut location. 5% discount for full-year payment; sibling discounts."],
  considerations: ["Confirm fee schedule and any resource or activity fees. Ask about exam results and retention."],
});

applyKLIntelligence("tanarata-international-school", {
  verdict:
    "British curriculum in Kajang; fees RM 25K–37K, 10% sibling discount. Ask about IGCSE and A-Level provision and retention.",
  paragraphs: [
    "Tanarata offers British curriculum in Kajang with Resource Fund per term. Briefing content was limited; contact the school for current outcomes and teacher stability.",
  ],
  positives: ["British curriculum. Kajang. 10% sibling discount. Resource Fund RM 600/term."],
  considerations: ["Kajang location. Verify full fee breakdown and exam support."],
});

applyKLIntelligence("idrissi-international-school", {
  verdict:
    "Islamic international school with British curriculum; Setia Alam and Bukit Jelutong campuses. Preschool through secondary. Ask about ethos and language support.",
  paragraphs: [
    "Idrissi runs British curriculum in an Islamic context with two Shah Alam-area campuses. Briefing data was limited; families should confirm fit, fees and results directly.",
  ],
  positives: ["British curriculum. Two campuses (Setia Alam, Bukit Jelutong). Islamic ethos; all backgrounds admitted."],
  considerations: ["Confirm fit with faith-based approach. Verify fee structure and secondary pathway."],
});

export const KUALA_LUMPUR_SCHOOL_PROFILES = PROFILES_MAP;
export const ALL_KUALA_LUMPUR_SCHOOL_SLUGS = Object.keys(PROFILES_MAP);
