import { neon } from "@neondatabase/serverless";

type Env = { DATABASE_URL?: string };

let tableReady: Promise<void> | null = null;

function ensureTable(sql: any) {
  if (tableReady) return tableReady;
  tableReady = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS reader_pulse_responses (
        id BIGSERIAL PRIMARY KEY,
        article_id TEXT NOT NULL,
        module_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        option_id TEXT NOT NULL,
        session_key TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (article_id, question_id, session_key)
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_reader_pulse_article_module_question
      ON reader_pulse_responses (article_id, module_id, question_id);
    `;
  })();
  return tableReady;
}

export async function getReaderPulseSql(env: Env) {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
  const sql = neon(env.DATABASE_URL);
  await ensureTable(sql);
  return sql;
}

