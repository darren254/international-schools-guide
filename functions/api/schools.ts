/**
 * Protected API proxy: returns all schools from static JSON asset.
 * Requires Authorization: Bearer <ISG_API_KEY>
 */
export async function onRequestGet(context: {
  request: Request;
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

  const assetUrl = new URL("/api/schools.json", context.request.url);
  const assetRes = await context.env.ASSETS.fetch(assetUrl);
  if (!assetRes.ok) {
    return new Response(JSON.stringify({ error: "schools asset not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(await assetRes.text(), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
