import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const today = new Date().toISOString().split("T")[0];

  const { data: receivables, error: receivablesError } =
    await supabaseAdmin
      .from("finance_receivables")
      .select("*")
      .lt("due_date", today)
      .neq("status", "paid");

  if (receivablesError) {
    return NextResponse.json(
      {
        ok: false,
        error: receivablesError.message
      },
      {
        status: 500
      }
    );
  }

  const { data: payables, error: payablesError } =
    await supabaseAdmin
      .from("finance_payables")
      .select("*")
      .lt("due_date", today)
      .neq("status", "paid");

  if (payablesError) {
    return NextResponse.json(
      {
        ok: false,
        error: payablesError.message
      },
      {
        status: 500
      }
    );
  }

  const overdueReceivablesTotal =
    receivables.reduce(
      (sum, item) =>
        sum + Number(item.outstanding_amount),
      0
    );

  const overduePayablesTotal =
    payables.reduce(
      (sum, item) =>
        sum + Number(item.outstanding_amount),
      0
    );

  return NextResponse.json({
    ok: true,

    summary: {
      overdue_receivables_total:
        overdueReceivablesTotal,

      overdue_payables_total:
        overduePayablesTotal,

      overdue_receivables_count:
        receivables.length,

      overdue_payables_count:
        payables.length
    },

    overdue_receivables: receivables,
    overdue_payables: payables
  });
}
