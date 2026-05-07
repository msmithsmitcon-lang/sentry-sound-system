import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data: accounts, error } = await supabaseAdmin
    .from("finance_accounts")
    .select("*")
    .order("type", { ascending: true });

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

  const summary = {
    cash: 0,
    liability: 0,
    revenue: 0,
    expense: 0
  };

  for (const account of accounts) {

    const balance = Number(account.current_balance);

    if (account.type === "cash") {
      summary.cash += balance;
    }

    if (account.type === "liability") {
      summary.liability += balance;
    }

    if (account.type === "revenue") {
      summary.revenue += balance;
    }

    if (account.type === "expense") {
      summary.expense += balance;
    }
  }

  return NextResponse.json({
    ok: true,
    summary,
    accounts
  });
}
