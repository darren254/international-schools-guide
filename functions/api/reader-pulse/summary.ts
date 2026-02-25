import { getReaderPulseSql } from "./_db";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=120" },
  });
}

export async function onRequestGet(context: {
  request: Request;
  env: { DATABASE_URL?: string };
}) {
  try {
    const url = new URL(context.request.url);
    const articleId = url.searchParams.get("article_id")?.trim() ?? "";
    const moduleId = url.searchParams.get("module_id")?.trim() ?? "";
    const questionIds = (url.searchParams.get("question_ids") ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 3);

    if (!articleId || !moduleId || questionIds.length === 0) {
      return json({ error: "Missing required query params" }, 400);
    }

    const sql = await getReaderPulseSql(context.env);

    const counts: Record<string, Record<string, number>> = {};
    const totals: Record<string, number> = {};

    for (const questionId of questionIds) {
      const rows = await sql`
        SELECT option_id, COUNT(*)::int AS count
        FROM reader_pulse_responses
        WHERE article_id = ${articleId}
          AND module_id = ${moduleId}
          AND question_id = ${questionId}
        GROUP BY option_id;
      `;

      counts[questionId] = {};
      totals[questionId] = 0;
      for (const r of rows as Array<{ option_id: string; count: number }>) {
        counts[questionId][r.option_id] = Number(r.count);
        totals[questionId] += Number(r.count);
      }
    }

    return json({ article_id: articleId, module_id: moduleId, counts, totals });
  } catch (error) {
    return json(
      {
        error: "Failed to load summary",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}

