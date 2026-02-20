"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { InsightDraft } from "@/lib/insights/draft";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { FloatingToolbar } from "@/components/editor/FloatingToolbar";

interface ReviewEditorProps {
  draft: InsightDraft;
}

interface ImageEditorProps {
  image: string;
  index: number;
  onUpdate: (index: number, newUrl: string) => void;
  onDelete: (index: number) => void;
}

function ImageEditor({ image, index, onUpdate, onDelete }: ImageEditorProps) {
  const [editing, setEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(image);

  if (image.startsWith("[IMAGE NEEDED:")) {
    return (
      <div className="bg-cream-50 border border-warm-border rounded-sm overflow-hidden">
        <div className="p-6">
          {editing ? (
            <div>
              <textarea
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full text-sm bg-white border-2 border-hermes rounded-sm p-3 mb-2 resize-y min-h-[80px]"
                placeholder="Enter image URL or placeholder text"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onUpdate(index, imageUrl);
                    setEditing(false);
                  }}
                  className="px-4 py-2 bg-hermes text-white text-sm rounded-sm hover:bg-hermes-hover"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setImageUrl(image);
                    setEditing(false);
                  }}
                  className="px-4 py-2 border border-warm-border text-charcoal text-sm rounded-sm hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded-sm ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="font-semibold mb-2 text-charcoal-muted">Placeholder {index + 1}</div>
              <div className="text-sm text-charcoal-muted mb-3">{image}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 border border-warm-border text-charcoal text-sm rounded-sm hover:bg-cream-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 border border-warm-border rounded-sm overflow-hidden">
      <div className="relative">
        <img
          src={image}
          alt={`Image ${index + 1}`}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const errorDiv = target.nextElementSibling as HTMLElement;
            if (errorDiv) errorDiv.classList.remove('hidden');
          }}
        />
        <div className="hidden absolute inset-0 bg-cream-200 flex items-center justify-center text-charcoal-muted text-sm">
          Image failed to load
        </div>
      </div>
      {editing ? (
        <div className="p-4 border-t border-warm-border">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full text-sm bg-white border-2 border-hermes rounded-sm p-2 mb-2"
            placeholder="Enter image URL"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                onUpdate(index, imageUrl);
                setEditing(false);
              }}
              className="px-4 py-2 bg-hermes text-white text-sm rounded-sm hover:bg-hermes-hover"
            >
              Save
            </button>
            <button
              onClick={() => {
                setImageUrl(image);
                setEditing(false);
              }}
              className="px-4 py-2 border border-warm-border text-charcoal text-sm rounded-sm hover:bg-cream-100"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(index)}
              className="px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded-sm ml-auto"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-warm-border flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 border border-warm-border text-charcoal text-sm rounded-sm hover:bg-cream-100"
          >
            Replace
          </button>
          <button
            onClick={() => onDelete(index)}
            className="px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export function ReviewEditor({ draft: initialDraft }: ReviewEditorProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [placeholderCount, setPlaceholderCount] = useState(0);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>(JSON.stringify(draft));

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

      {/* Article Content - Rich Text Editor */}
      <div className="bg-white border border-warm-border rounded-sm mb-8">
        <div className="border-b border-warm-border p-4 flex items-center justify-between">
          <h3 className="font-display text-lg">Article Content</h3>
          {placeholderCount > 0 && (
            <div className="text-sm text-red-600 font-medium">
              ⚠️ {placeholderCount} placeholder{placeholderCount > 1 ? "s" : ""} need{placeholderCount === 1 ? "s" : ""} resolution
            </div>
          )}
        </div>
        <div className="relative">
          <RichTextEditor
            content={draft.content}
            onChange={(html) => setDraft({ ...draft, content: html })}
            onPlaceholderCountChange={setPlaceholderCount}
          />
        </div>
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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Images</h3>
          <button
            onClick={() => {
              const newImages = [...(draft.images || []), "[IMAGE NEEDED: New image]"];
              setDraft({ ...draft, images: newImages });
            }}
            className="text-sm text-hermes hover:text-hermes-hover font-medium"
          >
            + Add Image
          </button>
        </div>
        {draft.images && draft.images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draft.images.map((img, i) => {
              const [editing, setEditing] = useState(false);
              const [imageUrl, setImageUrl] = useState(img);
              
              return (
                <div
                  key={i}
                  className="bg-cream-50 border border-warm-border rounded-sm overflow-hidden"
                >
                  {img.startsWith("[IMAGE NEEDED:") ? (
                    <div className="p-6">
                      {editing ? (
                        <div>
                          <textarea
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full text-sm bg-white border-2 border-hermes rounded-sm p-3 mb-2 resize-y min-h-[80px]"
                            placeholder="Enter image URL or placeholder text"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newImages = [...draft.images!];
                                newImages[i] = imageUrl;
                                setDraft({ ...draft, images: newImages });
                                setEditing(false);
                              }}
                              className="px-4 py-2 bg-hermes text-white text-sm rounded-sm hover:bg-hermes-hover"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setImageUrl(img);
                                setEditing(false);
                              }}
                              className="px-4 py-2 border border-warm-border text-charcoal text-sm rounded-sm hover:bg-cream-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                const newImages = draft.images!.filter((_, idx) => idx !== i);
                                setDraft({ ...draft, images: newImages.length > 0 ? newImages : undefined });
                              }}
                              className="px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded-sm ml-auto"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold mb-2 text-charcoal-muted">Placeholder {i + 1}</div>
                          <div className="text-sm text-charcoal-muted mb-3">{img}</div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditing(true)}
                              className="px-4 py-2 border border-warm-border text-charcoal text-sm rounded-sm hover:bg-cream-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                const newImages = draft.images!.filter((_, idx) => idx !== i);
                                setDraft({ ...draft, images: newImages.length > 0 ? newImages : undefined });
                              }}
                              className="px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <img
                          src={img}
                          alt={`Image ${i + 1}`}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden absolute inset-0 bg-cream-200 flex items-center justify-center text-charcoal-muted text-sm">
                          Image failed to load
                        </div>
                      </div>
                      {editing ? (
                        <div className="p-4 border-t border-warm-border">
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full text-sm bg-white border-2 border-hermes rounded-sm p-2 mb-2"
                            placeholder="Enter image URL"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newImages = [...draft.images!];
                                newImages[i] = imageUrl;
                                setDraft({ ...draft, images: newImages });
                                setEditing(false);
                              }}
                              className="px-4 py-2 bg-hermes text-white text-sm rounded-sm hover:bg-hermes-hover"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setImageUrl(img);
                                setEditing(false);
                              }}
                              className="px-4 py-2 border border-warm-border text-charcoal text-sm rounded-sm hover:bg-cream-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                const newImages = draft.images!.filter((_, idx) => idx !== i);
                                setDraft({ ...draft, images: newImages.length > 0 ? newImages : undefined });
                              }}
                              className="px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded-sm ml-auto"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 border-t border-warm-border flex gap-2">
                          <button
                            onClick={() => setEditing(true)}
                            className="px-4 py-2 border border-warm-border text-charcoal text-sm rounded-sm hover:bg-cream-100"
                          >
                            Replace
                          </button>
                          <button
                            onClick={() => {
                              const newImages = draft.images!.filter((_, idx) => idx !== i);
                              setDraft({ ...draft, images: newImages.length > 0 ? newImages : undefined });
                            }}
                            className="px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-cream-50 border border-warm-border rounded-sm p-8 text-center text-charcoal-muted">
            <p className="mb-4">No images added yet</p>
            <button
              onClick={() => {
                setDraft({ ...draft, images: ["[IMAGE NEEDED: New image]"] });
              }}
              className="px-6 py-2 bg-hermes text-white rounded-sm hover:bg-hermes-hover"
            >
              Add First Image
            </button>
          </div>
        )}
      </div>

      {/* Publish Button (sticky at bottom) */}
      <div className="sticky bottom-0 bg-cream border-t border-warm-border p-6 -mx-6 mt-8 shadow-lg">
        <div className="container-site flex items-center justify-between">
          <div className="text-sm text-charcoal-muted">
            {placeholderCount > 0
              ? `⚠️ ${placeholderCount} placeholder${placeholderCount > 1 ? "s" : ""} must be resolved before publishing`
              : "Ready to publish? Click the button to approve this article."}
          </div>
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
      </div>
    </div>
  );
}
