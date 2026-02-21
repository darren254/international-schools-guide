/**
 * Data for the Jakarta guide article tables.
 * Section 1: 7 schools popular with expats (with ages column).
 * Section 2: All 66 schools (article table). Slug used for profile links.
 */

export interface Section1Row {
  school: string;
  curriculum: string;
  ages: string;
  fees: string;
  location: string;
  slug: string | null;
}

export interface Section2Row {
  school: string;
  area: string;
  curriculum: string;
  fees: string;
  slug: string | null;
}

export const SECTION1_POPULAR_SCHOOLS: Section1Row[] = [
  { school: "Jakarta Intercultural School (JIS)", curriculum: "American / IB / AP", ages: "3–18", fees: "US$23K – US$37K", location: "South Jakarta", slug: "jakarta-intercultural-school" },
  { school: "British School Jakarta (BSJ)", curriculum: "British / IB Diploma", ages: "2–18", fees: "US$9.2K – US$30K", location: "Bintaro", slug: "british-school-jakarta" },
  { school: "The Independent School of Jakarta (ISJ)", curriculum: "British", ages: "2–13", fees: "US$9.2K – US$30K", location: "Pondok Indah", slug: "independent-school-of-jakarta" },
  { school: "Australian Independent School (AIS)", curriculum: "Australian / IB Diploma", ages: "3–18", fees: "US$9.3K – US$27K", location: "South Jakarta", slug: "australian-independent-school-jakarta" },
  { school: "Nord Anglia School Jakarta (NAS)", curriculum: "British / IPC", ages: "18m–12", fees: "US$7.2K – US$22K", location: "South Jakarta", slug: "nord-anglia-school-jakarta" },
  { school: "Sekolah Pelita Harapan (SPH)", curriculum: "IB continuum", ages: "4–18", fees: "US$7.2K – US$22K", location: "Lippo Village / Kemang", slug: "sekolah-pelita-harapan" },
  { school: "New Zealand School Jakarta (NZSJ)", curriculum: "NZ Curriculum / British", ages: "1–18", fees: "US$6.9K – US$22K", location: "South Jakarta", slug: "new-zealand-school-jakarta" },
];

export const SECTION2_ALL_SCHOOLS: Section2Row[] = [
  { school: "Jakarta Intercultural School", area: "South Jakarta", curriculum: "American / IB / AP", fees: "US$23K – US$37K", slug: "jakarta-intercultural-school" },
  { school: "British School Jakarta", area: "Bintaro", curriculum: "British / IB Diploma", fees: "US$9.2K – US$30K", slug: "british-school-jakarta" },
  { school: "The Independent School of Jakarta", area: "South Jakarta", curriculum: "British", fees: "US$9.2K – US$30K", slug: "independent-school-of-jakarta" },
  { school: "Australian Independent School Jakarta", area: "South Jakarta", curriculum: "Australian / IB Diploma", fees: "US$9.3K – US$27K", slug: "australian-independent-school-jakarta" },
  { school: "Tunas Muda School", area: "West Jakarta", curriculum: "IB PYP / MYP / DP", fees: "US$6.9K – US$27K", slug: "tunas-muda-school" },
  { school: "Sekolah Pelita Harapan Kemang Village", area: "South Jakarta", curriculum: "IB Diploma / IGCSEs / Christian", fees: "US$8.1K – US$26K", slug: "sekolah-pelita-harapan-kemang-village" },
  { school: "BTB School", area: "North Jakarta", curriculum: "IB PYP / IGCSEs / IB DP", fees: "US$7.4K – US$26K", slug: "btb-school" },
  { school: "ACG School Jakarta", area: "South Jakarta", curriculum: "IB PYP / IGCSEs / IB DP", fees: "US$9.8K – US$25K", slug: "acg-school-jakarta" },
  { school: "NationalHigh Jakarta School", area: "West Jakarta", curriculum: "Cambridge / Singapore", fees: "US$9.8K – US$24K", slug: "nationalhigh-jakarta-school" },
  { school: "Raffles Christian School Jakarta", area: "South Jakarta", curriculum: "Cambridge / IGCSEs / A-Levels", fees: "US$4.9K – US$24K", slug: "raffles-christian-school-jakarta" },
  { school: "Nord Anglia School Jakarta", area: "South Jakarta", curriculum: "British / IPC", fees: "US$7.2K – US$22K", slug: "nord-anglia-school-jakarta" },
  { school: "Sekolah Pelita Harapan Lippo Village", area: "BSD", curriculum: "IB PYP / MYP / DP", fees: "US$7.2K – US$22K", slug: "sekolah-pelita-harapan" },
  { school: "Jakarta Nanyang School", area: "BSD", curriculum: "Cambridge / IGCSEs / A-Levels", fees: "US$7.2K – US$22K", slug: "jakarta-nanyang-school" },
  { school: "New Zealand School Jakarta", area: "South Jakarta", curriculum: "NZ Curriculum / British", fees: "US$6.9K – US$22K", slug: "new-zealand-school-jakarta" },
  { school: "Binus School Serpong", area: "BSD", curriculum: "Cambridge / IGCSEs / A-Levels", fees: "US$6.2K – US$22K", slug: "binus-school-serpong" },
  { school: "Stella Maris School", area: "North Jakarta", curriculum: "IGCSEs / A-Levels / IB DP", fees: "US$4.9K – US$21K", slug: "stella-maris-school" },
  { school: "El Shaddai Intercontinental School", area: "South Jakarta", curriculum: "Cambridge / IGCSEs / A-Levels", fees: "US$4.9K – US$21K", slug: "el-shaddai-intercontinental-school" },
  { school: "ACS Jakarta", area: "East Jakarta", curriculum: "Cambridge / IGCSEs / IB DP", fees: "US$15K – US$20K", slug: "acs-jakarta" },
  { school: "IPEKA Integrated Christian School", area: "West Jakarta", curriculum: "Australian / IB Diploma", fees: "US$6.2K – US$20K", slug: "ipeka-integrated-christian-school" },
  { school: "Jakarta Indonesia Korean School", area: "East Jakarta", curriculum: "Korean National Curriculum", fees: "US$6.2K – US$19K", slug: "jakarta-indonesia-korean-school" },
  { school: "Sekolah Ciputra", area: "West Jakarta", curriculum: "IB PYP / MYP / DP", fees: "US$4.9K – US$19K", slug: "sekolah-ciputra" },
  { school: "Cikal School", area: "South Jakarta", curriculum: "Cikal Curriculum / IB DP", fees: "US$4.9K – US$17K", slug: "cikal-school" },
  { school: "North Jakarta Intercultural School", area: "North Jakarta", curriculum: "IB PYP / MYP / DP", fees: "US$6.1K – US$16K", slug: "north-jakarta-intercultural-school" },
  { school: "Springfield School Jakarta", area: "West Jakarta", curriculum: "Cambridge / IGCSEs / A-Levels", fees: "US$4.9K – US$16K", slug: "springfield-school-jakarta" },
  { school: "Binus School Simprug", area: "South Jakarta", curriculum: "IB PYP / MYP / DP", fees: "US$5.2K – US$15K", slug: "binus-school-simprug" },
  { school: "Binus School Bekasi", area: "East Jakarta", curriculum: "Cambridge / IGCSEs / A-Levels", fees: "US$4.9K – US$15K", slug: "binus-school-bekasi" },
  { school: "Cita Buana School", area: "South Jakarta", curriculum: "IB PYP / MYP / DP", fees: "US$4.3K – US$15K", slug: "cita-buana-school" },
  { school: "Singapore Intercultural School South Jakarta", area: "South Jakarta", curriculum: "Singapore / IGCSEs / IB DP", fees: "US$2.4K – US$15K", slug: "singapore-intercultural-school-south-jakarta" },
  { school: "Deutsche Internationale Schule Jakarta", area: "South Jakarta", curriculum: "German / Abitur / Cambridge", fees: "US$2.4K – US$15K", slug: "deutsche-internationale-schule-jakarta" },
  { school: "Mentari Intercultural School Jakarta", area: "South Jakarta", curriculum: "IB PYP / MYP / DP", fees: "US$5.6K – US$14K", slug: "mentari-intercultural-school-jakarta" },
  { school: "HighScope Indonesia", area: "South Jakarta", curriculum: "HighScope / Indonesian National", fees: "US$4.9K – US$14K", slug: "highscope-indonesia" },
  { school: "Jakarta Multicultural School", area: "South Jakarta", curriculum: "IB PYP / IGCSEs / IB DP", fees: "US$4.9K – US$13K", slug: "jakarta-multicultural-school" },
  { school: "Global Jaya School", area: "Bintaro", curriculum: "IB PYP / MYP / DP", fees: "US$4.9K – US$13K", slug: "global-jaya-school" },
  { school: "Ichthus School Jakarta", area: "South Jakarta", curriculum: "IGCSEs / A-Levels", fees: "US$4.9K – US$13K", slug: "ichthus-school-jakarta" },
  { school: "SIS Pantai Indah Kapuk", area: "North Jakarta", curriculum: "Singapore / IGCSEs / IB DP / BTEC", fees: "US$3.7K – US$13K", slug: "sis-pantai-indah-kapuk" },
  { school: "Kanaan Global School", area: "West Jakarta", curriculum: "Cambridge / IGCSEs / A-Levels", fees: "US$3.1K – US$13K", slug: "kanaan-global-school" },
  { school: "French School Jakarta", area: "South Jakarta", curriculum: "French National / French Bac", fees: "US$5.9K – US$12K", slug: "french-school-jakarta" },
  { school: "Al Jabr Islamic School", area: "South Jakarta", curriculum: "Cambridge / IGCSEs / IB DP", fees: "US$4.9K – US$12K", slug: "al-jabr-islamic-school" },
  { school: "Tzu Chi School", area: "North Jakarta", curriculum: "Cambridge / IB MYP / IB DP", fees: "US$4.3K – US$11K", slug: "tzu-chi-school" },
  { school: "Global Sevilla School", area: "West Jakarta", curriculum: "Cambridge / IGCSEs / A-Levels", fees: "US$3.7K – US$11K", slug: "global-sevilla-school" },
  { school: "Sampoerna Academy Jakarta", area: "South Jakarta", curriculum: "Cambridge / IGCSEs / IB DP", fees: "US$1.6K – US$11K", slug: "sampoerna-academy-jakarta" },
  { school: "SIS Kelapa Gading", area: "North Jakarta", curriculum: "Singapore / IGCSEs / IB DP", fees: "US$2.4K – US$10K", slug: "sis-kelapa-gading" },
  { school: "Bina Bangsa School", area: "West Jakarta", curriculum: "Singapore / IGCSEs / A-Levels", fees: "US$3.7K – US$9.3K", slug: "bina-bangsa-school" },
  { school: "Gandhi Memorial International School", area: "Central Jakarta", curriculum: "IB PYP / MYP / DP + Indian", fees: "US$3K – US$8.6K", slug: "gandhi-memorial-international-school" },
  { school: "Mentari Intercultural School Bintaro", area: "Bintaro", curriculum: "Cambridge / IGCSEs / IB DP", fees: "US$4.4K – US$8K", slug: "mentari-intercultural-school-bintaro" },
  { school: "Mutiara Harapan Islamic School", area: "South Jakarta", curriculum: "Cambridge / IGCSEs / A-Levels", fees: "US$2.8K – US$8K", slug: "mutiara-harapan-islamic-school" },
  { school: "Kharisma Bangsa School", area: "South Jakarta", curriculum: "Cambridge / IGCSEs / A-Levels", fees: "US$6.4K – US$7.9K", slug: "kharisma-bangsa-school" },
  { school: "Al Azhar Syifa Budi Jakarta", area: "South Jakarta", curriculum: "British / IGCSEs / IB DP", fees: "US$1.9K – US$7.8K", slug: "al-azhar-syifa-budi-jakarta" },
  { school: "Jubilee School Jakarta", area: "North Jakarta", curriculum: "Cambridge / IGCSEs / A-Levels", fees: "US$3.1K – US$7.7K", slug: "jubilee-school-jakarta" },
  { school: "Universal School Jakarta", area: "North Jakarta", curriculum: "British / Cambridge / IGCSEs", fees: "US$3.1K – US$7.7K", slug: "universal-school-jakarta" },
  { school: "Beacon Academy", area: "BSD", curriculum: "IB PYP / IGCSEs / IB DP", fees: "US$6.8K – US$7.5K", slug: "beacon-academy" },
  { school: "Pelangi Kasih School", area: "North Jakarta", curriculum: "Cambridge / IGCSEs", fees: "US$2.5K – US$7.1K", slug: "pelangi-kasih-school" },
  { school: "Sekolah Lentera Kasih Jakarta", area: "North Jakarta", curriculum: "Cambridge / IGCSEs", fees: "US$3.1K – US$6.8K", slug: "sekolah-lentera-kasih-jakarta" },
  { school: "Bunda Mulia School", area: "North Jakarta", curriculum: "Cambridge Primary / Lower Secondary", fees: "US$3.7K – US$6.2K", slug: "bunda-mulia-school" },
  { school: "Holy Angels School", area: "West Jakarta", curriculum: "Singapore / Cambridge", fees: "US$3.1K – US$6.2K", slug: "holy-angels-school" },
  { school: "Al Fajar Schule Jakarta", area: "South Jakarta", curriculum: "Cambridge / IGCSEs", fees: "US$2.5K – US$6.2K", slug: "al-fajar-schule-jakarta" },
  { school: "Sekolah Terpadu Pahoa", area: "West Jakarta", curriculum: "Cambridge / IGCSEs + Mandarin", fees: "US$2.2K – US$6.2K", slug: "sekolah-terpadu-pahoa" },
  { school: "Sekolah Madania", area: "South Jakarta", curriculum: "IB PYP / IGCSEs", fees: "US$2.5K – US$5.9K", slug: "sekolah-madania" },
  { school: "Sekolah Pelita Bangsa", area: "West Jakarta", curriculum: "Cambridge / IGCSEs", fees: "US$2.2K – US$5.9K", slug: "sekolah-pelita-bangsa" },
  { school: "Santa Laurensia School", area: "BSD", curriculum: "British / A-Levels", fees: "US$2.1K – US$5.9K", slug: "santa-laurensia-school" },
  { school: "Labschool Jakarta", area: "East Jakarta", curriculum: "Indonesian National / IGCSEs / A-Levels", fees: "US$3.1K – US$5.2K", slug: "labschool-jakarta" },
  { school: "Millennia World School", area: "South Jakarta", curriculum: "Finnish Waldorf Framework", fees: "US$2.8K – US$5.2K", slug: "millennia-world-school" },
  { school: "Sekolah Cita Buana", area: "South Jakarta", curriculum: "IPC / Cambridge", fees: "US$2.5K – US$5.2K", slug: "sekolah-cita-buana" },
  { school: "Sekolah Victory Plus", area: "East Jakarta", curriculum: "IB PYP / MYP / DP", fees: "US$2K – US$5K", slug: "sekolah-victory-plus" },
  { school: "Penabur International School", area: "North Jakarta", curriculum: "IGCSEs / A-Levels", fees: "Contact school", slug: "penabur-international-school" },
  { school: "Sinarmas World Academy", area: "BSD", curriculum: "IB MYP / IB DP", fees: "Fees not published", slug: "sinarmas-world-academy" },
];
