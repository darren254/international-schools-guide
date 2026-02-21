# Setup Guide — International Schools Guide

## Prerequisites
- Node.js 18+ installed (check: `node --version`)
- Git installed (check: `git --version`)
- GitHub CLI installed (check: `gh --version`) — install from https://cli.github.com if needed

## Step 1: Download the project folder
Download the `international-schools-guide` folder from Cowork to your computer.
Put it somewhere sensible, like ~/Projects/ or your Desktop.

## Step 2: Open Terminal and navigate to the project
```bash
cd ~/path/to/international-schools-guide
```

## Step 3: Add your Neon database URL
Open `.env.local` in any text editor and paste your Neon connection string on the DATABASE_URL line.

## Step 4: Install dependencies
```bash
npm install
```

## Step 5: Run the dev server
```bash
npm run dev
```
Visit http://localhost:3000/international-schools/jakarta/jakarta-intercultural-school/

## Step 6: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — JIS profile template + Jakarta city page"
gh repo create international-schools-guide --public --source=. --push
```

## Step 7: Connect Cloudflare Pages
1. Go to dash.cloudflare.com → Pages → Create a project
2. Connect to GitHub → select `international-schools-guide`
3. Build settings:
   - Framework preset: **Static Site** (or None)
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node version: `18` or `20`
4. Add environment variables (same as .env.local) - optional for static export
5. Deploy

That's it. Every push to `main` will auto-deploy.

**Deployment (record here once connected):**
- **Target:** Cloudflare Pages
- **Live URL:** _e.g. https://international-schools-guide.pages.dev_ ← paste your Pages URL here after first deploy

**Note:** The project uses static export (`output: 'export'`), so it outputs to `out/` directory, not `.vercel/output/static`.
