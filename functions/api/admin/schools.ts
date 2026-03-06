import { getAdminSql } from "@api/_db";
import { getSessionUserId } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

function json(body: unknown, status = 200, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export async function onRequestGet(
  context: { request: Request; env: AdminEnv }
): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ error: "Unauthorized" }, 401);
  try {
    const sql = await getAdminSql(context.env);
    const url = new URL(context.request.url);
    const citySlug = url.searchParams.get("city");
    type Row = { id: string; name: string; slug: string; city_slug: string | null; image_count: string };
    let rows: Row[];
    if (citySlug) {
      rows = (await sql`
        SELECT s.id, s.name, s.slug, s.city_slug, COUNT(m.id)::text AS image_count
        FROM schools s
        LEFT JOIN school_media m ON m.school_id = s.id
        WHERE s.city_slug = ${citySlug}
        GROUP BY s.id, s.name, s.slug, s.city_slug
        ORDER BY s.name
      `) as Row[];
    } else {
      rows = (await sql`
        SELECT s.id, s.name, s.slug, s.city_slug, COUNT(m.id)::text AS image_count
        FROM schools s
        LEFT JOIN school_media m ON m.school_id = s.id
        GROUP BY s.id, s.name, s.slug, s.city_slug
        ORDER BY s.city_slug, s.name
      `) as Row[];
    }
    const list = rows.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      citySlug: s.city_slug,
      imageCount: parseInt(s.image_count, 10) || 0,
    }));
    return json(
      { schools: list },
      200,
      { "Cache-Control": "private, max-age=60" }
    );
  } catch (e) {
    return json(
      { error: "Failed to list schools", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}
