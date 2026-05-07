import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from("finance_company_settings")
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
    .order("created_at", {
      ascending: false
    })
    .limit(1)
    .maybeSingle();

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
    settings: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } =
    await supabaseAdmin
      .from("finance_company_settings")
      .insert({
        company_name:
          body.company_name,

        country_code:
          body.country_code,

        base_currency:
          body.base_currency,

        reporting_currency:
          body.reporting_currency,

        is_vat_registered:
          body.is_vat_registered ?? false,

        vat_number:
          body.vat_number ?? null,

        tax_registration_status:
          body.tax_registration_status ??
          "not_registered",

        default_tax_rate_id:
          body.default_tax_rate_id ?? null,

        metadata:
          body.metadata ?? {}
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
    settings: data
  });
}
