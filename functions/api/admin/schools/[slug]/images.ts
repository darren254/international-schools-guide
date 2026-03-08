import { getAdminSql } from "@api/_db";
import { getSessionUserId } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const PHOTO_VARIANTS = Array.from({ length: 20 }, (_, i) => `photo${i + 1}`);
const ALLOWED_VARIANTS = new Set(["card", "profile", "hero", "og", "logo", "head", ...PHOTO_VARIANTS]);

function isValidVariant(v: string): boolean {
  return ALLOWED_VARIANTS.has(v);
}

export async function onRequestGet(
  context: { request: Request; params: Promise<{ slug: string }>; env: AdminEnv }
): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ error: "Unauthorized" }, 401);
  const { slug } = await context.params;
  try {
    const sql = await getAdminSql(context.env);
    const schools = (await sql`SELECT id FROM schools WHERE slug = ${slug}`) as { id: string }[];
    if (!schools?.[0]) return json({ error: "School not found" }, 404);
    const media = (await sql`
      SELECT id, variant, url, display_order, created_at
      FROM school_media WHERE school_id = ${schools[0].id}
      ORDER BY display_order, created_at
    `) as { id: string; variant: string; url: string; display_order: number; created_at: string }[];
    return json({ images: media });
  } catch (e) {
    return json(
      { error: "Failed to list images", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}

export async function onRequestPost(
  context: { request: Request; params: Promise<{ slug: string }>; env: AdminEnv }
): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ error: "Unauthorized" }, 401);
  const { slug } = await context.params;
  try {
    const sql = await getAdminSql(context.env);
    const schools = (await sql`SELECT id FROM schools WHERE slug = ${slug}`) as { id: string }[];
    if (!schools?.[0]) return json({ error: "School not found" }, 404);
    const schoolId = schools[0].id;
    const contentType = context.request.headers.get("Content-Type") ?? "";
    let variant = "photo1";
    let fileData: ArrayBuffer;
    if (contentType.includes("multipart/form-data")) {
      const formData = await context.request.formData();
      variant = (formData.get("variant") as string) || "photo1";
      if (!isValidVariant(variant)) variant = "photo1";
      const file = formData.get("file") as File | null;
      if (!file) return json({ error: "No file in form" }, 400);
      fileData = await file.arrayBuffer();
    } else {
      const body = await context.request.json() as { variant?: string; url?: string };
      variant = body.variant ?? "photo1";
      if (!isValidVariant(variant)) variant = "photo1";
      if (body.url) {
        const id = crypto.randomUUID();
        await sql`
          INSERT INTO school_media (id, school_id, variant, url, display_order)
          VALUES (${id}, ${schoolId}, ${variant}, ${String(body.url)}, 0)
        `;
        const row = (await sql`SELECT id, variant, url, display_order, created_at FROM school_media WHERE id = ${id}`) as { id: string; variant: string; url: string; display_order: number; created_at: string }[];
        return json({ ok: true, image: row[0] });
      }
      return json({ error: "Either file upload or url required" }, 400);
    }
    const bucket = context.env.R2_BUCKET;
    if (!bucket) return json({ error: "R2 not configured; use url in JSON body" }, 501);
    const ext = "webp";
    const key = `schools/${slug}/${crypto.randomUUID()}.${ext}`;
    await bucket.put(key, fileData, {
      httpMetadata: { contentType: "image/webp" },
    });
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO school_media (id, school_id, variant, url, display_order)
      VALUES (${id}, ${schoolId}, ${variant}, ${key}, 0)
    `;
    const row = (await sql`SELECT id, variant, url, display_order, created_at FROM school_media WHERE id = ${id}`) as { id: string; variant: string; url: string; display_order: number; created_at: string }[];
    return json({ ok: true, image: row[0] });
  } catch (e) {
    return json(
      { error: "Failed to add image", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}
