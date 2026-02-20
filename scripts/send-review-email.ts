#!/usr/bin/env tsx
/**
 * Send review email for an existing draft
 */

import { getDraft } from "../src/lib/insights/draft";
import { sendReviewNotification } from "../src/lib/insights/email";

async function main() {
  const slug = process.argv[2] || "best-international-schools-jakarta";
  
  console.log(`Loading draft: ${slug}...`);
  const draft = await getDraft(slug);
  
  if (!draft) {
    console.error(`Draft not found: ${slug}`);
    process.exit(1);
  }
  
  console.log(`Found draft: ${draft.title}`);
  console.log(`Status: ${draft.status}`);
  
  try {
    await sendReviewNotification(draft);
    console.log(`✓ Review email sent to darren@schoolstrust.co.uk`);
    console.log(`\nReview URL: https://international-schools-guide.com/admin/insights/${draft.slug}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
