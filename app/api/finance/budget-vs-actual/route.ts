import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data: budgets, error: budgetError } =
    await supabaseAdmin
      .from("finance_budgets")
      .select("*")
      .order("budget_year", { ascending: false })
      .order("budget_month", { ascending: false });

  if (budgetError) {
    return NextResponse.json(
      {
        ok: false,
        error: budgetError.message
      },
      {
        status: 500
      }
    );
  }

  const { data: accounts, error: accountError } =
    await supabaseAdmin
      .from("finance_accounts")
      .select("*");

  if (accountError) {
    return NextResponse.json(
      {
        ok: false,
        error: accountError.message
      },
      {
        status: 500
      }
    );
  }

  const report = budgets.map((budget) => {

    const matchingAccount =
      accounts.find(
        (a) => a.code === budget.account_code
      );

    const actualAmount =
      matchingAccount
        ? Math.abs(
            Number(
              matchingAccount.current_balance
            )
          )
        : 0;

    const variance =
      Number(budget.planned_amount) -
      actualAmount;

    return {
      budget_name: budget.name,

      account_code: budget.account_code,

      budget_year: budget.budget_year,
      budget_month: budget.budget_month,

      planned_amount:
        Number(budget.planned_amount),

      actual_amount:
        actualAmount,

      variance,

      status:
        variance >= 0
          ? "within_budget"
          : "over_budget"
    };
  });

  return NextResponse.json({
    ok: true,
    report
  });
}
