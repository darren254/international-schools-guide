/**
 * Draft management for insights articles
 * Stores drafts as JSON files, can migrate to database later
 */

import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export interface InsightDraft {
  slug: string;
  title: string;
  summary: string;
  category: string;
  content: string; // Markdown or JSX string
  images?: string[]; // Image URLs or paths
  author?: string;
  status: "draft" | "pending_review" | "approved" | "published";
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  publishedAt?: string;
}

const DRAFTS_DIR = join(process.cwd(), "src/content/insights/drafts");

async function ensureDraftsDir() {
  if (!existsSync(DRAFTS_DIR)) {
    await mkdir(DRAFTS_DIR, { recursive: true });
  }
}

export async function saveDraft(draft: Omit<InsightDraft, "createdAt" | "updatedAt" | "status">): Promise<InsightDraft> {
  await ensureDraftsDir();
  
  const now = new Date().toISOString();
  const fullDraft: InsightDraft = {
    ...draft,
    status: "pending_review",
    createdAt: now,
    updatedAt: now,
  };
  
  const filePath = join(DRAFTS_DIR, `${draft.slug}.json`);
  await writeFile(filePath, JSON.stringify(fullDraft, null, 2), "utf-8");
  
  return fullDraft;
}

export async function getDraft(slug: string): Promise<InsightDraft | null> {
  const filePath = join(DRAFTS_DIR, `${slug}.json`);
  
  if (!existsSync(filePath)) {
    return null;
  }
  
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content) as InsightDraft;
}

export async function getAllDrafts(): Promise<InsightDraft[]> {
  await ensureDraftsDir();
  
  // For now, return empty array - would need to read directory
  // This is a placeholder for database migration
  return [];
}

export async function updateDraftStatus(
  slug: string,
  status: InsightDraft["status"],
  reviewedBy?: string
): Promise<InsightDraft | null> {
  const draft = await getDraft(slug);
  if (!draft) return null;
  
  const updated: InsightDraft = {
    ...draft,
    status,
    updatedAt: new Date().toISOString(),
  };
  
  if (status === "approved" || status === "published") {
    updated.reviewedBy = reviewedBy;
    updated.reviewedAt = new Date().toISOString();
  }
  
  if (status === "published") {
    updated.publishedAt = new Date().toISOString();
  }
  
  const filePath = join(DRAFTS_DIR, `${slug}.json`);
  await writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");
  
  return updated;
}
