import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function calculateTotals(snapshot: any) {

  const accounts = snapshot.data.accounts ?? [];

  const cash = accounts
    .filter((a: any) => a.type === "cash")
    .reduce(
      (sum: number, a: any) =>
        sum + Number(a.current_balance),
      0
    );

  const liabilities = accounts
    .filter((a: any) => a.type === "liability")
    .reduce(
      (sum: number, a: any) =>
        sum + Math.abs(Number(a.current_balance)),
      0
    );

  const revenue = accounts
    .filter((a: any) => a.type === "revenue")
    .reduce(
      (sum: number, a: any) =>
        sum + Math.abs(Number(a.current_balance)),
      0
    );

  const expenses = accounts
    .filter((a: any) => a.type === "expense")
    .reduce(
      (sum: number, a: any) =>
        sum + Math.abs(Number(a.current_balance)),
      0
    );

  return {
    cash,
    liabilities,
    revenue,
    expenses,
    net_profit: revenue - expenses
  };
}

export async function GET() {

  const { data: snapshots, error } =
    await supabaseAdmin
      .from("finance_snapshots")
      .select("*")
      .order("snapshot_date", {
        ascending: false
      })
      .limit(2);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  if (!snapshots || snapshots.length < 2) {
    return NextResponse.json(
      {
        ok: false,
        error: "At least 2 snapshots required"
      },
      {
        status: 400
      }
    );
  }

  const current = snapshots[0];
  const previous = snapshots[1];

  const currentTotals =
    calculateTotals(current);

  const previousTotals =
    calculateTotals(previous);

  const comparison = {
    cash_change:
      currentTotals.cash -
      previousTotals.cash,

    liability_change:
      currentTotals.liabilities -
      previousTotals.liabilities,

    revenue_change:
      currentTotals.revenue -
      previousTotals.revenue,

    expense_change:
      currentTotals.expenses -
      previousTotals.expenses,

    profit_change:
      currentTotals.net_profit -
      previousTotals.net_profit
  };

  return NextResponse.json({
    ok: true,

    current_snapshot: current.snapshot_date,
    previous_snapshot: previous.snapshot_date,

    comparison
  });
}