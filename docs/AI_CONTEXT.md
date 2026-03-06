# AI context: stack, user, and workflows

For AI assistants and humans. Keep this file up to date when we add or change services.

---

## User / product owner

Non-technical; prefers doing one simple thing (e.g. saying "publish" in chat) over using terminal or code. Prefer solutions the AI can execute on their behalf.

---

## Tech stack and integrations

Keep this section up to date when we add services. Never suggest alternatives we don't use (e.g. Supabase instead of Neon).

| Layer | Technology | Notes |
|-------|------------|--------|
| **Framework** | Next.js 14 App Router, TypeScript, React | Static export (`output: 'export'`). |
| **Styling** | Tailwind CSS | Rightmove/Louvre design system (see .cursor/rules/project.mdc). |
| **Database** | Neon (Postgres) | `DATABASE_URL` in .env.local or Cloudflare env. **Never suggest Supabase or another database.** |
| **ORM** | Drizzle ORM | Schema: src/lib/db/schema.ts. Config: drizzle.config.ts. |
| **Hosting** | Cloudflare Pages | Deploy = push to repo; Cloudflare builds from source. Do not ask the user to run wrangler or terminal deploy. |
| **Storage** | Cloudflare R2 | Optional; admin image uploads. R2_BUCKET binding in Cloudflare; optionally R2_PUBLIC_URL for sync script. |
| **Maps** | Mapbox GL JS | `NEXT_PUBLIC_MAPBOX_TOKEN`. Used on school profiles (CampusMap). |
| **Email** | Resend | `RESEND_API_KEY`. Not fully wired yet. |
| **APIs** | Pexels | City/insight images. `PEXELS_API_KEY` (optional). |
| | Google Geocoding | Campus addresses. `GOOGLE_GEOCODING_API_KEY`. |
| | NewsData.io | News. `NEWSDATA_API_KEY`. |
| | GA4 | Analytics. `NEXT_PUBLIC_GA_MEASUREMENT_ID`. |
| **Admin auth** | Neon tables | `admin_users`, `admin_sessions`; session cookie. No Supabase, Auth0, etc. |

---

## Publish workflow

1. Sync DB → static: `npx tsx scripts/sync-schools-from-db.ts` (uses DATABASE_URL from .env.local).
2. Git add changed files (e.g. src/data/school-images.json and any other modified files), commit with a clear message, push.
3. Cloudflare Pages builds and deploys from the push.

When the user says "publish" in chat, the AI runs these steps. Do not ask the user to run wrangler or deploy commands.

---

## Self-improving

When we add a new library, API, or service (e.g. a new map provider, CMS, or analytics), add it to the "Tech stack and integrations" table above and, if it's a common point of confusion, add a one-line reminder in .cursor/rules/user-and-workflow.mdc so the AI doesn't suggest the wrong tool.
