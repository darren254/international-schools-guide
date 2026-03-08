import schoolImages from "@/data/school-images.json";

export type SchoolImageVariant =
  | "card"
  | "profile"
  | "hero"
  | "og"
  | "logo"
  | "head"
  | "photo1"
  | "photo2"
  | "photo3"
  | "photo4"
  | "photo5"
  | "photo6"
  | "photo7"
  | "photo8"
  | "photo9"
  | "photo10"
  | "photo11"
  | "photo12"
  | "photo13"
  | "photo14"
  | "photo15"
  | "photo16"
  | "photo17"
  | "photo18"
  | "photo19"
  | "photo20";

type SchoolImageEntry = {
  card?: string;
  profile?: string;
  hero?: string;
  og?: string;
  logo?: string;
  head?: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  [key: string]: string | undefined;
};

type SchoolImageManifest = {
  slugs: Record<string, SchoolImageEntry>;
};

const manifest = schoolImages as SchoolImageManifest;
const IMAGE_ALIAS_SLUGS: Record<string, string> = {
  "sekolah-cita-buana": "cita-buana-school",
};

const GALLERY_KEYS = Array.from({ length: 20 }, (_, i) => `photo${i + 1}`) as const;

function normalizeUrl(url: string): string {
  if (url.startsWith("//") && url.slice(2).startsWith("images/")) return "/" + url.slice(2);
  return url;
}

function getOrderedGalleryUrls(entry: SchoolImageEntry): string[] {
  const urls: string[] = [];
  for (const k of GALLERY_KEYS) {
    const v = entry[k];
    if (v) urls.push(normalizeUrl(v));
  }
  return urls;
}

/** Ordered gallery image URLs (photo1, photo2, … photo20) for a school. */
export function getSchoolGalleryUrls(slug: string): string[] {
  const entry = manifest.slugs[slug] ?? manifest.slugs[IMAGE_ALIAS_SLUGS[slug]];
  if (!entry) return [];
  return getOrderedGalleryUrls(entry);
}

export function getSchoolImageUrl(
  slug: string,
  variant: SchoolImageVariant = "card"
): string | undefined {
  const entry = manifest.slugs[slug] ?? manifest.slugs[IMAGE_ALIAS_SLUGS[slug]];
  if (!entry) return undefined;
  let url = entry[variant];
  // If card/profile is missing but gallery photos exist, use first available so URL-only uploads still show
  if (!url && (variant === "card" || variant === "profile")) {
    url = entry.profile ?? entry.card ?? getOrderedGalleryUrls(entry)[0];
  }
  if (!url) return undefined;
  return normalizeUrl(url);
}

/** Prefer OG image for metadata; fallback to profile then card. */
export function getSchoolOgImageUrl(slug: string): string | undefined {
  return getSchoolImageUrl(slug, "og") ?? getSchoolImageUrl(slug, "profile") ?? getSchoolImageUrl(slug, "card");
}

