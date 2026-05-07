import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from("finance_budgets")
    .select("*")
    .order("budget_year", { ascending: false })
    .order("budget_month", { ascending: false });

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

  return NextResponse.json({
    ok: true,
    budgets: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("finance_budgets")
    .insert({
      name: body.name,
      account_code: body.account_code,
      budget_year: body.budget_year,
      budget_month: body.budget_month,
      planned_amount: body.planned_amount,
      metadata: body.metadata ?? {}
    })
    .select("*")
    .single();

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

  return NextResponse.json({
    ok: true,
    budget: data
  });
}
