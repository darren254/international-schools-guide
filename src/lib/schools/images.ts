import schoolImages from "@/data/school-images.json";

export type SchoolImageVariant = "card" | "profile" | "photo1" | "photo2" | "photo3";

type SchoolImageEntry = {
  card: string;
  profile: string;
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
  return entry?.[variant];
}

