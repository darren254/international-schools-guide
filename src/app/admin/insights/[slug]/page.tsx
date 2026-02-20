import { getDraft, getAllDrafts } from "@/lib/insights/draft";
import { notFound } from "next/navigation";
import Link from "next/link";

// Generate static params for all drafts
export async function generateStaticParams() {
  try {
    const drafts = await getAllDrafts();
    const params = drafts.map((draft) => ({
      slug: draft.slug,
    }));
    // Log for debugging during build
    if (params.length === 0) {
      console.warn("[Admin Insights] No drafts found - route will not be generated");
    } else {
      console.log(`[Admin Insights] Generated ${params.length} static params:`, params.map(p => p.slug));
    }
    return params;
  } catch (error) {
    console.error("Error generating static params for admin insights:", error);
    // Return empty array - route won't be generated without params in static export
    return [];
  }
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const draft = await getDraft(slug);

  if (!draft) {
    notFound();
  }

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
        <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-2">
          Review Article
        </h1>
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

      {/* Article Info */}
      <div className="bg-cream-50 border border-warm-border rounded-sm p-6 mb-8">
        <h2 className="font-display text-xl mb-4">Article Details</h2>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Title:</strong> {draft.title}
          </div>
          <div>
            <strong>Slug:</strong> {draft.slug}
          </div>
          <div>
            <strong>Summary:</strong> {draft.summary}
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
          <h2 className="font-display text-xl mb-4">Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draft.images.map((img, i) => {
              // Handle placeholder images
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

      {/* Content Viewer */}
      <div className="mb-8">
        <h2 className="font-display text-xl mb-4">Content</h2>
        <div className="prose-hermes bg-white border border-warm-border rounded-sm p-8">
          <div dangerouslySetInnerHTML={{ __html: draft.content }} />
        </div>
      </div>

      {/* Approval Instructions */}
      <div className="border-t border-warm-border pt-8">
        <div className="bg-hermes/10 border border-hermes/20 rounded-sm p-6 mb-6">
          <h2 className="font-display text-xl mb-3 text-charcoal">
            How to Approve This Article
          </h2>
          <p className="text-sm text-charcoal mb-4">
            Since this site uses static export, approval requires updating the
            draft file and rebuilding. Follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-charcoal mb-4">
            <li>
              Open the draft file:{" "}
              <code className="bg-white px-2 py-1 rounded text-xs">
                src/content/insights/drafts/{slug}.json
              </code>
            </li>
            <li>
              Change the <code className="bg-white px-2 py-1 rounded text-xs">
                "status"
              </code>{" "}
              field from <code className="bg-white px-2 py-1 rounded text-xs">
                "{draft.status}"
              </code>{" "}
              to <code className="bg-white px-2 py-1 rounded text-xs">
                "approved"
              </code>
            </li>
            <li>
              Commit and push the change to GitHub:
              <pre className="bg-white mt-2 p-3 rounded text-xs overflow-x-auto">
                git add src/content/insights/drafts/{slug}.json{`\n`}
                git commit -m "Approve {slug}"{`\n`}
                git push
              </pre>
            </li>
            <li>
              The next build will automatically process approved drafts and
              publish them.
            </li>
          </ol>
        </div>

        <div className="flex gap-4">
          <a
            href={`https://github.com/darren254/international-schools-guide/edit/main/src/content/insights/drafts/${slug}.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-hermes text-white font-semibold rounded-sm hover:bg-hermes-hover transition-colors inline-block"
          >
            Edit Draft File on GitHub
          </a>
          <Link
            href="/admin/insights"
            className="px-8 py-3 border border-warm-border text-charcoal rounded-sm hover:bg-cream-100 transition-colors inline-block"
          >
            Back to All Drafts
          </Link>
        </div>
      </div>
    </div>
  );
}
