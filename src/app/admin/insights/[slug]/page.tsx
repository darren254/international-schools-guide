import { getDraft, getAllDrafts } from "@/lib/insights/draft";
import { notFound } from "next/navigation";
import { ReviewEditor } from "./ReviewEditor";

// Generate static params for all drafts
export async function generateStaticParams() {
  try {
    const drafts = await getAllDrafts();
    const params = drafts.map((draft) => ({
      slug: draft.slug,
    }));
    if (params.length === 0) {
      console.warn("[Admin Insights] No drafts found - route will not be generated");
    } else {
      console.log(`[Admin Insights] Generated ${params.length} static params:`, params.map(p => p.slug));
    }
    return params;
  } catch (error) {
    console.error("Error generating static params for admin insights:", error);
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

  return <ReviewEditor draft={draft} />;
}
