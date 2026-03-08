import { neon } from "@neondatabase/serverless";

export type AdminEnv = {
  DATABASE_URL?: string;
  ADMIN_SESSION_SECRET?: string;
  R2_BUCKET?: { put: (key: string, value: ArrayBuffer | ReadableStream, options?: unknown) => Promise<unknown> };
  APIFY_TOKEN?: string;
};

export async function getAdminSql(env: AdminEnv) {
  if (!env.DATABASE_URL) throw new Error("DATABASE_URL not configured");
  return neon(env.DATABASE_URL);
}
