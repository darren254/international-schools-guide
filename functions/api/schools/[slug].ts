/**
 * Protected API: returns a single school by slug. Requires Authorization: Bearer <ISG_API_KEY>
 */
// @ts-ignore - JSON import
import data from "../data/schools.json";

export function onRequestGet(
  context: { request: Request; params: { slug: string }; env: { ISG_API_KEY?: string } }
) {
  const apiKey = context.env.ISG_API_KEY;
  const auth = context.request.headers.get("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!apiKey || token !== apiKey) {
    return new Response(JSON.stringify({ error: "Unauthorized", message: "Valid API key required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const slug = context.params.slug;
  const school = data.schools.find((s: { slug: string }) => s.slug === slug);

  if (!school) {
    return new Response(JSON.stringify({ error: "Not found", message: `School '${slug}' not found` }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(school), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
