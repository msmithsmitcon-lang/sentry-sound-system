import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data: accounts, error } =
    await supabaseAdmin
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

  const totalRevenue =
    accounts
      .filter(
        (a) => a.type === "revenue"
      )
      .reduce(
        (sum, a) =>
          sum +
          Math.abs(
            Number(
              a.current_balance
            )
          ),
        0
      );

  const totalExpenses =
    accounts
      .filter(
        (a) => a.type === "expense"
      )
      .reduce(
        (sum, a) =>
          sum +
          Math.abs(
            Number(
              a.current_balance
            )
          ),
        0
      );

  const retainedEarnings =
    totalRevenue -
    totalExpenses;

  return NextResponse.json({
    ok: true,

    retained_earnings: {
      total_revenue:
        totalRevenue,

      total_expenses:
        totalExpenses,

      retained_earnings:
        retainedEarnings
    }
  });
}
