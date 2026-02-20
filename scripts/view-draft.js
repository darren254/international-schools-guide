/**
 * View a draft in the browser (opens local file or provides instructions)
 * Run with: node scripts/view-draft.js best-international-schools-jakarta
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const slug = process.argv[2] || "best-international-schools-jakarta";
const draftPath = path.join(process.cwd(), "src/content/insights/drafts", `${slug}.json`);

if (!fs.existsSync(draftPath)) {
  console.error(`Draft not found: ${slug}`);
  process.exit(1);
}

const draft = JSON.parse(fs.readFileSync(draftPath, 'utf-8'));

console.log("\n" + "=".repeat(80));
console.log(`DRAFT: ${draft.title}`);
console.log("=".repeat(80));
console.log(`\nSlug: ${draft.slug}`);
console.log(`Category: ${draft.category}`);
console.log(`Author: ${draft.author || 'Not specified'}`);
console.log(`Status: ${draft.status}`);
console.log(`Created: ${new Date(draft.createdAt).toLocaleString()}`);
console.log(`\nSummary:\n${draft.summary}`);
console.log("\n" + "-".repeat(80));
console.log("CONTENT PREVIEW (first 500 chars):");
console.log("-".repeat(80));
console.log(draft.content.substring(0, 500) + "...");
console.log("\n" + "=".repeat(80));
console.log("\nTo review the full draft:");
console.log(`1. Open: ${draftPath}`);
console.log(`2. Or run: npm run dev and visit http://localhost:3000/admin/insights/${draft.slug}`);
console.log(`3. Or view on Cloudflare: https://international-schools-guide.darren-1a2.workers.dev/admin/insights/${draft.slug}`);
console.log("\nTo approve:");
console.log(`1. Edit ${draftPath}`);
console.log(`2. Change "status" from "${draft.status}" to "approved"`);
console.log(`3. Run: npm run build (this will process approved drafts)`);
console.log("=".repeat(80) + "\n");
