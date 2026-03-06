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
  context: { request: Request; params: Promise<{ slug: string }>; env: AdminEnv }
): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ error: "Unauthorized" }, 401);
  const { slug } = await context.params;
  try {
    const sql = await getAdminSql(context.env);
    const schools = (await sql`
      SELECT * FROM schools WHERE slug = ${slug} LIMIT 1
    `) as Record<string, unknown>[];
    const school = schools?.[0];
    if (!school) return json({ error: "School not found" }, 404);
    const media = (await sql`
      SELECT id, variant, url, display_order, created_at
      FROM school_media
      WHERE school_id = ${school.id as string}
      ORDER BY display_order, created_at
    `) as { id: string; variant: string; url: string; display_order: number; created_at: string }[];
    return json({ school, images: media });
  } catch (e) {
    return json(
      { error: "Failed to load school", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}

export async function onRequestPatch(
  context: { request: Request; params: Promise<{ slug: string }>; env: AdminEnv }
): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ error: "Unauthorized" }, 401);
  const { slug } = await context.params;
  try {
    const body = (await context.request.json()) as Record<string, unknown>;
    const sql = await getAdminSql(context.env);
    const existing = (await sql`SELECT id FROM schools WHERE slug = ${slug}`) as { id: string }[];
    if (!existing?.[0]) return json({ error: "School not found" }, 404);
    const schoolId = existing[0].id;
    if (body.name != null) await sql`UPDATE schools SET name = ${String(body.name)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.metaTitle != null) await sql`UPDATE schools SET meta_title = ${String(body.metaTitle)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.metaDescription != null) await sql`UPDATE schools SET meta_description = ${String(body.metaDescription)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.phone != null) await sql`UPDATE schools SET phone = ${String(body.phone)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.email != null) await sql`UPDATE schools SET email = ${String(body.email)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.website != null) await sql`UPDATE schools SET website = ${String(body.website)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.headName != null) await sql`UPDATE schools SET head_name = ${String(body.headName)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.headBio != null) await sql`UPDATE schools SET head_bio = ${String(body.headBio)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.headCredentials != null) await sql`UPDATE schools SET head_credentials = ${String(body.headCredentials)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.intelligenceSummary != null) await sql`UPDATE schools SET intelligence_summary = ${String(body.intelligenceSummary)}, intelligence_updated_at = NOW(), last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.heroImageUrl != null) await sql`UPDATE schools SET hero_image_url = ${String(body.heroImageUrl)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.ogImageUrl != null) await sql`UPDATE schools SET og_image_url = ${String(body.ogImageUrl)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.logoUrl != null) await sql`UPDATE schools SET logo_url = ${String(body.logoUrl)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.addressFull != null) await sql`UPDATE schools SET address_full = ${String(body.addressFull)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.studentCount != null) await sql`UPDATE schools SET student_count = ${String(body.studentCount)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.ageRange != null) await sql`UPDATE schools SET age_range = ${String(body.ageRange)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.headSince != null) {
      const v = body.headSince === "" ? null : Number(body.headSince);
      if (v !== null && !Number.isNaN(v)) await sql`UPDATE schools SET head_since = ${v}, last_updated = NOW() WHERE id = ${schoolId}`;
    }
    if (body.studentBodyDescription != null) await sql`UPDATE schools SET student_body_description = ${String(body.studentBodyDescription)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.academicDescription != null) await sql`UPDATE schools SET academic_description = ${String(body.academicDescription)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.schoolLifeDescription != null) await sql`UPDATE schools SET school_life_description = ${String(body.schoolLifeDescription)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.lastInspected != null) await sql`UPDATE schools SET last_inspected = ${body.lastInspected === "" ? null : String(body.lastInspected)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.inspectionBody != null) await sql`UPDATE schools SET inspection_body = ${String(body.inspectionBody)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.inspectionRating != null) await sql`UPDATE schools SET inspection_rating = ${String(body.inspectionRating)}, last_updated = NOW() WHERE id = ${schoolId}`;
    if (body.inspectionFindings != null) await sql`UPDATE schools SET inspection_findings = ${String(body.inspectionFindings)}, last_updated = NOW() WHERE id = ${schoolId}`;
    const updated = (await sql`SELECT * FROM schools WHERE id = ${schoolId}`) as Record<string, unknown>[];
    return json({ ok: true, school: updated[0] });
  } catch (e) {
    return json(
      { error: "Failed to update school", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}
