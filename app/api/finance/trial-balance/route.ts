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

  const trialBalance = accounts.map((account) => {

    const balance = Number(account.current_balance);

    return {
      id: account.id,
      code: account.code,
      name: account.name,
      type: account.type,
      debit: balance > 0 ? balance : 0,
      credit: balance < 0 ? Math.abs(balance) : 0,
      balance
    };
  });

  const totals = {
    debit: trialBalance.reduce(
      (sum, row) => sum + row.debit,
      0
    ),
    credit: trialBalance.reduce(
      (sum, row) => sum + row.credit,
      0
    )
  };

  return NextResponse.json({
    ok: true,
    totals,
    trial_balance: trialBalance
  });
}
