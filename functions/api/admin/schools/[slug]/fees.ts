import { getAdminSql } from "@api/_db";
import { getSessionUserId } from "@api/_auth";
import type { AdminEnv } from "@api/_db";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestGet(
  context: { request: Request; params: Promise<{ slug: string }>; env: AdminEnv }
): Promise<Response> {
  const userId = await getSessionUserId(context.request, context.env);
  if (!userId) return json({ error: "Unauthorized" }, 401);
  const { slug } = await context.params;
  try {
    const sql = await getAdminSql(context.env);
    const schools = (await sql`SELECT id FROM schools WHERE slug = ${slug}`) as { id: string }[];
    if (!schools?.[0]) return json({ error: "School not found" }, 404);
    const schoolId = schools[0].id;

    const feeRows = (await sql`
      SELECT id, academic_year, grade_level, grade_ages, tuition_fee, capital_fee,
             enrollment_guarantee_fee, total_fee_early_bird, total_fee_standard, display_order
      FROM school_fees
      WHERE school_id = ${schoolId}
      ORDER BY display_order, grade_level
    `) as {
      id: string;
      academic_year: string;
      grade_level: string;
      grade_ages: string | null;
      tuition_fee: number | null;
      capital_fee: number | null;
      enrollment_guarantee_fee: number | null;
      total_fee_early_bird: number | null;
      total_fee_standard: number | null;
      display_order: number;
    }[];

    const oneTimeFees = (await sql`
      SELECT id, academic_year, fee_name, amount, description, display_order
      FROM school_one_time_fees
      WHERE school_id = ${schoolId}
      ORDER BY display_order, fee_name
    `) as {
      id: string;
      academic_year: string;
      fee_name: string;
      amount: number;
      description: string | null;
      display_order: number;
    }[];

    return json({ feeRows, oneTimeFees });
  } catch (e) {
    return json(
      { error: "Failed to load fees", detail: e instanceof Error ? e.message : "" },
      500
    );
  }
}
