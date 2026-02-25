/**
 * Protected API: returns all schools. Requires Authorization: Bearer <ISG_API_KEY>
 */
// @ts-ignore - JSON import
import data from "./data/schools.json";

export function onRequestGet(context: { request: Request; env: { ISG_API_KEY?: string } }) {
  const apiKey = context.env.ISG_API_KEY;
  const auth = context.request.headers.get("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!apiKey || token !== apiKey) {
    return new Response(JSON.stringify({ error: "Unauthorized", message: "Valid API key required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
