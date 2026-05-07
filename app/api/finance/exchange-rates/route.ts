import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from("finance_exchange_rates")
    .select("*")
    .order("effective_date", {
      ascending: false
    });

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
    exchange_rates: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("finance_exchange_rates")
    .insert({
      base_currency:
        body.base_currency,

      target_currency:
        body.target_currency,

      exchange_rate:
        body.exchange_rate,

      effective_date:
        body.effective_date ??
        new Date().toISOString().split("T")[0]
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
    exchange_rate: data
  });
}
