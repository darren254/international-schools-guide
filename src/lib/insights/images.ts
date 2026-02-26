import fs from "node:fs";
import path from "node:path";

type InsightImageKind = "hero" | "card" | "inline";

const EXTENSIONS = ["webp", "jpg", "jpeg", "png"] as const;

function existingUrlFor(slug: string, kind: InsightImageKind): string | null {
  const publicDir = path.join(process.cwd(), "public", "images", "insights");
  for (const ext of EXTENSIONS) {
    const fileName = `${slug}-${kind}.${ext}`;
    if (fs.existsSync(path.join(publicDir, fileName))) {
      return `/images/insights/${fileName}`;
    }
  }
  return null;
}

export function getInsightImageUrl(slug: string, kind: InsightImageKind): string | null {
  const direct = existingUrlFor(slug, kind);
  if (direct) return direct;

  // Fallbacks so we can generate fewer assets while keeping pages populated.
  const fallbacks: InsightImageKind[] =
    kind === "card" ? ["hero"] : kind === "hero" ? ["card"] : ["hero", "card"];

  for (const fb of fallbacks) {
    const url = existingUrlFor(slug, fb);
    if (url) return url;
  }

  return null;
}

