import { getSessionUserId } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const GITHUB_OWNER = "darren254";
const GITHUB_REPO = "international-schools-guide";
const WORKFLOW_FILE = "publish-from-admin.yml";

export async function onRequestPost(
  context: { request: Request; env: AdminEnv }
): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ error: "Unauthorized" }, 401);

  const pat = context.env.GITHUB_PAT;
  if (!pat) {
    return json({ error: "GITHUB_PAT not configured" }, 500);
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pat}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "ISG-Admin",
        },
        body: JSON.stringify({ ref: "main" }),
      }
    );

    if (res.status === 204) {
      return json({ ok: true, message: "Publish triggered. Changes will be live in ~5 minutes." });
    }

    const body = await res.text();
    return json(
      { error: "GitHub API error", status: res.status, detail: body },
      502
    );
  } catch (e) {
    return json(
      { error: "Failed to trigger publish", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}
