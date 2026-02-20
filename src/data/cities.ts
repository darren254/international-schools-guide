/**
 * Cities config: which cities are live (have school data and listing page) vs coming soon.
 * Homepage Popular row and Browse by City grid use this. Only live cities get links.
 */

export interface CityConfig {
  name: string;
  slug: string;
  country: string;
  live: boolean;
  /** Used when live: e.g. 66 for Jakarta. When !live, placeholder for future. */
  schoolCount?: number;
  feeRange?: string;
  topCurricula?: string[];
  tagline?: string;
}

export const CITIES: CityConfig[] = [
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
    name: "Singapore",
    slug: "singapore",
    country: "Singapore",
    live: false,
    schoolCount: 70,
    feeRange: "US$15K – $45K / year",
    topCurricula: ["IB", "British", "Singaporean"],
    tagline:
      "Asia's education hub with world-class IB and British curriculum schools",
  },
  {
    name: "Bangkok",
    slug: "bangkok",
    country: "Thailand",
    live: false,
    schoolCount: 100,
    feeRange: "US$4K – $30K / year",
    topCurricula: ["IB", "British", "American"],
    tagline:
      "Exceptional value with top-tier schools at a fraction of Singapore prices",
  },
  {
    name: "Dubai",
    slug: "dubai",
    country: "UAE",
    live: false,
    schoolCount: 200,
    feeRange: "US$6K – $35K / year",
    topCurricula: ["British", "IB", "American"],
    tagline: "The world's most competitive international school market",
  },
  {
    name: "Hong Kong",
    slug: "hong-kong",
    country: "China",
    live: false,
    schoolCount: 55,
    feeRange: "US$12K – $40K / year",
    topCurricula: ["IB", "British", "Canadian"],
    tagline: "Premier Asian hub blending British, IB, and local curricula",
  },
  {
    name: "Kuala Lumpur",
    slug: "kuala-lumpur",
    country: "Malaysia",
    live: false,
    schoolCount: 65,
    feeRange: "US$4K – $25K / year",
    topCurricula: ["British", "IB", "Australian"],
    tagline:
      "Outstanding value and quality — increasingly popular with expat families",
  },
];

export const LIVE_CITIES = CITIES.filter((c) => c.live);
export const TOTAL_SCHOOLS_LIVE = LIVE_CITIES.reduce(
  (sum, c) => sum + (c.schoolCount ?? 0),
  0
);
