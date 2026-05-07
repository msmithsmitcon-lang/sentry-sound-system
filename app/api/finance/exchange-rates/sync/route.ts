import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const body = await req.json();

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabaseAdmin
    .from("finance_exchange_rates")
    .upsert(
      {
        base_currency: body.base_currency,
        target_currency: body.target_currency,
        exchange_rate: body.exchange_rate,
        effective_date: today,
        source_name: body.source_name ?? "manual_sync",
        source_type: body.source_type ?? "manual",
        source_reference: body.source_reference ?? null,
        fetched_at: new Date().toISOString(),
        is_official: body.is_official ?? false
      },
      {
        onConflict: "base_currency,target_currency,effective_date"
      }
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    exchange_rate: data
  });
}
