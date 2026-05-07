import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const transactionId = params.id;

  const body = await req.json();

  const allowedStatuses = ["pending", "cleared", "reconciled"];

  if (!allowedStatuses.includes(body.reconciliation_status)) {
    return NextResponse.json(
      { ok: false, error: "Invalid reconciliation status" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("finance_transactions")
    .update({
      reconciliation_status: body.reconciliation_status
    })
    .eq("id", transactionId)
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
    transaction: data
  });
}