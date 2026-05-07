import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from("finance_accounts")
    .select(`
      id,
      code,
      name,
      type,
      category,
      subcategory,
      current_balance,
      is_active
    `)
    .order("code", { ascending: true });

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

  const grouped = {
    assets: data.filter((a) => a.type === "cash"),
    liabilities: data.filter((a) => a.type === "liability"),
    revenue: data.filter((a) => a.type === "revenue"),
    expenses: data.filter((a) => a.type === "expense")
  };

  return NextResponse.json({
    ok: true,
    chart_of_accounts: grouped
  });
}
