/**
 * Generate an HTML preview file from a draft
 * Run with: node scripts/generate-preview.js best-international-schools-jakarta
 */

const fs = require('fs');
const path = require('path');

const slug = process.argv[2] || "best-international-schools-jakarta";
const draftPath = path.join(process.cwd(), "src/content/insights/drafts", `${slug}.json`);
const outputPath = path.join(process.cwd(), "draft-preview.html");

if (!fs.existsSync(draftPath)) {
  console.error(`Draft not found: ${slug}`);
  process.exit(1);
}

const draft = JSON.parse(fs.readFileSync(draftPath, 'utf-8'));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Draft Preview - ${draft.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.7;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #F8F4EE;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 { color: #E8722A; margin-bottom: 10px; font-size: 2.5rem; }
    .meta { color: #666; font-size: 14px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #ddd; }
    h2 { margin-top: 40px; margin-bottom: 20px; color: #333; font-size: 1.8rem; }
    h3 { margin-top: 30px; margin-bottom: 15px; color: #555; font-size: 1.3rem; }
    p { margin-bottom: 15px; }
    strong { font-weight: 600; }
    .status { display: inline-block; padding: 4px 12px; background: #f0f0f0; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
    .status.pending { background: #fff3cd; color: #856404; }
    section { margin-bottom: 40px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${draft.title}</h1>
    <div class="meta">
      <span class="status ${draft.status}">${draft.status}</span>
      <span style="margin-left: 15px;">Category: ${draft.category}</span>
      <span style="margin-left: 15px;">Author: ${draft.author || 'Not specified'}</span>
      <span style="margin-left: 15px;">Created: ${new Date(draft.createdAt).toLocaleDateString()}</span>
    </div>
    <div style="font-size: 18px; color: #666; margin-bottom: 30px; font-style: italic;">
      ${draft.summary}
    </div>
    <div>
      ${draft.content}
    </div>
    ${draft.images && draft.images.length > 0 ? `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
      <h3>Image Placeholders</h3>
      <ul>
        ${draft.images.map(img => `<li style="margin-bottom: 10px; color: #666;">${img}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
  </div>
</body>
</html>`;

fs.writeFileSync(outputPath, html, 'utf-8');
console.log(`✓ HTML preview generated: ${outputPath}`);
console.log(`  Open in browser: file://${outputPath}`);
console.log(`  Or: open ${outputPath}`);
