#!/usr/bin/env tsx
/**
 * Build-time script to process approved insights drafts
 * Converts approved drafts to published articles
 * Run before: npm run build
 */

import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import type { InsightDraft } from "../src/lib/insights/draft";

const DRAFTS_DIR = join(process.cwd(), "src/content/insights/drafts");
const REGISTRY_FILE = join(process.cwd(), "src/lib/insights/registry.json");
const PUBLISHED_DIR = join(process.cwd(), "src/content/insights/published");

interface PublishedArticle {
  slug: string;
  title: string;
  summary: string;
  category: string;
  content: string;
  images?: string[];
  author?: string;
  publishedAt: string;
  date: string; // Formatted date for display
  readTime: string; // Estimated read time
}

async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function getAllDrafts(): Promise<InsightDraft[]> {
  await ensureDir(DRAFTS_DIR);
  
  if (!existsSync(DRAFTS_DIR)) {
    return [];
  }
  
  const files = await readdir(DRAFTS_DIR);
  const drafts: InsightDraft[] = [];
  
  for (const file of files) {
    if (file.endsWith(".json")) {
      try {
        const content = await readFile(join(DRAFTS_DIR, file), "utf-8");
        const draft = JSON.parse(content) as InsightDraft;
        drafts.push(draft);
      } catch (error) {
        console.error(`Error reading draft ${file}:`, error);
      }
    }
  }
  
  return drafts;
}

function estimateReadTime(content: string): string {
  // Rough estimate: 200 words per minute
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

async function processDrafts() {
  console.log("Processing insights drafts...");
  
  const drafts = await getAllDrafts();
  const approvedDrafts = drafts.filter(
    (d) => d.status === "approved" || d.status === "published"
  );
  
  console.log(`Found ${approvedDrafts.length} approved draft(s) out of ${drafts.length} total`);
  
  if (approvedDrafts.length === 0) {
    console.log("No approved drafts to process");
    return;
  }
  
  await ensureDir(PUBLISHED_DIR);
  
  const published: PublishedArticle[] = [];
  
  for (const draft of approvedDrafts) {
    const publishedArticle: PublishedArticle = {
      slug: draft.slug,
      title: draft.title,
      summary: draft.summary,
      category: draft.category,
      content: draft.content,
      images: draft.images,
      author: draft.author,
      publishedAt: draft.publishedAt || draft.updatedAt,
      date: formatDate(draft.publishedAt || draft.updatedAt),
      readTime: estimateReadTime(draft.content),
    };
    
    // Save published article JSON
    const publishedPath = join(PUBLISHED_DIR, `${draft.slug}.json`);
    await writeFile(publishedPath, JSON.stringify(publishedArticle, null, 2), "utf-8");
    
    published.push(publishedArticle);
    
    // Update draft status to "published" if it was "approved"
    if (draft.status === "approved") {
      const updatedDraft: InsightDraft = {
        ...draft,
        status: "published",
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const draftPath = join(DRAFTS_DIR, `${draft.slug}.json`);
      await writeFile(draftPath, JSON.stringify(updatedDraft, null, 2), "utf-8");
    }
    
    console.log(`✓ Published: ${draft.slug}`);
  }
  
  // Save registry file for use by pages
  await writeFile(REGISTRY_FILE, JSON.stringify(published, null, 2), "utf-8");
  
  console.log(`\n✓ Processed ${published.length} article(s)`);
  console.log(`✓ Registry saved to ${REGISTRY_FILE}`);
}

// Run if called directly
if (require.main === module) {
  processDrafts().catch((error) => {
    console.error("Error processing drafts:", error);
    process.exit(1);
  });
}

export { processDrafts };
