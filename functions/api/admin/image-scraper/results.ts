import { getSessionUserId } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

const APIFY_BASE = "https://api.apify.com/v2";
const BLOCKED_HOSTS = ["instagram.com", "facebook.com", "fb.com", "youtube.com", "tiktok.com"];
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const TOP_N = 5;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type ApifyRun = { data: { status: string } };
type ApifyItem = {
  image_url?: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  page_url?: string;
};

function isBlockedUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return BLOCKED_HOSTS.some((h) => lower.includes(h));
}

export async function onRequestGet(
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

  const url = new URL(context.request.url);
  const runId = url.searchParams.get("runId");
  if (!runId) return json({ error: "runId is required" }, 400);

  try {
    const runRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}`, {
      headers: { Authorization: `Bearer ${context.env.APIFY_TOKEN}` },
    });
    if (!runRes.ok) {
      return json(
        { status: "failed", error: `Apify API error: ${runRes.status}` },
        200
      );
    }

    const runData = (await runRes.json()) as ApifyRun;
    const status = runData?.data?.status;

    if (status === "RUNNING" || status === "READY") {
      return json({ status: "running" });
    }

    if (status === "FAILED" || status === "ABORTED" || status === "TIMED-OUT") {
      return json({ status: "failed", error: status });
    }

    if (status !== "SUCCEEDED") {
      return json({ status: "running" });
    }

    const datasetRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}/dataset/items`, {
      headers: { Authorization: `Bearer ${context.env.APIFY_TOKEN}` },
    });
    if (!datasetRes.ok) {
      return json({ status: "failed", error: "Failed to fetch dataset" }, 200);
    }

    const items = (await datasetRes.json()) as ApifyItem[];
    const filtered = items.filter((item) => {
      const imgUrl = item.image_url;
      const pageUrl = item.page_url ?? "";
      if (!imgUrl || isBlockedUrl(imgUrl) || isBlockedUrl(pageUrl)) return false;
      const w = item.width ?? 0;
      const h = item.height ?? 0;
      return w >= MIN_WIDTH && h >= MIN_HEIGHT;
    });

    const top = filtered.slice(0, TOP_N).map((item) => ({
      url: item.image_url!,
      thumbnailUrl: item.thumbnail_url ?? item.image_url,
      width: item.width,
      height: item.height,
    }));

    return json({ status: "succeeded", images: top });
  } catch (e) {
    return json(
      {
        status: "failed",
        error: e instanceof Error ? e.message : String(e),
      },
      200
    );
  }
}
