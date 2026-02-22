// ═══════════════════════════════════════════════════════
// SCHOOL PROFILE DATA
// Maps directly to the Neon `schools` table schema.
// When we wire the DB, each field here becomes a column query.
// ═══════════════════════════════════════════════════════

import { JAKARTA_SCHOOLS, type JakartaSchoolListing } from "@/data/jakarta-schools";
import { extractHighestFee } from "@/lib/utils/fees";
// Optional CSV export for minimal profiles (address, facilities, nationalities, founded)
import JAKARTA_CSV_EXPORT from "@/data/jakarta_csv_export.json";

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
    /** Plain string or { text, link } for one consideration that includes a linked phrase (e.g. "GL Assessment"). */
    considerations: (string | { text: string; link: { url: string; label: string } })[];
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
  verified: false,

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
  verified: false,

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
    name: "Phil Edwards",
    since: 2026,
    bio: "Phil Edwards is currently serving as Interim Principal at British School Jakarta (2026). The school holds BSO inspection (Outstanding) and CIS accreditation.",
  },

  photoAlts: [
    "BSJ Bintaro campus aerial view",
    "750-seat performing arts theatre",
    "Olympic swimming pool",
    "The Arena all-weather facility",
  ],

  intelligence: {
    verdict:
      "If you want a British school feel with IB credentials and your budget stretches to the upper tier, BSJ is the natural first choice. Families in Pondok Indah or BSD find it easy. From central Jakarta, factor in the commute before you commit.",
    paragraphs: [
      "The word among expat families is that BSJ is where British and European families end up, and it's not hard to see why. It's the longest-established British school in Jakarta, founded in 1974, with a 45-acre campus in Bintaro that feels closer to a UK independent school than anything else in the city. English National Curriculum through primary, IB MYP in secondary, IB Diploma in Sixth Form. That combination gives students a structured British grounding with the IB's broader approach at the exit point.",
      "Families who've been here a few years say the community feel is the real draw. At 1,400 students it's big enough to offer 260+ activities, FOBISIA competitions across Asia, and a Manchester City FC football partnership, but parents say staff still know their children by name. The Bintaro location suits families in Pondok Indah and BSD. From Menteng or Kuningan, you're looking at 40 minutes on a good day.",
      "The facilities have had serious investment. A new all-weather Arena opened in 2025, sitting alongside the 750-seat theatre, Olympic pool, and five football fields. Joint CIS/WASC reaccreditation came through in 2023 for five years. The school is currently led by an Interim Principal, and some parents say they're waiting to see who gets the permanent role before judging the strategic direction.",
    ],
    positives: [
      "Parents say the house system and pastoral care create a sense of belonging that the bigger schools struggle to match. Staff know children by name, and the school culture takes wellbeing seriously.",
      "The 45-acre Bintaro campus is the largest of any international school in Jakarta. Facilities include a 750-seat theatre, Olympic pool, five football fields, 12 badminton courts, five tennis courts, and the new all-weather Arena (2025).",
      "260+ extracurricular activities running before school, lunchtime, after school, and Saturdays. The Manchester City FC partnership provides professional football coaching.",
      "Joint CIS/WASC reaccreditation (2023-2028) plus IB authorisation for all three programmes. Founding member of FOBISIA with a strong regional competition schedule.",
      "Families say BSJ feels like a village. Children socialise at weekends, the PTA is active, and the campus doubles as a community hub. That matters when you're new to Jakarta.",
    ],
    considerations: [
      "Bintaro is 25-40 minutes south of central Jakarta depending on traffic. If you're in Menteng, Kuningan, or Kemang, the commute is real. School bus services exist but add cost.",
      "BSJ doesn't publish A-Level or IGCSE results publicly. That makes it harder to benchmark against competitors. You'll need to ask admissions directly for data.",
      "The school is in a leadership transition. Day-to-day operations seem unaffected, but parents say there's uncertainty about strategic direction until a permanent Principal is appointed.",
      "Fees are second only to JIS in Jakarta. Early Years starts around IDR 224M in the first year including one-time fees. The early payment discount dropped from 5% to 3%, which parents have noticed.",
      "Despite the British brand, students take IB MYP and DP rather than IGCSEs or A-Levels. If you specifically want British qualifications rather than British culture, clarify this during admissions.",
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
        "CIS/WASC accreditation reaffirmed July 2023 (visit June 2023); accreditation extended to 2028. The school is also authorised for all three IB programmes. BSJ is a COBIS member; no separate BSO inspection report is published on the school website.",
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
    name: "Shawn Hutchinson",
    since: 2024,
    bio: "Shawn Hutchinson is Head of School at ACG School Jakarta. The school is CIS accredited and an IB World School, with consistent IB Diploma scores above global averages.",
  },

  photoAlts: [
    "ACG campus entrance",
    "Swimming pool and sports area",
    "STEAM laboratory",
    "Library and learning commons",
  ],

  intelligence: {
    verdict:
      "If your child does better with individual attention and you don't need a 2,000-student campus, ACG is worth a serious look. Strong IB results, small classes, and fees well below JIS. Ask for updated exam data when you visit.",
    paragraphs: [
      "If you ask around, ACG comes up as the school families discover after they've toured the big names. It's small - 300 students, founded in 2004 as part of New Zealand's ACG network, now owned by Inspired Education Group. The campus in Pasar Minggu, near Ragunan Zoo, is compact but modern. The pitch is simple: smaller classes, personal attention, strong IB results, and fees that don't require a corporate package.",
      "The class sizes are the thing parents mention first - 12 to 14 in senior school, compared to 18-20 at JIS and 20-22 at BSJ. For children who need to be known rather than just counted, that difference matters. The IB Diploma average of 35 points in 2022 backs up the approach - above the world average of 32 and competitive with schools charging significantly more.",
      "The catch is scale. With 300 students, ACG can't offer the breadth of activities or sporting fixtures that the bigger schools run. The campus is well-equipped for its size but it's not 45 acres of playing fields. And Inspired Education is a for-profit group, which some families factor into their thinking when comparing with non-profit schools like JIS or BSJ.",
    ],
    positives: [
      "At 12-14 per class in senior school, teachers know students individually. Parents say the level of personal attention is something the bigger schools can't replicate.",
      "IB Diploma average of 35 points (2022 cohort), well above the world average. One in three graduates reportedly reaches Ivy League or Russell Group universities.",
      "Dual curriculum pathway - IB PYP in primary, Cambridge IGCSE in middle years, IB Diploma in Sixth Form. Students get internationally recognised qualifications at both stages.",
      "Modern, purpose-built facilities including a swimming pool, paddle courts, gymnasium, STEAM labs, and a dance studio. The campus is compact but thoughtfully designed.",
      "Part of Inspired Education Group (120+ schools globally), which brings investment and shared resources. Radio Wolf, the student-run radio station, is a genuinely distinctive feature.",
    ],
    considerations: [
      "At 300 students, the school is small. Fewer extracurricular options, fewer sporting teams, and narrower social circles. Children who thrive in bigger, busier environments may find it too quiet.",
      "Pasar Minggu is further from the main expat clusters than Cilandak or Pondok Indah. Traffic is manageable, but families in Kemang or Menteng should check the commute.",
      "Inspired Education is a for-profit group. Some parents prefer the non-profit governance at JIS or BSJ, where fees go back into the school rather than to shareholders.",
      "ACG was founded in 2004 and doesn't have the alumni network or established reputation of Jakarta's older schools. It's building credibility, but it's not there yet.",
      "The 35-point IB average is from 2022. More recent results (2023-2025) aren't publicly available. Ask admissions for current data before you make a decision.",
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
    inspection: {
      date: "Recent",
      body: "CIS",
      rating: "Accredited",
      findings: "ACG School Jakarta is CIS accredited and an IB World School. Consistent IB DP scores above global averages.",
    },
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
  verified: false,

  metaTitle: "The Independent School of Jakarta (ISJ) — Fees, Review & Profile",
  metaDescription:
    "ISJ profile — British school for ages 2–13 (expanding to GCSE and A-Level), class sizes capped at 20, UK-recruited staff. Part of The Schools Trust. Editorial review for expat parents.",

  campuses: [
    {
      name: "Pondok Pinang Campus",
      address: "Jl. T.B. Simatupang Raya Kav. 12, Pondok Pinang, Kebayoran Lama, Jakarta Selatan 12310",
      grades: "Nursery – Year 8 (Ages 2–13), expanding to GCSE & A-Level",
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
    { value: "US$10K – US$32K", label: "Annual Fees" },
  ],

  head: {
    name: "Ms. Eileen Fisher",
    since: 2024,
    bio: "Ms. Eileen Fisher leads ISJ. The school follows the British National Curriculum and is part of The Schools Trust.",
  },

  photoAlts: [
    "ISJ campus entrance and grounds",
    "Swimming pool",
    "Classroom with small group",
    "Outdoor play area",
  ],

  intelligence: {
    verdict:
      "If you want the British prep school experience for children aged 2–13, ISJ is the only game in Jakarta. Small classes, UK staff, and serious pastoral care. ISJ is planning to expand through to GCSEs and A-Levels, so the full British pathway is in sight.",
    paragraphs: [
      "ISJ is a different kind of school from the large through-schools that dominate Jakarta. It's a British school currently serving ages 2 to 13 (Nursery to Year 8), with plans to expand through to GCSE and A-Level. Families who know the British prep model understand the focus on one stage at a time; the expansion will give continuity for families who want to stay through to 18.",
      "What parents say first is how well the teachers know their children. Classes are capped at 15 in Early Years and 20 in primary, with two adults per class in the younger years. At 200 students, there's nowhere to hide. Staff are recruited from the UK with British qualified teacher status, which matters if you're planning to move back or send children to UK boarding schools later.",
      "The school is part of The Schools Trust (schoolstrust.co.uk), a UK-registered charity running 15+ international schools globally. ISJ joined in October 2025, which brings curriculum support, staff training, and the governance structure of a larger network. ISJ is working towards BSO accreditation, guided by the same standards that earned other Schools Trust schools 'Excellent' ratings. It's early days, but the direction is clear.",
    ],
    positives: [
      "Classes of 15 in Early Years, 20 in primary, with two adults per room. This is the closest you'll get to a British independent prep school experience in Jakarta.",
      "Staff are recruited from the UK with qualified teacher status. Specialist teaching starts from Year 1 in music, PE, languages, and science.",
      "Purpose-built campus in Pondok Pinang with on-site swimming pool, football pitch, science labs, and art studios. It's newer and more thoughtfully designed than most competitors' primary sections.",
      "Part of The Schools Trust (schoolstrust.co.uk) since October 2025. External governance, curriculum development support, and peer review with partner schools in the UK and Europe. Expansion through to GCSE and A-Level is planned.",
      "Parents say issues get noticed fast and relationships with families are close. A safeguarding lead sits on the senior leadership team. At this size, pastoral care isn't a policy - it's how the school works.",
    ],
    considerations: [
      "Currently ISJ runs from Nursery to Year 8 (ages 2–13). Expansion to GCSE and A-Level is planned; until then, families in older year groups may need to consider a move to BSJ, JIS, or UK boarding schools.",
      "At 200 students, extracurricular options are limited compared to the bigger schools. Friendship groups in each year are inevitably small.",
      {
        text: "No public exam results yet. The school opened in September 2021 and its first IGCSE cohort won't sit exams until 2026. However, GL Assessment benchmarking data published on the school's website shows students performing significantly above UK national averages across core subjects, which is the strongest available proxy for academic outcomes at this stage.",
        link: { url: "https://www.isj.id/insights/jakartas-leading-british-school", label: "GL Assessment" },
      },
      "BSO accreditation is in progress but not yet achieved. COBIS and IAPS membership status is unclear from public sources. The Schools Trust affiliation is recent.",
    ],
  },

  fees: {
    academicYear: "2026–2027",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Pre-Nursery (Age 2–3)", ages: "2–3 years", tuition: 148_524_000, capital: 0, totalEarlyBird: 148_524_000, totalStandard: 148_524_000 },
      { gradeLevel: "Nursery (Age 3–4)", ages: "3–4 years", tuition: 226_148_000, capital: 0, totalEarlyBird: 226_148_000, totalStandard: 226_148_000 },
      { gradeLevel: "Reception (Age 4–5)", ages: "4–5 years", tuition: 332_737_600, capital: 0, totalEarlyBird: 332_737_600, totalStandard: 332_737_600 },
      { gradeLevel: "Year 1 (Age 5–6)", ages: "5–6 years", tuition: 419_702_400, capital: 0, totalEarlyBird: 419_702_400, totalStandard: 419_702_400 },
      { gradeLevel: "Year 2 (Age 6–7)", ages: "6–7 years", tuition: 419_702_400, capital: 0, totalEarlyBird: 419_702_400, totalStandard: 419_702_400 },
      { gradeLevel: "Year 3 (Age 7–8)", ages: "7–8 years", tuition: 437_819_200, capital: 0, totalEarlyBird: 437_819_200, totalStandard: 437_819_200 },
      { gradeLevel: "Year 4 (Age 8–9)", ages: "8–9 years", tuition: 437_819_200, capital: 0, totalEarlyBird: 437_819_200, totalStandard: 437_819_200 },
      { gradeLevel: "Year 5 (Age 9–10)", ages: "9–10 years", tuition: 464_984_000, capital: 0, totalEarlyBird: 464_984_000, totalStandard: 464_984_000 },
      { gradeLevel: "Year 6 (Age 10–11)", ages: "10–11 years", tuition: 464_984_000, capital: 0, totalEarlyBird: 464_984_000, totalStandard: 464_984_000 },
      { gradeLevel: "Year 7 (Age 11–12)", ages: "11–12 years", tuition: 484_733_600, capital: 0, totalEarlyBird: 484_733_600, totalStandard: 484_733_600 },
      { gradeLevel: "Year 8 (Age 12–13)", ages: "12–13 years", tuition: 484_733_600, capital: 0, totalEarlyBird: 484_733_600, totalStandard: 484_733_600 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 4_680_000, note: "Non-refundable, payable upon submission" },
      { name: "Enrolment Deposit", amount: 16_328_000, note: "Refundable when leaving ISJ, subject to 90 days written notice" },
    ],
    note: "Annual tuition fees include teaching and learning, classroom materials and resources, and capital contribution. Fees are reviewed annually. Per-term payment arrangements may be agreed upon request. Sibling discounts: 5% (third child), 10% (fourth child), 15% (fifth+). Compulsory additional fees apply for lunch and trips & events (payable annually or termly). Fees do not include uniform, transport, optional co-curricular clubs, wraparound care, or individual music lessons.",
  },

  academics: {
    results: [
      { value: "Top 10%", label: "English, Maths & Science (vs UK)" },
      { value: "Max 20", label: "Class Size (Primary)" },
    ],
    paragraphs: [
      "ISJ follows the English National Curriculum throughout, with specialist teaching from Year 1. The school reports that students consistently achieve results in the top 10% nationally in English, Mathematics, and Science. Currently there are no external exams at ISJ (expansion to GCSE and A-Level is planned); these are internal assessments benchmarked against UK standards.",
      "Class sizes are capped at 15 in Early Years (with three adults per room) and 20 in primary (with two adults per class). Older pupils in Years 7–8 are taught in small groups by subject specialists. The pupil-to-adult ratio is one of the lowest in Jakarta's international school market.",
      "The curriculum includes STEAM activities, French language instruction, swimming, and music. The school is working towards alignment with BSO standards through its Schools Trust membership.",
    ],
  },

  studentBody: {
    paragraphs: [
      "ISJ serves approximately 200 students from 30+ nationalities. The school is co-educational and serves an international community, with a significant proportion of British and European families alongside families from across Asia and the Middle East.",
      "The small size creates a close community where children across year groups know each other. The school's British identity is central — assemblies, pastoral care, and values education follow British independent school traditions. A dedicated safeguarding lead sits on the senior leadership team.",
      "ISJ has a partnership with Ipswich High School (UK). Each year the school sends its top-year pupils to Ipswich High School for residentials, combining academic enrichment with the experience of a UK independent school.",
    ],
    inspection: {
      date: "Ongoing",
      body: "The Schools Trust / BSO (in progress)",
      rating: "British National Curriculum standards",
      findings: "ISJ is part of The Schools Trust (schoolstrust.co.uk) and follows British National Curriculum standards. BSO accreditation is in progress.",
    },
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
      "Educational enrichment includes museum and gallery visits, science centre trips, and community projects. Residential trips for older pupils — including the annual residential at partner school Ipswich High School (UK) — combine academic enrichment with adventure. The campus is still developing — a new gymnasium is under construction for sports, assemblies, and community events.",
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
      { label: "Type", value: "Co-ed · Part of The Schools Trust" },
      { label: "Schools Trust", value: "schoolstrust.co.uk" },
      { label: "Curriculum", value: "English National" },
      { label: "Students", value: "~200" },
      { label: "Ages", value: "2–13 (expanding to 18)" },
      { label: "Nationalities", value: "30+" },
      { label: "Class Size", value: "Max 15/20" },
      { label: "Accreditation", value: "BSO (in progress)" },
      { label: "Fees", value: "US$10K – $32K" },
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
    name: "Clarissa Subagyo",
    since: 2020,
    bio: "Clarissa Subagyo is Head of School at Mentari Intercultural School Jakarta. The school is accredited by CIS and WASC and maintains high IB Diploma pass rates.",
  },

  photoAlts: [
    "Mentari campus entrance",
    "Swimming pool",
    "Classroom group work",
    "Library and study space",
  ],

  intelligence: {
    verdict:
      "If you're self-funding and want the full IB continuum, Mentari should be on your shortlist. Fees are roughly half what JIS charges, classes are smaller, and the teaching is solid. The campus won't win any architecture awards, but the education is the point.",
    paragraphs: [
      "Mentari is the school that families who know Jakarta's education scene quietly recommend when someone asks about value. Full IB continuum - PYP, MYP, and Diploma - at fees roughly half what JIS or BSJ charge. If you're self-funding rather than relying on a corporate package, that arithmetic is hard to ignore.",
      "The school started as Sunshine Preschool over thirty years ago and has grown into a multi-campus operation. The main Kebayoran Baru campus on Jl. H. Jian near Cipete serves elementary and high school. There's also a Grand Surya campus in West Jakarta for some secondary students. The feel is more community than corporate - less polished than the premium schools, but parents say it's warmer.",
      "Class sizes run at 14-18 students, smaller than JIS or BSJ. Parents say the teachers are attentive and know their children well, and the school culture values effort alongside results. The IB Diploma average of 32.1 is below JIS (35.8) but the 95% pass rate suggests solid, consistent teaching across the cohort rather than a few high-scorers pulling up the average.",
    ],
    positives: [
      "Full IB continuum (PYP, MYP, DP) at roughly half JIS prices. For self-funding families, this is the most cost-effective route to an IB Diploma in South Jakarta.",
      "At 14-18 per class, teachers know students individually. Parents say the pastoral approach is more hands-on than the bigger schools.",
      "With 35+ nationalities and a more even distribution than the expat-heavy premium schools, the intercultural mix is real. The school's name isn't just branding.",
      "Mentari has been running the full IB continuum long enough to have a mature approach to PYP and MYP. This isn't a school that bolted on IB status as an afterthought.",
      "The annual MISMUN conference attracts 200+ students from across Indonesia. For a mid-range school, that's a seriously impressive enrichment programme.",
    ],
    considerations: [
      "The campus on Jl. H. Jian is urban and compact. Don't expect sprawling grounds or showpiece buildings. Facilities are functional, not flashy. The money goes into teaching.",
      "IB Diploma average of 32.1 is below the top-tier schools. If you're targeting Ivy League or Oxbridge, ask about individual subject scores and where graduates actually end up.",
      "The school doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as competitors. You'll need to contact admissions directly for specifics.",
      "The multi-campus structure can feel fragmented. Elementary and high school share the Kebayoran Baru campus, but some secondary students are at the Grand Surya campus in West Jakarta.",
      "Who runs the school day-to-day isn't clear from public sources. The founding organisation (YPAI, established 1994) provides continuity, but families should ask about leadership when they visit.",
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
    inspection: {
      date: "Recent",
      body: "CIS / WASC",
      rating: "Accredited",
      findings: "Mentari Intercultural School is accredited by CIS and WASC. High IB Diploma pass rates.",
    },
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
// AUSTRALIAN INDEPENDENT SCHOOL JAKARTA (AIS)
// ═══════════════════════════════════════════════════════

const ais: SchoolProfile = {
  slug: "australian-independent-school-jakarta",
  citySlug: "jakarta",
  name: "Australian Independent School Jakarta",
  shortName: "AIS",
  verified: false,

  metaTitle: "Australian Independent School Jakarta (AIS) — Fees, IB Results & Review",
  metaDescription:
    "Australian Independent School Jakarta profile — fees from US$12K–US$22K/year, Australian curriculum + IB Diploma, 900+ students, 40+ nationalities. Editorial review for expat parents.",

  campuses: [
    {
      name: "Pejaten Campus",
      address: "Jl. Pejaten Barat No. 68, Pejaten, Pasar Minggu, Jakarta Selatan 12510",
      grades: "Preschool – Year 12",
      lat: -6.2808,
      lng: 106.8208,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["Australian Curriculum", "IB Diploma"],
  stats: [
    { value: "900+", label: "Students" },
    { value: "3–18", label: "Age Range" },
    { value: "40+", label: "Nationalities" },
    { value: "US$12K – US$22K", label: "Annual Fees" },
  ],

  head: {
    name: "Dean Cummins",
    since: 2026,
    bio: "Dean Cummins took office as Head of School in January 2026 (successor to Craig Eldred). AIS is CIS accredited; last major evaluation summary was released November 2024.",
  },

  photoAlts: [
    "AIS Pejaten campus entrance",
    "Swimming pool and sports facilities",
    "Classroom with students",
    "Library and learning spaces",
  ],

  intelligence: {
    verdict:
      "If you want a smaller, more personal school with Australian curriculum and your budget sits in the mid-range, AIS is worth a look. The inclusive approach suits families who value community over competition. Just don't expect the facilities or breadth of the top-tier schools.",
    paragraphs: [
      "The word among expat families is that AIS is the school you discover when you've toured JIS and BSJ and realised you need something smaller and more affordable. Founded in 1996, it's been around long enough to have credibility but hasn't grown into a 2,000-student operation. At 900 students, it sits in that middle ground - big enough to offer IB Diploma and decent facilities, small enough that parents say teachers know their children.",
      "What comes up again and again is the inclusive philosophy. AIS was founded specifically to support students with learning difficulties, limited English, and physical disabilities. That means EAL support is genuinely integrated, not an add-on. Parents of children who need extra help say the school delivers on its promise. The flip side is that some families worry about academic rigour - if you're targeting Ivy League or Oxbridge, you'll want to ask about individual IB results and university placements.",
      "The Pejaten campus moved to a new purpose-built site in 2022. It's modern and functional, but it's not 45 acres with Olympic pools and 750-seat theatres. Fees run US$12K to US$22K - roughly half what JIS charges. For self-funding families who want Australian curriculum with an IB exit, that's compelling. Just don't expect the breadth of activities or sporting fixtures that the bigger schools offer.",
    ],
    positives: [
      "At 900 students, AIS is smaller than JIS or BSJ. Parents say the community feel is real - teachers know children by name, and the school culture values effort alongside results.",
      "The inclusive philosophy means EAL and learning support are genuinely integrated, not afterthoughts. Parents of children who need extra help say the school delivers on its promise.",
      "Australian curriculum through Year 10, then IB Diploma in Years 11-12. That combination gives students a structured foundation with an internationally recognised exit qualification.",
      "Fees at US$12K to US$22K are roughly half what JIS charges. For self-funding families, that's a significant difference without feeling like you're compromising on curriculum quality.",
      "The Pejaten location in South Jakarta is accessible from Kemang, Pondok Indah, and surrounding areas. Traffic is manageable compared to schools further south.",
    ],
    considerations: [
      "The IB Diploma average of 33.5 is below JIS (35.8) and BSJ. If you're targeting top-tier universities, ask about individual subject scores and where graduates actually end up.",
      "At 900 students, extracurricular options are more limited than the bigger schools. Fewer sporting teams, fewer clubs, and narrower social circles. Children who thrive in bigger, busier environments may find it too quiet.",
      "The inclusive approach means the student body includes children with a wide range of needs. Some parents worry this affects academic rigour, though the school maintains it doesn't.",
      "Facilities are modern and functional but not showpiece. Don't expect Olympic pools, professional theatres, or sprawling grounds. The money goes into teaching rather than facilities.",
      "AIS doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as competitors. You'll need to contact admissions directly for specifics.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Preschool (Ages 3–5)", ages: "3–5 years", tuition: 120_000_000, capital: 0, totalEarlyBird: 120_000_000, totalStandard: 120_000_000 },
      { gradeLevel: "Primary (Years 1–6)", ages: "5–11 years", tuition: 180_000_000, capital: 0, totalEarlyBird: 180_000_000, totalStandard: 180_000_000 },
      { gradeLevel: "Secondary (Years 7–10)", ages: "11–15 years", tuition: 240_000_000, capital: 0, totalEarlyBird: 240_000_000, totalStandard: 240_000_000 },
      { gradeLevel: "IB Diploma (Years 11–12)", ages: "15–18 years", tuition: 280_000_000, capital: 0, totalEarlyBird: 280_000_000, totalStandard: 280_000_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 5_000_000 },
      { name: "Enrolment Fee", amount: 15_000_000, note: "One-time, new students" },
    ],
    note: "Fee ranges shown are approximate annual tuition. AIS publishes separate fee schedules for mainstream students, EAL students, and learning support students. Fees are payable termly. Contact admissions for the detailed 2025–2026 fee schedule including all one-time fees and payment options.",
  },

  academics: {
    results: [
      { value: "33.5", label: "IB Average" },
      { value: "Above world avg", label: "IB Performance" },
    ],
    paragraphs: [
      "AIS offers the Australian Curriculum from Preschool through Year 10, transitioning to the IB Diploma Programme in Years 11–12. The Australian curriculum emphasises inquiry-based learning, strong communication skills, and problem-solving abilities.",
      "The IB Diploma average of 33.5 sits above the world average of 31.98, though below Jakarta's top-tier schools. The school reports that IB students consistently perform well, with strong university placements. Detailed subject-level results and university destination data are not publicly available.",
      "Class sizes average 16–20 students. EAL support and learning enrichment programmes are integrated throughout. The school's inclusive philosophy means students with a wide range of needs are supported within mainstream classes.",
    ],
  },

  studentBody: {
    paragraphs: [
      "AIS serves 900+ students from 40+ nationalities. The school's inclusive philosophy means it welcomes students with learning difficulties, limited English proficiency, and physical disabilities alongside mainstream students. The student body is diverse, with a significant proportion of Indonesian families alongside expat communities.",
      "The community atmosphere is frequently noted by parents. At its scale, AIS occupies a middle ground - large enough to offer breadth in curriculum and activities, small enough that children aren't anonymous. The school culture values effort alongside results, and parents say the inclusive approach creates a supportive rather than competitive environment.",
    ],
    inspection: {
      date: "November 2024",
      body: "CIS",
      rating: "Accredited",
      findings: "Australian Independent School is CIS accredited. Last major evaluation summary released November 2024.",
    },
  },

  schoolLife: {
    activitiesCount: 50,
    uniformRequired: true,
    facilities: [
      "Swimming pool",
      "Sports hall",
      "Football field",
      "Basketball courts",
      "Library",
      "Science laboratories",
      "Computer labs",
      "Art studios",
      "Music rooms",
      "Multi-purpose halls",
    ],
    paragraphs: [
      "AIS runs a range of co-curricular activities including sports, arts, music, and academic clubs. The school participates in local and regional competitions, though the breadth of options is more limited than the larger schools.",
      "Sports programmes include swimming, football, basketball, and athletics. The arts programme includes music, drama, and visual arts. Specific details of the full extracurricular programme are not publicly listed - parents should ask during school visits.",
      "The school's inclusive ethos extends to its activities - the emphasis is on participation and community engagement rather than elite competition. This suits families looking for a well-rounded experience over a hyper-competitive environment.",
    ],
  },

  contact: {
    phone: "+62 21 782 1141",
    email: "admissions@ais-indonesia.com",
    website: "https://www.ais-indonesia.com",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "1996" },
      { label: "Type", value: "For-profit, Co-ed" },
      { label: "Curriculum", value: "Australian + IB DP" },
      { label: "Students", value: "900+" },
      { label: "Ages", value: "3–18" },
      { label: "Nationalities", value: "40+" },
      { label: "IB Average", value: "33.5" },
      { label: "Accreditation", value: "NEASC" },
      { label: "Fees", value: "US$12K – $22K" },
    ],
    otherSchools: [
      { name: "Mentari Intercultural School", slug: "mentari-intercultural-school-jakarta", meta: "IB · Ages 3–18 · Kebayoran Baru", feeRange: "US$8K – $16K / year" },
      { name: "British School Jakarta", slug: "british-school-jakarta", meta: "British + IB · Ages 2–18 · Bintaro", feeRange: "US$18K – $32K / year" },
      { name: "Jakarta Intercultural School", slug: "jakarta-intercultural-school", meta: "IB + AP · Ages 3–18 · Cilandak", feeRange: "US$17K – $36K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "Australian Curriculum Schools in Southeast Asia", slug: "australian-curriculum-schools-southeast-asia", readTime: "8 min read" },
    ],
  },

  jsonLd: {
    description: "Co-educational international school established in 1996 offering Australian Curriculum and IB Diploma Programme. Inclusive education philosophy.",
    foundingDate: "1996",
    numberOfStudents: "900",
  },
};

// ═══════════════════════════════════════════════════════
// SEKOLAH PELITA HARAPAN (SPH)
// ═══════════════════════════════════════════════════════

const sph: SchoolProfile = {
  slug: "sekolah-pelita-harapan",
  citySlug: "jakarta",
  name: "Sekolah Pelita Harapan",
  shortName: "SPH",
  verified: false,

  metaTitle: "Sekolah Pelita Harapan (SPH) Jakarta — Fees, IB Results & Review",
  metaDescription:
    "Sekolah Pelita Harapan profile — fees from US$6K–US$14K/year, full IB continuum, 2,000+ students, Christian values. Largest Christian international school in Jakarta. Editorial review.",

  campuses: [
    {
      name: "Lippo Village Campus",
      address: "Lippo Village, Tangerang, Banten",
      grades: "Pre-Kindergarten – Grade 12",
      lat: -6.2406,
      lng: 106.6103,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["IB PYP", "IB MYP", "IB Diploma"],
  stats: [
    { value: "2,000+", label: "Students" },
    { value: "3–18", label: "Age Range" },
    { value: "20+", label: "Nationalities" },
    { value: "US$6K – US$14K", label: "Annual Fees" },
  ],

  head: {
    name: "Helen Schleper",
    since: 2020,
    bio: "Helen Schleper is Head of School at Sekolah Pelita Harapan (Lippo Village). The school is accredited by WASC and ACSI. IB average typically 34–35.",
  },

  photoAlts: [
    "SPH Lippo Village campus",
    "Chapel and auditorium",
    "Sports facilities",
    "Classroom learning",
  ],

  intelligence: {
    verdict:
      "If you want a Christian school with full IB continuum at fees that won't break the bank, SPH is the obvious choice. The community is strong and the values are clear. Just know that faith is central to everything - if that's not your thing, look elsewhere.",
    paragraphs: [
      "The word among expat families is that SPH is where Christian families go when they want IB education without JIS prices. Founded in 1993, it's grown into the largest Christian international school in Jakarta with multiple campuses across the city. The main Lippo Village campus serves 2,000+ students from Pre-K through Grade 12, all following the full IB continuum.",
      "What comes up again and again is the community. Parents say the Christian values create a sense of belonging that secular schools can't match. Chapel services, Bible study, and faith-based character education are woven into daily life. The flip side is that if you're not Christian or comfortable with faith being central, this isn't the school for you. The student body is predominantly Indonesian Christian families, with a smaller expat community.",
      "Fees run US$6K to US$14K - significantly more affordable than the top-tier schools. The IB Diploma average of 31.4 is below JIS or BSJ, but the 92% pass rate suggests solid, consistent teaching. Facilities are functional rather than showpiece. If you're self-funding and faith matters, SPH offers genuine value. If you're targeting Ivy League or Oxbridge, you'll want to ask about individual results and university placements.",
    ],
    positives: [
      "Full IB continuum (PYP, MYP, DP) at fees roughly a third of what JIS charges. For self-funding families, that's compelling.",
      "The Christian community is strong. Parents say the values-based approach creates a sense of belonging that secular schools can't match.",
      "At 2,000+ students across multiple campuses, SPH has scale. Facilities are functional, and the school has been running long enough to have credibility.",
      "The IB Diploma pass rate of 92% suggests solid, consistent teaching across the cohort. The school has been running the full IB continuum for long enough to have a mature approach.",
      "Lippo Village is a planned community with good infrastructure. Families who live there find the location convenient.",
    ],
    considerations: [
      "Faith is central to everything. Chapel services, Bible study, and Christian values are woven into daily life. If that's not your thing, this isn't the school for you.",
      "The IB Diploma average of 31.4 is below the top-tier schools. If you're targeting Ivy League or Oxbridge, ask about individual subject scores and where graduates actually end up.",
      "The student body is predominantly Indonesian Christian families. The expat community is smaller than at JIS or BSJ. If you want a more international mix, this might not fit.",
      "Lippo Village is in Tangerang, west of Jakarta. If you're in South Jakarta or central Jakarta, you're looking at a long commute. Traffic can be heavy.",
      "SPH doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as competitors. You'll need to contact admissions directly for specifics.",
    ],
  },

  fees: {
    academicYear: "2026–2027",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Early Childhood (Ages 3–5)", ages: "3–5 years", tuition: 35_000_000, capital: 56_500_000, totalEarlyBird: 91_500_000, totalStandard: 91_500_000 },
      { gradeLevel: "Primary (Grades 1–6)", ages: "5–11 years", tuition: 214_000_000, capital: 214_200_000, totalEarlyBird: 428_200_000, totalStandard: 428_200_000 },
      { gradeLevel: "Middle School (Grades 7–10)", ages: "11–15 years", tuition: 284_000_000, capital: 0, totalEarlyBird: 284_000_000, totalStandard: 284_000_000 },
      { gradeLevel: "High School IB DP (Grades 11–12)", ages: "15–18 years", tuition: 384_000_000, capital: 0, totalEarlyBird: 384_000_000, totalStandard: 384_000_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 3_000_000, note: "Non-refundable" },
      { name: "Application Fee (Sibling)", amount: 1_500_000, note: "Non-refundable" },
      { name: "Annual Development Fee (DPP)", amount: 56_500_000, note: "One-time, varies by grade level" },
    ],
    note: "Fee structure includes Annual Development Fee (DPP) which is a one-time payment, and Annual Tuition Fee (SPP). Multi-year DPP discounts available. Tuition covers field trips, retreats, learning support, lab equipment, art supplies, and extracurricular activities. Contact admissions for the detailed 2026–2027 fee schedule.",
  },

  academics: {
    results: [
      { value: "31.4", label: "IB Average" },
      { value: "92%", label: "IB Pass Rate" },
    ],
    paragraphs: [
      "SPH offers the full IB continuum - Primary Years Programme (PYP) from K1 through Grade 6, Middle Years Programme (MYP) in Grades 7–10, and the IB Diploma Programme in Grades 11–12. The school is authorised for all three IB programmes.",
      "The IB Diploma average of 31.4 and pass rate of 92% represent solid performance - above the global IB average though below Jakarta's top-tier schools. The school integrates Christian values throughout the curriculum, with Bible study and character education woven into daily learning.",
      "Class sizes average 20–24 students. The school serves a wide ability range, with learning support available. The Christian philosophy emphasises character development alongside academic achievement.",
    ],
  },

  studentBody: {
    paragraphs: [
      "SPH serves 2,000+ students from 20+ nationalities across its campuses. The student body is predominantly Indonesian Christian families, with a smaller expat community. The school's Christian identity is central - families choose SPH specifically for the faith-based values.",
      "The community atmosphere is frequently noted by parents. The Christian values create a sense of belonging, and parents say the school culture takes character development seriously. The multi-campus structure means families can choose the location that works best for them.",
    ],
    inspection: {
      date: "Recent",
      body: "WASC / ACSI",
      rating: "Accredited",
      findings: "Sekolah Pelita Harapan is accredited by WASC and ACSI (Association of Christian Schools International).",
    },
  },

  schoolLife: {
    activitiesCount: 60,
    uniformRequired: true,
    facilities: [
      "Swimming pool",
      "Auditorium",
      "Chapel",
      "Sports fields",
      "Basketball courts",
      "Library",
      "Science laboratories",
      "Computer labs",
      "Art studios",
      "Music rooms",
      "Multi-purpose halls",
    ],
    paragraphs: [
      "SPH runs a range of co-curricular activities including sports, arts, music, and academic clubs. The school's Christian identity is reflected in activities like chapel services, Bible study groups, and community service initiatives.",
      "Sports programmes include swimming, football, basketball, volleyball, and athletics. The arts programme includes music, drama, and visual arts. The school participates in local and regional competitions.",
      "The school's faith-based approach extends to its activities - the emphasis is on character development, community service, and values education alongside academic and sporting achievement.",
    ],
  },

  contact: {
    phone: "+62 21 546 0233",
    email: "admissions@sph.edu",
    website: "https://www.sph.edu",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "1993" },
      { label: "Type", value: "Non-profit (Christian), Co-ed" },
      { label: "Curriculum", value: "Full IB (PYP/MYP/DP)" },
      { label: "Students", value: "2,000+" },
      { label: "Ages", value: "3–18" },
      { label: "Nationalities", value: "20+" },
      { label: "IB Average", value: "31.4" },
      { label: "Accreditation", value: "ACSI / IBO" },
      { label: "Fees", value: "US$6K – $14K" },
    ],
    otherSchools: [
      { name: "Mentari Intercultural School", slug: "mentari-intercultural-school-jakarta", meta: "IB · Ages 3–18 · Kebayoran Baru", feeRange: "US$8K – $16K / year" },
      { name: "Global Jaya School", slug: "global-jaya-school", meta: "IB · Ages 3–18 · BSD", feeRange: "US$6K – $12K / year" },
      { name: "Jakarta Intercultural School", slug: "jakarta-intercultural-school", meta: "IB + AP · Ages 3–18 · Cilandak", feeRange: "US$17K – $36K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "Faith-Based International Schools: What Parents Need to Know", slug: "faith-based-international-schools", readTime: "6 min read" },
    ],
  },

  jsonLd: {
    description: "Christian co-educational international school established in 1993 offering full IB continuum (PYP, MYP, DP). Largest Christian international school in Jakarta.",
    foundingDate: "1993",
    numberOfStudents: "2000",
  },
};

// ═══════════════════════════════════════════════════════
// GLOBAL JAYA SCHOOL
// ═══════════════════════════════════════════════════════

const globalJaya: SchoolProfile = {
  slug: "global-jaya-school",
  citySlug: "jakarta",
  name: "Global Jaya School",
  shortName: "Global Jaya",
  verified: false,

  metaTitle: "Global Jaya School Jakarta — Fees, IB Results & Review",
  metaDescription:
    "Global Jaya School profile — fees from US$6K–US$12K/year, full IB continuum, 800+ students, BSD City. Good value IB school in South Tangerang. Editorial review.",

  campuses: [
    {
      name: "Bintaro Jaya Campus",
      address: "Emerald Boulevard, Bintaro Jaya Sektor IX, Tangerang Selatan 15224",
      grades: "Early Years – Year 12",
      lat: -6.2726,
      lng: 106.7018,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["IB PYP", "IB MYP", "IB Diploma"],
  stats: [
    { value: "800+", label: "Students" },
    { value: "3–18", label: "Age Range" },
    { value: "25+", label: "Nationalities" },
    { value: "US$6K – US$12K", label: "Annual Fees" },
  ],

  head: {
    name: "Dr. Howard Menand IV",
    since: 2024,
    bio: "Dr. Howard Menand IV became Head of School at Global Jaya School in July 2024, having previously served as Secondary Principal at the school. His appointment was announced in October 2023. Under his leadership, GJS has continued to develop its IB continuum programmes and community engagement initiatives, including hosting Asia Pacific Regional IB Workshops and the annual Global Connect university guidance event. Dr. Menand emphasises community, Indonesian cultural heritage, and putting students at the heart of decision-making.",
  },

  photoAlts: [
    "Global Jaya School campus",
    "Swimming pool and sports facilities",
    "IB classroom learning",
    "Library and study spaces",
  ],

  intelligence: {
    verdict:
      "If you're in BSD City and want full IB continuum at fees that won't break the bank, Global Jaya is a solid option. The commute from central Jakarta is the main trade-off, but for families already in the area, it makes sense.",
    paragraphs: [
      "The word among expat families is that Global Jaya is the school you consider if you're already in BSD City or planning to live there. Founded in 1996, it's been running the full IB continuum long enough to have credibility. At 800 students, it sits in that middle ground - big enough to offer decent facilities and activities, small enough that parents say it feels like a community.",
      "What comes up again and again is the value. Fees run US$6K to US$12K - roughly a third of what JIS charges. The IB Diploma average of 30.8 is below the top-tier schools, but the 90% pass rate suggests solid, consistent teaching. Parents say the international atmosphere is genuine - 25+ nationalities, and the school culture values diversity and intercultural understanding.",
      "The catch is location. BSD City is in South Tangerang, well south of central Jakarta. If you're in Menteng, Kuningan, or Kemang, you're looking at 60-90 minutes each way during rush hour. For families already in BSD or planning to live there, Global Jaya makes sense. For everyone else, the commute is a deal-breaker.",
    ],
    positives: [
      "Full IB continuum (PYP, MYP, DP) at fees roughly a third of what JIS charges. For self-funding families, that's compelling.",
      "The international atmosphere is genuine. With 25+ nationalities and a diverse student body, the intercultural mix is real.",
      "The IB Diploma pass rate of 90% suggests solid, consistent teaching across the cohort. The school has been running the full IB continuum for long enough to have a mature approach.",
      "BSD City is a planned community with good infrastructure. Families who live there find the location convenient and the area family-friendly.",
      "At 800 students, Global Jaya is smaller than JIS or BSJ. Parents say the community feel is real - teachers know children by name.",
    ],
    considerations: [
      "BSD City is in South Tangerang, well south of central Jakarta. If you're in Menteng, Kuningan, or Kemang, you're looking at 60-90 minutes each way during rush hour. The commute is a genuine trade-off.",
      "The IB Diploma average of 30.8 is below the top-tier schools. If you're targeting Ivy League or Oxbridge, ask about individual subject scores and where graduates actually end up.",
      "At 800 students, extracurricular options are more limited than the bigger schools. Fewer sporting teams, fewer clubs, and narrower social circles.",
      "Facilities are functional but not showpiece. Don't expect Olympic pools, professional theatres, or sprawling grounds. The money goes into teaching rather than facilities.",
      "Global Jaya doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as competitors. You'll need to contact admissions directly for specifics.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Early Years (KG1–KG2)", ages: "3–5 years", tuition: 70_675_000, capital: 0, totalEarlyBird: 70_675_000, totalStandard: 70_675_000 },
      { gradeLevel: "Primary (Grades 1–5)", ages: "5–11 years", tuition: 117_810_000, capital: 0, totalEarlyBird: 117_810_000, totalStandard: 117_810_000 },
      { gradeLevel: "Middle Years (Grades 6–8)", ages: "11–14 years", tuition: 138_006_000, capital: 0, totalEarlyBird: 138_006_000, totalStandard: 138_006_000 },
      { gradeLevel: "IB Diploma (Grades 9–11)", ages: "14–18 years", tuition: 164_945_000, capital: 0, totalEarlyBird: 164_945_000, totalStandard: 164_945_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 3_000_000 },
      { name: "Enrolment Fee", amount: 10_000_000, note: "One-time, new students" },
    ],
    note: "Fee ranges shown are approximate annual tuition. Uniforms cost approximately IDR 800,000 for three sets. Textbooks, starter packs, and exam fees are included. Contact admissions for the detailed 2025–2026 fee schedule.",
  },

  academics: {
    results: [
      { value: "30.8", label: "IB Average" },
      { value: "90%", label: "IB Pass Rate" },
    ],
    paragraphs: [
      "Global Jaya School offers the full IB continuum - Primary Years Programme (PYP) from Early Years through Grade 5, Middle Years Programme (MYP) in Grades 6–10, and the IB Diploma Programme in Grades 11–12. The school is authorised for all three IB programmes.",
      "The IB Diploma average of 30.8 and pass rate of 90% represent solid performance - around the global IB average though below Jakarta's top-tier schools. The school emphasises inquiry-based learning and international-mindedness throughout the curriculum.",
      "Class sizes average 18–22 students. The school serves a wide ability range, with learning support available. The IB approach emphasises critical thinking, communication, and intercultural understanding.",
    ],
  },

  studentBody: {
    paragraphs: [
      "Global Jaya serves 800+ students from 25+ nationalities. The school's international identity is central - the student body is diverse, with a mix of expat and Indonesian families. The school culture values intercultural understanding and global citizenship.",
      "The community atmosphere is frequently noted by parents. At its scale, Global Jaya occupies a middle ground - large enough to offer breadth in curriculum and activities, small enough that children aren't anonymous. Parents say the international mix creates a genuine global learning environment.",
    ],
    inspection: {
      date: "Recent",
      body: "WASC / IB World School",
      rating: "Accredited",
      findings: "Global Jaya School holds WASC accreditation and IB World School status. Long-standing IB Diploma programme.",
    },
  },

  schoolLife: {
    activitiesCount: 40,
    uniformRequired: true,
    facilities: [
      "Swimming pool",
      "Sports hall",
      "Football field",
      "Basketball courts",
      "Library",
      "Science laboratories",
      "Computer labs",
      "Art studios",
      "Music rooms",
      "Multi-purpose halls",
    ],
    paragraphs: [
      "Global Jaya runs a range of co-curricular activities including sports, arts, music, and academic clubs. The school participates in local and regional competitions, though the breadth of options is more limited than the larger schools.",
      "Sports programmes include swimming, football, basketball, volleyball, and athletics. The arts programme includes music, drama, and visual arts. The school's IB approach emphasises service learning and community engagement.",
      "The school's international identity extends to its activities - the emphasis is on intercultural understanding, global citizenship, and community service rather than elite competition.",
    ],
  },

  contact: {
    phone: "+62 21 745 7562",
    email: "info@globaljaya.sch.id",
    website: "https://www.globaljaya.sch.id",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "1996" },
      { label: "Type", value: "Non-profit, Co-ed" },
      { label: "Curriculum", value: "Full IB (PYP/MYP/DP)" },
      { label: "Students", value: "800+" },
      { label: "Ages", value: "3–18" },
      { label: "Nationalities", value: "25+" },
      { label: "IB Average", value: "30.8" },
      { label: "Accreditation", value: "CIS / IBO / WASC" },
      { label: "Fees", value: "US$6K – $12K" },
    ],
    otherSchools: [
      { name: "Mentari Intercultural School", slug: "mentari-intercultural-school-jakarta", meta: "IB · Ages 3–18 · Kebayoran Baru", feeRange: "US$8K – $16K / year" },
      { name: "Sekolah Pelita Harapan", slug: "sekolah-pelita-harapan", meta: "IB · Ages 3–18 · Lippo Village", feeRange: "US$6K – $14K / year" },
      { name: "Binus School Serpong", slug: "binus-school-serpong", meta: "Cambridge · Ages 3–18 · Serpong", feeRange: "US$5K – $10K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "IB World Schools in Jakarta: The Complete Guide", slug: "ib-world-schools-jakarta-guide", readTime: "10 min read" },
    ],
  },

  jsonLd: {
    description: "Co-educational IB World School established in 1996 offering full IB continuum (PYP, MYP, DP). Located in BSD City, South Tangerang.",
    foundingDate: "1996",
    numberOfStudents: "800",
  },
};

// ═══════════════════════════════════════════════════════
// BINUS SCHOOL SERPONG
// ═══════════════════════════════════════════════════════

const binus: SchoolProfile = {
  slug: "binus-school-serpong",
  citySlug: "jakarta",
  name: "Binus School Serpong",
  shortName: "Binus",
  verified: false,

  metaTitle: "Binus School Serpong — Fees, Cambridge Results & Review",
  metaDescription:
    "Binus School Serpong profile — fees from US$5K–US$10K/year, Cambridge curriculum, 1,200+ students, strong STEM focus. Part of Bina Nusantara group. Editorial review.",

  campuses: [
    {
      name: "Serpong Campus",
      address: "Jl. Alam Sutera Boulevard, Serpong, Tangerang Selatan",
      grades: "Early Years – Year 13",
      lat: -6.2406,
      lng: 106.6103,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["Cambridge Primary", "Cambridge Lower Secondary", "IGCSE", "A-Levels"],
  stats: [
    { value: "1,200+", label: "Students" },
    { value: "3–18", label: "Age Range" },
    { value: "15+", label: "Nationalities" },
    { value: "US$5K – US$10K", label: "Annual Fees" },
  ],

  head: {
    name: "Anwin Samsudi",
    since: 2020,
    bio: "Binus School Serpong has a split leadership structure: Anwin Samsudi (Primary) and Sherrierose Garcia Gonzales (Secondary). The school holds WASC (Candidate) and IB World School status, with a strong focus on STEM and international placements.",
  },

  photoAlts: [
    "Binus School Serpong campus",
    "STEM laboratories",
    "Technology and robotics facilities",
    "Sports and recreation facilities",
  ],

  intelligence: {
    verdict:
      "If you want Cambridge curriculum with a strong STEM focus at the lowest fees in Jakarta, Binus is worth a look. The student body is predominantly Indonesian, which suits some families but not others. The commute from central Jakarta is significant.",
    paragraphs: [
      "The word among expat families is that Binus is the school you consider if you're looking for Cambridge curriculum and your budget is tight. Part of the Bina Nusantara group - Indonesia's leading technology education network - it's strong in STEM and technology. Fees run US$5K to US$10K, making it the most affordable international school in Jakarta.",
      "What comes up again and again is the value proposition. Cambridge curriculum from primary through A-Levels, modern facilities, and fees that won't break the bank. The flip side is that the student body is predominantly Indonesian - around 80% by most accounts. If you want a more international mix, this isn't the school for you. But if you're comfortable with a predominantly local student body and want strong academics at a low price, Binus delivers.",
      "The Serpong location is in South Tangerang, well south of central Jakarta. If you're in Menteng, Kuningan, or Kemang, you're looking at 60-90 minutes each way during rush hour. For families already in the area or planning to live there, Binus makes sense. For everyone else, the commute is a deal-breaker.",
    ],
    positives: [
      "Fees at US$5K to US$10K are the lowest of any international school in Jakarta. For self-funding families, that's compelling.",
      "Strong STEM focus with modern technology and robotics facilities. The Bina Nusantara connection brings resources and expertise in technology education.",
      "Cambridge curriculum from primary through A-Levels gives students internationally recognised qualifications at every stage.",
      "A-Level results show 40% achieving A*–A grades, and IGCSE shows 45% achieving 9–7 grades. That's solid performance for the fee level.",
      "The school has been running long enough to have credibility. Facilities are modern, and the campus is purpose-built.",
    ],
    considerations: [
      "The student body is predominantly Indonesian - around 80% by most accounts. If you want a more international mix, this isn't the school for you.",
      "Serpong is in South Tangerang, well south of central Jakarta. If you're in Menteng, Kuningan, or Kemang, you're looking at 60-90 minutes each way during rush hour.",
      "At 1,200+ students, Binus is large. Some parents say it can feel impersonal, particularly in secondary school.",
      "The school doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as competitors. You'll need to contact admissions directly for specifics.",
      "Extracurricular options are more limited than the bigger schools. Fewer sporting teams, fewer clubs, and narrower social circles.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Early Years (Ages 3–5)", ages: "3–5 years", tuition: 60_000_000, capital: 0, totalEarlyBird: 60_000_000, totalStandard: 60_000_000 },
      { gradeLevel: "Primary (Years 1–6)", ages: "5–11 years", tuition: 80_000_000, capital: 0, totalEarlyBird: 80_000_000, totalStandard: 80_000_000 },
      { gradeLevel: "Lower Secondary (Years 7–9)", ages: "11–14 years", tuition: 100_000_000, capital: 0, totalEarlyBird: 100_000_000, totalStandard: 100_000_000 },
      { gradeLevel: "IGCSE (Years 10–11)", ages: "14–16 years", tuition: 120_000_000, capital: 0, totalEarlyBird: 120_000_000, totalStandard: 120_000_000 },
      { gradeLevel: "A-Levels (Years 12–13)", ages: "16–18 years", tuition: 140_000_000, capital: 0, totalEarlyBird: 140_000_000, totalStandard: 140_000_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 2_500_000 },
      { name: "Enrolment Fee", amount: 8_000_000, note: "One-time, new students" },
    ],
    note: "Fee ranges shown are approximate annual tuition. Contact admissions for the detailed 2025–2026 fee schedule including all one-time fees and payment options.",
  },

  academics: {
    results: [
      { value: "45%", label: "A*–A at IGCSE" },
      { value: "40%", label: "A*–A at A-Level" },
    ],
    paragraphs: [
      "Binus School Serpong offers the Cambridge curriculum from primary through A-Levels. Cambridge Primary and Lower Secondary provide structured learning in core subjects, IGCSE qualifications in Years 10–11, and A-Levels in Years 12–13.",
      "A-Level results show 40% of students achieving A*–A grades, and IGCSE shows 45% achieving 9–7 grades. That's solid performance for the fee level, though below the top-tier Jakarta schools. The school's STEM focus means strong results in mathematics, sciences, and technology subjects.",
      "Class sizes average 22–26 students. The school serves a wide ability range, with learning support available. The Cambridge approach emphasises structured learning, clear assessment, and internationally recognised qualifications.",
    ],
  },

  studentBody: {
    paragraphs: [
      "Binus serves 1,200+ students from 15+ nationalities. The student body is predominantly Indonesian - around 80% by most accounts - with a smaller expat community. The school culture reflects its Indonesian identity while maintaining international curriculum standards.",
      "The community atmosphere reflects the school's size and local focus. Parents say the school culture values academic achievement and technology skills. The predominantly Indonesian student body suits some families but not others - if you want a more international mix, this isn't the school for you.",
    ],
    inspection: {
      date: "Recent",
      body: "WASC (Candidate) / IB World School",
      rating: "Accredited",
      findings: "Binus School Serpong holds WASC (Candidate) and IB World School status. Strong focus on STEM and international placements.",
    },
  },

  schoolLife: {
    activitiesCount: 30,
    uniformRequired: true,
    facilities: [
      "STEM laboratories",
      "Robotics and technology labs",
      "Sports hall",
      "Football field",
      "Basketball courts",
      "Library",
      "Computer labs",
      "Art studios",
      "Music rooms",
      "Multi-purpose halls",
    ],
    paragraphs: [
      "Binus runs a range of co-curricular activities with a focus on STEM, technology, and robotics. The school participates in local and regional competitions, particularly in technology and science.",
      "Sports programmes include football, basketball, volleyball, and athletics. The arts programme includes music, drama, and visual arts. The school's STEM focus means strong robotics and technology clubs.",
      "The school's technology identity extends to its activities - the emphasis is on STEM skills, innovation, and technology rather than elite competition.",
    ],
  },

  contact: {
    phone: "+62 21 538 0400",
    email: "info@binus.edu",
    website: "https://www.binus.edu",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "2007" },
      { label: "Type", value: "For-profit, Co-ed" },
      { label: "Curriculum", value: "Cambridge (Primary–A-Levels)" },
      { label: "Students", value: "1,200+" },
      { label: "Ages", value: "3–18" },
      { label: "Nationalities", value: "15+" },
      { label: "A-Level A*–A", value: "40%" },
      { label: "Accreditation", value: "Cambridge International" },
      { label: "Fees", value: "US$5K – $10K" },
    ],
    otherSchools: [
      { name: "Global Jaya School", slug: "global-jaya-school", meta: "IB · Ages 3–18 · BSD", feeRange: "US$6K – $12K / year" },
      { name: "Sekolah Pelita Harapan", slug: "sekolah-pelita-harapan", meta: "IB · Ages 3–18 · Lippo Village", feeRange: "US$6K – $14K / year" },
      { name: "British School Jakarta", slug: "british-school-jakarta", meta: "British + IB · Ages 2–18 · Bintaro", feeRange: "US$18K – $32K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "Cambridge Curriculum Schools in Southeast Asia", slug: "cambridge-curriculum-schools-southeast-asia", readTime: "8 min read" },
    ],
  },

  jsonLd: {
    description: "Co-educational international school established in 2007 offering Cambridge curriculum from primary through A-Levels. Part of Bina Nusantara group, strong STEM focus.",
    foundingDate: "2007",
    numberOfStudents: "1200",
  },
};

// ═══════════════════════════════════════════════════════
// SINARMAS WORLD ACADEMY (SWA)
// ═══════════════════════════════════════════════════════

const sinarmas: SchoolProfile = {
  slug: "sinarmas-world-academy",
  citySlug: "jakarta",
  name: "Sinarmas World Academy",
  shortName: "SWA",
  verified: false,

  metaTitle: "Sinarmas World Academy (SWA) Jakarta — Fees, IB Results & Review",
  metaDescription:
    "Sinarmas World Academy profile — Jakarta's top IB results school (avg 38.2). Fees not published. BSD campus, 1,200+ students. Academically rigorous IB school. Editorial review.",

  campuses: [
    {
      name: "BSD City Campus",
      address: "Jl. TM Pahlawan Seribu, CBD Lot XV, BSD City, Tangerang Selatan 15322",
      grades: "Toddler – Grade 12",
      lat: -6.3014,
      lng: 106.6528,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["UK EYFS", "Cambridge Primary", "IB MYP", "IB Diploma"],
  stats: [
    { value: "1,200+", label: "Students" },
    { value: "2–18", label: "Age Range" },
    { value: "30+", label: "Nationalities" },
    { value: "Fees not published", label: "Annual Fees" },
  ],

  head: {
    name: "Stanislav K. Sousek",
    since: 2026,
    bio: "Stanislav K. Sousek is Head of School and University Counsellor at Sinarmas World Academy (2026). The school is CIS accredited and an IB World School, with high achievement in IGCSE and IB DP.",
  },

  photoAlts: [
    "SWA BSD campus",
    "Modern learning facilities",
    "IB Diploma students",
    "Campus grounds",
  ],

  intelligence: {
    verdict:
      "If you're targeting top-tier universities and want Jakarta's strongest IB results, SWA is the obvious choice. The academic rigour is real, but it's not for every child - this is a school for achievement-focused families.",
    paragraphs: [
      "The word among expat families is that SWA is where you go if you want the strongest IB results in Jakarta. The 2024 IB Diploma average of 38.2 points is the highest in the city - well above JIS (35.8) and BSJ (35). If you're targeting Oxbridge, Ivy League, or top-tier universities, that difference matters.",
      "What comes up again and again is the academic focus. SWA attracts achievement-oriented families who prioritise results. The curriculum combines Cambridge Primary, IB MYP, and IB Diploma - a pathway designed for academic excellence. Parents say the teaching is rigorous, expectations are high, and the school culture values achievement.",
      "The BSD City location suits families already in the area or planning to live there. If you're in South Jakarta or central Jakarta, you're looking at a long commute. Fees run US$9.3K to US$28K - premium but not at JIS levels. The catch is that this intensity isn't for every child. If your child thrives under pressure and wants academic challenge, SWA delivers. If they need more balance or support, look elsewhere.",
    ],
    positives: [
      "IB Diploma average of 38.2 points (2024) is the highest in Jakarta - well above the global average of 30.24 and competitive with top schools globally.",
      "100% IB pass rate with 80% of students scoring 35+ points. The highest score was 44/45 points - exceptional performance.",
      "Strong university placements including Oxford, Imperial College London, University of Melbourne, and prestigious art schools like Central Saint Martins and RISD.",
      "Dual curriculum pathway - Cambridge Primary and IB MYP/DP - gives students internationally recognised qualifications at every stage.",
      "Modern BSD City campus with purpose-built facilities. The location suits families already in the area or planning to live there.",
    ],
    considerations: [
      "The academic intensity is real. This is a school for achievement-focused families. If your child needs more support or balance, SWA's rigour might not be the right fit.",
      "BSD City is in South Tangerang, well south of central Jakarta. If you're in Menteng, Kuningan, or Kemang, you're looking at 60-90 minutes each way during rush hour.",
      "Fees at US$9.3K to US$28K are premium, though below JIS levels. The school doesn't publish detailed fee schedules publicly - you'll need to contact admissions.",
      "The school culture values achievement and academic excellence. Some parents say it can feel competitive rather than collaborative.",
      "SWA doesn't publish detailed exam results, leadership team profiles, or fee schedules as openly as some competitors. You'll need to contact admissions directly for specifics.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Early Years (Toddler–KG)", ages: "1–5 years", tuition: 120_000_000, capital: 0, totalEarlyBird: 120_000_000, totalStandard: 120_000_000 },
      { gradeLevel: "Primary (Grades 1–6)", ages: "5–11 years", tuition: 200_000_000, capital: 0, totalEarlyBird: 200_000_000, totalStandard: 200_000_000 },
      { gradeLevel: "Middle School (Grades 7–10)", ages: "11–15 years", tuition: 280_000_000, capital: 0, totalEarlyBird: 280_000_000, totalStandard: 280_000_000 },
      { gradeLevel: "IB Diploma (Grades 11–12)", ages: "15–18 years", tuition: 350_000_000, capital: 0, totalEarlyBird: 350_000_000, totalStandard: 350_000_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 5_000_000 },
      { name: "Enrolment Fee", amount: 20_000_000, note: "One-time, new students" },
    ],
    note: "Fee ranges shown are approximate annual tuition. SWA does not publish detailed fee schedules publicly. Contact admissions for the current 2025–2026 fee schedule including all one-time fees and payment options.",
  },

  academics: {
    results: [
      { value: "38.2", label: "IB Average (2024)" },
      { value: "100%", label: "IB Pass Rate" },
      { value: "80%", label: "Students scoring 35+" },
    ],
    paragraphs: [
      "SWA offers UK Early Years Foundation Stage (EYFS) for toddlers, Cambridge Primary for elementary, IB Middle Years Programme (MYP) for middle school, and IB Diploma Programme for high school. The school also integrates Peking University Chinese Curriculum at elementary level.",
      "The 2024 IB Diploma cohort achieved an average of 38.2 points - the highest in Jakarta and well above the global average of 30.24. 100% pass rate with 80% of students scoring 35+ points. The highest score was 44/45 points. These results place SWA among the top IB schools globally.",
      "University destinations include Oxford, Imperial College London, University of Melbourne, and prestigious art schools including Central Saint Martins and RISD. The school's academic rigour and strong university preparation are central to its identity.",
    ],
  },

  studentBody: {
    paragraphs: [
      "SWA serves 1,200+ students from 30+ nationalities. The school attracts achievement-oriented families who prioritise academic excellence and university preparation. The student body includes both expat and Indonesian families.",
      "The school culture values academic achievement and rigour. Parents say the community is focused on results and university placements. The BSD City location means many families live in the area or have chosen to relocate there for the school.",
    ],
    inspection: {
      date: "Recent",
      body: "CIS / IB World School",
      rating: "Accredited",
      findings: "Sinarmas World Academy is CIS accredited and an IB World School. High achievement in IGCSE and IB DP.",
    },
  },

  schoolLife: {
    activitiesCount: 50,
    uniformRequired: true,
    facilities: [
      "Modern classrooms",
      "Science laboratories",
      "Computer labs",
      "Library",
      "Sports facilities",
      "Arts studios",
      "Music rooms",
      "Multi-purpose halls",
    ],
    paragraphs: [
      "SWA runs a range of co-curricular activities with a focus on academic enrichment and university preparation. The school participates in academic competitions and international programmes.",
      "Sports and arts programmes are available, though the emphasis is on academic achievement. The school's modern BSD City campus provides purpose-built facilities for learning and activities.",
      "The school culture emphasises academic excellence and achievement. Activities are designed to support university applications and academic development.",
    ],
  },

  contact: {
    phone: "+62 21 5316 1400",
    email: "admissions@swa-jkt.com",
    website: "https://www.swa-jkt.com",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "c. 2008" },
      { label: "Type", value: "For-profit, Co-ed" },
      { label: "Curriculum", value: "Cambridge + IB MYP/DP" },
      { label: "Students", value: "1,200+" },
      { label: "Ages", value: "2–18" },
      { label: "Nationalities", value: "30+" },
      { label: "IB Average", value: "38.2 (2024)" },
      { label: "Accreditation", value: "IB / Cambridge" },
      { label: "Fees", value: "Fees not published" },
    ],
    otherSchools: [
      { name: "Jakarta Intercultural School", slug: "jakarta-intercultural-school", meta: "IB + AP · Ages 3–18 · Cilandak", feeRange: "US$23K – $37K / year" },
      { name: "British School Jakarta", slug: "british-school-jakarta", meta: "British + IB · Ages 2–18 · Bintaro", feeRange: "US$9.2K – $30K / year" },
      { name: "ACG School Jakarta", slug: "acg-school-jakarta", meta: "IB · Ages 3–17 · Pasar Minggu", feeRange: "US$9.8K – $25K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "IB Results: Top International Schools in Asia", slug: "ib-results-top-schools-asia-2025", readTime: "10 min read" },
    ],
  },

  jsonLd: {
    description: "Co-educational international school offering Cambridge Primary, IB MYP and IB Diploma Programme. Highest IB results in Jakarta (avg 38.2). Fees not published.",
    foundingDate: "2008",
    numberOfStudents: "1200",
  },
};

// ═══════════════════════════════════════════════════════
// TUNAS MUDA SCHOOL
// ═══════════════════════════════════════════════════════

const tunasMuda: SchoolProfile = {
  slug: "tunas-muda-school",
  citySlug: "jakarta",
  name: "Tunas Muda School",
  shortName: "Tunas Muda",
  verified: false,

  metaTitle: "Tunas Muda School Jakarta — Fees, IB Results & Review",
  metaDescription:
    "Tunas Muda School profile — fees from US$6.9K–US$27K/year, full IB continuum (PYP/MYP/DP), Catholic values, 800+ students. One of Jakarta's few complete IB schools. Editorial review.",

  campuses: [
    {
      name: "Meruya Campus",
      address: "Jl. Meruya Utara Raya No. 71, Kembangan, Jakarta Barat 11620",
      grades: "Early Childhood – Grade 12",
      lat: -6.2014,
      lng: 106.7486,
    },
    {
      name: "Kedoya Campus",
      address: "Jl. Angsana Raya D8/2, Taman Kedoya Baru, Kedoya, Jakarta Barat 11520",
      grades: "Early Childhood – Grade 5",
      lat: -6.1789,
      lng: 106.7689,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["IB PYP", "IB MYP", "IB DP"],
  stats: [
    { value: "800+", label: "Students" },
    { value: "1–18", label: "Age Range" },
    { value: "25+", label: "Nationalities" },
    { value: "US$6.9K – US$27K", label: "Annual Fees" },
  ],

  head: {
    name: "Dr. Ridwan Bachtra",
    since: 2020,
    bio: "Tunas Muda operates with campus-specific heads: Dr. Ridwan Bachtra (Meruya) and Rachel Groves (Kedoya). The school is an IB World School (full continuum: PYP, MYP, DP) with a consistent 100% IB Diploma pass rate; average scores typically 32–35.",
  },

  photoAlts: [
    "Tunas Muda Meruya campus",
    "IB classroom learning",
    "Campus facilities",
    "Student activities",
  ],

  intelligence: {
    verdict:
      "If you want the complete IB continuum from age 1 through Grade 12 and Catholic values matter, Tunas Muda is one of the few options in Jakarta. Fees are mid-range, and the school has been running long enough to have credibility.",
    paragraphs: [
      "The word among expat families is that Tunas Muda is one of the few schools in Jakarta offering the complete IB continuum - PYP, MYP, and Diploma - from early childhood through high school. Founded in 1994, it's been running long enough to have credibility. The school integrates Catholic values throughout the curriculum, which matters if faith is important to your family.",
      "What comes up again and again is the full IB pathway. Most Jakarta schools offer IB Diploma but not the full continuum. Tunas Muda runs PYP from early years, MYP in middle school, and DP in high school - a coherent pathway that appeals to families who want consistency. Fees run US$6.9K to US$27K - mid-range, making it accessible to self-funding families.",
      "The Meruya campus serves ages 2-18, while the Kedoya campus focuses on early childhood through Grade 5. Both are in West Jakarta. If you're in South Jakarta or central Jakarta, you're looking at a commute. The Catholic identity means chapel services and faith-based character education are part of daily life - if that's not your thing, this isn't the school for you.",
    ],
    positives: [
      "Full IB continuum (PYP, MYP, DP) from early childhood through high school - one of the few schools in Jakarta offering this complete pathway.",
      "Founded in 1994, Tunas Muda has been running long enough to have credibility and an established approach to IB education.",
      "Fees at US$6.9K to US$27K are mid-range, making it accessible to self-funding families who want full IB without premium prices.",
      "Catholic values integrated throughout the curriculum - suits families who want faith-based education alongside international qualifications.",
      "Two campuses in West Jakarta provide options for families in different areas - Meruya for full programme, Kedoya for early years and primary.",
    ],
    considerations: [
      "The Catholic identity means faith is central to school life. If that's not your thing, this isn't the school for you.",
      "West Jakarta locations mean a commute for families in South Jakarta or central Jakarta. Traffic can be heavy, particularly to Meruya.",
      "The school doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as competitors. You'll need to contact admissions directly for specifics.",
      "At 800 students across two campuses, extracurricular options are more limited than the bigger schools. Fewer sporting teams, fewer clubs.",
      "IB Diploma results aren't publicly available. If you're targeting top-tier universities, ask about individual results and university placements.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Early Childhood (Ages 1–5)", ages: "1–5 years", tuition: 90_000_000, capital: 0, totalEarlyBird: 90_000_000, totalStandard: 90_000_000 },
      { gradeLevel: "Primary IB PYP (Grades 1–5)", ages: "5–11 years", tuition: 180_000_000, capital: 0, totalEarlyBird: 180_000_000, totalStandard: 180_000_000 },
      { gradeLevel: "Middle School IB MYP (Grades 6–10)", ages: "11–15 years", tuition: 250_000_000, capital: 0, totalEarlyBird: 250_000_000, totalStandard: 250_000_000 },
      { gradeLevel: "High School IB DP (Grades 11–12)", ages: "15–18 years", tuition: 350_000_000, capital: 0, totalEarlyBird: 350_000_000, totalStandard: 350_000_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 3_000_000 },
      { name: "Enrolment Fee", amount: 15_000_000, note: "One-time, new students" },
    ],
    note: "Fee ranges shown are approximate annual tuition. Tunas Muda does not publish detailed fee schedules publicly. Contact admissions for the current 2025–2026 fee schedule including all one-time fees and payment options.",
  },

  academics: {
    results: [
      { value: "100%", label: "IB Diploma Pass Rate" },
      { value: "32–35", label: "IB Average (typical range)" },
    ],
    paragraphs: [
      "Tunas Muda offers the complete IB continuum - Primary Years Programme (PYP) from early childhood through Grade 5, Middle Years Programme (MYP) in Grades 6–10, and IB Diploma Programme in Grades 11–12. The school is authorised for all three IB programmes.",
      "The school integrates Catholic values throughout the curriculum, with chapel services and faith-based character education woven into daily learning. The IB approach emphasises inquiry-based learning, critical thinking, and international-mindedness.",
      "Detailed IB Diploma results and university destination data are not publicly available. Parents should ask admissions directly for current exam results and university placements.",
    ],
  },

  studentBody: {
    paragraphs: [
      "Tunas Muda serves 800+ students from 25+ nationalities across its two campuses. The school's Catholic identity is central - families choose Tunas Muda specifically for the faith-based values alongside IB education.",
      "The community atmosphere reflects the school's size and values. Parents say the Catholic values create a sense of belonging, and the school culture takes character development seriously alongside academic achievement.",
    ],
    inspection: {
      date: "Recent",
      body: "IB World School",
      rating: "Full continuum (PYP, MYP, DP)",
      findings: "Tunas Muda is an IB World School offering the full continuum. Consistent 100% IB Diploma pass rate; average scores typically 32–35.",
    },
  },

  schoolLife: {
    activitiesCount: 40,
    uniformRequired: true,
    facilities: [
      "Chapel",
      "Library",
      "Science laboratories",
      "Computer labs",
      "Art studios",
      "Music rooms",
      "Sports facilities",
      "Multi-purpose halls",
    ],
    paragraphs: [
      "Tunas Muda runs a range of co-curricular activities with a focus on service learning and character development. The school's Catholic identity is reflected in activities like chapel services and community service initiatives.",
      "Sports and arts programmes are available. The school participates in local competitions and community events. The emphasis is on holistic development - academic achievement alongside character and values.",
      "The school's faith-based approach extends to its activities - the emphasis is on service, community engagement, and values education alongside academic and sporting achievement.",
    ],
  },

  contact: {
    phone: "+62 21 5870 329",
    email: "cservice@tunasmuda.sch.id",
    website: "https://www.tunasmuda.sch.id",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "1994" },
      { label: "Type", value: "Catholic, Co-ed" },
      { label: "Curriculum", value: "Full IB (PYP/MYP/DP)" },
      { label: "Students", value: "800+" },
      { label: "Ages", value: "1–18" },
      { label: "Nationalities", value: "25+" },
      { label: "Accreditation", value: "IB World School" },
      { label: "Fees", value: "US$6.9K – $27K" },
    ],
    otherSchools: [
      { name: "Sekolah Pelita Harapan", slug: "sekolah-pelita-harapan", meta: "IB · Ages 4–18 · Lippo Village", feeRange: "US$7.2K – $22K / year" },
      { name: "Mentari Intercultural School", slug: "mentari-intercultural-school-jakarta", meta: "IB · Ages 3–18 · Kebayoran Baru", feeRange: "US$5.6K – $14K / year" },
      { name: "BTB School", slug: "btb-school", meta: "IB · Ages 3–18 · Pluit", feeRange: "US$7.4K – $26K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "IB World Schools in Jakarta: The Complete Guide", slug: "ib-world-schools-jakarta-guide", readTime: "10 min read" },
    ],
  },

  jsonLd: {
    description: "Catholic co-educational IB World School established in 1994 offering full IB continuum (PYP, MYP, DP). Two campuses in West Jakarta.",
    foundingDate: "1994",
    numberOfStudents: "800",
  },
};

// ═══════════════════════════════════════════════════════
// BTB SCHOOL (BINA TUNAS BANGSA)
// ═══════════════════════════════════════════════════════

const btb: SchoolProfile = {
  slug: "btb-school",
  citySlug: "jakarta",
  name: "BTB School",
  shortName: "BTB",
  verified: false,

  metaTitle: "BTB School Jakarta (Bina Tunas Bangsa) — Fees, IB Results & Review",
  metaDescription:
    "BTB School profile — fees from US$7.4K–US$26K/year, IB World School since 2005, Pluit campus, 700+ students. Well-established IB school in North Jakarta. Editorial review.",

  campuses: [
    {
      name: "Pluit Campus",
      address: "Jl. Pluit Timur Blok MM, Pluit, Jakarta Utara",
      grades: "Early Years – Grade 12",
      lat: -6.1208,
      lng: 106.7897,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["IB PYP", "IGCSEs", "IB DP"],
  stats: [
    { value: "700+", label: "Students" },
    { value: "3–18", label: "Age Range" },
    { value: "20+", label: "Nationalities" },
    { value: "US$7.4K – US$26K", label: "Annual Fees" },
  ],

  head: {
    name: "Ronald Jimenez",
    since: 2020,
    bio: "Ronald Jimenez is Executive Principal at BTB School. The school is an IB World School with strong performance in IGCSE (Cambridge) and IB Diploma; majority of graduates enter Top 100 global universities.",
  },

  photoAlts: [
    "BTB School Pluit campus",
    "IB classroom learning",
    "Campus facilities",
    "Student activities",
  ],

  intelligence: {
    verdict:
      "If you're in North Jakarta and want IB education with a focus on character development, BTB is a solid option. The Pluit location suits families in the area, and the school has been running long enough to have credibility.",
    paragraphs: [
      "The word among expat families is that BTB School (formerly Bina Tunas Bangsa) is North Jakarta's established IB option. Authorised as an IB World School since 2005, it's been running long enough to have credibility. The Pluit location suits families in North Jakarta who don't want to commute to South Jakarta schools.",
      "What comes up again and again is the character development focus. BTB emphasises values education alongside academic achievement - parents say the school culture takes character seriously. The curriculum combines IB PYP, IGCSEs, and IB Diploma - a pathway that gives students internationally recognised qualifications at multiple stages.",
      "Fees run US$7.4K to US$26K - mid-range, making it accessible to self-funding families. The Pluit location is convenient for families already in North Jakarta, but if you're in South Jakarta or central Jakarta, you're looking at a long commute. The school doesn't publish detailed results or fee schedules publicly - you'll need to contact admissions directly.",
    ],
    positives: [
      "IB World School since 2005 - been running long enough to have credibility and an established approach to IB education.",
      "Pluit location suits families in North Jakarta who don't want to commute to South Jakarta schools.",
      "Dual curriculum pathway - IB PYP, IGCSEs, and IB Diploma - gives students internationally recognised qualifications at multiple stages.",
      "Fees at US$7.4K to US$26K are mid-range, making it accessible to self-funding families who want IB without premium prices.",
      "Character development focus - parents say the school culture takes values education seriously alongside academic achievement.",
    ],
    considerations: [
      "Pluit is in North Jakarta. If you're in South Jakarta or central Jakarta, you're looking at a long commute. Traffic can be heavy.",
      "The school doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as competitors. You'll need to contact admissions directly for specifics.",
      "At 700 students, extracurricular options are more limited than the bigger schools. Fewer sporting teams, fewer clubs, and narrower social circles.",
      "IB Diploma results aren't publicly available. If you're targeting top-tier universities, ask about individual results and university placements.",
      "The school's character development focus means values education is woven into daily life - make sure this aligns with your family's values.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Early Years (Ages 3–5)", ages: "3–5 years", tuition: 100_000_000, capital: 0, totalEarlyBird: 100_000_000, totalStandard: 100_000_000 },
      { gradeLevel: "Primary IB PYP (Grades 1–5)", ages: "5–11 years", tuition: 180_000_000, capital: 0, totalEarlyBird: 180_000_000, totalStandard: 180_000_000 },
      { gradeLevel: "Middle School IGCSE (Grades 6–10)", ages: "11–15 years", tuition: 250_000_000, capital: 0, totalEarlyBird: 250_000_000, totalStandard: 250_000_000 },
      { gradeLevel: "High School IB DP (Grades 11–12)", ages: "15–18 years", tuition: 350_000_000, capital: 0, totalEarlyBird: 350_000_000, totalStandard: 350_000_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 3_500_000 },
      { name: "Enrolment Fee", amount: 18_000_000, note: "One-time, new students" },
    ],
    note: "Fee ranges shown are approximate annual tuition. BTB School does not publish detailed fee schedules publicly. Contact admissions for the current 2025–2026 fee schedule including all one-time fees and payment options.",
  },

  academics: {
    results: [
      { value: "Top 100", label: "Graduate university placement (global)" },
      { value: "High", label: "IGCSE and IB DP performance" },
    ],
    paragraphs: [
      "BTB School offers IB Primary Years Programme (PYP) from early years through Grade 5, IGCSE qualifications in middle school (Grades 6–10), and IB Diploma Programme in high school (Grades 11–12). The school is authorised as an IB World School.",
      "The dual curriculum pathway gives students internationally recognised qualifications at multiple stages - IGCSEs in middle school before the IB Diploma. The school emphasises character development alongside academic achievement.",
      "Detailed IB Diploma results and university destination data are not publicly available. Parents should ask admissions directly for current exam results and university placements.",
    ],
  },

  studentBody: {
    paragraphs: [
      "BTB serves 700+ students from 20+ nationalities. The school's character development focus means values education is central to the community. The student body includes both expat and Indonesian families.",
      "The community atmosphere reflects the school's size and values focus. Parents say the school culture takes character development seriously, and the Pluit location creates a neighbourhood feel.",
    ],
    inspection: {
      date: "Recent",
      body: "IB World School",
      rating: "Accredited",
      findings: "BTB School is an IB World School. Strong performance in IGCSE and IB Diploma; majority of graduates enter Top 100 global universities.",
    },
  },

  schoolLife: {
    activitiesCount: 35,
    uniformRequired: true,
    facilities: [
      "Library",
      "Science laboratories",
      "Computer labs",
      "Art studios",
      "Music rooms",
      "Sports facilities",
      "Multi-purpose halls",
    ],
    paragraphs: [
      "BTB runs a range of co-curricular activities with a focus on character development and service learning. The school's values focus is reflected in activities like community service initiatives.",
      "Sports and arts programmes are available. The school participates in local competitions and community events. The emphasis is on holistic development - academic achievement alongside character and values.",
      "The school's character development approach extends to its activities - the emphasis is on service, community engagement, and values education alongside academic and sporting achievement.",
    ],
  },

  contact: {
    phone: "+62 21 3003 1300",
    email: "info@btbschool.sch.id",
    website: "https://www.btbschool.sch.id",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "c. 2000" },
      { label: "Type", value: "For-profit, Co-ed" },
      { label: "Curriculum", value: "IB PYP + IGCSE + IB DP" },
      { label: "Students", value: "700+" },
      { label: "Ages", value: "3–18" },
      { label: "Nationalities", value: "20+" },
      { label: "IB Authorised", value: "Since 2005" },
      { label: "Fees", value: "US$7.4K – $26K" },
    ],
    otherSchools: [
      { name: "Tunas Muda School", slug: "tunas-muda-school", meta: "IB · Ages 1–18 · Meruya", feeRange: "US$6.9K – $27K / year" },
      { name: "North Jakarta Intercultural School", slug: "north-jakarta-intercultural-school", meta: "IB · Ages 3–18 · Kelapa Gading", feeRange: "US$6.1K – $16K / year" },
      { name: "Jakarta Intercultural School", slug: "jakarta-intercultural-school", meta: "IB + AP · Ages 3–18 · Cilandak", feeRange: "US$23K – $37K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "IB World Schools in Jakarta: The Complete Guide", slug: "ib-world-schools-jakarta-guide", readTime: "10 min read" },
    ],
  },

  jsonLd: {
    description: "Co-educational IB World School established c. 2000, authorised since 2005. Offers IB PYP, IGCSEs and IB Diploma Programme. Located in Pluit, North Jakarta.",
    foundingDate: "2000",
    numberOfStudents: "700",
  },
};

// ═══════════════════════════════════════════════════════
// SEKOLAH PELITA HARAPAN KEMANG VILLAGE
// ═══════════════════════════════════════════════════════

const sphKemang: SchoolProfile = {
  slug: "sekolah-pelita-harapan-kemang-village",
  citySlug: "jakarta",
  name: "Sekolah Pelita Harapan Kemang Village",
  shortName: "SPH Kemang",
  verified: false,

  metaTitle: "Sekolah Pelita Harapan Kemang Village — Fees, IB Results & Review",
  metaDescription:
    "SPH Kemang Village profile — fees from US$8.1K–US$26K/year, Cambridge + IB Diploma, Christian values, 800+ students. South Jakarta campus. Editorial review.",

  campuses: [
    {
      name: "Kemang Village Campus",
      address: "Kemang Village, South Jakarta",
      grades: "Kindergarten – Grade 12",
      lat: -6.2620,
      lng: 106.7960,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["Cambridge Primary", "IGCSEs", "IB Diploma", "Christian Education"],
  stats: [
    { value: "800+", label: "Students" },
    { value: "2–18", label: "Age Range" },
    { value: "20+", label: "Nationalities" },
    { value: "US$8.1K – US$26K", label: "Annual Fees" },
  ],

  head: {
    name: "Dale Wood",
    since: 2025,
    bio: "Dale Wood joined as Head of School for the 2025/26 year. SPH Kemang Village is accredited by WASC and ACSI; part of the SPH group with IB average typically 33–34.",
  },

  photoAlts: [
    "SPH Kemang Village campus",
    "Modern learning facilities",
    "Chapel and auditorium",
    "Student activities",
  ],

  intelligence: {
    verdict:
      "If you want strong academics with a genuine Christian foundation and you're in South Jakarta, SPH Kemang is worth a look. The Kemang Village location is convenient, and the Cambridge-to-IB pathway is well-established.",
    paragraphs: [
      "The word among expat families is that SPH Kemang Village is the school for families who want strong academics with a genuine Christian foundation. Located in Kemang Village since 2010, it's more accessible than SPH's Lippo Village campus for families in South Jakarta. The curriculum combines Cambridge Primary and IGCSEs with IB Diploma in high school.",
      "What comes up again and again is the Christian values. Parents say the faith-based approach creates a sense of belonging that secular schools can't match. Chapel services, Bible study, and Christian character education are woven into daily life. The flip side is that if you're not Christian or comfortable with faith being central, this isn't the school for you.",
      "Fees run US$8.1K to US$26K - mid-range, making it accessible to self-funding families. The Kemang Village location is convenient for families already in South Jakarta. The Cambridge-to-IB pathway is well-established, and parents say the academic standards are strong. Just know that faith is central to everything - if that's not your thing, look elsewhere.",
    ],
    positives: [
      "Kemang Village location in South Jakarta is convenient for families already in the area. More accessible than SPH's Lippo Village campus.",
      "Cambridge Primary and IGCSEs in middle school, then IB Diploma in high school - a well-established pathway that gives students internationally recognised qualifications at multiple stages.",
      "Christian values integrated throughout the curriculum - suits families who want faith-based education alongside strong academics.",
      "Fees at US$8.1K to US$26K are mid-range, making it accessible to self-funding families who want Christian values without premium prices.",
      "Founded in 2010, the campus has been running long enough to have credibility and an established approach to education.",
    ],
    considerations: [
      "Faith is central to everything. Chapel services, Bible study, and Christian values are woven into daily life. If that's not your thing, this isn't the school for you.",
      "The student body is predominantly Indonesian Christian families. The expat community is smaller than at JIS or BSJ. If you want a more international mix, this might not fit.",
      "IB Diploma results aren't publicly available. If you're targeting top-tier universities, ask about individual results and university placements.",
      "The school doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as competitors. You'll need to contact admissions directly for specifics.",
      "At 800 students, extracurricular options are more limited than the bigger schools. Fewer sporting teams, fewer clubs, and narrower social circles.",
    ],
  },

  fees: {
    academicYear: "2026–2027",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Early Childhood (Ages 2–5)", ages: "2–5 years", tuition: 50_000_000, capital: 17_000_000, totalEarlyBird: 67_000_000, totalStandard: 67_000_000 },
      { gradeLevel: "Primary Cambridge (Grades 1–6)", ages: "5–11 years", tuition: 200_000_000, capital: 68_000_000, totalEarlyBird: 268_000_000, totalStandard: 268_000_000 },
      { gradeLevel: "Middle School IGCSE (Grades 7–10)", ages: "11–15 years", tuition: 280_000_000, capital: 0, totalEarlyBird: 280_000_000, totalStandard: 280_000_000 },
      { gradeLevel: "High School IB DP (Grades 11–12)", ages: "15–18 years", tuition: 384_000_000, capital: 17_000_000, totalEarlyBird: 401_000_000, totalStandard: 401_000_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 2_000_000, note: "Non-refundable" },
      { name: "Application Fee (Sibling)", amount: 1_000_000, note: "Non-refundable" },
      { name: "Annual Development Fee (DPP)", amount: 17_000_000, note: "One-time, varies by grade level" },
    ],
    note: "Fee structure includes Annual Development Fee (DPP) which is a one-time payment, and Annual Tuition Fee (SPP). Multi-year DPP discounts available. Tuition covers field trips, retreats, learning support, lab equipment, art supplies, and extracurricular activities. Contact admissions for the detailed 2026–2027 fee schedule.",
  },

  academics: {
    results: [
      { value: "33–34", label: "IB Average (SPH group typical)" },
      { value: "Above global avg", label: "IB performance" },
    ],
    paragraphs: [
      "SPH Kemang Village offers Cambridge Primary from early childhood through Grade 6, Cambridge IGCSEs in middle school (Grades 7–10), and IB Diploma Programme in high school (Grades 11–12). The school integrates Christian values throughout the curriculum.",
      "The Cambridge-to-IB pathway gives students internationally recognised qualifications at multiple stages - IGCSEs in middle school before the IB Diploma. The school emphasises academic excellence alongside character development.",
      "Detailed IB Diploma results and university destination data are not publicly available. Parents should ask admissions directly for current exam results and university placements.",
    ],
  },

  studentBody: {
    paragraphs: [
      "SPH Kemang Village serves 800+ students from 20+ nationalities. The school's Christian identity is central - families choose SPH Kemang specifically for the faith-based values alongside strong academics.",
      "The community atmosphere reflects the school's values focus. Parents say the Christian values create a sense of belonging, and the school culture takes character development seriously alongside academic achievement.",
    ],
    inspection: {
      date: "Recent",
      body: "WASC / ACSI",
      rating: "Accredited",
      findings: "SPH Kemang Village is accredited by WASC and ACSI. Part of the SPH group; IB average typically 33–34.",
    },
  },

  schoolLife: {
    activitiesCount: 50,
    uniformRequired: true,
    facilities: [
      "Chapel",
      "Auditorium",
      "Library",
      "Science laboratories",
      "Computer labs",
      "Art studios",
      "Music rooms",
      "Sports facilities",
      "Multi-purpose halls",
    ],
    paragraphs: [
      "SPH Kemang Village runs a range of co-curricular activities with a focus on service learning and character development. The school's Christian identity is reflected in activities like chapel services and community service initiatives.",
      "Sports and arts programmes are available. The school participates in local competitions and community events. The emphasis is on holistic development - academic achievement alongside character and values.",
      "The school's faith-based approach extends to its activities - the emphasis is on service, community engagement, and values education alongside academic and sporting achievement.",
    ],
  },

  contact: {
    phone: "+62 21 2905 6789",
    email: "damar.wirastomo@sph.ac.id",
    website: "https://www.sph.edu",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "2010" },
      { label: "Type", value: "Non-profit (Christian), Co-ed" },
      { label: "Curriculum", value: "Cambridge + IB DP" },
      { label: "Students", value: "800+" },
      { label: "Ages", value: "2–18" },
      { label: "Nationalities", value: "20+" },
      { label: "Accreditation", value: "ACSI / IBO" },
      { label: "Fees", value: "US$8.1K – $26K" },
    ],
    otherSchools: [
      { name: "Sekolah Pelita Harapan", slug: "sekolah-pelita-harapan", meta: "IB · Ages 4–18 · Lippo Village", feeRange: "US$7.2K – $22K / year" },
      { name: "Mentari Intercultural School", slug: "mentari-intercultural-school-jakarta", meta: "IB · Ages 3–18 · Kebayoran Baru", feeRange: "US$5.6K – $14K / year" },
      { name: "Jakarta Intercultural School", slug: "jakarta-intercultural-school", meta: "IB + AP · Ages 3–18 · Cilandak", feeRange: "US$23K – $37K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "Faith-Based International Schools: What Parents Need to Know", slug: "faith-based-international-schools", readTime: "6 min read" },
    ],
  },

  jsonLd: {
    description: "Christian co-educational international school established in 2010 offering Cambridge Primary, IGCSEs and IB Diploma Programme. Located in Kemang Village, South Jakarta.",
    foundingDate: "2010",
    numberOfStudents: "800",
  },
};

// ═══════════════════════════════════════════════════════
// NORD ANGLIA SCHOOL JAKARTA
// ═══════════════════════════════════════════════════════

const nordAnglia: SchoolProfile = {
  slug: "nord-anglia-school-jakarta",
  citySlug: "jakarta",
  name: "Nord Anglia School Jakarta",
  shortName: "NAS Jakarta",
  verified: false,

  metaTitle: "Nord Anglia School Jakarta (NAS) — Fees, British Curriculum & Review",
  metaDescription:
    "Nord Anglia School Jakarta profile — fees from US$7.2K–US$22K/year, British curriculum + IPC, 400+ students, ages 18 months–12 years. Part of Nord Anglia Education. Editorial review.",

  campuses: [
    {
      name: "Jakarta Campus",
      address: "South Jakarta",
      grades: "Early Years – Year 6",
      lat: -6.2620,
      lng: 106.7960,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["British Curriculum", "International Primary Curriculum"],
  stats: [
    { value: "400+", label: "Students" },
    { value: "18 months–12", label: "Age Range" },
    { value: "30+", label: "Nationalities" },
    { value: "US$7.2K – US$22K", label: "Annual Fees" },
  ],

  head: {
    name: "Rosy Clark",
    since: 2020,
    bio: "Rosy Clark is Principal at Nord Anglia School Jakarta. The school is a CIS Member and follows English National Curriculum standards with high performance.",
  },

  photoAlts: [
    "NAS Jakarta campus",
    "Early years learning",
    "Primary classroom",
    "Campus facilities",
  ],

  intelligence: {
    verdict:
      "If you want a well-run British primary school with genuine global connections and your child is under 12, NAS Jakarta is worth a look. The Nord Anglia brand brings resources and opportunities, but it's primary only - you'll need a secondary school plan.",
    paragraphs: [
      "The word among expat families is that NAS Jakarta is a well-run British primary school with genuine global connections. Part of Nord Anglia Education - a network of 80+ schools globally - it brings resources and opportunities that standalone schools can't match. The curriculum combines British National Curriculum with International Primary Curriculum (IPC), giving students a structured British foundation with an international perspective.",
      "What comes up again and again is the global connections. Nord Anglia's collaboration with MIT, Juilliard, and UNICEF means students get access to programmes and resources that standalone schools can't offer. Parents say the quality of teaching is strong, and the school culture values both academic achievement and personal development.",
      "The catch is that it's primary only - ages 18 months to 12 years. You'll need a secondary school plan, and you'll need to start thinking about it around Year 5 or 6. Fees run US$7.2K to US$22K - mid-range, making it accessible to self-funding families. The South Jakarta location is convenient, but if you're planning to stay long-term, factor in the secondary school transition.",
    ],
    positives: [
      "Part of Nord Anglia Education (80+ schools globally) brings resources and opportunities that standalone schools can't match - collaboration with MIT, Juilliard, and UNICEF.",
      "British National Curriculum combined with International Primary Curriculum (IPC) gives students a structured British foundation with an international perspective.",
      "Parents say the quality of teaching is strong, and the school culture values both academic achievement and personal development.",
      "Fees at US$7.2K to US$22K are mid-range, making it accessible to self-funding families who want British curriculum without premium prices.",
      "The South Jakarta location is convenient for families already in the area. The campus is modern and purpose-built.",
    ],
    considerations: [
      "Primary only - ages 18 months to 12 years. You'll need a secondary school plan, and you'll need to start thinking about it around Year 5 or 6.",
      "The school doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as competitors. You'll need to contact admissions directly for specifics.",
      "At 400 students, extracurricular options are more limited than the bigger schools. Fewer sporting teams, fewer clubs, and narrower social circles.",
      "The Nord Anglia brand brings resources but also corporate structure. Some parents prefer the independence of standalone schools.",
      "If you're planning to stay in Jakarta long-term, factor in the secondary school transition. Most families move to JIS, BSJ, or other secondary schools.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Early Years (18 months–5)", ages: "18 months–5 years", tuition: 116_284_000, capital: 0, totalEarlyBird: 116_284_000, totalStandard: 116_284_000 },
      { gradeLevel: "Primary (Years 1–6)", ages: "5–12 years", tuition: 280_000_000, capital: 0, totalEarlyBird: 280_000_000, totalStandard: 280_000_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 5_000_000 },
      { name: "Enrolment Fee", amount: 15_000_000, note: "One-time, new students" },
    ],
    note: "Fee ranges shown are approximate annual tuition. NAS Jakarta does not publish detailed fee schedules publicly. Contact admissions for the current 2025–2026 fee schedule including all one-time fees and payment options.",
  },

  academics: {
    results: [],
    paragraphs: [
      "NAS Jakarta offers British National Curriculum combined with International Primary Curriculum (IPC) from early years through Year 6. The British curriculum provides structured learning in core subjects, while IPC adds an international perspective and inquiry-based learning.",
      "The school emphasises both academic achievement and personal development. The Nord Anglia collaboration with MIT, Juilliard, and UNICEF provides additional resources and programmes that standalone schools can't offer.",
      "As a primary-only school, there are no external exam results to report. The focus is on building strong foundations for secondary education. Parents should ask about transition support and where graduates typically move on to.",
    ],
  },

  studentBody: {
    paragraphs: [
      "NAS Jakarta serves 400+ students from 30+ nationalities. The school's international identity is central - the student body is diverse, with a mix of expat and Indonesian families.",
      "The community atmosphere reflects the school's size and global connections. Parents say the Nord Anglia network creates opportunities for students to connect with peers globally, and the school culture values international-mindedness.",
    ],
    inspection: {
      date: "Recent",
      body: "CIS Member",
      rating: "English National Curriculum standards",
      findings: "Nord Anglia School Jakarta is a CIS Member and follows English National Curriculum standards. High performance in primary curriculum.",
    },
  },

  schoolLife: {
    activitiesCount: 30,
    uniformRequired: true,
    facilities: [
      "Modern classrooms",
      "Library",
      "Science laboratories",
      "Computer labs",
      "Art studios",
      "Music rooms",
      "Sports facilities",
      "Multi-purpose halls",
    ],
    paragraphs: [
      "NAS Jakarta runs a range of co-curricular activities with a focus on global connections and personal development. The Nord Anglia collaboration with MIT, Juilliard, and UNICEF provides additional programmes and resources.",
      "Sports and arts programmes are available. The school participates in Nord Anglia's global events and competitions, giving students opportunities to connect with peers internationally.",
      "The school's global identity extends to its activities - the emphasis is on international-mindedness, collaboration, and personal development alongside academic achievement.",
    ],
  },

  contact: {
    phone: "+62 21 2905 6789",
    email: "admissions@nasjakarta.sch.id",
    website: "https://www.nordangliaeducation.com/nas-jakarta",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "c. 2017" },
      { label: "Type", value: "For-profit (Nord Anglia), Co-ed" },
      { label: "Curriculum", value: "British + IPC" },
      { label: "Students", value: "400+" },
      { label: "Ages", value: "18 months–12" },
      { label: "Nationalities", value: "30+" },
      { label: "Network", value: "Nord Anglia (80+ schools)" },
      { label: "Fees", value: "US$7.2K – $22K" },
    ],
    otherSchools: [
      { name: "British School Jakarta", slug: "british-school-jakarta", meta: "British + IB · Ages 2–18 · Bintaro", feeRange: "US$9.2K – $30K / year" },
      { name: "The Independent School of Jakarta", slug: "independent-school-of-jakarta", meta: "British · Ages 2–13 (expanding to 18) · Pondok Pinang", feeRange: "US$9.2K – $30K / year" },
      { name: "ACG School Jakarta", slug: "acg-school-jakarta", meta: "IB · Ages 3–17 · Pasar Minggu", feeRange: "US$9.8K – $25K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "British Curriculum Schools in Southeast Asia", slug: "british-curriculum-schools-southeast-asia", readTime: "8 min read" },
    ],
  },

  jsonLd: {
    description: "Co-educational British international school established c. 2017, part of Nord Anglia Education. Offers British National Curriculum and IPC for ages 18 months–12 years.",
    foundingDate: "2017",
    numberOfStudents: "400",
  },
};

// ═══════════════════════════════════════════════════════
// NEW ZEALAND SCHOOL JAKARTA
// ═══════════════════════════════════════════════════════

const newZealandSchool: SchoolProfile = {
  slug: "new-zealand-school-jakarta",
  citySlug: "jakarta",
  name: "New Zealand School Jakarta",
  shortName: "NZSJ",
  verified: false,

  metaTitle: "New Zealand School Jakarta (NZSJ) — Fees, NZ Curriculum & Review",
  metaDescription:
    "New Zealand School Jakarta profile — fees from US$6.9K–US$22K/year, New Zealand curriculum, 300+ students, wellbeing focus. Small, nurturing school. Editorial review.",

  campuses: [
    {
      name: "South Jakarta Campus",
      address: "South Jakarta",
      grades: "Preschool – Grade 12",
      lat: -6.2620,
      lng: 106.7960,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["New Zealand Curriculum", "Te Whariki", "British Curriculum"],
  stats: [
    { value: "300+", label: "Students" },
    { value: "1–18", label: "Age Range" },
    { value: "25+", label: "Nationalities" },
    { value: "US$6.9K – US$22K", label: "Annual Fees" },
  ],

  head: {
    name: "Tim Maitland",
    since: 2020,
    bio: "Tim Maitland is Head of School at New Zealand School Jakarta. The school follows NZ Curriculum standards and reports high literacy and numeracy growth compared to international norms.",
  },

  photoAlts: [
    "NZSJ campus",
    "Play-based learning",
    "Inquiry-based classroom",
    "Campus facilities",
  ],

  intelligence: {
    verdict:
      "If you want a small, nurturing school with a genuine focus on wellbeing and your family has ties to New Zealand, NZSJ is worth a look. The New Zealand curriculum is different from British or IB - make sure it aligns with your plans.",
    paragraphs: [
      "The word among expat families is that NZSJ is a hidden gem for families who want a small, nurturing school with a genuine focus on wellbeing. Founded to serve the New Zealand community in Jakarta, it's grown to welcome families from all backgrounds. At 300 students, it's small enough that teachers know every child, and parents say the school culture values wellbeing alongside academic achievement.",
      "What comes up again and again is the New Zealand approach. The curriculum follows New Zealand's national curriculum with Te Whariki in early years - a play-based, inquiry-focused approach that's different from the structured British or IB models. Parents say the school culture is less pressured, more holistic, and genuinely focused on children's wellbeing. The flip side is that if you're planning to move to the UK or want British qualifications, the New Zealand curriculum might not align.",
      "Fees run US$6.9K to US$22K - mid-range, making it accessible to self-funding families. The South Jakarta location is convenient. The school serves ages 1-18, so families can stay through high school. Just know that the New Zealand curriculum is different - if you're targeting UK universities or want IGCSEs/A-Levels, this might not be the right fit.",
    ],
    positives: [
      "At 300 students, NZSJ is small enough that teachers know every child. Parents say the school culture values wellbeing alongside academic achievement.",
      "New Zealand curriculum with Te Whariki in early years - a play-based, inquiry-focused approach that's less pressured than structured British or IB models.",
      "Fees at US$6.9K to US$22K are mid-range, making it accessible to self-funding families who want a nurturing environment without premium prices.",
      "The school serves ages 1-18, so families can stay through high school without needing to transition.",
      "The South Jakarta location is convenient for families already in the area. The campus is modern and purpose-built.",
    ],
    considerations: [
      "The New Zealand curriculum is different from British or IB. If you're planning to move to the UK or want IGCSEs/A-Levels, this might not align with your plans.",
      "At 300 students, extracurricular options are limited. Fewer sporting teams, fewer clubs, and narrower social circles.",
      "The school doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as competitors. You'll need to contact admissions directly for specifics.",
      "New Zealand qualifications (NCEA) are recognised internationally but less familiar than IB or British qualifications in some markets.",
      "The school's wellbeing focus means less academic pressure - suits some families but not others who want more rigour.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Pre-School (Half Day)", ages: "3–4 years", tuition: 70_700_000, capital: 0, totalEarlyBird: 70_700_000, totalStandard: 70_700_000 },
      { gradeLevel: "Pre-School (Full Day)", ages: "3–4 years", tuition: 112_300_000, capital: 0, totalEarlyBird: 112_300_000, totalStandard: 112_300_000 },
      { gradeLevel: "Kindergarten", ages: "4–5 years", tuition: 123_600_000, capital: 0, totalEarlyBird: 123_600_000, totalStandard: 123_600_000 },
      { gradeLevel: "Primary (Grades 1–6)", ages: "5–11 years", tuition: 273_900_000, capital: 0, totalEarlyBird: 273_900_000, totalStandard: 273_900_000 },
      { gradeLevel: "Secondary (Grades 7–12)", ages: "11–18 years", tuition: 289_800_000, capital: 0, totalEarlyBird: 289_800_000, totalStandard: 289_800_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 3_000_000 },
      { name: "Enrolment Fee", amount: 12_000_000, note: "One-time, new students" },
    ],
    note: "Fee ranges shown are approximate annual tuition. Payment plans available: Annual, Half-Year, or Termly. Additional fees apply for buses, catering, uniforms, and activities. Contact admissions for the detailed 2025–2026 fee schedule.",
  },

  academics: {
    results: [
      { value: "High", label: "Literacy/numeracy growth vs NZ norms" },
      { value: "Progress-based", label: "NZ National Standards" },
    ],
    paragraphs: [
      "NZSJ offers New Zealand Curriculum (NZC) from primary through secondary, with Te Whariki in early years. The curriculum emphasises inquiry-based learning, critical thinking, and holistic development. The approach is less structured than British or IB models, focusing on wellbeing alongside academic achievement.",
      "The school serves Preschool through Grade 12, including Pre-University (Grades 11–12). Students follow New Zealand's national curriculum, which is recognised internationally but less familiar than IB or British qualifications in some markets.",
      "As a small school, NZSJ doesn't publish detailed exam results publicly. The focus is on holistic development and wellbeing rather than competitive academic achievement. Parents should ask about university placements and where graduates typically go.",
    ],
  },

  studentBody: {
    paragraphs: [
      "NZSJ serves 300+ students from 25+ nationalities. The school was founded to serve the New Zealand community but has grown to welcome families from all backgrounds. The small size creates a close-knit community.",
      "The community atmosphere reflects the school's size and values. Parents say the school culture is less pressured, more holistic, and genuinely focused on children's wellbeing. The New Zealand identity is central - families choose NZSJ specifically for the curriculum and approach.",
    ],
    inspection: {
      date: "2025/26",
      body: "NZ Curriculum",
      rating: "93% audit (2025/26)",
      findings: "New Zealand School Jakarta follows NZ Curriculum standards. High literacy and numeracy growth compared to international norms.",
    },
  },

  schoolLife: {
    activitiesCount: 25,
    uniformRequired: true,
    facilities: [
      "Library",
      "Science laboratories",
      "Computer labs",
      "Art studios",
      "Music rooms",
      "Sports facilities",
      "Multi-purpose halls",
    ],
    paragraphs: [
      "NZSJ runs a range of co-curricular activities with a focus on wellbeing and holistic development. The school's New Zealand identity is reflected in activities that emphasise play, inquiry, and personal growth.",
      "Sports and arts programmes are available. The school participates in local competitions and community events. The emphasis is on participation and enjoyment rather than elite competition.",
      "The school's wellbeing focus extends to its activities - the emphasis is on personal development, community engagement, and holistic growth alongside academic achievement.",
    ],
  },

  contact: {
    phone: "+62 21 2905 6789",
    email: "admissions@nzsj.sch.id",
    website: "https://www.nzsj.sch.id",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "c. 2000" },
      { label: "Type", value: "For-profit, Co-ed" },
      { label: "Curriculum", value: "New Zealand + Te Whariki" },
      { label: "Students", value: "300+" },
      { label: "Ages", value: "1–18" },
      { label: "Nationalities", value: "25+" },
      { label: "Accreditation", value: "New Zealand Curriculum" },
      { label: "Fees", value: "US$6.9K – $22K" },
    ],
    otherSchools: [
      { name: "Australian Independent School", slug: "australian-independent-school-jakarta", meta: "Australian + IB · Ages 3–18 · Pejaten", feeRange: "US$9.3K – $27K / year" },
      { name: "British School Jakarta", slug: "british-school-jakarta", meta: "British + IB · Ages 2–18 · Bintaro", feeRange: "US$9.2K – $30K / year" },
      { name: "Mentari Intercultural School", slug: "mentari-intercultural-school-jakarta", meta: "IB · Ages 3–18 · Kebayoran Baru", feeRange: "US$5.6K – $14K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "Alternative Curricula: New Zealand and Australian Schools", slug: "alternative-curricula-schools", readTime: "7 min read" },
    ],
  },

  jsonLd: {
    description: "Co-educational international school offering New Zealand Curriculum and Te Whariki. Small, nurturing school with focus on wellbeing. Ages 1–18.",
    foundingDate: "2000",
    numberOfStudents: "300",
  },
};

// ═══════════════════════════════════════════════════════
// JAKARTA NANYANG SCHOOL
// ═══════════════════════════════════════════════════════

const jakartaNanyang: SchoolProfile = {
  slug: "jakarta-nanyang-school",
  citySlug: "jakarta",
  name: "Jakarta Nanyang School",
  shortName: "JNY",
  verified: false,

  metaTitle: "Jakarta Nanyang School — Fees, Cambridge Results & Review",
  metaDescription:
    "Jakarta Nanyang School profile — fees from US$7.2K–US$22K/year, Cambridge curriculum, trilingual instruction (English/Mandarin/Indonesian), 700+ students. Singapore-style education. Editorial review.",

  campuses: [
    {
      name: "BSD City Campus",
      address: "Jl. Sekolah Foresta No. 1, Foresta, BSD City, Tangerang Selatan",
      grades: "Kindergarten – Year 13",
      lat: -6.3014,
      lng: 106.6528,
    },
  ],
  lastUpdated: "February 2026",
  curricula: ["Cambridge Primary", "IGCSEs", "A-Levels"],
  stats: [
    { value: "700+", label: "Students" },
    { value: "3–18", label: "Age Range" },
    { value: "20+", label: "Nationalities" },
    { value: "US$7.2K – US$22K", label: "Annual Fees" },
  ],

  head: {
    name: "Eileen Fisher",
    since: 2020,
    bio: "Eileen Fisher is Academic Director and Head of School at Jakarta Nanyang School. The school is accredited by Cambridge (CAIE). 100% of Junior College 2 students matriculate to universities, with strong STEM placements in the UK and Singapore.",
  },

  photoAlts: [
    "Jakarta Nanyang School campus",
    "Trilingual classroom",
    "Cambridge learning",
    "Campus facilities",
  ],

  intelligence: {
    verdict:
      "If you want Singapore-style rigour with genuine trilingual instruction and you're in BSD City, Jakarta Nanyang is worth a look. The Cambridge pathway is well-established, and the Mandarin focus appeals to families who value Chinese language.",
    paragraphs: [
      "The word among expat families is that Jakarta Nanyang appeals to families wanting a Singapore-style education with genuine trilingual instruction. Part of the Nanyang Family of Schools, it brings Singapore's academic rigour and discipline. The curriculum follows Cambridge from primary through A-Levels - a structured pathway that gives students internationally recognised qualifications at every stage.",
      "What comes up again and again is the trilingual approach. English is the medium of instruction for core subjects, but all students learn Mandarin Chinese and Bahasa Indonesia. Parents say the Mandarin instruction is serious - students can sit for Cambridge IGCSE Mandarin or HSK exams. If you value Chinese language and culture, this is one of the few schools in Jakarta that delivers.",
      "The BSD City location suits families already in the area or planning to live there. Fees run US$7.2K to US$22K - mid-range, making it accessible to self-funding families. The catch is that Singapore-style rigour means high expectations and structured learning. If your child thrives under pressure and wants academic challenge, Jakarta Nanyang delivers. If they need more support or balance, look elsewhere.",
    ],
    positives: [
      "Genuine trilingual instruction - English for core subjects, plus serious Mandarin Chinese and Bahasa Indonesia. Students can sit for Cambridge IGCSE Mandarin or HSK exams.",
      "Singapore-style academic rigour and discipline - appeals to families who want structured learning and high expectations.",
      "Cambridge pathway from primary through A-Levels - gives students internationally recognised qualifications at every stage.",
      "Fees at US$7.2K to US$22K are mid-range, making it accessible to self-funding families who want Singapore-style education without premium prices.",
      "Part of the Nanyang Family of Schools brings resources and credibility. The BSD City campus is modern and purpose-built.",
    ],
    considerations: [
      "Singapore-style rigour means high expectations and structured learning. If your child needs more support or balance, this might not be the right fit.",
      "BSD City is in South Tangerang, well south of central Jakarta. If you're in Menteng, Kuningan, or Kemang, you're looking at 60-90 minutes each way during rush hour.",
      "The school doesn't publish detailed fee schedules, exam results, or leadership team profiles as openly as competitors. You'll need to contact admissions directly for specifics.",
      "At 700 students, extracurricular options are more limited than the bigger schools. Fewer sporting teams, fewer clubs, and narrower social circles.",
      "The trilingual approach means significant time spent on languages. If you don't value Mandarin instruction, this might not be the best use of your child's time.",
    ],
  },

  fees: {
    academicYear: "2025–2026",
    feeCurrency: "IDR",
    rows: [
      { gradeLevel: "Kindergarten (Ages 3–5)", ages: "3–5 years", tuition: 100_000_000, capital: 0, totalEarlyBird: 100_000_000, totalStandard: 100_000_000 },
      { gradeLevel: "Primary Cambridge (Years 1–6)", ages: "5–11 years", tuition: 180_000_000, capital: 0, totalEarlyBird: 180_000_000, totalStandard: 180_000_000 },
      { gradeLevel: "Lower Secondary IGCSE (Years 7–10)", ages: "11–15 years", tuition: 250_000_000, capital: 0, totalEarlyBird: 250_000_000, totalStandard: 250_000_000 },
      { gradeLevel: "A-Levels (Years 11–13)", ages: "15–18 years", tuition: 320_000_000, capital: 0, totalEarlyBird: 320_000_000, totalStandard: 320_000_000 },
    ],
    oneTime: [
      { name: "Application Fee", amount: 3_000_000 },
      { name: "Enrolment Fee", amount: 15_000_000, note: "One-time, new students" },
    ],
    note: "Fee ranges shown are approximate annual tuition. Jakarta Nanyang School does not publish detailed fee schedules publicly. Contact admissions for the current 2025–2026 fee schedule including all one-time fees and payment options.",
  },

  academics: {
    results: [
      { value: "100%", label: "JC2 university matriculation" },
      { value: "Strong", label: "STEM placements (UK, Singapore)" },
    ],
    paragraphs: [
      "Jakarta Nanyang School offers Cambridge Primary from kindergarten through Year 6, Cambridge IGCSEs in Years 7–10, and Cambridge A-Levels in Years 11–13. The curriculum follows Singapore's academic rigour and discipline.",
      "The trilingual approach means English is the medium of instruction for core subjects (Mathematics, Sciences, Humanities), while all students learn Mandarin Chinese and Bahasa Indonesia. Students can sit for Cambridge IGCSE Mandarin or HSK (Chinese proficiency test) exams.",
      "Detailed A-Level results and university destination data are not publicly available. Parents should ask admissions directly for current exam results and university placements.",
    ],
  },

  studentBody: {
    paragraphs: [
      "Jakarta Nanyang serves 700+ students from 20+ nationalities. The school's trilingual identity is central - families choose Jakarta Nanyang specifically for the Mandarin instruction and Singapore-style education.",
      "The community atmosphere reflects the school's academic focus and trilingual approach. Parents say the Singapore-style rigour creates high expectations, and the school culture values discipline and achievement.",
    ],
    inspection: {
      date: "Recent",
      body: "Cambridge (CAIE)",
      rating: "Accredited",
      findings: "Jakarta Nanyang School is accredited by Cambridge Assessment International Education. 100% of Junior College 2 students matriculate to universities; strong STEM placements in the UK and Singapore.",
    },
  },

  schoolLife: {
    activitiesCount: 35,
    uniformRequired: true,
    facilities: [
      "Library",
      "Science laboratories",
      "Computer labs",
      "Language labs",
      "Art studios",
      "Music rooms",
      "Sports facilities",
      "Multi-purpose halls",
    ],
    paragraphs: [
      "Jakarta Nanyang runs a range of co-curricular activities with a focus on academic enrichment and language development. The school's trilingual identity is reflected in activities that emphasise Mandarin and Chinese culture.",
      "Sports and arts programmes are available. The school participates in local competitions and community events. The emphasis is on academic achievement and language proficiency.",
      "The school's Singapore-style approach extends to its activities - the emphasis is on discipline, achievement, and academic excellence alongside personal development.",
    ],
  },

  contact: {
    phone: "+62 21 5316 1400",
    email: "admissions@jakartananyang.sch.id",
    website: "https://www.jakartananyang.sch.id",
  },

  sidebar: {
    quickFacts: [
      { label: "Founded", value: "2012" },
      { label: "Type", value: "For-profit, Co-ed" },
      { label: "Curriculum", value: "Cambridge (Primary–A-Levels)" },
      { label: "Students", value: "700+" },
      { label: "Ages", value: "3–18" },
      { label: "Nationalities", value: "20+" },
      { label: "Languages", value: "English/Mandarin/Indonesian" },
      { label: "Fees", value: "US$7.2K – $22K" },
    ],
    otherSchools: [
      { name: "Singapore Intercultural School South Jakarta", slug: "singapore-intercultural-school-south-jakarta", meta: "Singapore · Ages 2–17 · Bona Vista", feeRange: "US$2.4K – $15K / year" },
      { name: "ACS Jakarta", slug: "acs-jakarta", meta: "Cambridge + Singapore · Ages 3–18 · East Jakarta", feeRange: "US$15K – $20K / year" },
      { name: "Binus School Serpong", slug: "binus-school-serpong", meta: "Cambridge · Ages 3–17 · Serpong", feeRange: "US$6.2K – $22K / year" },
    ],
    relatedInsights: [
      { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      { title: "Trilingual Schools in Southeast Asia", slug: "trilingual-schools-southeast-asia", readTime: "8 min read" },
    ],
  },

  jsonLd: {
    description: "Co-educational international school established in 2012 offering Cambridge curriculum from primary through A-Levels. Trilingual instruction (English/Mandarin/Indonesian). Part of Nanyang Family of Schools.",
    foundingDate: "2012",
    numberOfStudents: "700",
  },
};

// ═══════════════════════════════════════════════════════
// MINIMAL PROFILES — for schools with listing data only
// ═══════════════════════════════════════════════════════

type CsvRow = { addressFull?: string; facilities?: string; nationalitiesCount?: string; foundedYear?: string };
const getCsvRow = (slug: string): CsvRow | undefined =>
  (JAKARTA_CSV_EXPORT as Record<string, CsvRow>)[slug];

function createMinimalProfile(L: JakartaSchoolListing): SchoolProfile {
  const highK = extractHighestFee(L.feeRange);
  const tuitionIDR = highK > 0 ? Math.round(highK * 1000 * EXCHANGE_RATE) : 100_000_000;
  const csv = getCsvRow(L.slug);
  const address = (csv?.addressFull || L.area).trim() || L.area;
  const facilitiesList =
    csv?.facilities?.split("|").map((s) => s.trim()).filter(Boolean) ?? [];
  return {
    slug: L.slug,
    citySlug: "jakarta",
    name: L.name,
    shortName: L.name.split(" ").slice(0, 2).join(" "),
    verified: L.verified,
    metaTitle: `${L.name} — Fees, Review & Contact`,
    metaDescription: `${L.name} (${L.area}). ${L.editorialSummary.slice(0, 140)}…`,
    campuses: [
      { name: "Main Campus", address, grades: L.ageRange, lat: -6.2, lng: 106.8 },
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
      feeCurrency: "IDR",
      rows: [
        {
          gradeLevel: "All grades",
          ages: L.ageRange,
          tuition: tuitionIDR,
          capital: 0,
          totalEarlyBird: tuitionIDR,
          totalStandard: tuitionIDR,
        },
      ],
      oneTime: [],
      note: L.feeRange === "Contact school" ? "Fees not publicly disclosed. Contact the school for current fee schedule." : `Approximate annual fee range: ${L.feeRange}. Contact the school for the full fee schedule and payment options.`,
    },
    academics: {
      results: L.examResults,
      paragraphs: L.examResults.length ? [`Key results: ${L.examResults.map((r) => `${r.label} ${r.value}`).join(", ")}.`] : [],
    },
    studentBody: { paragraphs: ["Diverse international and local student body. Contact the school for current enrolment details."] },
    schoolLife: {
      activitiesCount: facilitiesList.length > 0 ? Math.min(facilitiesList.length * 2, 50) : 0,
      uniformRequired: true,
      facilities: facilitiesList,
      paragraphs: facilitiesList.length > 0 ? ["Facilities include: " + facilitiesList.slice(0, 5).join(", ") + (facilitiesList.length > 5 ? "." : ".")] : ["Contact the school for details on co-curricular activities and facilities."],
    },
    contact: {
      phone: L.phone ?? "",
      email: L.email ?? "",
      website: L.website ?? "",
    },
    sidebar: {
      quickFacts: [
        { label: "Location", value: L.area },
        { label: "Curriculum", value: L.curricula.slice(0, 2).join(", ") },
        { label: "Students", value: L.studentCount },
        { label: "Ages", value: L.ageRange },
        ...(csv?.nationalitiesCount ? [{ label: "Nationalities", value: csv.nationalitiesCount + "+" }] : []),
        ...(csv?.foundedYear ? [{ label: "Founded", value: csv.foundedYear }] : []),
        { label: "Fees", value: L.feeRange },
      ],
      otherSchools: [],
      relatedInsights: [
        { title: "The Expat Guide to International Schools in Jakarta", slug: "expat-guide-jakarta-international-schools", readTime: "12 min read" },
      ],
    },
    jsonLd: {
      description: L.editorialSummary,
      foundingDate: csv?.foundedYear ?? "",
      numberOfStudents: L.studentCount,
    },
  };
}

const EXISTING_PROFILE_SLUGS = new Set([
  "jakarta-intercultural-school", "british-school-jakarta", "acg-school-jakarta",
  "independent-school-of-jakarta", "mentari-intercultural-school-jakarta",
  "australian-independent-school-jakarta", "sekolah-pelita-harapan",
  "global-jaya-school", "binus-school-serpong", "sinarmas-world-academy",
  "tunas-muda-school", "btb-school", "sekolah-pelita-harapan-kemang-village",
  "nord-anglia-school-jakarta", "new-zealand-school-jakarta", "jakarta-nanyang-school",
]);

const MINIMAL_PROFILES = JAKARTA_SCHOOLS
  .filter((s) => !EXISTING_PROFILE_SLUGS.has(s.slug))
  .map(createMinimalProfile);

const MINIMAL_PROFILES_MAP: Record<string, SchoolProfile> = Object.fromEntries(
  MINIMAL_PROFILES.map((p) => [p.slug, p])
);

// ═══════════════════════════════════════════════════════
// SCHOOL MAP — keyed by slug for O(1) lookup
// ═══════════════════════════════════════════════════════

export const SCHOOL_PROFILES: Record<string, SchoolProfile> = {
  "jakarta-intercultural-school": jis,
  "british-school-jakarta": bsj,
  "acg-school-jakarta": acg,
  "independent-school-of-jakarta": isj,
  "mentari-intercultural-school-jakarta": mentari,
  "australian-independent-school-jakarta": ais,
  "sekolah-pelita-harapan": sph,
  "global-jaya-school": globalJaya,
  "binus-school-serpong": binus,
  "sinarmas-world-academy": sinarmas,
  "tunas-muda-school": tunasMuda,
  "btb-school": btb,
  "sekolah-pelita-harapan-kemang-village": sphKemang,
  "nord-anglia-school-jakarta": nordAnglia,
  "new-zealand-school-jakarta": newZealandSchool,
  "jakarta-nanyang-school": jakartaNanyang,
  ...MINIMAL_PROFILES_MAP,
};

// All slugs for generateStaticParams
export const ALL_SCHOOL_SLUGS = Object.keys(SCHOOL_PROFILES);
