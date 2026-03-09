/**
 * Deterministic cleanup of all leader bios in head-bios.json.
 *
 * Usage: npx tsx scripts/clean-leader-bios.ts [--dry-run]
 */

import * as fs from "fs";
import * as path from "path";

const BIOS_PATH = path.join(process.cwd(), "src/data/head-bios.json");
const PLACEHOLDER = "Contact the school for leadership details.";
const DRY_RUN = process.argv.includes("--dry-run");

const FLUFF_PHRASES = [
  /\bpassionate\s+(about\s+)?/gi,
  /\bvisionary\b/gi,
  /\btransformational\b/gi,
  /\bdedicated\s+(to\s+)?/gi,
  /\bcommitted\s+(to\s+)?/gi,
  /\bdynamic\b/gi,
  /\binnovative\b/gi,
  /\bdistinguished\b/gi,
  /\baccomplished\b/gi,
  /\bhighly motivated\b/gi,
  /\bdeeply committed\b/gi,
  /\bstrongly believes?\b/gi,
  /\bfirm believer\b/gi,
  /\bstrong advocate\b/gi,
  /\bunwavering commitment\b/gi,
  /\bproven track record\b/gi,
  /\bextensive experience in\b/gi,
  /\bone of the world's\s+\w+,?\s*/gi,
  /\bmost diverse,?\s*(and\s+)?/gi,
  /\bacademically\s+innovative\b/gi,
];

function stripLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function stripFluff(text: string): string {
  let result = text;
  for (const re of FLUFF_PHRASES) {
    result = result.replace(re, "");
  }
  return result;
}

function fixGrammar(text: string): string {
  return text
    .replace(/\ba\s+(a(?!nd\b)|e|i|o|u)/gi, (m, vowel) => `an ${vowel}`)
    .replace(/\ban\s+(?!MA\b|MBA\b|MBE\b|MEd\b|MSc\b|MP\b)(b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z)/gi, (m, cons) => `a ${cons}`)
    .replace(/\s{2,}/g, " ")
    .replace(/\s([,.])/g, "$1")
    .replace(/,\s*,/g, ",")
    .replace(/\.\s*\./g, ".")
    .replace(/\s+\./g, ".")
    .replace(/\.\s+in\s+[A-Z]/g, (m) => {
      // Fix broken sentences like "She holds an MA. in Anglo-Irish" → merge
      return m.replace(". in", " in");
    })
    .trim();
}

function splitSentences(text: string): string[] {
  // Pre-process: protect abbreviation dots from splitting
  let safe = text
    .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Jr|Sr|St|Dip|Inc|Ltd|Corp|Dept|Assoc|Univ|Hons|Cert|Ed|Phil)\./gi, "$1\u0000")
    .replace(/\b([A-Z])\.\s*(?=[A-Z])/g, "$1\u0000 ")
    .replace(/\b([A-Z])\.\s*(?=[A-Z][a-z])/g, "$1\u0000 ");

  const results: string[] = [];
  const re = /[^.!?]+[.!?]+/g;
  let match;
  while ((match = re.exec(safe)) !== null) {
    const s = match[0].replace(/\u0000/g, ".").trim();
    if (s.length > 10) results.push(s);
  }

  // Capture any remainder after last sentence-ending punctuation
  const remainder = safe.slice(re.lastIndex).replace(/\u0000/g, ".").trim();
  if (remainder.length > 15 && results.length === 0) {
    results.push(remainder);
  }

  if (results.length === 0 && text.trim().length > 10) {
    results.push(text.trim());
  }
  return results;
}

function trimToTarget(sentences: string[], minWords: number, maxWords: number): string {
  let result = "";
  let wordCount = 0;

  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i].trim();
    const sWords = s.split(/\s+/).length;

    if (i === 0) {
      result = s;
      wordCount = sWords;
      continue;
    }

    if (wordCount + sWords > maxWords) break;
    result += " " + s;
    wordCount += sWords;
    if (wordCount >= minWords) break;
  }

  return result;
}

function cleanBio(slug: string, raw: string): { bio: string; action: string } {
  if (!raw || raw.trim() === "Information not available" || raw.split(/\s+/).length <= 5) {
    return { bio: PLACEHOLDER, action: "placeholder" };
  }

  if (raw.includes("Melinda Hanlon")) {
    return { bio: PLACEHOLDER, action: "melinda-replaced" };
  }

  let text = stripLinks(raw);
  text = stripFluff(text);
  text = fixGrammar(text);

  // Remove orphaned trailing proper-noun fragments (from stripped links)
  text = text.replace(/\s+[A-Z][A-Za-z\s&'-]{2,30}$/, (m) => {
    const trimmed = m.trim();
    if (trimmed.includes(".") || trimmed.split(/\s+/).length > 5) return m;
    return "";
  });

  text = text.trim();

  const sentences = splitSentences(text);
  if (sentences.length === 0) {
    return { bio: PLACEHOLDER, action: "placeholder" };
  }

  // Trim trailing fragment sentences (ending mid-word or with abbreviation dot)
  const cleaned = sentences.filter((s) => {
    if (/\b[A-Z]\.$/.test(s)) return false;
    if (s.split(/\s+/).length < 4) return false;
    return true;
  });

  const usable = cleaned.length > 0 ? cleaned : sentences;
  let result = trimToTarget(usable, 25, 50);

  result = fixGrammar(result);

  if (!result.endsWith(".") && !result.endsWith("!") && !result.endsWith("?")) {
    result += ".";
  }

  const finalWords = result.split(/\s+/).length;
  const rawWords = raw.split(/\s+/).length;

  if (result === raw.trim()) {
    return { bio: result, action: "unchanged" };
  }

  return { bio: result, action: finalWords < rawWords ? "trimmed" : "cleaned" };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(BIOS_PATH, "utf-8"));
  const slugs: Record<string, string> = data.slugs;

  const stats: Record<string, number> = {};
  const changes: { slug: string; action: string; before: number; after: number }[] = [];

  for (const [slug, raw] of Object.entries(slugs)) {
    const { bio, action } = cleanBio(slug, raw);
    stats[action] = (stats[action] || 0) + 1;

    if (bio !== raw) {
      changes.push({
        slug,
        action,
        before: raw.split(/\s+/).length,
        after: bio.split(/\s+/).length,
      });
      slugs[slug] = bio;
    }
  }

  console.log("\n=== STATS ===");
  for (const [k, v] of Object.entries(stats)) {
    if (v > 0) console.log(`  ${k}: ${v}`);
  }
  console.log(`  total changed: ${changes.length}`);
  console.log(`  total unchanged: ${Object.keys(slugs).length - changes.length}`);

  // Word count distribution
  const wordCounts = Object.values(slugs).map((b) => (b as string).split(/\s+/).length);
  const avg = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
  const max = Math.max(...wordCounts);
  const min = Math.min(...wordCounts);
  console.log(`\n=== WORD COUNTS ===`);
  console.log(`  min: ${min}, avg: ${avg}, max: ${max}`);
  console.log(`  <=20w: ${wordCounts.filter((w) => w <= 20).length}`);
  console.log(`  21-40w: ${wordCounts.filter((w) => w > 20 && w <= 40).length}`);
  console.log(`  41-50w: ${wordCounts.filter((w) => w > 40 && w <= 50).length}`);
  console.log(`  >50w: ${wordCounts.filter((w) => w > 50).length}`);

  console.log("\n=== SAMPLE CHANGES ===");
  const sampleSlugs = [
    "jakarta-intercultural-school", "tanglin-trust-school", "singapore-american-school",
    "dubai-college", "brighton-college", "kellett-school", "gems-world-academy",
    "north-london-collegiate-school", "stamford-american-international-school-singapore",
    "harrow-international-school", "sekolah-pelita-harapan", "british-school-jakarta",
  ];
  for (const s of sampleSlugs) {
    if (slugs[s]) {
      const c = changes.find((ch) => ch.slug === s);
      const wc = (slugs[s] as string).split(/\s+/).length;
      console.log(`  ${s} (${c ? `${c.before}→${wc}w` : `${wc}w unchanged`}):`);
      console.log(`    "${(slugs[s] as string).slice(0, 150)}${(slugs[s] as string).length > 150 ? "..." : ""}"`);
    }
  }

  if (DRY_RUN) {
    console.log("\n[DRY RUN] No changes written.");
  } else {
    fs.writeFileSync(BIOS_PATH, JSON.stringify(data, null, 2) + "\n");
    console.log(`\nWrote ${BIOS_PATH}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
