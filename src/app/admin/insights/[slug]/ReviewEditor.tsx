"use client";

import { useState } from "react";
import Link from "next/link";
import type { InsightDraft } from "@/lib/insights/draft";

interface ReviewEditorProps {
  draft: InsightDraft;
}

export function ReviewEditor({ draft: initialDraft }: ReviewEditorProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    
    // For static export, we'll open GitHub edit page with updated content
    const updatedDraft = {
      ...draft,
      status: "approved" as const,
      updatedAt: new Date().toISOString(),
    };

    // Create GitHub edit URL with updated JSON
    const githubEditUrl = `https://github.com/darren254/international-schools-guide/edit/main/src/content/insights/drafts/${draft.slug}.json`;
    
    // Copy updated JSON to clipboard
    const jsonContent = JSON.stringify(updatedDraft, null, 2);
    await navigator.clipboard.writeText(jsonContent);
    
    // Open GitHub edit page
    window.open(githubEditUrl, "_blank");
    
    alert("✅ Draft JSON copied to clipboard!\n\n1. Paste it into the GitHub editor\n2. Click 'Commit changes'\n3. The next build will publish it automatically");
    
    setPublishing(false);
  };

  return (
    <div className="container-site pt-6 pb-16">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/insights"
          className="text-sm text-charcoal-muted hover:text-hermes mb-4 inline-block"
        >
          ← Back to drafts
        </Link>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-3xl md:text-4xl text-charcoal">
            Review Article
          </h1>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-8 py-3 bg-hermes text-white font-semibold rounded-sm hover:bg-hermes-hover transition-colors disabled:opacity-50"
          >
            {publishing ? "Preparing..." : "Publish"}
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm text-charcoal-muted">
          <span>
            Status: <strong className="text-charcoal">{draft.status}</strong>
          </span>
          <span>•</span>
          <span>Category: {draft.category}</span>
          <span>•</span>
          <span>
            Created: {new Date(draft.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Editable Title */}
      <div className="mb-6">
        {editingTitle ? (
          <div>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="w-full text-3xl md:text-4xl font-display text-charcoal bg-white border-2 border-hermes rounded-sm p-4 mb-2"
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditingTitle(false);
                }
              }}
              autoFocus
            />
            <p className="text-xs text-charcoal-muted">Press Enter to save, or click outside</p>
          </div>
        ) : (
          <h2
            onClick={() => setEditingTitle(true)}
            className="text-3xl md:text-4xl font-display text-charcoal cursor-pointer hover:bg-cream-50 p-2 -m-2 rounded-sm transition-colors"
            title="Click to edit"
          >
            {draft.title}
          </h2>
        )}
      </div>

      {/* Editable Summary */}
      <div className="mb-8">
        {editingSummary ? (
          <div>
            <textarea
              value={draft.summary}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
              className="w-full text-base text-charcoal bg-white border-2 border-hermes rounded-sm p-4 mb-2 resize-y min-h-[80px]"
              onBlur={() => setEditingSummary(false)}
              rows={3}
              autoFocus
            />
            <p className="text-xs text-charcoal-muted">Click outside to save</p>
          </div>
        ) : (
          <p
            onClick={() => setEditingSummary(true)}
            className="text-lg text-charcoal-light cursor-pointer hover:bg-cream-50 p-2 -m-2 rounded-sm transition-colors"
            title="Click to edit"
          >
            {draft.summary}
          </p>
        )}
      </div>

      {/* Article Content - Nicely Formatted */}
      <div className="bg-white border border-warm-border rounded-sm p-8 mb-8">
        <div
          className="prose-hermes prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: draft.content }}
          style={{
            // Ensure sections are visually separated
            lineHeight: "1.75",
          }}
        />
      </div>

      {/* Metadata */}
      <div className="bg-cream-50 border border-warm-border rounded-sm p-6 mb-8">
        <h3 className="font-display text-lg mb-4">Article Metadata</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Slug:</strong> <code className="bg-white px-2 py-1 rounded">{draft.slug}</code>
          </div>
          {draft.author && (
            <div>
              <strong>Author:</strong> {draft.author}
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      {draft.images && draft.images.length > 0 && (
        <div className="mb-8">
          <h3 className="font-display text-lg mb-4">Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draft.images.map((img, i) => {
              if (img.startsWith("[IMAGE NEEDED:")) {
                return (
                  <div
                    key={i}
                    className="bg-cream-200 border border-warm-border rounded-sm p-6 text-sm text-charcoal-muted"
                  >
                    <div className="font-semibold mb-2">Placeholder {i + 1}</div>
                    <div>{img}</div>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="bg-cream-200 rounded-sm overflow-hidden border border-warm-border"
                >
                  <img
                    src={img}
                    alt={`Image ${i + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Publish Button (sticky at bottom) */}
      <div className="sticky bottom-0 bg-cream border-t border-warm-border p-6 -mx-6 mt-8 shadow-lg">
        <div className="container-site flex items-center justify-between">
          <div className="text-sm text-charcoal-muted">
            Ready to publish? Click the button above to approve this article.
          </div>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-8 py-3 bg-hermes text-white font-semibold rounded-sm hover:bg-hermes-hover transition-colors disabled:opacity-50"
          >
            {publishing ? "Preparing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
