import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {

  const body = await req.json();

  if (!body.country_code) {
    return NextResponse.json(
      {
        ok: false,
        error: "country_code required"
      },
      {
        status: 400
      }
    );
  }

  const countryCode =
    body.country_code.toUpperCase();

  const { data: country, error } =
    await supabaseAdmin
      .from("finance_country_currency")
      .select("*")
      .eq("country_code", countryCode)
      .maybeSingle();

  if (error || !country) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Country configuration not found"
      },
      {
        status: 404
      }
    );
  }

  let suggestedTaxStatus =
    "not_registered";

  let suggestedVatQuestion =
    true;

  if (
    body.is_vat_registered === true
  ) {
    suggestedTaxStatus =
      "registered";
  }

  return NextResponse.json({
    ok: true,

    onboarding_resolution: {

      country_code:
        country.country_code,

      country_name:
        country.country_name,

      suggested_base_currency:
        country.currency_code,

      suggested_reporting_currency:
        country.currency_code,

      currency_symbol:
        country.currency_symbol,

      vat_question_required:
        suggestedVatQuestion,

      suggested_tax_registration_status:
        suggestedTaxStatus
    }
  });
}
