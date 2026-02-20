"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { InsightDraft } from "@/lib/insights/draft";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { FloatingToolbar } from "@/components/editor/FloatingToolbar";

interface ReviewEditorProps {
  draft: InsightDraft;
}

export function ReviewEditor({ draft: initialDraft }: ReviewEditorProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [placeholderCount, setPlaceholderCount] = useState(0);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>(JSON.stringify(draft));

  // Inject image placeholders from images array into content if they're not already there
  const getContentWithImagePlaceholders = () => {
    let content = draft.content;
    
    // Check if images array placeholders are already in content
    if (draft.images && draft.images.length > 0) {
      const existingPlaceholders = draft.images.filter((img) => 
        content.includes(img) || content.includes(img.replace(/\[IMAGE NEEDED:\s*/i, "").replace(/\]/g, ""))
      );
      
      // Inject missing placeholders
      const missingPlaceholders = draft.images.filter((img) => 
        !existingPlaceholders.includes(img)
      );
      
      if (missingPlaceholders.length > 0) {
        const imagePlaceholders = missingPlaceholders
          .map((img) => {
            const cleanText = img.replace(/\[IMAGE NEEDED:\s*/i, "").replace(/\]/g, "");
            return `<p>[IMAGE NEEDED:${cleanText}]</p>`;
          })
          .join("");
        
        // Insert after the title/summary section (after first </section> or at start)
        const firstSectionEnd = content.indexOf("</section>");
        if (firstSectionEnd !== -1) {
          const insertPos = firstSectionEnd + 10; // After "</section>"
          content = content.slice(0, insertPos) + imagePlaceholders + content.slice(insertPos);
        } else {
          // Insert at the beginning if no sections
          content = imagePlaceholders + content;
        }
      }
    }
    
    return content;
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const currentDraft = JSON.stringify(draft);
    if (currentDraft !== lastSavedRef.current) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(() => {
        // Save to localStorage as backup
        try {
          localStorage.setItem(`draft-${draft.slug}`, currentDraft);
          lastSavedRef.current = currentDraft;
          console.log("Auto-saved draft to localStorage");
        } catch (error) {
          console.warn("Failed to auto-save:", error);
        }
      }, 30000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [draft]);

  const handlePublish = async () => {
    if (placeholderCount > 0) {
      alert(`Please resolve all ${placeholderCount} placeholder(s) before publishing.`);
      return;
    }

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
    <div className="min-h-screen bg-cream">
      {/* Top Bar - Fixed */}
      <div className="sticky top-0 z-40 bg-white border-b border-warm-border shadow-sm">
        <div className="container-site py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/admin/insights"
              className="text-sm text-charcoal-muted hover:text-hermes"
            >
              ← Back to drafts
            </Link>
            <button
              onClick={handlePublish}
              disabled={publishing || placeholderCount > 0}
              className="px-8 py-3 bg-hermes text-white font-semibold rounded-sm hover:bg-hermes-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={placeholderCount > 0 ? `Resolve ${placeholderCount} placeholder(s) before publishing` : ""}
            >
              {publishing
                ? "Preparing..."
                : placeholderCount > 0
                ? `Resolve ${placeholderCount} issue${placeholderCount > 1 ? "s" : ""} before publishing`
                : "Publish"}
            </button>
          </div>
          
          {/* Metadata Row */}
          <div className="flex items-center gap-6 text-xs text-charcoal-muted">
            <div>
              Status: <strong className="text-charcoal">{draft.status}</strong>
            </div>
            <div>•</div>
            <div>Category: {draft.category}</div>
            <div>•</div>
            <div>Created: {new Date(draft.createdAt).toLocaleDateString()}</div>
            {placeholderCount > 0 && (
              <>
                <div>•</div>
                <div className="text-red-600 font-medium">
                  ⚠️ {placeholderCount} placeholder{placeholderCount > 1 ? "s" : ""} unresolved
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article Content - Full Width, Matches Live Site */}
      <div className="container-site pt-12 pb-16">
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
            <h1
              onClick={() => setEditingTitle(true)}
              className="text-3xl md:text-4xl font-display text-charcoal cursor-pointer hover:bg-cream-50 p-2 -m-2 rounded-sm transition-colors"
              title="Click to edit"
            >
              {draft.title}
            </h1>
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

        {/* Metadata - Inline */}
        <div className="mb-8 flex items-center gap-4 text-sm text-charcoal-muted pb-4 border-b border-warm-border">
          <div>
            <span className="font-medium text-charcoal">Slug:</span>{" "}
            <code className="bg-cream-100 px-2 py-1 rounded text-xs">{draft.slug}</code>
          </div>
          {draft.author && (
            <>
              <div>•</div>
              <div>
                <span className="font-medium text-charcoal">Author:</span> {draft.author}
              </div>
            </>
          )}
        </div>

        {/* Rich Text Editor - NYT Style: Narrow Centered Column */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[680px]">
            <RichTextEditor
              content={getContentWithImagePlaceholders()}
              onChange={(html) => {
                // Remove image placeholders that were injected (they're managed separately)
                // But keep any that were added/edited in the editor
                setDraft({ ...draft, content: html });
              }}
              onPlaceholderCountChange={setPlaceholderCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
