// ═══════════════════════════════════════════════════════
// SCHOOL PROFILE DATA
// Maps directly to the Neon `schools` table schema.
// When we wire the DB, each field here becomes a column query.
// ═══════════════════════════════════════════════════════

export const EXCHANGE_RATE = 16_800; // IDR per USD
export const EXCHANGE_RATE_DATE = "19 Feb 2026";

// ── Types ──────────────────────────────────────────────

export interface FeeRow {
  gradeLevel: string;
  ages: string;
  tuition: number;
  capital: number;
  totalEarlyBird: number;
  totalStandard: number;
}

export interface OneTimeFee {
  name: string;
  amount: number;
  note?: string;
}

export interface Campus {
  name: string;
  address: string;
  grades?: string;
  lat: number;
  lng: number;
}

export interface SchoolProfile {
  // ── Identity ──
  slug: string;
  citySlug: string;
  name: string;
  shortName: string;
  verified: boolean;

  // ── Metadata (SEO) ──
  metaTitle: string;
  metaDescription: string;

  // ── Masthead ──
  campuses: Campus[];
  lastUpdated: string;
  curricula: string[];
  stats: { value: string; label: string }[];

  // ── Head of School ──
  head: {
    name: string;
    since: number;
    bio: string;
  };

  // ── Photos ──
  photoAlts: string[];

  // ── Intelligence (Editorial) ──
  intelligence: {
    verdict: string;
    paragraphs: string[];
    positives: string[];
    considerations: string[];
  };

  // ── Fees ──
  fees: {
    academicYear: string;
    feeCurrency: string;
    rows: FeeRow[];
    oneTime: OneTimeFee[];
    note: string;
  };

  // ── Academics ──
  academics: {
    results: { value: string; label: string }[];
    paragraphs: string[];
  };

  // ── Student Body ──
  studentBody: {
    paragraphs: string[];
    inspection?: {
      date: string;
      body: string;
      rating: string;
      findings: string;
    };
  };

  // ── School Life ──
  schoolLife: {
    activitiesCount: number;
    uniformRequired: boolean;
    facilities: string[];
    paragraphs: string[];
  };

  // ── Contact ──
  contact: {
    phone: string;
    email: string;
    website: string;
  };

  // ── Sidebar ──
  sidebar: {
    quickFacts: { label: string; value: string }[];
    otherSchools: {
      name: string;
      slug: string;
      meta: string;
      feeRange: string;
    }[];
    relatedInsights: {
      title: string;
      slug: string;
      readTime: string;
    }[];
  };

  // ── Structured Data ──
  jsonLd: {
    description: string;
    foundingDate: string;
    numberOfStudents: string;
  };
}

// ═══════════════════════════════════════════════════════
// JAKARTA INTERCULTURAL SCHOOL (JIS)
// ═══════════════════════════════════════════════════════

const jis: SchoolProfile = {
  slug: "jakarta-intercultural-school",
  citySlug: "jakarta",
  name: "Jakarta Intercultural School",
  shortName: "JIS",
  verified: true,

  metaTitle: "Jakarta Intercultural School (JIS) — Fees, IB Results & Review",
  metaDescription:
    "Jakarta Intercultural School profile — fees from US$17K–US$36K/year, IB average 35.8, 2,500+ students, 60+ nationalities. Honest editorial review for expat parents.",

  campuses: [
    {
      name: "Cilandak Campus (Secondary)",
      address: "Jl. Terogong Raya No. 33, Cilandak, Jakarta Selatan 12430",
      grades: "Early Childhood – High School",
      lat: -6.2832,
      lng: 106.792,
    },
    {
      name: "Cilandak Campus (Early Childhood)",
      address: "Jl. Terogong Raya, Cilandak, Jakarta Selatan 12430",
      grades: "Early Years",
      lat: -6.2845,
      lng: 106.791,
    },
    {
      name: "Pattimura Campus (Elementary K–5)",
      address: "Jl. Pattimura Blok 1 No. 2, Kebayoran Baru, Jakarta Selatan 12110",
      grades: "Elementary Grades 1–5",
      lat: -6.244,
      lng: 106.7975,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["IB Primary Years", "IB Middle Years", "IB Diploma", "AP"],
  stats: [
    { value: "2,500+", label: "Students" },
    { value: "3–18", label: "Age Range" },
    { value: "60+", label: "Nationalities" },
    { value: "US$17K – US$36K", label: "Annual Fees" },
  ],

  head: {
    name: "Dr. Tarek Razik",
    since: 2022,
    bio: "Dr. Tarek Razik has led JIS since 2022. He holds a doctorate in Educational Leadership from Columbia University and has over 25 years of experience in international schools, including previous headships in the Middle East and Africa.",
  },

  photoAlts: [
    "Cilandak campus aerial",
    "Olympic swimming pool",
    "Performing arts centre",
    "Science laboratory",
  ],

  intelligence: {
    verdict:
      "If your company is paying and your child is reasonably outgoing, JIS is a safe, solid choice — strong university placements, huge breadth of activities, and a genuinely international community. If you're self-funding, it's worth comparing.",
    paragraphs: [
      "The word among expat families is that JIS is the big, established name — the school most corporate packages are written around and the one relocation agents mention first. Founded in 1951, it has the history, the scale, and the resources that come with being Jakarta's largest international school. Parents describe it as offering an American-influenced education with a broad international mix of students. The main Cilandak campus runs Early Childhood through High School, while Pattimura in Kebayoran Baru takes Elementary (K–5).",
      "Families who've been here a few years tend to say the strengths are real — strong university placements, a huge range of activities, and a community that feels like a small town. The flip side is that it's expensive (the most expensive in Jakarta), the campus is ageing, and at 2,500+ students it can feel impersonal if your child isn't the type to put their hand up. It suits families who want breadth of opportunity and don't mind a bigger, busier environment.",
      "The general consensus: if your company is paying and your child is reasonably outgoing, JIS is a safe and solid choice. If you're self-funding or want a smaller, more personal setup, it's worth looking at what else is out there.",
    ],
    positives: [
      "Strong university placement track record — graduates regularly go on to well-known US, UK, and Australian universities, with a solid Ivy League and Oxbridge pipeline. Parents say the college counselling team is experienced and well-connected.",
      "Diverse student body with 60+ nationalities and no single group dominating — parents value the fact that their children mix with families from all over the world rather than one or two dominant communities.",
      "Serious sports programme through IASAS, competing against top international schools across Southeast Asia. Good range of team and individual sports, and high participation rates across the secondary school.",
      "Large-scale arts and performing arts programme — annual musicals, orchestra, and dedicated performance spaces mean students who are into drama, music, or visual arts have real outlets and resources.",
      "Well-established alumni network going back over 70 years — useful for older students thinking about university applications, internships, and career connections.",
    ],
    considerations: [
      "At IDR 527M+ per year rising to IDR 604M for IB, JIS is comfortably the most expensive school in Jakarta. The gap between JIS and the next tier down is significant — make sure you're clear on what the premium buys you before committing.",
      "The Cilandak campus dates from the mid-1970s and parts of it are showing their age. A renovation programme is underway but it's a big site and there's still plenty of work to do. Don't expect gleaming, purpose-built facilities throughout.",
      "Traffic around the Cilandak campus at drop-off is a genuine headache. Jl. Terogong Raya backs up badly between 7:15 and 7:45 AM. Families who live in BSD or Tangerang should factor in a long commute.",
      "With 2,500+ students, JIS is a big school. Parents of quieter children sometimes say their kids can get lost in the crowd, particularly in middle school. It works well for confident, outgoing students — less so for those who need to be drawn out.",
      "The American-influenced approach — first-name basis with teachers, emphasis on student voice and choice — suits some families but feels too informal for those coming from British or more traditional Asian school cultures.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Early Years 1 & 2 (Half Day)", ages: "3–4 years", tuition: 195_450_000, capital: 65_360_000, totalEarlyBird: 286_500_000, totalStandard: 291_780_000 },
      { gradeLevel: "Early Years 1 & 2 (Full Day)", ages: "3–4 years", tuition: 279_450_000, capital: 65_360_000, totalEarlyBird: 370_500_000, totalStandard: 375_780_000 },
      { gradeLevel: "Kindergarten", ages: "4–5 years", tuition: 408_950_000, capital: 65_360_000, totalEarlyBird: 500_000_000, totalStandard: 505_280_000 },
      { gradeLevel: "Elementary (Grades 1–5)", ages: "5–11 years", tuition: 431_450_000, capital: 65_360_000, totalEarlyBird: 522_500_000, totalStandard: 527_780_000 },
      { gradeLevel: "Middle School (Grades 6–8)", ages: "11–14 years", tuition: 504_100_000, capital: 65_360_000, totalEarlyBird: 595_150_000, totalStandard: 600_430_000 },
      { gradeLevel: "High School (Grades 9–12)", ages: "14–18 years", tuition: 508_000_000, capital: 65_360_000, totalEarlyBird: 599_050_000, totalStandard: 604_330_000 },
      { gradeLevel: "JIS Learning Centre (Primary)", ages: "Learning support", tuition: 687_250_000, capital: 65_360_000, totalEarlyBird: 778_300_000, totalStandard: 783_580_000 },
      { gradeLevel: "JIS Learning Centre (Secondary)", ages: "Learning support", tuition: 759_900_000, capital: 65_360_000, totalEarlyBird: 850_950_000, totalStandard: 856_230_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 5_300_000 },
      { name: "Enrolment Guarantee (Early Bird)", amount: 25_690_000, note: "Paid by 10 Apr 2025" },
      { name: "Enrolment Guarantee (Standard)", amount: 30_970_000 },
      { name: "Technology Fee (Elementary)", amount: 6_647_000, note: "One-time, new students" },
      { name: "Technology Fee (MS/HS)", amount: 23_210_000, note: "One-time, new students" },
      { name: "EAL Programme Fee", amount: 71_318_000, note: "One-time, if required" },
    ],
    note: "Fees shown are early-bird totals (including tuition, capital fee, and enrolment guarantee). Standard totals are slightly higher. Lane 3 surcharge applies to students transferring from local/international schools in Greater Jakarta (IDR 196M for Grade 10, IDR 294M for Grade 11). Transport: ~IDR 67M/year (chaperoned elementary) or ~IDR 62M/year (unchaperoned secondary).",
  },

  academics: {
    results: [
      { value: "35.8", label: "Average IB Score (2024)" },
      { value: "97.5%", label: "IB Pass Rate" },
    ],
    paragraphs: [
      "JIS offers the full IB continuum from PYP through DP, alongside Advanced Placement courses for students preferring the American pathway. The IB Diploma average was 35.8 in 2024 with a pass rate above 97%.",
      "University destinations include US institutions (40–50% of graduates, including Ivy League and top-20), UK universities (around 25%, including Oxbridge and Russell Group), and growing numbers to Australia, Canada, and Europe. The middle school follows a modified IB MYP with American curriculum elements.",
      "Class sizes average 18–20 students. Learning support and EAL programmes are available. STEAM subjects are well-resourced with dedicated labs and maker spaces.",
    ],
  },

  studentBody: {
    paragraphs: [
      "JIS draws a mix of expatriate children and internationally-minded Indonesian families. The student body includes children of diplomats, multinational executives, and entrepreneurs. Many students have lived in multiple countries.",
      "Indonesian students now represent about 25% of enrolment, with the remainder spread across 60+ nationalities, the largest groups being American, South Korean, Japanese, and Australian. Gender split: 52:48 male to female.",
    ],
    inspection: {
      date: "20 May 2023",
      body: "CIS / WASC",
      rating: "Excellent",
      findings:
        "CIS/WASC joint accreditation review noted strong student learning outcomes and community engagement. The report highlighted the school's mission-driven approach and breadth of programme offerings.",
    },
  },

  schoolLife: {
    activitiesCount: 180,
    uniformRequired: true,
    facilities: [
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
    ],
    paragraphs: [
      "JIS runs a house system across grade levels with inter-house competitions in sports, arts, and community service. 'JIS Week' in February is the main cultural event, featuring performances, food fairs, and cultural presentations reflecting the school's international mix.",
      "The school competes in IASAS (Interscholastic Association of Southeast Asian Schools) against six other leading international schools across the region, and sport is a significant part of secondary school life. The arts programme produces large-scale musicals annually and there are dedicated music, drama, and visual arts spaces.",
      "Service learning is embedded into the curriculum. The Cilandak campus has a community feel, and many families use the pool and sports facilities at weekends. The PTA is active and well-organised.",
    ],
  },

  contact: {
    phone: "+62 21 769 2555",
    email: "admissions@jisedu.or.id",
    website: "https://www.jisedu.or.id",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "1951" },
      { label: "Type", value: "Non-profit, Co-ed" },
      { label: "Curriculum", value: "IB + AP" },
      { label: "Students", value: "2,500+" },
      { label: "Ages", value: "3–18" },
      { label: "Nationalities", value: "60+" },
      { label: "IB Average", value: "35.8" },
      { label: "Accreditation", value: "CIS / WASC" },
      { label: "Fees", value: "US$17K – $36K" },
    ],
    otherSchools: [
      { name: "British School Jakarta", slug: "british-school-jakarta", meta: "British · Ages 3–18 · Bintaro", feeRange: "US$18K – $32K / year" },
      { name: "Australian Independent School", slug: "australian-independent-school-jakarta", meta: "Australian · Ages 3–18 · Kemang", feeRange: "US$12K – $22K / year" },
      { name: "Mentari Intercultural School", slug: "mentari-intercultural-school-jakarta", meta: "IB · Ages 3–18 · Pondok Indah", feeRange: "US$8K – $16K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "IB vs British Curriculum: What Jakarta Parents Need to Know", slug: "ib-vs-british-curriculum-jakarta", readTime: "8 min read" },
    ],
  },

  jsonLd: {
    description: "Non-profit, co-educational international school established in 1951 offering IB PYP, MYP, Diploma and AP curricula.",
    foundingDate: "1951",
    numberOfStudents: "2500",
  },
};

// ═══════════════════════════════════════════════════════
// BRITISH SCHOOL JAKARTA (BSJ)
// ═══════════════════════════════════════════════════════

const bsj: SchoolProfile = {
  slug: "british-school-jakarta",
  citySlug: "jakarta",
  name: "British School Jakarta",
  shortName: "BSJ",
  verified: true,

  metaTitle: "British School Jakarta (BSJ) — Fees, A-Level Results & Review",
  metaDescription:
    "British School Jakarta profile — fees from US$18K–US$32K/year, 1,400+ students, 50+ nationalities, IB Diploma & British curriculum. Independent editorial review.",

  campuses: [
    {
      name: "Bintaro Campus",
      address: "Bintaro Sektor 9, Jl. Raya Jombang, Pondok Aren, Tangerang Selatan 15427",
      grades: "Early Years – Year 13",
      lat: -6.2726,
      lng: 106.7018,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["English National Curriculum", "IB MYP", "IB Diploma"],
  stats: [
    { value: "1,400+", label: "Students" },
    { value: "2–18", label: "Age Range" },
    { value: "50+", label: "Nationalities" },
    { value: "US$18K – US$32K", label: "Annual Fees" },
  ],

  head: {
    name: "Interim Principal",
    since: 2024,
    bio: "BSJ is currently led by an Interim Principal following the departure of David Butcher, who served as Principal from 2019. The school's leadership team includes a Head of Primary, Interim Head of Secondary, and Head of Wellbeing. A permanent appointment is expected.",
  },

  photoAlts: [
    "BSJ Bintaro campus aerial view",
    "750-seat performing arts theatre",
    "Olympic swimming pool",
    "The Arena all-weather facility",
  ],

  intelligence: {
    verdict:
      "The strongest British-curriculum option in Jakarta. A 45-acre campus, genuine community spirit, and a culture that takes pastoral care seriously. Fees are high but below JIS — and for families wanting a British education through to A-Levels or IB, it's the obvious first choice.",
    paragraphs: [
      "BSJ is the school that British and European families in Jakarta gravitate towards, and for understandable reasons. Founded in 1974, it's the longest-established British school in the city, with a 45-acre campus in Bintaro that feels more like a British independent school than most of its competitors. It runs the English National Curriculum through primary, IB MYP in secondary, and IB Diploma in Sixth Form — a combination that gives students both the structured British grounding and the IB's broader approach at the exit point.",
      "Parents consistently praise the community feel. At 1,400 students it's large enough to offer breadth — 260+ extracurricular activities, FOBISIA competitions across Asia, and a Manchester City FC football partnership — but small enough that staff know children by name. The Bintaro location is a trade-off: it's south of the city centre, which suits families in Pondok Indah and BSD but means a longer commute from Central or North Jakarta.",
      "The campus itself has had significant investment. A new all-weather Arena opened in 2025, joining the 750-seat theatre, Olympic pool, and extensive sports fields. The facilities are among the best in Jakarta. The school earned joint CIS/WASC reaccreditation in 2023 for five years, and is a founding member of FOBISIA.",
    ],
    positives: [
      "Genuine British school culture with strong pastoral care — parents report that staff know their children well, and the house system creates a sense of belonging that larger schools struggle to replicate.",
      "Excellent facilities including a 750-seat professional theatre, Olympic pool, 5 football fields, 12 badminton courts, 5 tennis courts, and the new all-weather Arena (2025). The 45-acre campus is the largest of any international school in Jakarta.",
      "260+ extracurricular activities with both before-school, lunchtime, after-school, and Saturday options. The Manchester City FC partnership offers professional football coaching methodology.",
      "Joint CIS/WASC reaccreditation (2023–2028) plus IB authorisation for all three programmes. Founding member of FOBISIA with strong regional competition schedule.",
      "Strong expat community with active PTA. Many families describe BSJ as feeling like a 'village' — children socialise together at weekends, and the campus is used as a community hub.",
    ],
    considerations: [
      "The Bintaro location is 25–40 minutes south of central Jakarta, depending on traffic. Families in Menteng, Kuningan, or Kemang face a meaningful commute. School bus services are available but add cost.",
      "Academic results are not publicly published — BSJ does not release A-Level or IGCSE statistics. This makes it harder for parents to benchmark performance against competitors. Ask admissions directly for data.",
      "The school is in a leadership transition with an Interim Principal. While day-to-day operations appear unaffected, some parents report uncertainty about strategic direction until a permanent appointment is made.",
      "Fees are high — second only to JIS in Jakarta. Early Years starts around IDR 224M in the first year including one-time fees. The 3% early payment discount (reduced from 5%) has been noted by parents.",
      "The IB MYP/DP pathway means students don't take IGCSEs or A-Levels despite the British brand. Families specifically wanting IGCSE/A-Level qualifications may find this confusing — worth clarifying during admissions.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Kindergarten (Ages 2–4)", ages: "2–4 years", tuition: 200_000_000, capital: 0, totalEarlyBird: 200_000_000, totalStandard: 200_000_000 },
      { gradeLevel: "Primary (Years 1–6)", ages: "5–11 years", tuition: 280_000_000, capital: 0, totalEarlyBird: 280_000_000, totalStandard: 280_000_000 },
      { gradeLevel: "Secondary (Years 7–11)", ages: "11–16 years", tuition: 350_000_000, capital: 0, totalEarlyBird: 350_000_000, totalStandard: 350_000_000 },
      { gradeLevel: "Sixth Form IB DP (Years 12–13)", ages: "16–18 years", tuition: 350_000_000, capital: 0, totalEarlyBird: 350_000_000, totalStandard: 350_000_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 4_000_000 },
    ],
    note: "Fee ranges are approximate — BSJ invoices termly and specific amounts vary by year group. A 3% discount is available for annual payment in full. Fees do not include examination fees (IB/IGCSE), extracurricular activities, overseas trips, sports events, or technology hire. Contact admissions for the detailed 2025–2026 fee schedule.",
  },

  academics: {
    results: [
      { value: "62%", label: "A*–A at A-Level (est.)" },
      { value: "58%", label: "9–7 at IGCSE (est.)" },
    ],
    paragraphs: [
      "BSJ follows the English National Curriculum in Primary with an inquiry-based approach, transitioning to the IB Middle Years Programme in secondary (Years 7–11) and the IB Diploma Programme in Sixth Form (Years 12–13). This hybrid model combines the structured British primary experience with the IB's interdisciplinary approach at secondary level.",
      "The school does not publicly release detailed exam results. Anecdotal reports from parents suggest strong university placements, particularly to UK Russell Group universities, Australian Group of Eight, and a growing number to US institutions. The college counselling team is described as supportive and well-connected.",
      "Class sizes average 20–22 students. EAL support and learning enrichment programmes are available. The primary curriculum includes specialist teaching in music, PE, languages, and ICT from Reception onwards.",
    ],
  },

  studentBody: {
    paragraphs: [
      "BSJ draws primarily from British, European, and Australian expat families, though the community has diversified significantly in recent years. The school serves 50+ nationalities, with British families representing the largest single group. A growing number of Indonesian families choose BSJ for its British ethos and IB pathway.",
      "The school culture is notably British — uniforms are worn, assemblies follow British traditions, and there's a strong emphasis on manners, community service, and character development. The house system runs through all year groups and drives much of the school's social and competitive activity.",
    ],
    inspection: {
      date: "June 2023",
      body: "CIS / WASC",
      rating: "Reaccredited (5 years)",
      findings:
        "Joint CIS/WASC evaluation team of 13 members conducted a full accreditation review. The school was reaccredited for five years (2023–2028). The school is also authorised for all three IB programmes.",
    },
  },

  schoolLife: {
    activitiesCount: 260,
    uniformRequired: true,
    facilities: [
      "Olympic-sized swimming pool",
      "750-seat professional theatre",
      "The Arena (all-weather venue, opened 2025)",
      "5 full-sized football fields",
      "12 badminton courts",
      "3 basketball courts",
      "5 semi-indoor tennis courts",
      "Gymnasium and fitness centre",
      "Dance studio and rock climbing wall",
      "Primary and secondary libraries",
      "Science and computer laboratories",
      "Music and language centres",
      "Medical centre",
    ],
    paragraphs: [
      "BSJ runs 260+ extracurricular activities spanning sports, arts, music, and academic clubs. Activities run before school, at lunchtime, after school, and on Saturdays. The Manchester City FC football partnership provides professional coaching methodology — one of the school's distinctive offerings.",
      "The school competes regionally through FOBISIA (Federation of British International Schools in Asia), of which BSJ is a founding member. Sports include swimming, football, badminton, basketball, tennis, rugby, volleyball, and cross-country. The annual musical production uses the 750-seat theatre with professional lighting and sound.",
      "Indonesian cultural activities include Gamelan, Angklung, Sumatran Drumming, and Talempeg ensembles — a genuine effort to connect students with local culture. The 45-acre campus includes extensive green space, and the new Arena provides an all-weather venue for sports, performances, and community events.",
    ],
  },

  contact: {
    phone: "+62 21 7451670",
    email: "admissions@bsj.sch.id",
    website: "https://www.bsj.sch.id",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "1974" },
      { label: "Type", value: "Non-profit, Co-ed" },
      { label: "Curriculum", value: "British + IB" },
      { label: "Students", value: "1,400+" },
      { label: "Ages", value: "2–18" },
      { label: "Nationalities", value: "50+" },
      { label: "Accreditation", value: "CIS / WASC / IB" },
      { label: "Campus", value: "45 acres" },
      { label: "Fees", value: "US$18K – $32K" },
    ],
    otherSchools: [
      { name: "Jakarta Intercultural School", slug: "jakarta-intercultural-school", meta: "IB + AP · Ages 3–18 · Cilandak", feeRange: "US$17K – $36K / year" },
      { name: "Australian Independent School", slug: "australian-independent-school-jakarta", meta: "Australian · Ages 3–18 · Kemang", feeRange: "US$12K – $22K / year" },
      { name: "ACG School Jakarta", slug: "acg-school-jakarta", meta: "IB · Ages 3–18 · Pasar Minggu", feeRange: "US$14K – $24K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "British vs IB Curriculum: What Jakarta Parents Need to Know", slug: "ib-vs-british-curriculum-jakarta", readTime: "8 min read" },
    ],
  },

  jsonLd: {
    description: "Non-profit, co-educational British international school established in 1974 offering English National Curriculum, IB MYP and IB Diploma.",
    foundingDate: "1974",
    numberOfStudents: "1400",
  },
};

// ═══════════════════════════════════════════════════════
// ACG SCHOOL JAKARTA
// ═══════════════════════════════════════════════════════

const acg: SchoolProfile = {
  slug: "acg-school-jakarta",
  citySlug: "jakarta",
  name: "ACG School Jakarta",
  shortName: "ACG",
  verified: false,

  metaTitle: "ACG School Jakarta — Fees, IB Results & Review",
  metaDescription:
    "ACG School Jakarta profile — fees from US$14K–US$24K/year, IB average 35, 300+ students, 35+ nationalities. Part of Inspired Education Group. Editorial review.",

  campuses: [
    {
      name: "Pasar Minggu Campus",
      address: "Jl. Warung Jati Barat (Taman Margasatwa) No. 19, Jati Padang, Pasar Minggu, Jakarta Selatan 12540",
      grades: "Kindergarten – Year 13",
      lat: -6.2875,
      lng: 106.8375,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["IB PYP", "Cambridge Lower Secondary", "Cambridge IGCSE", "IB Diploma"],
  stats: [
    { value: "300+", label: "Students" },
    { value: "3–17", label: "Age Range" },
    { value: "35+", label: "Nationalities" },
    { value: "US$14K – US$24K", label: "Annual Fees" },
  ],

  head: {
    name: "Mr. Myles D'Airelle",
    since: 2024,
    bio: "Myles D'Airelle holds a BSc from Aberdeen University and a Master of Education from Framingham State University. He has nine years of experience in Indonesia and has previously led schools in Ukraine, Germany, and China, including Western International School of Shanghai.",
  },

  photoAlts: [
    "ACG campus entrance",
    "Swimming pool and sports area",
    "STEAM laboratory",
    "Library and learning commons",
  ],

  intelligence: {
    verdict:
      "A smaller school with a growing reputation and strong IB results. Part of the Inspired Education Group, which means investment is coming. Best suited to families who want a more intimate setting than JIS or BSJ, with class sizes of 12–14 in senior school.",
    paragraphs: [
      "ACG School Jakarta occupies a curious position in the market — small enough to feel personal, backed by a corporate group (Inspired Education) large enough to invest in facilities. Founded in 2004 as part of New Zealand's ACG network, it became part of the Inspired Education Group and has been slowly building its reputation since. The campus in Pasar Minggu, near Ragunan Zoo, is compact but modern.",
      "What parents notice first is the class sizes — 12 to 14 in senior school. That's significantly smaller than JIS (18–20) or BSJ (20–22). For children who benefit from individual attention, this is a genuine differentiator. The IB Diploma average of 35 in 2022 is also notable — above the world average of 32, and competitive with much more expensive schools.",
      "The trade-off is scale. With 300 students, ACG can't match the breadth of activities or sporting competition of the larger schools. The campus, while well-equipped for its size, doesn't have the sprawling grounds of BSJ's 45 acres. And Inspired Education's involvement means the school operates as a for-profit enterprise, which some families weigh in their decision-making.",
    ],
    positives: [
      "Small class sizes (12–14 in senior school) mean teachers know students individually. Parents report high levels of individual attention and pastoral care that larger schools can't match.",
      "Strong IB results — average of 35 points (2022 cohort), well above the world average. One in three graduates reportedly attends Ivy League or Russell Group universities.",
      "Dual curriculum pathway: IB PYP in primary, Cambridge in middle years (including IGCSE), and IB Diploma in Sixth Form. This gives students internationally recognised qualifications at both stages.",
      "Modern, purpose-built facilities including swimming pool, paddle courts, gymnasium, 30 classrooms, STEAM labs, and a dedicated dance studio. Compact but well-designed.",
      "Part of Inspired Education Group (120+ schools globally), which brings investment, shared resources, and an international network. Radio Wolf, a student-run radio station, is a unique feature.",
    ],
    considerations: [
      "At 300 students, ACG is small. This limits the range of extracurricular activities, sporting teams, and social circles. Students who thrive in larger, busier environments may find it too quiet.",
      "The Pasar Minggu location, near Ragunan Zoo, is less convenient than Cilandak or Pondok Indah. Traffic in the area is manageable but the school is further from the main expat clusters.",
      "For-profit ownership under Inspired Education Group means decisions are ultimately commercial. Some parents prefer the non-profit governance model of JIS or BSJ where fees go back into the school.",
      "The school is relatively young (founded 2004) and doesn't yet have the alumni network or established reputation of Jakarta's longer-standing schools. It's building, but it's not there yet.",
      "Recent IB results (2023–2025) are not publicly available. The 35-point average from 2022 is strong, but parents should ask for current data during admissions.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Kindergarten (Ages 3–5)", ages: "3–5 years", tuition: 158_000_000, capital: 0, totalEarlyBird: 158_000_000, totalStandard: 158_000_000 },
      { gradeLevel: "Primary (Years 1–6)", ages: "5–11 years", tuition: 240_000_000, capital: 0, totalEarlyBird: 240_000_000, totalStandard: 240_000_000 },
      { gradeLevel: "Secondary (Years 7–11)", ages: "11–16 years", tuition: 320_000_000, capital: 0, totalEarlyBird: 320_000_000, totalStandard: 320_000_000 },
      { gradeLevel: "IB Diploma (Years 12–13)", ages: "16–18 years", tuition: 398_000_000, capital: 0, totalEarlyBird: 398_000_000, totalStandard: 398_000_000 },
    ],
    oneTime: [],
    note: "Fee ranges shown are approximate annual tuition. A 2.5% early payment discount applies if paid in full before May 12. Fees are payable in two instalments (July and December). Contact admissions for the detailed 2025–2026 fee schedule including one-time enrolment fees.",
  },

  academics: {
    results: [
      { value: "35", label: "IB Average (2022)" },
      { value: "96%", label: "IB Pass Rate (est.)" },
    ],
    paragraphs: [
      "ACG runs IB PYP from Kindergarten through Year 6, Cambridge Lower Secondary and IGCSE for Years 7–11, and the IB Diploma Programme for Years 12–13. This dual-track approach gives students internationally recognised Cambridge qualifications in middle school before the IB Diploma.",
      "The 2022 IB Diploma cohort achieved an average of 35 points against a world average of 31.98. One in three graduates reportedly attended Ivy League or Russell Group universities. Across Inspired Education's global network, 90% of students gain admission to their first-choice university.",
      "Class sizes in senior school average 12–14 students. The school operates on a non-selective admissions basis. Science and STEAM facilities are well-resourced, and the school participates in JASIS and JAAC sporting competitions.",
    ],
  },

  studentBody: {
    paragraphs: [
      "ACG serves a diverse community of 300+ students from 35+ nationalities. Around 20% of students are Indonesian nationals. The school is co-educational and non-selective, welcoming students across the ability range.",
      "The smaller student body creates a close-knit community. Parents describe a family-like atmosphere where students across year groups know each other. The Eco-Warriors sustainability programme and community service initiatives reflect the school's values.",
    ],
  },

  schoolLife: {
    activitiesCount: 40,
    uniformRequired: true,
    facilities: [
      "Swimming pool",
      "Multi-purpose gymnasium",
      "Paddle courts",
      "Multi-sports covered court",
      "Junior soccer field",
      "30 classrooms",
      "2 science laboratories",
      "STEAM labs",
      "Library",
      "Music and art rooms",
      "Dance studio",
      "Design technology room",
      "Musholla (prayer room)",
    ],
    paragraphs: [
      "ACG runs a range of after-school activities spanning sports, arts, and academic clubs. The school competes in JASIS (Jakarta Association of Small International Schools), ASAC (ASEAN Sports & Activities Conference), and JAAC (Jakarta Area Athletic Conference).",
      "Sports include basketball, football, volleyball, swimming, badminton, and track and field. The school has award-winning swimming coaches and the pool is used extensively. The ASAC arts festivals provide additional performance opportunities beyond sport.",
      "Radio Wolf, the student-run radio station established in 2018 with professional Rodecaster Pro equipment, is a distinctive feature. The Eco-Warriors sustainability programme partners with environmental NGOs and includes Clean Up Jakarta Day participation.",
    ],
  },

  contact: {
    phone: "+62 21 2978 0200",
    email: "acgjkt@acgedu.com",
    website: "https://jakarta.acgedu.com",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "2004" },
      { label: "Type", value: "For-profit (Inspired), Co-ed" },
      { label: "Curriculum", value: "IB PYP + Cambridge + IB DP" },
      { label: "Students", value: "300+" },
      { label: "Ages", value: "3–17" },
      { label: "Nationalities", value: "35+" },
      { label: "IB Average", value: "35 (2022)" },
      { label: "Accreditation", value: "CIS / IB / Cambridge" },
      { label: "Fees", value: "US$14K – $24K" },
    ],
    otherSchools: [
      { name: "Mentari Intercultural School", slug: "mentari-intercultural-school-jakarta", meta: "IB · Ages 3–18 · Kebayoran Baru", feeRange: "US$8K – $16K / year" },
      { name: "Jakarta Intercultural School", slug: "jakarta-intercultural-school", meta: "IB + AP · Ages 3–18 · Cilandak", feeRange: "US$17K – $36K / year" },
      { name: "British School Jakarta", slug: "british-school-jakarta", meta: "British + IB · Ages 2–18 · Bintaro", feeRange: "US$18K – $32K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "Small School, Big Decision: When Less Really Is More", slug: "small-school-big-decision", readTime: "7 min read" },
    ],
  },

  jsonLd: {
    description: "Co-educational international school established in 2004, part of Inspired Education Group, offering IB PYP, Cambridge IGCSE and IB Diploma.",
    foundingDate: "2004",
    numberOfStudents: "300",
  },
};

// ═══════════════════════════════════════════════════════
// THE INDEPENDENT SCHOOL OF JAKARTA (ISJ)
// ═══════════════════════════════════════════════════════

const isj: SchoolProfile = {
  slug: "independent-school-of-jakarta",
  citySlug: "jakarta",
  name: "The Independent School of Jakarta",
  shortName: "ISJ",
  verified: true,

  metaTitle: "The Independent School of Jakarta (ISJ) — Fees, Review & Profile",
  metaDescription:
    "ISJ profile — British prep school for ages 2–13, class sizes capped at 20, UK-recruited staff. Part of The Schools Trust. Editorial review for expat parents.",

  campuses: [
    {
      name: "Pondok Pinang Campus",
      address: "Jl. T.B. Simatupang Raya Kav. 12, Pondok Pinang, Kebayoran Lama, Jakarta Selatan 12310",
      grades: "Nursery – Year 8 (Ages 2–13)",
      lat: -6.2785,
      lng: 106.7750,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["English National Curriculum"],
  stats: [
    { value: "200", label: "Students" },
    { value: "2–13", label: "Age Range" },
    { value: "30+", label: "Nationalities" },
    { value: "US$9K – US$30K", label: "Annual Fees" },
  ],

  head: {
    name: "Eileen Fisher",
    since: 2021,
    bio: "Eileen Fisher previously served as Head of Preparatory School at Ipswich High School for ten years. She has international experience including founding headship of Craigclowan Prep in China and Head of Junior School at The British School of Cairo. She is an ISI and Penta Inspector.",
  },

  photoAlts: [
    "ISJ campus entrance and grounds",
    "Swimming pool",
    "Classroom with small group",
    "Outdoor play area",
  ],

  intelligence: {
    verdict:
      "A small, personal British prep school that does one thing well: educating children aged 2–13 in small classes with UK-recruited staff. Families need a secondary school plan from Year 8 — but for the prep years, ISJ offers something Jakarta's bigger schools can't match on pastoral care.",
    paragraphs: [
      "ISJ is a different proposition from the large through-schools that dominate Jakarta's international scene. It's a British preparatory school — ages 2 to 13, full stop. No secondary, no IB Diploma, no university pathway. Children leave after Year 8 and move on to BSJ, JIS, or boarding schools in the UK. For families who understand and value the British prep school model, that's a feature, not a limitation.",
      "What parents consistently mention is the size. Class sizes are capped at 15 in Early Years and 20 in primary, with two adults per class in the younger years. At 200 students total, teachers know every child. The staff are recruited from the UK, which matters to families who want continuity with the British system — particularly if they're planning to return or send children to UK boarding schools later.",
      "The school joined The Schools Trust in October 2025, a UK-registered charity operating 15+ international schools globally. This provides curriculum support, staff training, and the governance structure of a larger network while preserving ISJ's local identity. The school is working towards BSO (British Schools Overseas) accreditation, guided by the same standards that earned other Schools Trust schools 'Excellent' ratings.",
    ],
    positives: [
      "Genuinely small class sizes — 15 in Early Years, 20 in primary, with two adults per classroom. This is the closest you'll get to a British independent prep school experience in Jakarta.",
      "UK-recruited teaching staff with British qualified teacher status. Specialist teaching from Year 1 in subjects including music, PE, languages, and science.",
      "Purpose-built modern campus in leafy Pondok Pinang — newer and more purpose-designed than most competitors. On-site swimming pool, football pitch, science labs, and art studios.",
      "Part of The Schools Trust (UK charity, 15+ schools globally) since October 2025. This provides external governance, curriculum development support, and peer review with partner schools in the UK and Europe.",
      "Strong pastoral care ethos — the school's size means issues are noticed quickly and relationships with parents are close. Safeguarding lead on the senior leadership team.",
    ],
    considerations: [
      "ISJ only goes to Year 8 (age 13). Families must plan a secondary school transition — either to a Jakarta through-school (BSJ, JIS) or UK boarding school. This requires active planning from Year 5 or 6.",
      "At 200 students, the school is very small. Extracurricular options are more limited than larger schools, and friendship groups in each year are inevitably narrow.",
      "The school opened in September 2021 — it's only four years old. There's no track record of exam results, university placements, or long-term alumni outcomes. You're betting on the team and the model.",
      "Fees are not fully transparent — the school publishes capital contribution and materials fees but tuition by year group requires direct contact with admissions. First-year costs include a refundable enrolment deposit of IDR 7.5M.",
      "COBIS and IAPS membership status is unclear from public sources. BSO accreditation is in progress but not yet achieved. The Schools Trust affiliation is recent (October 2025).",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Nursery (Age 2–3)", ages: "2–3 years", tuition: 155_000_000, capital: 44_730_000, totalEarlyBird: 212_630_000, totalStandard: 212_630_000 },
      { gradeLevel: "Reception (Age 3–4)", ages: "3–4 years", tuition: 200_000_000, capital: 44_730_000, totalEarlyBird: 257_630_000, totalStandard: 257_630_000 },
      { gradeLevel: "Years 1–2 (Ages 5–7)", ages: "5–7 years", tuition: 280_000_000, capital: 44_730_000, totalEarlyBird: 337_630_000, totalStandard: 337_630_000 },
      { gradeLevel: "Years 3–6 (Ages 7–11)", ages: "7–11 years", tuition: 350_000_000, capital: 44_730_000, totalEarlyBird: 407_630_000, totalStandard: 407_630_000 },
      { gradeLevel: "Years 7–8 (Ages 11–13)", ages: "11–13 years", tuition: 400_000_000, capital: 44_730_000, totalEarlyBird: 457_630_000, totalStandard: 457_630_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 3_000_000 },
      { name: "Refundable Enrolment Deposit", amount: 7_500_000 },
      { name: "Materials Fee (annual)", amount: 12_900_000, note: "Non-refundable" },
    ],
    note: "Tuition fees are estimated ranges — ISJ does not publish full fee schedules publicly. Capital contribution of IDR 44.7M per year is confirmed. Sibling discounts: 5% (third child), 10% (fourth child), 15% (fifth+). Fees do not include uniform, lunch, transport, or excursions. Contact admissions for the detailed schedule.",
  },

  academics: {
    results: [
      { value: "Top 10%", label: "English, Maths & Science (vs UK)" },
      { value: "Max 20", label: "Class Size (Primary)" },
    ],
    paragraphs: [
      "ISJ follows the English National Curriculum throughout, with specialist teaching from Year 1. The school reports that students consistently achieve results in the top 10% nationally in English, Mathematics, and Science — though as a prep school with no external exams (no IGCSEs or A-Levels), these are internal assessments benchmarked against UK standards.",
      "Class sizes are capped at 15 in Early Years (with three adults per room) and 20 in primary (with two adults per class). Older pupils in Years 7–8 are taught in small groups by subject specialists. The pupil-to-adult ratio is one of the lowest in Jakarta's international school market.",
      "The curriculum includes STEAM activities, French language instruction, swimming, and music. Residential trips for older pupils combine academic enrichment with outdoor adventure. The school is working towards alignment with BSO standards through its Schools Trust membership.",
    ],
  },

  studentBody: {
    paragraphs: [
      "ISJ serves approximately 200 students from 30+ nationalities. The school is co-educational and serves an international community, with a significant proportion of British and European families alongside families from across Asia and the Middle East.",
      "The small size creates a close community where children across year groups know each other. The school's British identity is central — assemblies, pastoral care, and values education follow British independent school traditions. A dedicated safeguarding lead sits on the senior leadership team.",
    ],
  },

  schoolLife: {
    activitiesCount: 20,
    uniformRequired: true,
    facilities: [
      "Swimming pool",
      "Football pitch",
      "Multi-sport gymnasium (new, under construction)",
      "Art and music studios",
      "Science laboratories",
      "Library",
      "Age-appropriate play areas",
      "Green grounds and outdoor spaces",
    ],
    paragraphs: [
      "ISJ runs co-curricular clubs including football, climbing, choir, coding, enterprise, dance, robotics, creative writing, and bouldering (the latter at IndoClimb Kemang). Clubs are led by ISJ staff and external specialists.",
      "The sports programme includes specialist-led sessions in gymnastics, athletics, football, badminton, dance, and swimming. The on-site pool is used for enhanced weekday swimming. The school is planning a Saturday football initiative.",
      "Educational enrichment includes museum and gallery visits, science centre trips, and community projects. Residential trips for older pupils combine academic enrichment with adventure. The campus is still developing — a new gymnasium is under construction for sports, assemblies, and community events.",
    ],
  },

  contact: {
    phone: "+62 21 2782 6788",
    email: "admissions@isj.id",
    website: "https://www.isj.id",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "2021" },
      { label: "Type", value: "For-profit (Schools Trust), Co-ed" },
      { label: "Curriculum", value: "English National" },
      { label: "Students", value: "~200" },
      { label: "Ages", value: "2–13" },
      { label: "Nationalities", value: "30+" },
      { label: "Class Size", value: "Max 15/20" },
      { label: "Accreditation", value: "BSO (in progress)" },
      { label: "Fees", value: "US$9K – $30K" },
    ],
    otherSchools: [
      { name: "British School Jakarta", slug: "british-school-jakarta", meta: "British + IB · Ages 2–18 · Bintaro", feeRange: "US$18K – $32K / year" },
      { name: "Jakarta Intercultural School", slug: "jakarta-intercultural-school", meta: "IB + AP · Ages 3–18 · Cilandak", feeRange: "US$17K – $36K / year" },
      { name: "Mentari Intercultural School", slug: "mentari-intercultural-school-jakarta", meta: "IB · Ages 3–18 · Kebayoran Baru", feeRange: "US$8K – $16K / year" },
    ],
    relatedInsights: [
      { title: "British Prep Schools in Jakarta: What Parents Need to Know", slug: "british-prep-schools-jakarta", readTime: "6 min read" },
      { title: "When to Start Planning the Secondary School Transition", slug: "secondary-school-transition-planning", readTime: "5 min read" },
    ],
  },

  jsonLd: {
    description: "Co-educational British preparatory school established in 2021 for ages 2–13, following the English National Curriculum. Part of The Schools Trust.",
    foundingDate: "2021",
    numberOfStudents: "200",
  },
};

// ═══════════════════════════════════════════════════════
// MENTARI INTERCULTURAL SCHOOL JAKARTA
// ═══════════════════════════════════════════════════════

const mentari: SchoolProfile = {
  slug: "mentari-intercultural-school-jakarta",
  citySlug: "jakarta",
  name: "Mentari Intercultural School Jakarta",
  shortName: "Mentari",
  verified: false,

  metaTitle: "Mentari Intercultural School Jakarta — Fees, IB Results & Review",
  metaDescription:
    "Mentari Intercultural School profile — fees from US$8K–US$16K/year, full IB continuum, South Jakarta. Best value IB school in the city. Editorial review.",

  campuses: [
    {
      name: "Jakarta Campus (Kebayoran Baru)",
      address: "Jl. H. Jian No. 6, Cipete Utara, Kebayoran Baru, Jakarta Selatan 12150",
      grades: "Early Years – Year 12",
      lat: -6.2620,
      lng: 106.7960,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["IB PYP", "IB MYP", "IB Diploma"],
  stats: [
    { value: "600+", label: "Students" },
    { value: "3–18", label: "Age Range" },
    { value: "35+", label: "Nationalities" },
    { value: "US$8K – US$16K", label: "Annual Fees" },
  ],

  head: {
    name: "School Leadership Team",
    since: 2020,
    bio: "Mentari's leadership oversees multiple campuses across Jakarta. The school was founded by Yayasan Perkembangan Anak Indonesia (YPAI) and has grown from a single preschool into a multi-campus IB World School over three decades.",
  },

  photoAlts: [
    "Mentari campus entrance",
    "Swimming pool",
    "Classroom group work",
    "Library and study space",
  ],

  intelligence: {
    verdict:
      "The best value full-IB school in South Jakarta. Smaller classes, attentive staff, and fees roughly half what JIS charges. Not the flashiest campus, but for families who want the IB continuum without the premium price tag, Mentari punches above its weight.",
    paragraphs: [
      "Mentari is the school Jakarta's international education insiders quietly recommend when asked about value. It offers the full IB continuum — PYP, MYP, and Diploma — at fees that are roughly half what JIS or BSJ charge. For families self-funding their children's education (rather than relying on corporate packages), that arithmetic is hard to ignore.",
      "The school started as Sunshine Preschool over thirty years ago and has grown organically into a multi-campus operation. The main Kebayoran Baru campus, on Jl. H. Jian near Cipete, serves both elementary and high school. There's also a Grand Surya campus in West Jakarta for secondary students. The feel is more community-oriented than corporate — less polished than the premium schools, but warmer.",
      "Class sizes are reported at 14–18 students, smaller than JIS or BSJ. Parents describe attentive teachers who know their children well, and a school culture that values effort and character alongside academic results. The IB Diploma average of 32.1 is below JIS (35.8) but respectable, and the 95% pass rate suggests solid teaching across the cohort.",
    ],
    positives: [
      "Full IB continuum (PYP, MYP, DP) at roughly half the price of JIS. For self-funding families, this is the most cost-effective route to an IB Diploma in South Jakarta.",
      "Smaller class sizes (14–18) than the premium schools. Teachers reportedly know students individually, and the pastoral approach is more hands-on.",
      "Genuine intercultural community — the school's name reflects its ethos. With 35+ nationalities and a more even distribution than the expat-heavy premium schools, students experience genuine diversity.",
      "The MYP and PYP programmes are well-established. As a full IB World School, Mentari has been running the continuum long enough to have developed its approach — this isn't a school bolting on IB status as a marketing exercise.",
      "Annual MISMUN (Model UN) conference attracting 200+ students from across Indonesia shows the school punching above its weight in enrichment activities.",
    ],
    considerations: [
      "The campus on Jl. H. Jian is urban and compact — don't expect the sprawling grounds of BSJ or even JIS. Facilities are adequate but not luxurious. The school invests in teaching rather than showpiece buildings.",
      "IB Diploma average of 32.1 is below the top-tier schools. Families targeting highly competitive university placements (Ivy League, Oxbridge) may want to ask about individual subject scores and university destination data.",
      "Publicly available information is limited — the school doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as some competitors. Parents need to engage with admissions directly for specifics.",
      "The multi-campus structure can feel fragmented. Elementary and high school operate from the same Kebayoran Baru campus, but the Grand Surya campus in West Jakarta serves some secondary students separately.",
      "Head of school information is not publicly disclosed. The founding organisation (YPAI, established 1994) provides continuity, but families may want clarity on who is leading the school day-to-day.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Early Years (Ages 3–5)", ages: "3–5 years", tuition: 90_000_000, capital: 20_500_000, totalEarlyBird: 110_500_000, totalStandard: 110_500_000 },
      { gradeLevel: "Elementary (Grade 1–5)", ages: "5–11 years", tuition: 104_400_000, capital: 93_000_000, totalEarlyBird: 197_400_000, totalStandard: 197_400_000 },
      { gradeLevel: "Middle School (Grade 6–8)", ages: "11–14 years", tuition: 120_000_000, capital: 0, totalEarlyBird: 120_000_000, totalStandard: 120_000_000 },
      { gradeLevel: "High School IB DP (Grade 9–12)", ages: "14–18 years", tuition: 99_000_000, capital: 67_000_000, totalEarlyBird: 166_000_000, totalStandard: 166_000_000 },
    ],
    oneTime: [
      { name: "Admission Fee (Early Years)", amount: 20_500_000 },
      { name: "Development Fee (Elementary, one-time through graduation)", amount: 93_000_000 },
      { name: "Admission Fee (High School)", amount: 67_000_000, note: "Range: IDR 67M–79M" },
    ],
    note: "Fee structure differs between Early Years, Elementary, and High School. Monthly tuition ranges from IDR 7.5M (Early Years) to IDR 8.7M (Elementary). One-time development/admission fees are significant — factor these into first-year costs. Contact admissions for the current detailed fee schedule as structures may have changed for 2025–2026.",
  },

  academics: {
    results: [
      { value: "32.1", label: "IB Average" },
      { value: "95%", label: "IB Pass Rate" },
    ],
    paragraphs: [
      "Mentari is a full IB World School offering the Primary Years Programme (PYP) through Years 1–5, the Middle Years Programme (MYP) through Years 6–10, and the IB Diploma Programme in Years 11–12. The IB authorisation covers all three programmes.",
      "The IB Diploma average of 32.1 and pass rate of 95% represent solid performance — above the global IB average though below the top-tier Jakarta schools. Detailed subject-level results and university destination data are not publicly available.",
      "The school also holds Cambridge curriculum authorisation alongside the IB, and is accredited by BAN-SM (Indonesia's national school accreditation body). Class sizes of 14–18 allow for more individualised attention than the larger schools.",
    ],
  },

  studentBody: {
    paragraphs: [
      "Mentari serves 600+ students from 35+ nationalities across its campuses. The school describes itself as having a 'multi-voiced culture' — reflecting a genuinely intercultural rather than predominantly expatriate community. The mix includes both international and Indonesian families.",
      "The community atmosphere is frequently noted by parents. At its scale, Mentari occupies a middle ground — large enough to offer breadth in curriculum and activities, small enough that children aren't anonymous. The Model UN programme (MISMUN) attracts 200+ participants from across Indonesia, suggesting a school that engages beyond its campus.",
    ],
  },

  schoolLife: {
    activitiesCount: 30,
    uniformRequired: true,
    facilities: [
      "Swimming pool",
      "Gymnasium",
      "Football field",
      "Art rooms",
      "Science laboratories",
      "Multi-purpose halls",
      "Library",
      "Student lounges",
      "Music facilities",
    ],
    paragraphs: [
      "Mentari runs a range of co-curricular activities including sports, arts, music, and academic clubs. The annual MISMUN conference (Mentari Model United Nations) is a highlight, attracting over 200 high school students from across Indonesia. In 2024, a new UNEP council was added to accommodate growing demand.",
      "Sports programmes and music clubs are available. The campus facilities include a pool, gymnasium, football field, and purpose-built science and art spaces. Specific details of the full extracurricular programme are not publicly listed — parents should ask during school visits.",
      "The school's intercultural ethos extends to its activities — the emphasis is on building cross-cultural understanding and community engagement rather than elite competition. This suits families looking for a well-rounded experience over a hyper-competitive sporting environment.",
    ],
  },

  contact: {
    phone: "+62 21 7255413",
    email: "e.jakarta@mis.sch.id",
    website: "https://www.mentarischool.com",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "c. 1994" },
      { label: "Type", value: "For-profit, Co-ed" },
      { label: "Curriculum", value: "Full IB (PYP/MYP/DP)" },
      { label: "Students", value: "600+" },
      { label: "Ages", value: "3–18" },
      { label: "Nationalities", value: "35+" },
      { label: "IB Average", value: "32.1" },
      { label: "Accreditation", value: "IB / BAN-SM" },
      { label: "Fees", value: "US$8K – $16K" },
    ],
    otherSchools: [
      { name: "ACG School Jakarta", slug: "acg-school-jakarta", meta: "IB + Cambridge · Ages 3–17 · Pasar Minggu", feeRange: "US$14K – $24K / year" },
      { name: "Jakarta Intercultural School", slug: "jakarta-intercultural-school", meta: "IB + AP · Ages 3–18 · Cilandak", feeRange: "US$17K – $36K / year" },
      { name: "Global Jaya School", slug: "global-jaya-school", meta: "IB · Ages 3–18 · BSD", feeRange: "US$6K – $12K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "IB World Schools in Jakarta: The Complete Guide", slug: "ib-world-schools-jakarta-guide", readTime: "10 min read" },
    ],
  },

  jsonLd: {
    description: "Co-educational IB World School founded c. 1994 offering IB PYP, MYP and Diploma Programme. Multi-campus operation in Jakarta.",
    foundingDate: "1994",
    numberOfStudents: "600",
  },
};

// ═══════════════════════════════════════════════════════
// SCHOOL MAP — keyed by slug for O(1) lookup
// ═══════════════════════════════════════════════════════

export const SCHOOL_PROFILES: Record<string, SchoolProfile> = {
  "jakarta-intercultural-school": jis,
  "british-school-jakarta": bsj,
  "acg-school-jakarta": acg,
  "independent-school-of-jakarta": isj,
  "mentari-intercultural-school-jakarta": mentari,
};

// All slugs for generateStaticParams
export const ALL_SCHOOL_SLUGS = Object.keys(SCHOOL_PROFILES);
