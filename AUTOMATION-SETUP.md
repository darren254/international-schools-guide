# Automated Draft Email Notifications - Setup

## How It Works

When a draft is created and committed to git, a GitHub Action automatically:
1. Detects the new/modified draft file
2. Sends email notification to darren@schoolstrust.co.uk
3. Includes review link and draft details

## Setup Required

### 1. Add Resend API Key to GitHub Secrets

1. Go to: https://github.com/darren254/international-schools-guide/settings/secrets/actions
2. Click "New repository secret"
3. Name: `RESEND_API_KEY`
4. Value: Your Resend API key (from `.env.local`)
5. Click "Add secret"

### 2. Test the Workflow

**Option A: Automatic (on commit)**
```bash
# Create/edit a draft file
echo '{"slug":"test-draft","title":"Test","status":"pending_review"}' > src/content/insights/drafts/test-draft.json

# Commit and push
git add src/content/insights/drafts/test-draft.json
git commit -m "Add test draft"
git push
# GitHub Action will trigger automatically
```

**Option B: Manual trigger**
1. Go to: https://github.com/darren254/international-schools-guide/actions
2. Click "Send Draft Review Notification"
3. Click "Run workflow"
4. Enter draft slug: `best-international-schools-jakarta`
5. Click "Run workflow"

## Workflow File

The workflow is at: `.github/workflows/draft-notification.yml`

It triggers on:
- Push to `main` when `src/content/insights/drafts/*.json` files change
- Manual trigger via GitHub Actions UI

## Current Issue

The email script fails in sandboxed environments (like Cursor) because network access is restricted. This is expected - the GitHub Action will handle email sending automatically when you commit the draft.

## Next Steps

1. Add `RESEND_API_KEY` to GitHub Secrets (see above)
2. Commit the draft file: `git add src/content/insights/drafts/best-international-schools-jakarta.json && git commit -m "Add Jakarta guide draft" && git push`
3. GitHub Action will automatically send the email
4. Check your inbox and Resend dashboard
