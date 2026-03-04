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
];

export const LIVE_CITIES = CITIES.filter((c) => c.live);
export const TOTAL_SCHOOLS_LIVE = LIVE_CITIES.reduce(
  (sum, c) => sum + (c.schoolCount ?? 0),
  0
);
