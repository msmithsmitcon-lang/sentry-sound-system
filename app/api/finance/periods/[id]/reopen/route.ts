import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const periodId = params.id;

  const { data, error } = await supabaseAdmin
    .from("finance_periods")
    .update({
      status: "open",
      closed_at: null
    })
    .eq("id", periodId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    period: data
  });
}