#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
import { getAllInsightArticles } from "../src/lib/insights/content";

type PromptItem = {
  slug: string;
  title: string;
  firstParagraph: string;
  heroPrompt: string;
  cardPrompt: string;
  inlinePrompt: string;
};

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function paragraphFromHtml(html: string, index: number): string {
  const regex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  let i = 0;
  while ((match = regex.exec(html)) !== null) {
    if (i === index) return stripHtml(match[1]);
    i++;
  }
  return "";
}

function buildPrompt(
  title: string,
  context: string,
  format: "hero" | "card" | "inline",
  variationNote: string
): string {
  const ratioHints: Record<string, string> = {
    hero: "wide editorial banner, panoramic establishing shot",
    card: "square-friendly thumbnail with a single strong focal point",
    inline: "landscape in-article detail or scene, different angle from hero",
  };
  return [
    "Create an original editorial illustration in a pop art watercolor style.",
    "Use bold color blocking, watercolor textures, expressive brush edges, and clean modern composition.",
    "No text, no logos, no watermarks, no brand names.",
    variationNote,
    "Theme must match this article:",
    `Headline: "${title}"`,
    `Context: "${context}"`,
    `Composition: ${ratioHints[format]}.`,
    "Visual tone: premium financial newspaper feature art, sophisticated and contemporary.",
  ].join(" ");
}

function main() {
  const items: PromptItem[] = getAllInsightArticles().map((article) => {
    const firstParagraph = paragraphFromHtml(article.bodyHtml, 0);
    const secondParagraph = paragraphFromHtml(article.bodyHtml, 1) || firstParagraph;
    return {
      slug: article.slug,
      title: article.h1,
      firstParagraph,
      heroPrompt: buildPrompt(
        article.h1,
        firstParagraph,
        "hero",
        "This is the primary hero image."
      ),
      cardPrompt: buildPrompt(
        article.h1,
        firstParagraph,
        "card",
        "Create a DIFFERENT illustration from the hero. Use a different composition, color emphasis, or visual metaphor. Do not repeat the same scene or layout."
      ),
      inlinePrompt: buildPrompt(
        article.h1,
        secondParagraph,
        "inline",
        "Create a DIFFERENT illustration from the hero and card. Use different context, a detail or close-up, or a contrasting angle. Avoid repeating any previous image."
      ),
    };
  });

  const outPath = path.join(process.cwd(), "content", "insights-image-prompts.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2), "utf8");
  console.log(`Wrote ${items.length} image prompts to ${outPath}`);
}

main();

