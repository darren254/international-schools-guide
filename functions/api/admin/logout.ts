import { getSessionUserId, clearSessionResponse } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

export async function onRequestPost(
  context: { request: Request; env: AdminEnv }
): Promise<Response> {
  await getSessionUserId(context.request, context.env);
  return clearSessionResponse(JSON.stringify({ ok: true }), { status: 200 });
}
