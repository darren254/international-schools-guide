import { getSessionUserId } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

const APIFY_ACTOR_ID = "thodor~google-images-up-to-30k";
const APIFY_BASE = "https://api.apify.com/v2";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(
  context: { request: Request; env: AdminEnv }
): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ error: "Unauthorized" }, 401);

  if (!context.env.APIFY_TOKEN) {
    return json(
      { error: "Image scraper not configured", detail: "APIFY_TOKEN is not set" },
      503
    );
  }

  try {
    const body = (await context.request.json()) as { schoolName?: string; city?: string };
    const schoolName = typeof body.schoolName === "string" ? body.schoolName.trim() : "";
    if (!schoolName) return json({ error: "schoolName is required" }, 400);

    const city = typeof body.city === "string" ? body.city.trim() : "";
    const searchQuery = [schoolName, city, "campus", "building", "school"]
      .filter(Boolean)
      .join(" ");

    const res = await fetch(`${APIFY_BASE}/acts/${APIFY_ACTOR_ID}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.env.APIFY_TOKEN}`,
      },
      body: JSON.stringify({
        search_query: searchQuery,
        max_results: 15,
        get_related_images: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return json(
        { error: "Failed to start Apify run", detail: err },
        502
      );
    }

    const data = (await res.json()) as { data: { id: string } };
    const runId = data?.data?.id;
    if (!runId) return json({ error: "No run ID in Apify response" }, 502);

    return json({ runId });
  } catch (e) {
    return json(
      { error: "Failed to start scrape", detail: e instanceof Error ? e.message : String(e) },
      500
    );
  }
}
