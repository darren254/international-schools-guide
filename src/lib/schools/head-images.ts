import headImages from "@/data/head-images.json";
import headOverrides from "@/data/head-overrides.json";

type HeadManifest = { generatedAt: string; slugs: Record<string, string> };
type HeadOverridesManifest = { generatedAt: string; slugs: Record<string, { name: string; title?: string }> };

const images = headImages as HeadManifest;
const overrides = headOverrides as HeadOverridesManifest;

export function getHeadImageUrl(slug: string): string | undefined {
  return images.slugs[slug];
}

export function getHeadOverride(slug: string): { name: string; title?: string } | undefined {
  return overrides.slugs[slug];
}
