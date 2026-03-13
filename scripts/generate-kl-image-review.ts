/**
 * Generate an interactive HTML gallery to review KL school images.
 *
 * Features:
 *  - Drag-to-reorder images within each school
 *  - Click X to mark images for deletion (toggle)
 *  - "Export Changes" button downloads a JSON edits file
 *  - The edits file is consumed by apply-kl-image-edits.ts
 *
 *   npx tsx scripts/generate-kl-image-review.ts
 *   open scripts/review/kl-school-images.html
 */

import fs from "node:fs";
import path from "node:path";
import { KUALA_LUMPUR_SCHOOLS } from "../src/data/kuala-lumpur-schools";

const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "school-images.json");
const OUTPUT_PATH = path.join(process.cwd(), "scripts", "review", "kl-school-images.html");
const IMG_BASE = "../../public/images/schools";

type ManifestEntry = Record<string, string | undefined>;
type Manifest = { slugs: Record<string, ManifestEntry> };

const manifest: Manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

const GALLERY_KEYS = Array.from({ length: 20 }, (_, i) => `photo${i + 1}`);

interface SchoolRow {
  name: string;
  slug: string;
  images: { key: string; src: string; file: string }[];
}

const withImages: SchoolRow[] = [];
const noImages: { name: string; slug: string }[] = [];

for (const school of KUALA_LUMPUR_SCHOOLS) {
  const entry = manifest.slugs[school.slug];
  if (!entry) {
    noImages.push({ name: school.name, slug: school.slug });
    continue;
  }

  const images: { key: string; src: string; file: string }[] = [];

  if (entry.profile) {
    images.push({
      key: "profile",
      src: `${IMG_BASE}/${school.slug}/profile.webp`,
      file: `profile.webp`,
    });
  }
  for (const k of GALLERY_KEYS) {
    if (entry[k]) {
      images.push({
        key: k,
        src: `${IMG_BASE}/${school.slug}/${k}.webp`,
        file: `${k}.webp`,
      });
    }
  }

  if (images.length === 0) {
    noImages.push({ name: school.name, slug: school.slug });
  } else {
    withImages.push({ name: school.name, slug: school.slug, images });
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const schoolDataJson = JSON.stringify(
  withImages.map((s) => ({
    name: s.name,
    slug: s.slug,
    images: s.images.map((img) => ({
      key: img.key,
      src: img.src,
      file: img.file,
    })),
  }))
);

const schoolCards = withImages
  .map(
    (s, idx) => `
  <div class="school" data-slug="${esc(s.slug)}" id="school-${esc(s.slug)}">
    <div class="school-header">
      <h2>${idx + 1}. ${esc(s.name)}</h2>
      <p class="slug">${esc(s.slug)}</p>
    </div>
    <div class="grid" data-slug="${esc(s.slug)}">
      ${s.images
        .map(
          (img) => `
      <div class="thumb" draggable="true" data-key="${esc(img.key)}" data-file="${esc(img.file)}" data-src="${esc(img.src)}">
        <button class="delete-btn" title="Mark for deletion">&times;</button>
        <img src="${esc(img.src)}" alt="${esc(s.name)} - ${img.key}" loading="lazy" />
        <span class="label">${img.key}</span>
      </div>`
        )
        .join("\n")}
    </div>
  </div>`
  )
  .join("\n");

const missingList = noImages
  .map(
    (s, idx) =>
      `<li>${idx + 1}. <strong>${esc(s.name)}</strong> <span class="slug">(${esc(s.slug)})</span></li>`
  )
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>KL School Images Review</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; color: #333; padding: 24px; }

  .top-bar { position: sticky; top: 0; z-index: 100; background: #fff; padding: 16px 20px; margin: -24px -24px 24px -24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .top-bar h1 { font-size: 22px; margin: 0; }
  .stats { color: #666; font-size: 14px; }
  .change-count { font-weight: 600; color: #c00; }
  .export-btn { background: #2563eb; color: #fff; border: none; padding: 10px 20px; border-radius: 8px;
    font-size: 14px; font-weight: 600; cursor: pointer; margin-left: auto; }
  .export-btn:hover { background: #1d4ed8; }
  .export-btn:disabled { background: #94a3b8; cursor: not-allowed; }
  .reset-btn { background: #e5e7eb; color: #333; border: none; padding: 10px 16px; border-radius: 8px;
    font-size: 14px; cursor: pointer; }
  .reset-btn:hover { background: #d1d5db; }

  .instructions { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px 18px;
    margin-bottom: 24px; font-size: 14px; line-height: 1.6; color: #1e40af; }

  .school { background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .school.has-changes { border-left: 4px solid #f59e0b; }
  .school-header { margin-bottom: 12px; }
  .school h2 { font-size: 18px; margin-bottom: 4px; }
  .slug { color: #999; font-size: 13px; font-family: monospace; }

  .grid { display: flex; flex-wrap: wrap; gap: 12px; min-height: 60px; padding: 4px; border-radius: 8px; }
  .grid.drag-over { background: #f0f9ff; outline: 2px dashed #60a5fa; }

  .thumb { position: relative; cursor: grab; user-select: none; transition: opacity 0.2s, transform 0.15s; }
  .thumb:active { cursor: grabbing; }
  .thumb.dragging { opacity: 0.3; }
  .thumb.drag-target { transform: scale(1.05); }
  .thumb img { width: 180px; height: 130px; object-fit: cover; border-radius: 6px; border: 2px solid #e0e0e0;
    pointer-events: none; transition: border-color 0.2s; }
  .thumb .label { display: block; text-align: center; font-size: 11px; color: #888; margin-top: 3px; transition: color 0.2s; }

  .thumb.deleted { opacity: 0.4; }
  .thumb.deleted img { border-color: #ef4444; filter: grayscale(0.8); }
  .thumb.deleted .label { color: #ef4444; text-decoration: line-through; }
  .thumb.deleted .delete-btn { background: #ef4444; }

  .thumb.reordered .label { color: #f59e0b; font-weight: 600; }

  .delete-btn { position: absolute; top: 4px; right: 4px; width: 26px; height: 26px; border-radius: 50%;
    background: rgba(0,0,0,0.5); color: #fff; border: none; font-size: 18px; line-height: 1;
    cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;
    transition: background 0.15s; }
  .delete-btn:hover { background: #ef4444; }

  .missing { background: #fff; border-radius: 12px; padding: 20px; margin-top: 32px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .missing h2 { font-size: 20px; margin-bottom: 12px; color: #c00; }
  .missing li { padding: 4px 0; font-size: 14px; }
  .missing .slug { color: #999; }

  /* Lightbox */
  .lightbox { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.88); z-index: 1000;
    justify-content: center; align-items: center; cursor: zoom-out; flex-direction: column; }
  .lightbox.active { display: flex; }
  .lightbox img { max-width: 92vw; max-height: 85vh; border-radius: 8px; }
  .lightbox-caption { color: #fff; font-size: 14px; margin-top: 12px; text-align: center; }
</style>
</head>
<body>

<div class="top-bar">
  <h1>KL School Images Review</h1>
  <span class="stats">${withImages.length} schools &middot; ${withImages.reduce((n, s) => n + s.images.length, 0)} images</span>
  <span class="change-count" id="changeCount"></span>
  <button class="reset-btn" id="resetBtn" onclick="resetAll()">Reset All</button>
  <button class="export-btn" id="exportBtn" onclick="exportChanges()" disabled>Export Changes</button>
</div>

<div class="instructions">
  <strong>How to use:</strong>
  Drag images to reorder (first image = profile/card on the site).
  Click the X to mark an image for deletion.
  When done, click <strong>Export Changes</strong> to download the edits file.
  Then tell the AI to "apply the edits".
</div>

${schoolCards}

<div class="missing">
  <h2>Schools Without Photos (${noImages.length})</h2>
  <ol>${missingList}</ol>
</div>

<div class="lightbox" id="lightbox" onclick="closeLightbox()">
  <img id="lb-img" src="" alt="" />
  <div class="lightbox-caption" id="lb-caption"></div>
</div>

<script>
const originalData = ${schoolDataJson};

const schoolEdits = {};

function getSchoolState(slug) {
  if (!schoolEdits[slug]) {
    const orig = originalData.find(s => s.slug === slug);
    schoolEdits[slug] = {
      order: orig.images.map(img => img.file),
      deleted: new Set()
    };
  }
  return schoolEdits[slug];
}

function hasChanges(slug) {
  const state = schoolEdits[slug];
  if (!state) return false;
  const orig = originalData.find(s => s.slug === slug);
  if (state.deleted.size > 0) return true;
  const origOrder = orig.images.map(img => img.file);
  return JSON.stringify(state.order) !== JSON.stringify(origOrder);
}

function updateUI() {
  let totalChanges = 0;
  document.querySelectorAll('.school').forEach(el => {
    const slug = el.dataset.slug;
    const changed = hasChanges(slug);
    el.classList.toggle('has-changes', changed);
    if (changed) totalChanges++;
  });

  const countEl = document.getElementById('changeCount');
  const exportBtn = document.getElementById('exportBtn');
  if (totalChanges > 0) {
    countEl.textContent = totalChanges + ' school' + (totalChanges > 1 ? 's' : '') + ' changed';
    exportBtn.disabled = false;
  } else {
    countEl.textContent = '';
    exportBtn.disabled = true;
  }
}

// Delete toggle
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const thumb = btn.closest('.thumb');
    const slug = thumb.closest('.grid').dataset.slug;
    const file = thumb.dataset.file;
    const state = getSchoolState(slug);

    if (state.deleted.has(file)) {
      state.deleted.delete(file);
      thumb.classList.remove('deleted');
    } else {
      state.deleted.add(file);
      thumb.classList.add('deleted');
    }
    updateUI();
  });
});

// Drag and drop reordering
let dragThumb = null;
let dragSlug = null;

document.querySelectorAll('.thumb').forEach(thumb => {
  thumb.addEventListener('dragstart', e => {
    dragThumb = thumb;
    dragSlug = thumb.closest('.grid').dataset.slug;
    thumb.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });

  thumb.addEventListener('dragend', () => {
    if (dragThumb) dragThumb.classList.remove('dragging');
    document.querySelectorAll('.drag-target').forEach(el => el.classList.remove('drag-target'));
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    dragThumb = null;
    dragSlug = null;
  });

  thumb.addEventListener('dragover', e => {
    e.preventDefault();
    if (!dragThumb || dragThumb === thumb) return;
    if (thumb.closest('.grid').dataset.slug !== dragSlug) return;
    e.dataTransfer.dropEffect = 'move';
    thumb.classList.add('drag-target');
  });

  thumb.addEventListener('dragleave', () => {
    thumb.classList.remove('drag-target');
  });

  thumb.addEventListener('drop', e => {
    e.preventDefault();
    thumb.classList.remove('drag-target');
    if (!dragThumb || dragThumb === thumb) return;

    const grid = thumb.closest('.grid');
    const slug = grid.dataset.slug;
    if (slug !== dragSlug) return;

    const thumbs = [...grid.querySelectorAll('.thumb')];
    const fromIdx = thumbs.indexOf(dragThumb);
    const toIdx = thumbs.indexOf(thumb);

    if (fromIdx < toIdx) {
      grid.insertBefore(dragThumb, thumb.nextSibling);
    } else {
      grid.insertBefore(dragThumb, thumb);
    }

    // Update state
    const state = getSchoolState(slug);
    const newOrder = [...grid.querySelectorAll('.thumb')].map(t => t.dataset.file);
    state.order = newOrder;

    // Update labels
    const orig = originalData.find(s => s.slug === slug);
    const origOrder = orig.images.map(img => img.file);
    grid.querySelectorAll('.thumb').forEach((t, i) => {
      const isReordered = t.dataset.file !== origOrder[i];
      t.classList.toggle('reordered', isReordered);
    });

    updateUI();
  });
});

// Grid drag-over highlight
document.querySelectorAll('.grid').forEach(grid => {
  grid.addEventListener('dragover', e => {
    e.preventDefault();
    if (grid.dataset.slug === dragSlug) {
      grid.classList.add('drag-over');
    }
  });
  grid.addEventListener('dragleave', e => {
    if (!grid.contains(e.relatedTarget)) {
      grid.classList.remove('drag-over');
    }
  });
  grid.addEventListener('drop', () => {
    grid.classList.remove('drag-over');
  });
});

// Lightbox on image click (not on delete button)
document.querySelectorAll('.thumb img').forEach(img => {
  img.style.pointerEvents = 'auto';
  img.addEventListener('click', e => {
    if (e.target.closest('.delete-btn')) return;
    document.getElementById('lb-img').src = img.src;
    document.getElementById('lb-caption').textContent = img.alt;
    document.getElementById('lightbox').classList.add('active');
  });
});

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// Export
function exportChanges() {
  const edits = [];
  for (const slug of Object.keys(schoolEdits)) {
    if (!hasChanges(slug)) continue;
    const state = schoolEdits[slug];
    const orig = originalData.find(s => s.slug === slug);
    edits.push({
      slug,
      name: orig.name,
      deleted: [...state.deleted],
      order: state.order.filter(f => !state.deleted.has(f))
    });
  }

  if (edits.length === 0) {
    alert('No changes to export.');
    return;
  }

  const json = JSON.stringify({ exportedAt: new Date().toISOString(), edits }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kl-image-edits.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Reset
function resetAll() {
  if (!confirm('Reset all changes? This will undo all deletions and reordering.')) return;

  for (const slug of Object.keys(schoolEdits)) {
    delete schoolEdits[slug];
  }

  document.querySelectorAll('.thumb.deleted').forEach(t => t.classList.remove('deleted'));
  document.querySelectorAll('.thumb.reordered').forEach(t => t.classList.remove('reordered'));

  // Restore original order
  originalData.forEach(school => {
    const grid = document.querySelector('.grid[data-slug="' + school.slug + '"]');
    if (!grid) return;
    const thumbs = [...grid.querySelectorAll('.thumb')];
    const fileOrder = school.images.map(img => img.file);
    const sorted = fileOrder.map(f => thumbs.find(t => t.dataset.file === f)).filter(Boolean);
    sorted.forEach(t => grid.appendChild(t));
  });

  updateUI();
}

updateUI();
</script>

</body>
</html>`;

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, html, "utf8");

console.log(`Generated: ${OUTPUT_PATH}`);
console.log(`Schools with images: ${withImages.length}`);
console.log(`Schools without images: ${noImages.length}`);
console.log(`Total image thumbnails: ${withImages.reduce((n, s) => n + s.images.length, 0)}`);
