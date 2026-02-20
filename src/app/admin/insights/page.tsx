import { getAllDrafts } from "@/lib/insights/draft";
import Link from "next/link";

export default async function AdminInsightsPage() {
  const drafts = await getAllDrafts();

  return (
    <div className="container-site pt-6 pb-16">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-2">
          Insights Drafts
        </h1>
        <p className="text-charcoal-muted">
          Review and approve draft articles for publication.
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="bg-cream-50 border border-warm-border rounded-sm p-8 text-center">
          <p className="text-charcoal-muted">No drafts found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <Link
              key={draft.slug}
              href={`/admin/insights/${draft.slug}`}
              className="block bg-white border border-warm-border rounded-sm p-6 hover:border-hermes transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="font-display text-xl text-charcoal mb-2">
                    {draft.title}
                  </h2>
                  <p className="text-sm text-charcoal-muted mb-3">
                    {draft.summary}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-charcoal-muted">
                    <span>Slug: {draft.slug}</span>
                    <span>•</span>
                    <span>Category: {draft.category}</span>
                    <span>•</span>
                    <span>
                      Created: {new Date(draft.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      draft.status === "pending_review"
                        ? "bg-yellow-100 text-yellow-800"
                        : draft.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : draft.status === "published"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {draft.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
