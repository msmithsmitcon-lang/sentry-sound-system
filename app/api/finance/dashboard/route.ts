import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data: accounts } = await supabaseAdmin
    .from("finance_accounts")
    .select("*");

  const { data: transactions } = await supabaseAdmin
    .from("finance_transactions")
    .select("*");

  const totalCash = accounts
    .filter((a) => a.type === "cash")
    .reduce(
      (sum, a) => sum + Number(a.current_balance),
      0
    );

  const totalLiabilities = accounts
    .filter((a) => a.type === "liability")
    .reduce(
      (sum, a) => sum + Math.abs(Number(a.current_balance)),
      0
    );

  const totalRevenue = accounts
    .filter((a) => a.type === "revenue")
    .reduce(
      (sum, a) => sum + Math.abs(Number(a.current_balance)),
      0
    );

  const totalExpenses = accounts
    .filter((a) => a.type === "expense")
    .reduce(
      (sum, a) => sum + Math.abs(Number(a.current_balance)),
      0
    );

  const netProfit =
    totalRevenue - totalExpenses;

  const unreconciledTransactions =
    transactions.filter(
      (t) =>
        t.reconciliation_status !== "reconciled"
    ).length;

  return NextResponse.json({
    ok: true,

    dashboard: {
      cash_position: totalCash,
      liabilities: totalLiabilities,
      revenue: totalRevenue,
      expenses: totalExpenses,
      net_profit: netProfit,

      total_transactions:
        transactions.length,

      unreconciled_transactions:
        unreconciledTransactions
    }
  });
}
