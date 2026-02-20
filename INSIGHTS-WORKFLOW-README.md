# Insights Approval Workflow - How to Use

## Overview
When new insights content is completed, it's saved as a draft, an email is sent to darren@schoolstrust.co.uk, and you can review/approve it via the admin UI.

## Workflow Steps

### 1. Create a Draft
When an article is completed, save it as a draft:

```typescript
import { saveDraft, sendReviewNotification } from "@/lib/insights/draft";

const draft = await saveDraft({
  slug: "best-international-schools-jakarta",
  title: "Best International Schools in Jakarta (2025) - The Expat Family Guide",
  summary: "Jakarta has 66 international schools...",
  category: "GUIDE",
  content: "<div>...</div>", // HTML content
  author: "Mia Windsor",
  images: ["/images/jakarta.jpg"],
});

await sendReviewNotification(draft);
```

Or use the CLI script:
```bash
tsx scripts/create-draft.ts \
  --slug="my-article" \
  --title="My Article Title" \
  --summary="Article summary" \
  --category="GUIDE" \
  --content="<div>Article HTML content</div>" \
  --author="Author Name"
```

### 2. Email Notification
An email is automatically sent to **darren@schoolstrust.co.uk** with:
- Article title, slug, category
- Link to review page: `https://international-schools-guide.com/admin/insights/[slug]`

### 3. Review & Edit
Visit the admin review page:
- **Local dev**: `http://localhost:3000/admin/insights/[slug]`
- **Production**: `https://international-schools-guide.com/admin/insights/[slug]`

You can:
- Read full content
- Edit content (Markdown/HTML editor)
- View images
- Preview as it will appear

### 4. Approve & Publish
Click "Approve & Publish" button. This:
- Updates draft status to "approved"
- On next build, `scripts/process-drafts.ts` runs automatically
- Approved drafts are converted to published articles
- Articles appear on `/insights` listing page

### 5. Build & Deploy
The build process automatically:
1. Runs `prebuild` script → processes approved drafts
2. Generates published articles
3. Updates `generateStaticParams` to include new articles
4. Builds static site with new content

## File Structure

```
src/
  content/
    insights/
      drafts/          # Draft JSON files (not committed)
        [slug].json
      published/       # Published articles (generated)
        [slug].json
  lib/
    insights/
      draft.ts        # Draft management functions
      email.ts        # Email notifications
      registry.json   # Generated registry of published articles
  app/
    admin/
      insights/
        [slug]/       # Admin review UI
          page.tsx
    insights/
      [slug]/         # Public article pages
        page.tsx
scripts/
  process-drafts.ts   # Build-time script (runs before build)
  create-draft.ts     # Helper to create drafts
```

## Draft Status Flow

1. **draft** → Initial creation
2. **pending_review** → Saved, email sent (default)
3. **approved** → You've approved, ready to publish
4. **published** → Live on site

## Notes

- Drafts are stored as JSON files in `src/content/insights/drafts/`
- Approved drafts are processed during build
- Published articles are added to `src/lib/insights/registry.json`
- The insights listing page reads from both hardcoded articles and registry
- Admin UI currently requires server rendering (will work when we switch from static export)

## Current Limitation

With **static export**, the admin UI won't work fully until we:
1. Switch to server rendering (`@opennextjs/cloudflare`), OR
2. Use GitHub-based approval workflow

For now, you can:
- Review drafts by reading JSON files directly
- Approve by changing status to "approved" in JSON
- Run `npm run process-drafts` manually before build

## Future: Database Migration

When switching to database:
- Drafts stored in `insights_drafts` table
- Admin UI will work fully with API routes
- No build-time processing needed
