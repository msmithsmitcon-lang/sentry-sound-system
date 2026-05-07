import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("finance_tax_profiles")
    .select(`
      *,
      default_tax_rate:default_tax_rate_id (
        id,
        name,
        country_code,
        tax_type,
        rate
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    tax_profiles: data
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("finance_tax_profiles")
    .insert({
      entity_name: body.entity_name,
      country_code: body.country_code ?? "ZA",
      is_vat_registered: body.is_vat_registered ?? false,
      vat_number: body.vat_number ?? null,
      tax_registration_status:
        body.tax_registration_status ??
        (body.is_vat_registered ? "registered" : "not_registered"),
      default_tax_rate_id: body.default_tax_rate_id ?? null,
      metadata: body.metadata ?? {}
    })
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
    tax_profile: data
  });
}
