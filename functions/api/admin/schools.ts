import { getAdminSql } from "@api/_db";
import { getSessionUserId } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
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
    let schools: { id: string; name: string; slug: string; city_slug: string | null }[];
    if (citySlug) {
      schools = (await sql`
        SELECT id, name, slug, city_slug FROM schools
        WHERE city_slug = ${citySlug}
        ORDER BY name
      `) as { id: string; name: string; slug: string; city_slug: string | null }[];
    } else {
      schools = (await sql`
        SELECT id, name, slug, city_slug FROM schools
        ORDER BY city_slug, name
      `) as { id: string; name: string; slug: string; city_slug: string | null }[];
    }
    const mediaCounts = (await sql`
      SELECT school_id, COUNT(*) as count FROM school_media GROUP BY school_id
    `) as { school_id: string; count: string }[];
    const countBySchoolId: Record<string, number> = {};
    for (const r of mediaCounts) countBySchoolId[r.school_id] = parseInt(r.count, 10);
    const list = schools.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      citySlug: s.city_slug,
      imageCount: countBySchoolId[s.id] ?? 0,
    }));
    return json({ schools: list });
  } catch (e) {
    return json(
      { error: "Failed to list schools", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}
