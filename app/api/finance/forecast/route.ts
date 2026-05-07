import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data: accounts, error } = await supabaseAdmin
    .from("finance_accounts")
    .select("*");

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  const cash = accounts
    .filter((a) => a.type === "cash")
    .reduce(
      (sum, a) =>
        sum + Number(a.current_balance),
      0
    );

  const revenue = accounts
    .filter((a) => a.type === "revenue")
    .reduce(
      (sum, a) =>
        sum + Math.abs(Number(a.current_balance)),
      0
    );

  const expenses = accounts
    .filter((a) => a.type === "expense")
    .reduce(
      (sum, a) =>
        sum + Math.abs(Number(a.current_balance)),
      0
    );

  const monthlyNet =
    revenue - expenses;

  const projected3MonthCash =
    cash + (monthlyNet * 3);

  const projected6MonthCash =
    cash + (monthlyNet * 6);

  const projected12MonthCash =
    cash + (monthlyNet * 12);

  return NextResponse.json({
    ok: true,

    forecast: {
      current_cash: cash,

      estimated_monthly_net:
        monthlyNet,

      projected_3_month_cash:
        projected3MonthCash,

      projected_6_month_cash:
        projected6MonthCash,

      projected_12_month_cash:
        projected12MonthCash
    }
  });
}
