import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { load as loadHtml } from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { marked } from "marked";

type PlanEntry = {
  number: number;
  slug: string;
  titleTag?: string;
  h1?: string;
  metaDescription?: string;
  breadcrumbs?: string;
  schema?: string[];
  internalLinksTo?: string;
};

export type InsightFaq = { question: string; answer: string };
export type InsightTocItem = { id: string; label: string };

export type InsightArticle = {
  slug: string;
  titleTag: string;
  h1: string;
  standfirst: string;
  metaDescription: string;
  breadcrumbs: string;
  schema: string[];
  date: string;
  readTime: string;
  tldr: string[];
  toc: InsightTocItem[];
  bodyHtml: string;
  faqs: InsightFaq[];
  categoryTag: string;
  relatedSlugs: string[];
  internalLinksFromRefs: number[];
  exchangeRateNote?: string;
  accuracyDisclaimer?: string;
  sourceFile: string;
};

type PlanData = {
  byNumber: Map<number, string>;
  bySlug: Map<string, PlanEntry>;
};

const CONTENT_DIR = path.join(process.cwd(), "content");
const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");
const CONTENT_PLAN_PATH = path.join(CONTENT_DIR, "ISG-content-plan-jakarta.md");
const HUB_SLUG = "best-international-schools-jakarta";
const INTERNAL_SLUG_ALIASES: Record<string, string> = {
  "expats-guide-to-international-schools-in-jakarta": "best-international-schools-jakarta",
  "ultimate-guide-to-jakartas-neighbourhoods-and-international-schools": "best-areas-jakarta-expat-families",
  "jakarta-school-commute-why-location-matters": "best-international-schools-south-jakarta",
  "jakartas-leading-british-school": "best-british-schools-jakarta",
  "academic-excellence-measuring-and-achieving-success-at-isj": "best-british-schools-jakarta",
};

const nhm = new NodeHtmlMarkdown();
const planData = parseContentPlan();
let cachedArticles: InsightArticle[] | null = null;

function normalizeTypography(input: string): string {
  return input
    .replaceAll("\u2014", "-")
    .replaceAll("\u2013", "-")
    .replaceAll("\u2018", "'")
    .replaceAll("\u2019", "'")
    .replaceAll("\u201c", '"')
    .replaceAll("\u201d", '"');
}

function slugFromPath(raw: string): string {
  const cleaned = raw.trim().replace(/^https?:\/\/[^/]+/i, "");
  const withoutPrefix = cleaned.replace(/^\/(insights|resources)\//, "");
  return withoutPrefix.replace(/^\/+|\/+$/g, "");
}

function parseContentPlan(): PlanData {
  const byNumber = new Map<number, string>();
  const bySlug = new Map<string, PlanEntry>();

  if (!fs.existsSync(CONTENT_PLAN_PATH)) {
    return { byNumber, bySlug };
  }

  const raw = fs.readFileSync(CONTENT_PLAN_PATH, "utf8");
  const lines = raw.split(/\r?\n/);
  let current: PlanEntry | null = null;

  for (const line of lines) {
    const sectionMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (sectionMatch) {
      if (current?.slug) {
        byNumber.set(current.number, current.slug);
        bySlug.set(current.slug, current);
      }
      current = { number: Number(sectionMatch[1]), slug: "" };
      continue;
    }

    if (!current) continue;

    const slugMatch = line.match(/URL slug:\s*(\/insights\/[a-z0-9-]+)/i);
    if (slugMatch) {
      current.slug = slugFromPath(slugMatch[1]);
      continue;
    }
    const titleMatch = line.match(/Title tag:\s*(.+)$/i);
    if (titleMatch) {
      current.titleTag = titleMatch[1].trim();
      continue;
    }
    const h1Match = line.match(/H1:\s*(.+)$/i);
    if (h1Match) {
      current.h1 = h1Match[1].trim();
      continue;
    }
    const metaMatch = line.match(/Meta description:\s*(.+)$/i);
    if (metaMatch) {
      current.metaDescription = metaMatch[1].replace(/\s*\(\d+\s*chars?\)\s*$/i, "").trim();
      continue;
    }
    const breadcrumbsMatch = line.match(/Breadcrumbs:\s*(.+)$/i);
    if (breadcrumbsMatch) {
      current.breadcrumbs = breadcrumbsMatch[1].trim();
      continue;
    }
    const schemaMatch = line.match(/Schema:\s*(.+)$/i);
    if (schemaMatch) {
      current.schema = schemaMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
      continue;
    }
    const linksMatch = line.match(/Internal links TO:\s*(.+)$/i);
    if (linksMatch) {
      current.internalLinksTo = linksMatch[1].trim();
    }
  }

  if (current?.slug) {
    byNumber.set(current.number, current.slug);
    bySlug.set(current.slug, current);
  }

  return { byNumber, bySlug };
}

function resolveNumberReference(refNumber: string): string {
  const slug = planData.byNumber.get(Number(refNumber));
  return slug ? `/insights/${slug}` : "";
}

function cleanBody(input: string): string {
  return normalizeTypography(input)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^\[(SHARE BAR|IMAGE PLACEHOLDER|YOU MIGHT ALSO BE INTERESTED IN|NEWSLETTER CTA|WAS THIS HELPFUL|BOTTOM SHARE BAR|RELATED ARTICLES|SCHOOL PROFILE CARDS)[^\]]*]\s*$/gim, "")
    .replace(/^\[[A-Z][A-Z0-9 \-:;,.()/'&]+]\s*$/gm, "")
    .replace(/^IMAGE PLACEHOLDER:[^\n]*$/gim, "")
    .replace(/^Alt text:[^\n]*$/gim, "")
    .replace(/\(#(\d+)\)/g, (_m, n) => {
      const href = resolveNumberReference(n);
      return href ? `(${href})` : "";
    })
    .replace(/(^|\s)#(\d+)(?=[\s),.;:]|$)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sectionRange(md: string, titleRegex: RegExp): [number, number] | null {
  const starts: { title: string; index: number }[] = [];
  const regex = /^##\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(md)) !== null) {
    starts.push({ title: match[1].trim(), index: match.index });
  }
  for (let i = 0; i < starts.length; i += 1) {
    const title = starts[i].title;
    if (!titleRegex.test(title)) continue;
    const start = starts[i].index;
    const end = i + 1 < starts.length ? starts[i + 1].index : md.length;
    return [start, end];
  }
  return null;
}

function getSection(md: string, titleRegex: RegExp): string {
  const range = sectionRange(md, titleRegex);
  return range ? md.slice(range[0], range[1]) : "";
}

function removeSection(md: string, titleRegex: RegExp): string {
  const range = sectionRange(md, titleRegex);
  if (!range) return md;
  return `${md.slice(0, range[0])}\n${md.slice(range[1])}`.replace(/\n{3,}/g, "\n\n").trim();
}

function parseTldr(section: string): string[] {
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function parseToc(section: string): InsightTocItem[] {
  const items: InsightTocItem[] = [];
  const regex = /\[([^\]]+)]\(#([a-z0-9-]+)\)/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(section)) !== null) {
    items.push({ label: match[1].trim(), id: match[2].trim() });
  }
  return items;
}

function parseFaqs(section: string): InsightFaq[] {
  if (!section) return [];
  const lines = section.split(/\r?\n/);
  const faqs: InsightFaq[] = [];
  let currentQuestion = "";
  let currentAnswer: string[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("## ")) continue;
    const questionMatch = line.match(/^\*\*(.+)\*\*$/);
    if (questionMatch) {
      if (currentQuestion && currentAnswer.length > 0) {
        faqs.push({ question: currentQuestion, answer: currentAnswer.join(" ").trim() });
      }
      currentQuestion = questionMatch[1].trim();
      currentAnswer = [];
      continue;
    }
    if (currentQuestion) {
      currentAnswer.push(line);
    }
  }
  if (currentQuestion && currentAnswer.length > 0) {
    faqs.push({ question: currentQuestion, answer: currentAnswer.join(" ").trim() });
  }
  return faqs;
}

/** Strip {#anchor-id} from heading lines so marked can parse; IDs are added after render. */
function stripHeadingAnchors(md: string): string {
  return md.replace(/^(#{2,3})\s+(.+?)\s*\{#([a-z0-9-]+)\}\s*$/gim, (_m, hashes, title) => {
    return `${hashes} ${title.trim()}`;
  });
}

/** Add id attributes to h2/h3 in rendered HTML for anchor links. */
function addHeadingIds(html: string): string {
  return html
    .replace(/<h2>([^<]+)<\/h2>/gi, (_m, text) => {
      const id = String(text)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      return id ? `<h2 id="${id}">${text.trim()}</h2>` : `<h2>${text.trim()}</h2>`;
    })
    .replace(/<h3>([^<]+)<\/h3>/gi, (_m, text) => {
      const id = String(text)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      return id ? `<h3 id="${id}">${text.trim()}</h3>` : `<h3>${text.trim()}</h3>`;
    });
}

/** Wrap tables in a scrollable container for mobile. */
function wrapTables(html: string): string {
  return html.replace(/<table>/gi, '<div class="table-wrapper"><table>').replace(/<\/table>/gi, "</table></div>");
}

/** Wrap consecutive label:value paragraphs (school facts) in a styled grid. */
function wrapFactsBlocks(html: string): string {
  const factsPattern = /((?:<p><strong>[^<]+:<\/strong>[^<]*<\/p>\s*)+)/g;
  return html.replace(factsPattern, (match) => `<div class="facts-grid">${match.trim()}</div>`);
}

function extractCategoryTag(breadcrumbs: string): string {
  const parts = breadcrumbs
    .split(">")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 3) return `${parts[1]} - ${parts[2]}`;
  if (parts.length >= 2) return `${parts[0]} - ${parts[1]}`;
  return "Insights";
}

function extractRelatedSlugs(source: string): string[] {
  const refs: number[] = [];
  const regex = /#(\d+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    refs.push(Number(match[1]));
  }
  const slugs = refs
    .map((n) => planData.byNumber.get(n))
    .filter((s): s is string => Boolean(s));
  const deduped = Array.from(new Set(slugs)).filter((slug) => slug !== HUB_SLUG);
  if (deduped.length === 0) return [HUB_SLUG];
  return deduped.includes(HUB_SLUG) ? deduped : [HUB_SLUG, ...deduped];
}

function extractRefNumbers(value: unknown): number[] {
  const source =
    typeof value === "string"
      ? value
      : Array.isArray(value)
        ? value.map((v) => String(v)).join(" ")
        : "";
  if (!source) return [];
  const refs: number[] = [];
  const regex = /#(\d+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    refs.push(Number(match[1]));
  }
  return refs;
}

function parseFrontmatterDate(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) return "Originally published: 25 February 2026";
  return value.startsWith("Originally published:") ? value : `Originally published: ${value}`;
}

function parseMarkdownSource(filePath: string): { data: Record<string, unknown>; markdown: string } {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;

  if (Object.keys(data).length > 0 || raw.startsWith("---")) {
    return { data, markdown: parsed.content };
  }

  // Fallback for metadata-led markdown files without YAML frontmatter.
  const fallback: Record<string, unknown> = {};
  const slugMatch = raw.match(/\*\*URL slug:\*\*\s*(\/insights\/[a-z0-9-]+)/i);
  const titleMatch = raw.match(/\*\*Title tag:\*\*\s*(.+)$/im);
  const metaMatch = raw.match(/\*\*Meta description:\*\*\s*(.+)$/im);
  const breadcrumbsMatch = raw.match(/\*\*Breadcrumbs:\*\*\s*(.+)$/im);
  const standfirstMatch = raw.match(/\*\*Standfirst:\*\*\s*(.+)$/im);
  const dateMatch = raw.match(/\*\*Originally published:\*\*\s*(.+)$/im);
  const readTimeMatch = raw.match(/\*\*Read time:\*\*\s*(.+)$/im);

  if (slugMatch) fallback.slug = slugMatch[1].trim();
  if (titleMatch) fallback.title = titleMatch[1].trim();
  if (metaMatch) fallback.meta_description = metaMatch[1].trim();
  if (breadcrumbsMatch) fallback.breadcrumbs = breadcrumbsMatch[1].trim();
  if (standfirstMatch) fallback.standfirst = standfirstMatch[1].trim();
  if (dateMatch) fallback.date = dateMatch[1].trim();
  if (readTimeMatch) fallback.read_time = readTimeMatch[1].trim();

  const start = raw.search(/^## TL;DR\b/im);
  const end = raw.search(/^## INTERNAL LINKS CHECKLIST\b/im);
  const markdown =
    start >= 0
      ? raw.slice(start, end > start ? end : undefined).trim()
      : parsed.content;

  return { data: fallback, markdown };
}

function parseHtmlSource(filePath: string): { data: Record<string, unknown>; markdown: string } {
  const raw = fs.readFileSync(filePath, "utf8");
  const metaComment = raw.match(/<!--([\s\S]*?)-->/)?.[1] ?? "";
  const kv: Record<string, unknown> = {};

  for (const line of metaComment.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_ ]+):\s*(.+)\s*$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase().replaceAll(" ", "_");
    kv[key] = m[2].trim();
  }

  if (typeof kv.slug === "string") {
    kv.slug = String(kv.slug).replace(/^\/resources\//, "/insights/");
  } else {
    kv.slug = `/insights/${path.basename(filePath, ".html")}`;
  }

  if (typeof kv.page_title === "string") kv.title = kv.page_title;
  if (typeof kv.meta_description === "string") kv.meta_description = kv.meta_description;

  const $ = loadHtml(raw);
  $("script").remove();
  $("nav[aria-label='Breadcrumb']").remove();
  $("h1").first().remove();
  const wrapper = $("body").find("div").first();
  const html = wrapper.length > 0 ? wrapper.html() ?? "" : $.root().html() ?? "";
  const markdown = nhm.translate(html);
  return { data: kv, markdown };
}

function toInsightArticle(filePath: string): InsightArticle | null {
  const ext = path.extname(filePath).toLowerCase();
  if (path.basename(filePath) === "RESEARCH-NOTES-comparisons-cluster.md") return null;

  const { data, markdown: sourceMarkdown } =
    ext === ".html" ? parseHtmlSource(filePath) : parseMarkdownSource(filePath);

  const rawSlug = String(data.slug ?? "");
  const fileNumber = Number(path.basename(filePath).match(/^(\d+)-/)?.[1] ?? 0);
  const planSlugFromNumber = fileNumber > 0 ? planData.byNumber.get(fileNumber) : undefined;

  const effectiveRawSlug = planSlugFromNumber ? `/insights/${planSlugFromNumber}` : rawSlug;
  if (!effectiveRawSlug) return null;
  const slug = slugFromPath(effectiveRawSlug);
  if (!slug) return null;

  const plan = planData.bySlug.get(slug);
  const cleaned = cleanBody(sourceMarkdown);

  const tldrSection = getSection(cleaned, /^TL;DR$/i);
  const tocSection = getSection(cleaned, /^In this article$/i);
  const faqSection = getSection(cleaned, /^FAQs?(\s*\{#.+\})?$/i);

  let bodyCore = cleaned;
  bodyCore = removeSection(bodyCore, /^TL;DR$/i);
  bodyCore = removeSection(bodyCore, /^In this article$/i);
  bodyCore = removeSection(bodyCore, /^Quiz(\s*\{#.+\})?$/i);
  bodyCore = removeSection(bodyCore, /^FAQs?(\s*\{#.+\})?$/i);

  const firstHeading = cleaned.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "";
  bodyCore = bodyCore.replace(/^#\s+.+$/m, "").trim();
  bodyCore = stripHeadingAnchors(bodyCore);

  const rendered = marked.parse(bodyCore);
  const bodyHtml = wrapFactsBlocks(
    wrapTables(addHeadingIds(typeof rendered === "string" ? rendered : String(rendered)))
  );

  const titleTagFromData = String(data.title_tag ?? data.title ?? "").trim();
  const standfirst = String(data.standfirst ?? "").trim();
  const metaDescription = String(data.meta_description ?? "").replace(/\s*\(\d+\s*chars?\)\s*$/i, "").trim();
  const breadcrumbs = String(data.breadcrumbs ?? "").trim();
  const schemaFromData = String(data.schema ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const titleTag = plan?.titleTag ?? (titleTagFromData || `${firstHeading} | The International Schools Guide`);
  const h1 = plan?.h1 ?? (String(data.h1 ?? "").trim() || firstHeading || titleTag);
  const finalMetaDescription = plan?.metaDescription ?? (metaDescription || h1);
  const finalBreadcrumbs = plan?.breadcrumbs ?? (breadcrumbs || "Home > Insights");
  const finalSchema = plan?.schema ?? (schemaFromData.length > 0 ? schemaFromData : ["Article", "BreadcrumbList"]);

  const tocFromLinks = parseToc(tocSection);
  const toc = tocFromLinks.length > 0 ? tocFromLinks : (() => {
    const items: InsightTocItem[] = [];
    const regex = /^##\s+(.+)$/gm;
    let match: RegExpExecArray | null;
    let idx = 0;
    while ((match = regex.exec(bodyCore)) !== null) {
      idx += 1;
      const raw = match[1].replace(/\{#.+\}$/, "").trim();
      const id = raw
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      items.push({ id: id || `section-${idx}`, label: raw });
    }
    return items;
  })();

  const footerLine = cleaned
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l.toLowerCase().startsWith("*fees correct as of"));
  const disclaimerLine = cleaned
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l.includes("We work hard to make every figure"));

  return {
    slug,
    titleTag,
    h1,
    standfirst,
    metaDescription: finalMetaDescription,
    breadcrumbs: finalBreadcrumbs,
    schema: finalSchema,
    date: parseFrontmatterDate(data.date),
    readTime: String(data.read_time ?? "").trim() || "8 min read",
    tldr: parseTldr(tldrSection),
    toc,
    bodyHtml,
    faqs: parseFaqs(faqSection),
    categoryTag: extractCategoryTag(finalBreadcrumbs),
    relatedSlugs: extractRelatedSlugs(String(data.internal_links_to ?? plan?.internalLinksTo ?? "")),
    internalLinksFromRefs: extractRefNumbers(data.internal_links_from),
    exchangeRateNote: footerLine?.replace(/^\*|\*$/g, ""),
    accuracyDisclaimer: disclaimerLine?.replace(/^\*|\*$/g, ""),
    sourceFile: path.basename(filePath),
  };
}

function loadAllArticles(): InsightArticle[] {
  const files = fs.readdirSync(ARTICLES_DIR);
  const articles = files
    .filter((name) => [".md", ".html"].includes(path.extname(name).toLowerCase()))
    .map((name) => toInsightArticle(path.join(ARTICLES_DIR, name)))
    .filter((a): a is InsightArticle => Boolean(a));

  const bySlug = new Map<string, InsightArticle>();
  for (const article of articles) {
    // Prefer markdown when both markdown and html exist for same slug.
    const existing = bySlug.get(article.slug);
    if (!existing) {
      bySlug.set(article.slug, article);
      continue;
    }
    if (existing.sourceFile.endsWith(".html") && article.sourceFile.endsWith(".md")) {
      bySlug.set(article.slug, article);
    }
  }

  const list = Array.from(bySlug.values()).sort((a, b) => a.slug.localeCompare(b.slug));
  const bySlugMap = new Map<string, InsightArticle>();
  for (const article of list) bySlugMap.set(article.slug, article);

  const validSlugs = new Set(list.map((a) => a.slug));

  // Normalize stale internal /insights links from imported content.
  for (const article of list) {
    article.bodyHtml = article.bodyHtml.replace(
      /href="\/insights\/([a-z0-9-]+)\/?"/gi,
      (_m, linkedSlugRaw: string) => {
        const linkedSlug = linkedSlugRaw.toLowerCase();
        const mappedSlug = INTERNAL_SLUG_ALIASES[linkedSlug] ?? linkedSlug;
        const target = validSlugs.has(mappedSlug) ? mappedSlug : HUB_SLUG;
        return `href="/insights/${target}"`;
      }
    );
  }

  // Ensure backlinks exist via related links when body link is missing.
  for (const target of list) {
    for (const ref of target.internalLinksFromRefs) {
      const sourceSlug = planData.byNumber.get(ref);
      if (!sourceSlug) continue;
      const source = bySlugMap.get(sourceSlug);
      if (!source || source.slug === target.slug) continue;

      const targetHref = `/insights/${target.slug}`;
      if (source.bodyHtml.includes(targetHref)) continue;
      if (!source.relatedSlugs.includes(target.slug)) {
        source.relatedSlugs.push(target.slug);
      }
    }
  }

  return list;
}

export function getAllInsightArticles(): InsightArticle[] {
  if (!cachedArticles) {
    cachedArticles = loadAllArticles();
  }
  return cachedArticles;
}

export function getInsightArticleBySlug(slug: string): InsightArticle | undefined {
  return getAllInsightArticles().find((article) => article.slug === slug);
}

