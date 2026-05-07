import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from("finance_tax_rates")
    .select("*")
    .order("country_code", {
      ascending: true
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
    tax_rates: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("finance_tax_rates")
    .insert({
      name: body.name,
      country_code: body.country_code,
      tax_type: body.tax_type,
      rate: body.rate
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
    tax_rate: data
  });
}
