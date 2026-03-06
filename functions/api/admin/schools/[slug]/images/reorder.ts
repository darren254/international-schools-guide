import { getAdminSql } from "@api/_db";
import { getSessionUserId } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPatch(
  context: { request: Request; params: Promise<{ slug: string }>; env: AdminEnv }
): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ error: "Unauthorized" }, 401);
  const { slug } = await context.params;
  try {
    const body = (await context.request.json()) as { orderedIds: string[] };
    const { orderedIds } = body;
    if (!Array.isArray(orderedIds)) return json({ error: "orderedIds array required" }, 400);
    const sql = await getAdminSql(context.env);
    const schools = (await sql`SELECT id FROM schools WHERE slug = ${slug}`) as { id: string }[];
    if (!schools?.[0]) return json({ error: "School not found" }, 404);
    const schoolId = schools[0].id;
    for (let i = 0; i < orderedIds.length; i++) {
      await sql`UPDATE school_media SET display_order = ${i} WHERE id = ${orderedIds[i]} AND school_id = ${schoolId}`;
    }
    const media = (await sql`
      SELECT id, variant, url, display_order, created_at
      FROM school_media WHERE school_id = ${schoolId}
      ORDER BY display_order, created_at
    `) as { id: string; variant: string; url: string; display_order: number; created_at: string }[];
    return json({ ok: true, images: media });
  } catch (e) {
    return json(
      { error: "Failed to reorder images", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}
