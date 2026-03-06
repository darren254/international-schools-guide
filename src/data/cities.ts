/**
 * Cities config: which cities are live (have school data and listing page) vs coming soon.
 * Homepage Popular row and Browse by City grid use this. Only live cities get links.
 */

export interface CityConfig {
  name: string;
  slug: string;
  country: string;
  live: boolean;
  /** Next city to go live — shown as "Coming next" instead of "Coming soon". */
  comingNext?: boolean;
  /** Used when live: e.g. 66 for Jakarta. When !live, placeholder for future. */
  schoolCount?: number;
  feeRange?: string;
  topCurricula?: string[];
  tagline?: string;
  /** Optional Pexels (or other) attribution: small text on city card image. */
  photoCredit?: { label: string; href: string };
}

export const CITIES: CityConfig[] = [
  {
    name: "Singapore",
    slug: "singapore",
    country: "Singapore",
    live: true,
    schoolCount: 64,
    feeRange: "US$13K – $45K / year",
    topCurricula: ["IB", "British", "American"],
    tagline:
      "Asia's education hub with world-class IB and British curriculum schools",
    photoCredit: { label: "Photo: Robert Butts / Pexels", href: "https://www.pexels.com/photo/marina-bay-sands-and-singapore-skyline-3583192/" },
  },
  {
    name: "Hong Kong",
    slug: "hong-kong",
    country: "China",
    live: true,
    schoolCount: 80,
    feeRange: "US$12K – $30K / year",
    topCurricula: ["IB", "British", "Canadian"],
    tagline: "Premier Asian hub blending British, IB, and local curricula",
  },
  {
    name: "Dubai",
    slug: "dubai",
    country: "UAE",
    live: true,
    schoolCount: 172,
    feeRange: "US$3K – $30K / year",
    topCurricula: ["British", "IB", "American"],
    tagline: "The world's most competitive international school market",
  },
  {
    name: "Kuala Lumpur",
    slug: "kuala-lumpur",
    country: "Malaysia",
    live: true,
    schoolCount: 112,
    feeRange: "US$4K – $25K / year",
    topCurricula: ["British", "IB", "Australian"],
    tagline:
      "Outstanding value and quality - increasingly popular with expat families",
  },
  {
    name: "Jakarta",
    slug: "jakarta",
    country: "Indonesia",
    live: true,
    schoolCount: 66,
    feeRange: "US$5K – $36K / year",
    topCurricula: ["IB", "British", "Australian"],
    tagline:
      "Southeast Asia's largest city, home to JIS, BSJ, and 80+ international schools",
    photoCredit: { label: "Photo: Javaistan / Pexels", href: "https://www.pexels.com/@javaistan/" },
  },
  {
    name: "Bangkok",
    slug: "bangkok",
    country: "Thailand",
    live: true,
    schoolCount: 96,
    feeRange: "US$4K – $30K / year",
    topCurricula: ["IB", "British", "American"],
    tagline:
      "Exceptional value with top-tier schools at a fraction of Singapore prices",
  },
  // Coming soon
  { name: "London", slug: "london", country: "UK", live: false, photoCredit: { label: "Photo: Zetong Li / Pexels", href: "https://www.pexels.com/@zetong-li-" } },
  { name: "Riyadh", slug: "riyadh", country: "Saudi Arabia", live: false, photoCredit: { label: "Photo: Aleksandar Pasaric / Pexels", href: "https://www.pexels.com/@apasaric/" } },
  { name: "Doha", slug: "doha", country: "Qatar", live: false, photoCredit: { label: "Photo: Aleksandar Pasaric / Pexels", href: "https://www.pexels.com/@apasaric/" } },
  { name: "Shanghai", slug: "shanghai", country: "China", live: false, photoCredit: { label: "Photo: Peng LIU / Pexels", href: "https://www.pexels.com/@peng-liu-185695" } },
  { name: "Seoul", slug: "seoul", country: "South Korea", live: false, photoCredit: { label: "Photo: Pixabay / Pexels", href: "https://www.pexels.com/@pixabay" } },
  { name: "Munich", slug: "munich", country: "Germany", live: false, photoCredit: { label: "Photo: Felix Rottmann / Pexels", href: "https://www.pexels.com/@felixrottmann" } },
  { name: "Manila", slug: "manila", country: "Philippines", live: false, photoCredit: { label: "Photo: Pixabay / Pexels", href: "https://www.pexels.com/@pixabay" } },
  { name: "Saigon (HCMC)", slug: "saigon", country: "Vietnam", live: false, photoCredit: { label: "Photo: Pixabay / Pexels", href: "https://www.pexels.com/@pixabay" } },
  { name: "Abu Dhabi", slug: "abu-dhabi", country: "UAE", live: false, photoCredit: { label: "Photo: Pixabay / Pexels", href: "https://www.pexels.com/@pixabay" } },
];

export const LIVE_CITIES = CITIES.filter((c) => c.live);
export const TOTAL_SCHOOLS_LIVE = LIVE_CITIES.reduce(
  (sum, c) => sum + (c.schoolCount ?? 0),
  0
);
