# Admin backend – step-by-step setup

## 1. Get a Neon database

1. Go to [neon.tech](https://neon.tech) and create a project (or use an existing one).
2. Copy the connection string (e.g. `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`).

## 2. Set local environment

1. In the project root, create `.env.local` if it doesn’t exist.
2. Add (or update):

   ```bash
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/your_db?sslmode=require
   ```

   Use your real Neon connection string.

## 3. Run the database migration

**If the database is empty (first time):**

```bash
npm run db:migrate
```

**If you already have tables** (e.g. from an older schema) and the migration fails with “relation already exists”:

- Either use a **new/empty Neon branch** and run `npm run db:migrate` there, or  
- Use `npm run db:push` once to sync the schema from `src/lib/db/schema.ts` (Drizzle will add missing columns/tables).  
  Then ensure `admin_users`, `admin_sessions`, and `school_media` exist; add them manually or via a small migration if needed.

## 4. Create the first admin user

From the project root, with `DATABASE_URL` set in `.env.local`:

```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=your-secure-password npx tsx scripts/seed-admin-user.ts
```

Use a real email and a strong password. You should see: `Admin user upserted: you@example.com`.

## 5. Run the app and admin API locally

The admin UI is static Next.js; the admin **API** lives in Cloudflare Functions, so `/api/admin/*` is only available when those functions run.

**Option A – Full stack with Wrangler (recommended for testing admin):**

1. Build the site:
   ```bash
   npm run build
   ```

2. Create a `.dev.vars` file in the project root (not committed) with your Neon URL so the Functions have `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/your_db?sslmode=require
   ```

3. Run Pages dev (serves `out/` and the `functions/` API):
   ```bash
   npx wrangler pages dev out
   ```

4. Open the URL Wrangler prints (e.g. `http://localhost:8788`). Go to `/admin` and log in with the email/password from step 4.

**Option B – Next.js only:**

```bash
npm run dev
```

Then open `http://localhost:3000/admin`. The UI will load, but **login and all admin API calls will fail** because `/api/admin/*` is not implemented in the Next dev server—those routes run in Cloudflare. Use Option A to actually log in and use the backend.

## 6. Deploy to Cloudflare (production)

**Production checklist:**

- **DATABASE_URL** — Set in Cloudflare Pages → your project → Settings → Environment variables (required for admin login and school list).
- **R2** (optional) — Create an R2 bucket and add a bucket binding named `R2_BUCKET` if you want image uploads in admin; otherwise you can add images by URL only.
- **APIFY_TOKEN** (optional) — Required for the admin **Image Scraper** (Admin → Image Scraper). Get a token from [apify.com](https://apify.com); add it to Cloudflare Pages env and to `.dev.vars` for local. If not set, the scraper API returns 503.

Steps:

1. **Connect the repo** to Cloudflare Pages (or your existing Worker/Pages project).
2. **Build command:** `npm run build` (output directory `out` for static export).
3. **Environment variables** (Cloudflare dashboard → your project → Settings → Environment variables):
   - `DATABASE_URL` = your Neon connection string (required for admin).
4. **Optional – R2 for image uploads:**
   - Create an R2 bucket in the Cloudflare dashboard.
   - In the Pages project, add an R2 bucket **binding** named `R2_BUCKET` pointing to that bucket.
   - Without R2, you can still add images by URL via the API (JSON `{ variant, url }`).
5. Redeploy. After deploy, open `https://your-site.pages.dev/admin` and log in.

## 7. Populate schools in the database

The admin “Schools” list is filled from the **database** `schools` table. To populate it from your existing static data (one-off):

```bash
npx tsx scripts/seed-schools-from-static.ts
```

Requires `DATABASE_URL` in `.env.local`. The script reads `SCHOOL_PROFILES` from `src/data/schools.ts`, inserts into `cities` and `schools`, and is safe to re-run (upserts by slug). After running, `/admin/schools` will show all schools.

**Populate images from existing manifest (optional):** To show the site’s current static images in the admin Images section, run:
```bash
npx tsx scripts/seed-school-images-from-manifest.ts
```
This reads `src/data/school-images.json` and fills `school_media` (and hero/og/logo on `schools`). Safe to re-run.

## 8. Publish: push admin changes to the live site

The live site reads from **static** data (`school-images.json`, profile files). After you edit schools or images in the admin UI, push those changes to the site as follows.

**Publish workflow:**

1. **Sync DB → static manifest** (from project root, with `DATABASE_URL` set in `.env.local` or env):
   ```bash
   npx tsx scripts/sync-schools-from-db.ts
   ```
   This reads from Neon (`schools` + `school_media`) and writes `src/data/school-images.json`. If you use R2 keys in `school_media.url`, set `R2_PUBLIC_URL` so the script can build full image URLs.

2. **Build and deploy:**
   ```bash
   npm run build
   ```
   Then deploy the `out/` directory (e.g. via your Cloudflare Pages connection or `wrangler pages deploy`).

Repeat this workflow whenever you want admin edits to go live.

---

## Quick reference

| Step | Command / action |
|------|-------------------|
| 1 | Create Neon project, copy connection string |
| 2 | Put `DATABASE_URL` in `.env.local` |
| 3 | `npm run db:migrate` (or `db:push` if DB already has tables) |
| 4 | `ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx scripts/seed-admin-user.ts` |
| 5 | `npm run build` then add `.dev.vars` with `DATABASE_URL`, run `npx wrangler pages dev out` → open `/admin` |
| 6 | Set `DATABASE_URL` (and optional R2) in Cloudflare → deploy |
| 7 | `npx tsx scripts/seed-schools-from-static.ts` (populate schools list) |
| 8 | After editing in admin: run `npx tsx scripts/sync-schools-from-db.ts`, then `npm run build` and deploy |
