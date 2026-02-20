#!/usr/bin/env tsx
/**
 * Helper script to create a new insights draft
 * Usage: tsx scripts/create-draft.ts --slug="my-article" --title="My Article" --summary="..." --category="GUIDE" --content="..."
 */

import { saveDraft, sendReviewNotification } from "../src/lib/insights/draft";

async function main() {
  const args = process.argv.slice(2);
  const params: Record<string, string> = {};
  
  for (const arg of args) {
    const [key, ...valueParts] = arg.replace(/^--/, "").split("=");
    params[key] = valueParts.join("=");
  }
  
  if (!params.slug || !params.title || !params.summary || !params.category || !params.content) {
    console.error("Usage: tsx scripts/create-draft.ts --slug=... --title=... --summary=... --category=... --content=...");
    console.error("\nRequired:");
    console.error("  --slug: URL slug (e.g. 'best-schools-jakarta')");
    console.error("  --title: Article title");
    console.error("  --summary: Article summary/description");
    console.error("  --category: Category (GUIDE, FEES, RESULTS, etc.)");
    console.error("  --content: Article content (HTML or Markdown)");
    console.error("\nOptional:");
    console.error("  --author: Author name");
    console.error("  --images: Comma-separated image URLs");
    process.exit(1);
  }
  
  const draft = await saveDraft({
    slug: params.slug,
    title: params.title,
    summary: params.summary,
    category: params.category,
    content: params.content,
    author: params.author,
    images: params.images ? params.images.split(",").map((s) => s.trim()) : undefined,
  });
  
  console.log(`✓ Draft saved: ${draft.slug}`);
  console.log(`  Status: ${draft.status}`);
  console.log(`  Created: ${draft.createdAt}`);
  
  // Send email notification
  try {
    await sendReviewNotification(draft);
    console.log(`✓ Review email sent to darren@schoolstrust.co.uk`);
  } catch (error) {
    console.error("⚠ Failed to send email:", error);
    console.error("  Draft saved but email notification failed");
  }
  
  console.log(`\nReview URL: http://localhost:3000/admin/insights/${draft.slug}`);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
