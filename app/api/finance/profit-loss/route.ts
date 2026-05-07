import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data: accounts, error } = await supabaseAdmin
    .from("finance_accounts")
    .select("*");

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message
      },
      {
        status: 500
      }
    );
  }

  const revenueAccounts = accounts.filter(
    (a) => a.type === "revenue"
  );

  const expenseAccounts = accounts.filter(
    (a) => a.type === "expense"
  );

  const totalRevenue = revenueAccounts.reduce(
    (sum, account) =>
      sum + Math.abs(Number(account.current_balance)),
    0
  );

  const totalExpenses = expenseAccounts.reduce(
    (sum, account) =>
      sum + Math.abs(Number(account.current_balance)),
    0
  );

  const netProfit =
    totalRevenue - totalExpenses;

  return NextResponse.json({
    ok: true,

    totals: {
      revenue: totalRevenue,
      expenses: totalExpenses,
      net_profit: netProfit
    },

    revenue_accounts: revenueAccounts,
    expense_accounts: expenseAccounts
  });
}
