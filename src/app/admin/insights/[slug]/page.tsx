"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getDraft, updateDraftStatus, type InsightDraft } from "@/lib/insights/draft";

export default function ReviewPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [draft, setDraft] = useState<InsightDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    // Note: This won't work with static export - needs API route or database
    // For now, this is a template for when we switch to server rendering
    loadDraft();
  }, [slug]);

  async function loadDraft() {
    try {
      // This would call an API route in a server-rendered setup
      // For static export, drafts would be loaded differently
      const response = await fetch(`/api/admin/drafts/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setDraft(data);
        setEditedContent(data.content);
      } else {
        console.error("Failed to load draft");
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    if (!draft) return;
    
    setPublishing(true);
    try {
      const response = await fetch(`/api/admin/drafts/${slug}/approve`, {
        method: "POST",
      });
      
      if (response.ok) {
        alert("Article approved and published!");
        window.location.href = "/admin/insights";
      } else {
        alert("Failed to publish article");
      }
    } catch (error) {
      console.error("Error approving:", error);
      alert("Error publishing article");
    } finally {
      setPublishing(false);
    }
  }

  async function handleSaveEdit() {
    if (!draft) return;
    
    try {
      const response = await fetch(`/api/admin/drafts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });
      
      if (response.ok) {
        setEditing(false);
        await loadDraft();
        alert("Changes saved");
      } else {
        alert("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving changes");
    }
  }

  if (loading) {
    return (
      <div className="container-site pt-6 pb-16">
        <p>Loading...</p>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="container-site pt-6 pb-16">
        <h1>Draft not found</h1>
        <Link href="/admin/insights">Back to drafts</Link>
      </div>
    );
  }

  return (
    <div className="container-site pt-6 pb-16">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/insights" className="text-sm text-charcoal-muted hover:text-hermes mb-4 inline-block">
          ← Back to drafts
        </Link>
        <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-2">
          Review Article
        </h1>
        <div className="flex items-center gap-4 text-sm text-charcoal-muted">
          <span>Status: <strong className="text-charcoal">{draft.status}</strong></span>
          <span>•</span>
          <span>Category: {draft.category}</span>
          <span>•</span>
          <span>Created: {new Date(draft.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Article Info */}
      <div className="bg-cream-50 border border-warm-border rounded-sm p-6 mb-8">
        <h2 className="font-display text-xl mb-4">Article Details</h2>
        <div className="space-y-2 text-sm">
          <div><strong>Title:</strong> {draft.title}</div>
          <div><strong>Slug:</strong> {draft.slug}</div>
          <div><strong>Summary:</strong> {draft.summary}</div>
        </div>
      </div>

      {/* Images */}
      {draft.images && draft.images.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-xl mb-4">Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {draft.images.map((img, i) => (
              <div key={i} className="bg-cream-200 rounded-sm overflow-hidden">
                <img src={img} alt={`Image ${i + 1}`} className="w-full h-48 object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Editor/Viewer */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Content</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 border border-charcoal text-charcoal text-sm rounded-sm hover:bg-charcoal hover:text-cream transition-colors"
            >
              Edit Content
            </button>
          )}
        </div>
        
        {editing ? (
          <div>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-96 p-4 border border-warm-border rounded-sm font-mono text-sm"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-hermes text-white rounded-sm hover:bg-hermes-hover transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditedContent(draft.content);
                }}
                className="px-6 py-2 border border-warm-border text-charcoal rounded-sm hover:bg-cream-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="prose-hermes bg-white border border-warm-border rounded-sm p-8">
            <div dangerouslySetInnerHTML={{ __html: draft.content }} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-warm-border pt-8">
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            disabled={publishing}
            className="px-8 py-3 bg-hermes text-white font-semibold rounded-sm hover:bg-hermes-hover transition-colors disabled:opacity-50"
          >
            {publishing ? "Publishing..." : "Approve & Publish"}
          </button>
          <button className="px-8 py-3 border border-warm-border text-charcoal rounded-sm hover:bg-cream-100 transition-colors">
            Request Changes
          </button>
        </div>
        <p className="text-sm text-charcoal-muted mt-4">
          Note: With static export, publishing requires a rebuild. This button will trigger a GitHub Action or manual deploy.
        </p>
      </div>
    </div>
  );
}
