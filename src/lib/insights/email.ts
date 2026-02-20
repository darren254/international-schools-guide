/**
 * Email notifications for insights approval workflow
 */

import { Resend } from "resend";
import type { InsightDraft } from "./draft";

const resend = new Resend(process.env.RESEND_API_KEY);

const REVIEW_EMAIL = "darren@schoolstrust.co.uk";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://international-schools-guide.darren-1a2.workers.dev";

export async function sendReviewNotification(draft: InsightDraft): Promise<any> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return;
  }
  
  const reviewUrl = `${BASE_URL}/admin/insights/${draft.slug}`;
  
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
                
                <p>To review the draft:</p>
                <ol style="margin: 20px 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;"><strong>Local HTML preview:</strong> Run <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">node scripts/generate-preview.js ${draft.slug}</code> then open <code>draft-preview.html</code></li>
                  <li style="margin-bottom: 10px;"><strong>JSON file:</strong> Edit <code>src/content/insights/drafts/${draft.slug}.json</code> directly</li>
                  <li style="margin-bottom: 10px;"><strong>Cloudflare URL:</strong> <a href="${reviewUrl}">${reviewUrl}</a> (admin UI requires domain setup)</li>
                </ol>
                
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                  <strong>To approve:</strong> Edit the JSON file and change "status" from "pending_review" to "approved", then run <code>npm run build</code>
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

Review options:
1. Local preview: Run "node scripts/generate-preview.js ${draft.slug}" then open draft-preview.html
2. JSON file: src/content/insights/drafts/${draft.slug}.json
3. Cloudflare: ${reviewUrl}

To approve: Edit JSON file, change status to "approved", then run "npm run build"
      `.trim(),
    });
    
    return result;
  } catch (error) {
    console.error("Failed to send review email:", error);
    throw error;
  }
}
