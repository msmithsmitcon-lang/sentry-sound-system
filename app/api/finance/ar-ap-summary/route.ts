import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data: receivables, error: receivablesError } = await supabaseAdmin
    .from("finance_receivables")
    .select("*");

  if (receivablesError) {
    return NextResponse.json(
      { ok: false, error: receivablesError.message },
      { status: 500 }
    );
  }

  const { data: payables, error: payablesError } = await supabaseAdmin
    .from("finance_payables")
    .select("*");

  if (payablesError) {
    return NextResponse.json(
      { ok: false, error: payablesError.message },
      { status: 500 }
    );
  }

  const receivablesOutstanding = receivables.reduce(
    (sum, item) => sum + Number(item.outstanding_amount),
    0
  );

  const payablesOutstanding = payables.reduce(
    (sum, item) => sum + Number(item.outstanding_amount),
    0
  );

  return NextResponse.json({
    ok: true,
    summary: {
      receivables_total: receivablesOutstanding,
      payables_total: payablesOutstanding,
      net_working_capital_position:
        receivablesOutstanding - payablesOutstanding,
      receivables_count: receivables.length,
      payables_count: payables.length
    },
    receivables,
    payables
  });
}
