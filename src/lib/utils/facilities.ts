/**
 * Facilities tiering for school profile: featured (icon grid) vs remaining (inline).
 * All content stays in the DOM for SEO; no hidden/accordion content.
 */

export type FeaturedFacilityType =
  | "pool"
  | "library"
  | "science"
  | "theatre"
  | "sports"
  | "arts"
  | "music"
  | "ict";

export const FEATURED_FACILITY_CONFIG: Record<
  FeaturedFacilityType,
  { label: string; keywords: RegExp }
> = {
  pool: { label: "Pool", keywords: /\b(pool|swimming)\b/i },
  library: { label: "Library", keywords: /\blibrar/i },
  science: { label: "Science labs", keywords: /\b(science|steam|stem|laborator)\b/i },
  theatre: { label: "Theatre", keywords: /\b(theatre|theater|auditorium|performing arts)\b/i },
  sports: {
    label: "Sports",
    keywords: /\b(sports|gym|gymnasium|football|basketball|tennis|badminton|court|field|arena|pitch)\b/i,
  },
  arts: { label: "Arts", keywords: /\b(art\s*studios?|arts?\s*studio|ceramics|art\s*rooms?)\b/i },
  music: { label: "Music", keywords: /\bmusic\b/i },
  ict: { label: "ICT", keywords: /\b(computer|ict|technology lab|robotics)\b/i },
};

const FEATURED_ORDER: FeaturedFacilityType[] = [
  "pool",
  "library",
  "science",
  "theatre",
  "sports",
  "arts",
  "music",
  "ict",
];

export interface TieredFacilities {
  featured: { type: FeaturedFacilityType; label: string }[];
  remaining: string[];
}

export function tierFacilities(facilities: string[]): TieredFacilities {
  const featuredTypes = new Set<FeaturedFacilityType>();
  const remaining: string[] = [];

  for (const f of facilities) {
    const trimmed = f.trim();
    if (!trimmed) continue;

    let matched: FeaturedFacilityType | null = null;
    for (const type of FEATURED_ORDER) {
      if (FEATURED_FACILITY_CONFIG[type].keywords.test(trimmed)) {
        matched = type;
        break;
      }
    }
    if (matched) {
      featuredTypes.add(matched);
    } else {
      remaining.push(trimmed);
    }
  }

  const featured = FEATURED_ORDER.filter((t) => featuredTypes.has(t)).map((type) => ({
    type,
    label: FEATURED_FACILITY_CONFIG[type].label,
  }));

  return { featured, remaining };
}
