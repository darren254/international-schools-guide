# Insights Approval Workflow - Implementation Notes

## Current Status
✅ Email notification system created (`src/lib/insights/email.ts`)
✅ Draft storage system created (`src/lib/insights/draft.ts`)
✅ Admin review UI template created (`src/app/admin/insights/[slug]/page.tsx`)

## Current Limitation: Static Export

The site currently uses **static export** (`output: 'export'` in `next.config.mjs`), which means:
- ❌ No API routes work (`/api/*` routes don't exist in static export)
- ❌ No server-side functions run at request time
- ✅ All pages are pre-rendered at build time

## Solutions

### Option 1: Build-Time Script (Quick Start)
Create a script that processes drafts before build:

```bash
# scripts/process-drafts.ts
# Run before `npm run build`
# Reads drafts from src/content/insights/drafts/
# Generates published articles in src/app/insights/[slug]/
```

**Workflow:**
1. Writer completes article → saves draft JSON
2. Run `npm run process-drafts` → checks for approved drafts
3. Approved drafts → converted to published pages
4. `npm run build` → includes published articles

### Option 2: GitHub Actions Workflow (Recommended)
Automate approval via GitHub:

1. Drafts stored as JSON files in repo
2. Admin reviews via GitHub UI or local admin page
3. Click "Approve" → creates PR or commits directly
4. GitHub Action triggers on merge → rebuilds site

### Option 3: Switch to Server Rendering (Future)
When ready to use database:
1. Remove `output: 'export'` from `next.config.mjs`
2. Use `@opennextjs/cloudflare` for Cloudflare Workers
3. API routes will work (`/api/admin/drafts/*`)
4. Admin UI will function fully

## Next Steps

1. **For now (static export):**
   - Create `scripts/process-drafts.ts` to handle approval workflow
   - Admin reviews drafts locally or via GitHub
   - Approved drafts get converted to published pages on next build

2. **Email integration:**
   - When draft is saved, call `sendReviewNotification()`
   - Email includes link to GitHub draft file or local admin page

3. **Admin UI:**
   - For static export: Admin UI runs locally (`npm run dev`)
   - Reads drafts from file system
   - Approval updates draft status
   - Next build processes approved drafts

## Example Usage

```typescript
// When article is completed:
import { saveDraft, sendReviewNotification } from "@/lib/insights";

const draft = await saveDraft({
  slug: "best-international-schools-jakarta",
  title: "Best International Schools in Jakarta (2025) - The Expat Family Guide",
  summary: "...",
  category: "GUIDE",
  content: "...", // Markdown or JSX
  images: ["/images/jakarta-guide.jpg"],
  author: "Mia Windsor",
});

await sendReviewNotification(draft);
// Email sent to darren@schoolstrust.co.uk
```

## Future: Database Migration

When switching to database:
1. Update `src/lib/insights/draft.ts` to use Drizzle ORM
2. Create `insights_drafts` table
3. API routes will work: `/api/admin/drafts/[slug]`
4. Admin UI will be fully functional
