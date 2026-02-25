import { getReaderPulseSql } from "./_db";

type VotePayload = {
  article_id?: string;
  module_id?: string;
  question_id?: string;
  option_id?: string;
  session_key?: string;
  timestamp?: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context: {
  request: Request;
  env: { DATABASE_URL?: string };
}) {
  try {
    const payload = (await context.request.json()) as VotePayload;
    const articleId = payload.article_id?.trim();
    const moduleId = payload.module_id?.trim();
    const questionId = payload.question_id?.trim();
    const optionId = payload.option_id?.trim();
    const sessionKey = payload.session_key?.trim();

    if (!articleId || !moduleId || !questionId || !optionId || !sessionKey) {
      return json({ error: "Missing required fields" }, 400);
    }

    const sql = await getReaderPulseSql(context.env);

    const result = await sql`
      INSERT INTO reader_pulse_responses (
        article_id,
        module_id,
        question_id,
        option_id,
        session_key,
        created_at
      )
      VALUES (
        ${articleId},
        ${moduleId},
        ${questionId},
        ${optionId},
        ${sessionKey},
        NOW()
      )
      ON CONFLICT (article_id, question_id, session_key) DO NOTHING
      RETURNING id;
    `;

    const inserted = Array.isArray(result) && result.length > 0;
    return json({ ok: true, inserted, duplicate: !inserted });
  } catch (error) {
    return json(
      {
        error: "Failed to record vote",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}

