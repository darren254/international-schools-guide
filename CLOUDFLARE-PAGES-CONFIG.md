# Cloudflare Pages Configuration

## Current Setup (Static Export)

The project uses **static export** (`output: 'export'` in `next.config.mjs`), which means all pages are pre-rendered at build time.

### Required Cloudflare Pages Settings

1. **Framework preset:** `Static Site` (or `None`)
2. **Build command:** `npm run build`
3. **Build output directory:** `out`
4. **Node version:** `18` or `20`

### Why This Matters

- With static export, Next.js outputs to `out/` directory
- The build command runs `prebuild` (process-drafts script) then `next build`
- All routes must be generated at build time via `generateStaticParams`

### If You See 404 Errors

1. Check that the route exists in `generateStaticParams`
2. Verify the draft file exists in `src/content/insights/drafts/`
3. Check Cloudflare Pages build logs for errors
4. Ensure the build output directory is set to `out`

### Future: Server-Side Rendering

When switching to server-side rendering:
1. Remove `output: 'export'` from `next.config.mjs`
2. Change build command to: `npx @cloudflare/next-on-pages@1`
3. Change output directory to: `.vercel/output/static`
4. This enables API routes and dynamic server-side rendering
