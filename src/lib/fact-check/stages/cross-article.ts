import { load as loadHtml } from "cheerio";
import { getAllInsightArticles } from "@/lib/insights/content";
import type { AnnotatedClaim, CrossArticleMatch } from "../types";

type ArticleCache = { slug: string; text: string }[];

let articleCache: ArticleCache | null = null;

function loadArticles(excludeSlug: string): ArticleCache {
  if (!articleCache) {
    articleCache = getAllInsightArticles().map((a) => ({
      slug: a.slug,
      text: loadHtml(a.bodyHtml).text().toLowerCase(),
    }));
  }
  return articleCache.filter((a) => a.slug !== excludeSlug);
}

function extractNumbers(text: string): string[] {
  const matches = text.match(/[\d,]+\.?\d*/g);
  return matches ? matches.map((m) => m.replace(/,/g, "")) : [];
}

function findMentions(
  articles: ArticleCache,
  schoolName: string,
  extractedValue: string,
): CrossArticleMatch[] {
  const matches: CrossArticleMatch[] = [];
  const searchName = schoolName.toLowerCase();
  const valueNums = extractNumbers(extractedValue);

  for (const article of articles) {
    if (!article.text.includes(searchName)) continue;

    const sentences = article.text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (!sentence.includes(searchName)) continue;

      const sentenceNums = extractNumbers(sentence);
      const hasRelevantNumber = valueNums.some((v) =>
        sentenceNums.some((s) => {
          const vn = parseFloat(v);
          const sn = parseFloat(s);
          if (isNaN(vn) || isNaN(sn)) return v === s;
          return Math.abs(vn - sn) / Math.max(vn, 1) < 0.15;
        }),
      );

      if (!hasRelevantNumber && valueNums.length > 0) continue;

      const hasValueText =
        valueNums.length === 0 &&
        extractedValue
          .toLowerCase()
          .split(/\s+/)
          .some((word) => word.length > 3 && sentence.includes(word));

      if (valueNums.length === 0 && !hasValueText) continue;

      const exactMatch = valueNums.length > 0
        ? valueNums.every((v) => sentenceNums.includes(v))
        : true;

      matches.push({
        slug: article.slug,
        text: sentence.trim().slice(0, 300),
        consistent: exactMatch,
      });
    }
  }

  return matches;
}

const SCHOOL_SEARCH_TERMS: Record<string, string[]> = {
  "jakarta-intercultural-school": ["jakarta intercultural school", "jis"],
  "british-school-jakarta": ["british school jakarta", "bsj"],
  "independent-school-of-jakarta": ["independent school of jakarta", "isj"],
  "australian-independent-school-jakarta": ["australian independent school", "ais"],
  "acg-school-jakarta": ["acg school jakarta", "acg"],
  "mentari-intercultural-school-jakarta": ["mentari intercultural school", "mentari"],
  "sekolah-pelita-harapan": ["sekolah pelita harapan", "sph"],
  "gandhi-memorial-international-school": ["gandhi memorial", "gmis"],
  "global-jaya-school": ["global jaya"],
  "binus-school-serpong": ["binus", "binus school"],
  "sinarmas-world-academy": ["sinarmas", "swa"],
  "nord-anglia-school-jakarta": ["nord anglia"],
};

function getSchoolSearchTerms(slug: string): string[] {
  return SCHOOL_SEARCH_TERMS[slug] ?? [slug.replace(/-/g, " ")];
}

export function scanCrossArticle(
  claims: AnnotatedClaim[],
  currentArticleSlug: string,
): AnnotatedClaim[] {
  console.log("  [Stage 3] Scanning cross-article consistency...");

  const articles = loadArticles(currentArticleSlug);
  let matchCount = 0;

  const result = claims.map((claim) => {
    if (!claim.schoolSlug) return claim;

    const searchTerms = getSchoolSearchTerms(claim.schoolSlug);
    const allMatches: CrossArticleMatch[] = [];
    const seenKeys = new Set<string>();

    for (const term of searchTerms) {
      const matches = findMentions(articles, term, claim.extractedValue);
      for (const m of matches) {
        const key = `${m.slug}:${m.text.slice(0, 50)}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          allMatches.push(m);
        }
      }
    }

    if (allMatches.length > 0) matchCount++;

    return {
      ...claim,
      crossArticleMatches: allMatches,
    };
  });

  console.log(`  [Stage 3] Found cross-article evidence for ${matchCount}/${claims.length} claims`);
  return result;
}
