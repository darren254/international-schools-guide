# Admin backend

School profile editing and image management.

## Setup

1. **Database**
   - Run migrations: `npm run db:migrate` (or `db:push` if you prefer).
   - Seed first admin user:
     ```bash
     ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword npx tsx scripts/seed-admin-user.ts
     ```

2. **Environment (Cloudflare Pages / Workers)**
   - `DATABASE_URL` — Neon Postgres connection string (required for admin API).
   - `R2_BUCKET` — Bind an R2 bucket in the dashboard for image uploads (optional; without it, images can be added via JSON `url` only).
   - For Cloudflare Pages: configure env vars in the dashboard and add an R2 bucket binding to the Pages project.

3. **Local dev**
   - The admin UI is static and calls `/api/admin/*`. With `next dev`, those routes don’t exist unless you use a rewrite to a separate Worker or run the Functions locally. To test the API locally, use `wrangler pages dev` (or run the Worker separately and set `NEXT_PUBLIC_ADMIN_API` if you add that).

## Routes

- `GET /admin` — Redirects to login or schools.
- `GET /admin/login` — Login form.
- `POST /api/admin/login` — Login (email + password); sets session cookie.
- `GET /api/admin/login` — Check auth (returns `{ authenticated: true|false }`).
- `POST /api/admin/logout` — Logout; clears cookie.
- `GET /api/admin/schools` — List schools (optional `?city=slug`).
- `GET /api/admin/schools/:slug` — Get one school + images.
- `PATCH /api/admin/schools/:slug` — Update school fields.
- `GET /api/admin/schools/:slug/images` — List images.
- `POST /api/admin/schools/:slug/images` — Upload (multipart file) or add by URL (JSON `{ variant, url }`).
- `DELETE /api/admin/schools/:slug/images/:id` — Delete image.
- `PATCH /api/admin/schools/:slug/images/assign` — Set variant (body: `{ imageId, variant }`).

## Image variants

`card` | `profile` | `hero` | `og` | `logo` | `photo1` | `photo2` | `photo3`

Assigning an image to `hero`, `og`, or `logo` also updates `schools.hero_image_url`, `og_image_url`, `logo_url` for that school.

## Sync / publish

The live site reads from static data (`school-images.json`, TS profile files). To push admin changes to the site:

1. Run a sync script (e.g. `scripts/sync-schools-from-db.ts`) that reads from Neon (+ R2 if used) and writes `src/data/school-images.json` (and optionally other static sources).
2. Run `npm run build` and deploy `out/`.

Image processing (resize, WebP, OG crop) can be done in the sync script (Node + Sharp) before writing the manifest.
