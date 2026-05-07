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

  const assetAccounts = accounts.filter(
    (a) => a.type === "cash"
  );

  const liabilityAccounts = accounts.filter(
    (a) => a.type === "liability"
  );

  const revenueAccounts = accounts.filter(
    (a) => a.type === "revenue"
  );

  const expenseAccounts = accounts.filter(
    (a) => a.type === "expense"
  );

  const totalAssets = assetAccounts.reduce(
    (sum, account) =>
      sum + Number(account.current_balance),
    0
  );

  const totalLiabilities = liabilityAccounts.reduce(
    (sum, account) =>
      sum + Math.abs(Number(account.current_balance)),
    0
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

  const retainedEarnings =
    totalRevenue - totalExpenses;

  const equity =
    totalAssets - totalLiabilities;

  return NextResponse.json({
    ok: true,

    totals: {
      assets: totalAssets,
      liabilities: totalLiabilities,
      retained_earnings: retainedEarnings,
      equity
    },

    assets: assetAccounts,
    liabilities: liabilityAccounts
  });
}
