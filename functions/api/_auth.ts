import { getAdminSql } from "@api/_db";
import type { AdminEnv } from "@api/_db";

const SESSION_COOKIE = "isg_admin_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

export async function getSessionUserId(
  request: Request,
  env: AdminEnv
): Promise<string | null> {
  const cookie = request.headers.get("Cookie");
  const sessionId = cookie
    ?.split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${SESSION_COOKIE}=`))
    ?.split("=")[1];
  if (!sessionId || !env.DATABASE_URL) return null;
  const sql = await getAdminSql(env);
  const rows = await sql`
    SELECT user_id FROM admin_sessions
    WHERE id = ${sessionId} AND expires_at > NOW()
  `;
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as { user_id: string }[])?.[0];
  return row?.user_id ?? null;
}

export function sessionResponse(
  sessionId: string,
  body: string,
  init: ResponseInit = {}
): Response {
  const res = new Response(body, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SEC}`,
      ...(init.headers as Record<string, string>),
    },
  });
  return res;
}

export function clearSessionResponse(body: string, init: ResponseInit = {}): Response {
  return new Response(body, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
      ...(init.headers as Record<string, string>),
    },
  });
}

/** Hash password with PBKDF2 for comparison. Caller must pass same salt used when storing. */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );
  const arr = new Uint8Array(bits);
  return btoa(String.fromCharCode(...Array.from(arr)));
}

/** Generate a random salt (base64). */
export function randomSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...Array.from(arr)));
}
