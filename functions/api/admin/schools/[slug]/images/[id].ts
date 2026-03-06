import { getAdminSql } from "@api/_db";
import { getSessionUserId } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestDelete(
  context: { request: Request; params: Promise<{ slug: string; id: string }>; env: AdminEnv }
): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ error: "Unauthorized" }, 401);
  const { slug, id: imageId } = await context.params;
  try {
    const sql = await getAdminSql(context.env);
    const schools = (await sql`SELECT id FROM schools WHERE slug = ${slug}`) as { id: string }[];
    if (!schools?.[0]) return json({ error: "School not found" }, 404);
    const deleted = await sql`
      DELETE FROM school_media
      WHERE id = ${imageId} AND school_id = ${schools[0].id}
      RETURNING id
    `;
    if (!(deleted as { id: string }[])?.[0]) return json({ error: "Image not found" }, 404);
    return json({ ok: true });
  } catch (e) {
    return json(
      { error: "Failed to delete image", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}
