/**
 * Send review email for an existing draft
 * Run with: node scripts/send-review-email.js best-international-schools-jakarta
 */

const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
let resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/RESEND_API_KEY=(.+)/);
  if (match) {
    resendApiKey = match[1].trim();
  }
}

if (!resendApiKey) {
  console.error('RESEND_API_KEY not found in .env.local');
  process.exit(1);
}

const resend = new Resend(resendApiKey);
const REVIEW_EMAIL = "darren@schoolstrust.co.uk";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://international-schools-guide.darren-1a2.workers.dev";

async function getDraft(slug) {
  const filePath = path.join(process.cwd(), "src/content/insights/drafts", `${slug}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

async function sendReviewNotification(draft) {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }
  
  console.log(`Using Resend API key: ${resendApiKey.substring(0, 10)}...`);
  
  const reviewUrl = `${BASE_URL}/admin/insights/${draft.slug}`;
  
  console.log(`Sending email to: ${REVIEW_EMAIL}`);
  console.log(`Subject: New Insights Article Ready for Review: ${draft.title}`);
  
  try {
    const result = await resend.emails.send({
    from: "International Schools Guide <noreply@international-schools-guide.com>",
    to: REVIEW_EMAIL,
    subject: `New Insights Article Ready for Review: ${draft.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #E8722A; color: white; padding: 20px; border-radius: 4px 4px 0 0; }
            .content { background: #F8F4EE; padding: 30px; border-radius: 0 0 4px 4px; }
            .button { display: inline-block; background: #E8722A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
            .meta { background: white; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .meta-item { margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Article Ready for Review</h1>
            </div>
            <div class="content">
              <p>Hi Darren,</p>
              <p>A new insights article has been completed and is ready for your review:</p>
              
              <div class="meta">
                <div class="meta-item"><strong>Title:</strong> ${draft.title}</div>
                <div class="meta-item"><strong>Slug:</strong> ${draft.slug}</div>
                <div class="meta-item"><strong>Category:</strong> ${draft.category}</div>
                ${draft.author ? `<div class="meta-item"><strong>Author:</strong> ${draft.author}</div>` : ""}
              </div>
              
              <p>You can review, edit, and approve the content at:</p>
              <a href="${reviewUrl}" class="button">Review Article</a>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                This link will take you to the admin review interface where you can read the full content, edit if needed, preview images, and publish when ready.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Insights Article Ready for Review

Title: ${draft.title}
Slug: ${draft.slug}
Category: ${draft.category}
${draft.author ? `Author: ${draft.author}` : ""}

Review and approve: ${reviewUrl}
    `.trim(),
    });
    
    console.log('Resend API response:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      throw new Error(`Resend API error: ${JSON.stringify(result.error)}`);
    }
    
    if (!result.data || !result.data.id) {
      throw new Error(`Unexpected Resend response: ${JSON.stringify(result)}`);
    }
    
    return result;
  } catch (error) {
    console.error("Resend API call failed:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

async function main() {
  const slug = process.argv[2] || "best-international-schools-jakarta";
  const draftPath = path.join(process.cwd(), "src/content/insights/drafts", `${slug}.json`);
  
  console.log(`Loading draft: ${slug}...`);
  const draft = await getDraft(slug);
  
  if (!draft) {
    console.error(`Draft not found: ${slug}`);
    process.exit(1);
  }
  
  console.log(`Found draft: ${draft.title}`);
  console.log(`Status: ${draft.status}`);
  
  try {
    const result = await sendReviewNotification(draft);
    console.log(`✓ Review email sent to darren@schoolstrust.co.uk`);
    if (result && result.data && result.data.id) {
      console.log(`  Email ID: ${result.data.id}`);
    } else if (result && result.id) {
      console.log(`  Email ID: ${result.id}`);
    }
    console.log(`\nReview options:`);
    console.log(`  1. Local HTML preview: node scripts/generate-preview.js ${slug} then open draft-preview.html`);
    console.log(`  2. JSON file: ${draftPath}`);
    console.log(`  3. Cloudflare URL: ${BASE_URL}/admin/insights/${draft.slug}`);
    console.log(`  4. Local dev: npm run dev then http://localhost:3000/admin/insights/${draft.slug}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    console.error("\nYou can still review the draft:");
    console.error(`  1. Open: ${draftPath}`);
    console.error(`  2. Or run: node scripts/generate-preview.js ${slug} then open draft-preview.html`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
