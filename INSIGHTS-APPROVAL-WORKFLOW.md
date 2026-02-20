# Insights Content Approval Workflow

## Overview
When new insights content is completed, an email is sent to darren@schoolstrust.co.uk with a link to an admin UI where content can be reviewed, edited, and approved for publication.

## Workflow Steps

1. **Content Creation** → Writer completes article following style guide
2. **Draft Saved** → Content saved as draft in database/storage
3. **Email Notification** → Email sent to darren@schoolstrust.co.uk with review link
4. **Review UI** → Admin can read, edit content, see images, preview
5. **Approve & Publish** → One-click approval publishes to live site

## Technical Implementation

### Option 1: Simple File-Based System (Quick Start)
- Drafts stored in `src/content/insights/drafts/[slug].mdx`
- Published moved to `src/app/insights/[slug]/page.tsx`
- Email via service like Resend/SendGrid
- Admin UI: Simple Next.js page at `/admin/insights/[slug]`

### Option 2: Database-Driven (Scalable)
- Database table: `insights_drafts` (slug, title, content, images, status, created_at, updated_at)
- Email via Resend API
- Admin UI: Full CRUD interface at `/admin/insights`
- Status: draft → pending_review → approved → published

### Option 3: Headless CMS Integration
- Use Sanity/Contentful/Strapi for content management
- Built-in approval workflows
- Email notifications via webhooks
- Admin UI provided by CMS

## Recommended: Option 2 (Database-Driven)

### Database Schema
```sql
CREATE TABLE insights_drafts (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  category VARCHAR(50),
  content TEXT NOT NULL, -- Markdown or JSON
  images JSONB, -- Array of image URLs/metadata
  status VARCHAR(20) DEFAULT 'draft', -- draft, pending_review, approved, published
  author VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP,
  published_at TIMESTAMP
);
```

### Email Template
```
Subject: New Insights Article Ready for Review: [Title]

Hi Darren,

A new insights article has been completed and is ready for your review:

Title: [Title]
Slug: [slug]
Category: [category]
Author: [author]

Review and approve: https://international-schools-guide.com/admin/insights/[slug]

You can edit the content, preview images, and publish when ready.
```

### Admin UI Features
- `/admin/insights/[slug]` - Review page
  - Read full content (rendered preview)
  - Edit content (Markdown editor)
  - Image gallery/viewer
  - Preview as it will appear on site
  - Approve & Publish button
  - Reject/Request Changes button
- `/admin/insights` - List all drafts/pending articles

### Implementation Checklist
- [ ] Set up database table (Neon/Postgres)
- [ ] Create draft save function
- [ ] Set up email service (Resend API key)
- [ ] Build admin review UI
- [ ] Add authentication (protect `/admin/*` routes)
- [ ] Create publish function (moves draft to live)
- [ ] Add image upload/handling
- [ ] Test email notifications
- [ ] Test approval workflow end-to-end

## Quick Start: Minimal Viable Version

1. **Draft Storage**: Save to `src/content/insights/drafts/[slug].json`
2. **Email**: Use Resend API (free tier: 3,000 emails/month)
3. **Admin Page**: Simple Next.js page at `/admin/review/[slug]`
4. **Publish**: Copy draft JSON to live route + update insights listing

## Next Steps
1. Choose implementation approach
2. Set up email service (Resend recommended)
3. Create database schema or file structure
4. Build admin UI
5. Integrate into content creation workflow
