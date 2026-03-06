import { getAdminSql } from "@api/_db";
import { getSessionUserId, sessionResponse, hashPassword } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

function json(body: unknown, status = 200, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export async function onRequestPost(
  context: { request: Request; env: AdminEnv }
): Promise<Response> {
  try {
    const body = (await context.request.json()) as { email?: string; password?: string };
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";
    if (!email || !password) {
      return json({ error: "Email and password required" }, 400);
    }
    const sql = await getAdminSql(context.env);
    const users = (await sql`
      SELECT id, password_hash, password_salt FROM admin_users WHERE email = ${email}
    `) as { id: string; password_hash: string; password_salt: string }[];
    const user = users?.[0];
    if (!user) {
      return json({ error: "Invalid email or password" }, 401);
    }
    const hash = await hashPassword(password, user.password_salt);
    if (hash !== user.password_hash) {
      return json({ error: "Invalid email or password" }, 401);
    }
    const sessionId = crypto.randomUUID();
    await sql`
      INSERT INTO admin_sessions (id, user_id, expires_at)
      VALUES (${sessionId}, ${user.id}, NOW() + INTERVAL '7 days')
    `;
    return sessionResponse(sessionId, JSON.stringify({ ok: true }), {
      status: 200,
    });
  } catch (e) {
    return json(
      { error: "Login failed", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}

export async function onRequestGet(context: { request: Request; env: AdminEnv }): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ authenticated: false }, 200);
  return json({ authenticated: true }, 200);
}
