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
  | "photo3";

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
};

type SchoolImageManifest = {
  slugs: Record<string, SchoolImageEntry>;
};

const manifest = schoolImages as SchoolImageManifest;
const IMAGE_ALIAS_SLUGS: Record<string, string> = {
  "sekolah-cita-buana": "cita-buana-school",
};

export function getSchoolImageUrl(
  slug: string,
  variant: SchoolImageVariant = "card"
): string | undefined {
  const entry = manifest.slugs[slug] ?? manifest.slugs[IMAGE_ALIAS_SLUGS[slug]];
  const url = entry?.[variant];
  if (!url) return undefined;
  // Normalize protocol-relative "//images/..." to same-origin "/images/..." so images load correctly
  if (url.startsWith("//") && url.slice(2).startsWith("images/")) return "/" + url.slice(2);
  return url;
}

/** Prefer OG image for metadata; fallback to profile then card. */
export function getSchoolOgImageUrl(slug: string): string | undefined {
  return getSchoolImageUrl(slug, "og") ?? getSchoolImageUrl(slug, "profile") ?? getSchoolImageUrl(slug, "card");
}

