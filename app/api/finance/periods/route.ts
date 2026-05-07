import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from("finance_periods")
    .select("*")
    .order("period_year", { ascending: false })
    .order("period_month", { ascending: false });

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
    periods: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("finance_periods")
    .insert({
      period_year: body.period_year,
      period_month: body.period_month,
      status: body.status ?? "open"
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
    period: data
  });
}
