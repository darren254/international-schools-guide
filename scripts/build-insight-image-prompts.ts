#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
import { getAllInsightArticles } from "../src/lib/insights/content";

type PromptItem = {
  slug: string;
  title: string;
  firstParagraph: string;
  heroPrompt: string;
  inlinePrompt: string;
};

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstParagraphFromHtml(html: string): string {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!match) return "";
  return stripHtml(match[1]);
}

function buildPrompt(title: string, firstParagraph: string, format: "hero" | "inline"): string {
  const ratioHint = format === "hero" ? "wide editorial banner composition" : "landscape in-article composition";
  return [
    "Create an original editorial illustration in a pop art watercolor style.",
    "Use bold color blocking, watercolor textures, expressive brush edges, and clean modern composition.",
    "No text, no logos, no watermarks, no brand names.",
    "Theme must match this article:",
    `Headline: "${title}"`,
    `Context: "${firstParagraph}"`,
    `Output intent: ${ratioHint}.`,
    "Visual tone: premium financial newspaper feature art, sophisticated and contemporary.",
  ].join(" ");
}

function main() {
  const items: PromptItem[] = getAllInsightArticles().map((article) => {
    const firstParagraph = firstParagraphFromHtml(article.bodyHtml);
    return {
      slug: article.slug,
      title: article.h1,
      firstParagraph,
      heroPrompt: buildPrompt(article.h1, firstParagraph, "hero"),
      inlinePrompt: buildPrompt(article.h1, firstParagraph, "inline"),
    };
  });

  const outPath = path.join(process.cwd(), "content", "insights-image-prompts.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2), "utf8");
  console.log(`Wrote ${items.length} image prompts to ${outPath}`);
}

main();

