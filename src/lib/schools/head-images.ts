import headImages from "@/data/head-images.json";
import headOverrides from "@/data/head-overrides.json";
import headBios from "@/data/head-bios.json";

type HeadManifest = { generatedAt: string; slugs: Record<string, string> };
type HeadOverridesManifest = {
  generatedAt: string;
  slugs: Record<string, { name: string; title?: string; schoolDisplayName?: string }>;
};
type HeadBiosManifest = { generatedAt: string; slugs: Record<string, string> };

const images = headImages as HeadManifest;
const overrides = headOverrides as HeadOverridesManifest;
const bios = headBios as HeadBiosManifest;

export function getHeadImageUrl(slug: string): string | undefined {
  return images.slugs[slug];
}

export function getHeadOverride(slug: string): { name: string; title?: string; schoolDisplayName?: string } | undefined {
  return overrides.slugs[slug];
}

/** Display name from directory (schoolDisplayName) + " (ACRONYM)" when profile has one. */
export function getSchoolDisplayName(
  slug: string,
  profile: { name: string; shortName: string }
): string {
  const override = overrides.slugs[slug];
  const base = override?.schoolDisplayName ?? profile.name;
  const short = profile.shortName;
  const isAcronym = short.length <= 6 && (short === short.toUpperCase() || !short.includes(" "));
  if (!isAcronym) return base;
  if (base.includes(`(${short})`)) return base;
  return `${base} (${short})`;
}

export function getHeadBioOverride(slug: string): string | undefined {
  return bios.slugs[slug];
}
