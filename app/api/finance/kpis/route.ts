import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data: accounts } = await supabaseAdmin
    .from("finance_accounts")
    .select("*");

  const { data: receivables } = await supabaseAdmin
    .from("finance_receivables")
    .select("*");

  const { data: payables } = await supabaseAdmin
    .from("finance_payables")
    .select("*");

  const cash = accounts
    .filter((a) => a.type === "cash")
    .reduce(
      (sum, a) => sum + Number(a.current_balance),
      0
    );

  const liabilities = accounts
    .filter((a) => a.type === "liability")
    .reduce(
      (sum, a) => sum + Math.abs(Number(a.current_balance)),
      0
    );

  const revenue = accounts
    .filter((a) => a.type === "revenue")
    .reduce(
      (sum, a) => sum + Math.abs(Number(a.current_balance)),
      0
    );

  const expenses = accounts
    .filter((a) => a.type === "expense")
    .reduce(
      (sum, a) => sum + Math.abs(Number(a.current_balance)),
      0
    );

  const receivablesOutstanding =
    receivables.reduce(
      (sum, r) =>
        sum + Number(r.outstanding_amount),
      0
    );

  const payablesOutstanding =
    payables.reduce(
      (sum, p) =>
        sum + Number(p.outstanding_amount),
      0
    );

  const netProfit =
    revenue - expenses;

  const currentRatio =
    payablesOutstanding === 0
      ? null
      : receivablesOutstanding / payablesOutstanding;

  return NextResponse.json({
    ok: true,

    kpis: {
      cash_position: cash,

      total_liabilities: liabilities,

      total_revenue: revenue,

      total_expenses: expenses,

      net_profit: netProfit,

      receivables_outstanding:
        receivablesOutstanding,

      payables_outstanding:
        payablesOutstanding,

      working_capital:
        receivablesOutstanding -
        payablesOutstanding,

      current_ratio: currentRatio
    }
  });
}
