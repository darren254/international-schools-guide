import fs from "node:fs";
import path from "node:path";

type InsightImageKind = "hero" | "card" | "inline";

const EXTENSIONS = ["webp", "jpg", "jpeg", "png"] as const;

export function getInsightImageUrl(slug: string, kind: InsightImageKind): string | null {
  const publicDir = path.join(process.cwd(), "public", "images", "insights");
  for (const ext of EXTENSIONS) {
    const fileName = `${slug}-${kind}.${ext}`;
    if (fs.existsSync(path.join(publicDir, fileName))) {
      return `/images/insights/${fileName}`;
    }
  }
  return null;
}

