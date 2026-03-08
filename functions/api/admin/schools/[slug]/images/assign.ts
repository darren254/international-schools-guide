import { getAdminSql } from "@api/_db";
import { getSessionUserId } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const PHOTO_VARIANTS = Array.from({ length: 20 }, (_, i) => `photo${i + 1}`) as readonly string[];
const VARIANTS = ["card", "profile", "hero", "og", "logo", "head", ...PHOTO_VARIANTS] as const;

export async function onRequestPatch(
  context: { request: Request; params: Promise<{ slug: string }>; env: AdminEnv }
): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ error: "Unauthorized" }, 401);
  const { slug } = await context.params;
  try {
    const body = (await context.request.json()) as { imageId: string; variant: string };
    const { imageId, variant } = body;
    if (!imageId || !variant || !VARIANTS.includes(variant as (typeof VARIANTS)[number])) {
      return json({ error: "imageId and variant (card|profile|hero|og|logo|head|photo1..photo20) required" }, 400);
    }
    const sql = await getAdminSql(context.env);
    const schools = (await sql`SELECT id FROM schools WHERE slug = ${slug}`) as { id: string }[];
    if (!schools?.[0]) return json({ error: "School not found" }, 404);
    const schoolId = schools[0].id;
    const media = (await sql`SELECT id, url FROM school_media WHERE id = ${imageId} AND school_id = ${schoolId}`) as { id: string; url: string }[];
    if (!media?.[0]) return json({ error: "Image not found" }, 404);
    await sql`UPDATE school_media SET variant = ${variant} WHERE id = ${imageId}`;
    const url = media[0].url;
    if (variant === "hero") await sql`UPDATE schools SET hero_image_url = ${url}, last_updated = NOW() WHERE id = ${schoolId}`;
    else if (variant === "og") await sql`UPDATE schools SET og_image_url = ${url}, last_updated = NOW() WHERE id = ${schoolId}`;
    else if (variant === "logo") await sql`UPDATE schools SET logo_url = ${url}, last_updated = NOW() WHERE id = ${schoolId}`;
    else if (variant === "head") await sql`UPDATE schools SET head_photo_url = ${url}, last_updated = NOW() WHERE id = ${schoolId}`;
    return json({ ok: true, variant, url });
  } catch (e) {
    return json(
      { error: "Failed to assign image", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}
