/**
 * Protected API proxy: returns single school static JSON by slug.
 * Requires Authorization: Bearer <ISG_API_KEY>
 */
export async function onRequestGet(context: {
  request: Request;
  params: { slug: string };
  env: { ISG_API_KEY?: string; ASSETS?: { fetch: (req: Request | URL | string) => Promise<Response> } };
}) {
  const apiKey = context.env.ISG_API_KEY;
  const auth = context.request.headers.get("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!apiKey || token !== apiKey) {
    return new Response(JSON.stringify({ error: "Unauthorized", message: "Valid API key required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!context.env.ASSETS) {
    return new Response(JSON.stringify({ error: "ASSETS binding missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const slug = context.params.slug;
  const assetUrl = new URL(`/api/schools/${slug}.json`, context.request.url);
  const assetRes = await context.env.ASSETS.fetch(assetUrl);
  if (!assetRes.ok) {
    return new Response(JSON.stringify({ error: "Not found", message: `School '${slug}' not found` }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(await assetRes.text(), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
