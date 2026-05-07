import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function emitAuditEvent({
  event_type,
  entity_type,
  entity_id,
  action,
  metadata = {}
}: any) {

  await supabaseAdmin
    .from("finance_audit_events")
    .insert({
      event_type,
      entity_type,
      entity_id,
      action,
      performed_by: "system",
      metadata
    });
}

export async function POST(req: Request) {

  const body = await req.json();

  const now = new Date();

  const periodYear =
    now.getUTCFullYear();

  const periodMonth =
    now.getUTCMonth() + 1;

  const { data: period } =
    await supabaseAdmin
      .from("finance_periods")
      .select("*")
      .eq("period_year", periodYear)
      .eq("period_month", periodMonth)
      .maybeSingle();

  if (
    period &&
    period.close_type === "hard_close"
  ) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Financial period is hard closed"
      },
      {
        status: 403
      }
    );
  }

  const postingWarnings = [];

  if (
    period &&
    period.close_type === "soft_close"
  ) {
    postingWarnings.push(
      "Financial period is soft closed"
    );
  }

  const required = [
    "debit_account_id",
    "credit_account_id",
    "amount",
    "reference_type"
  ];

  for (const field of required) {

    if (!body[field]) {

      return NextResponse.json(
        {
          ok: false,
          error:
            `Missing field: ${field}`
        },
        {
          status: 400
        }
      );
    }
  }

  if (body.amount <= 0) {

    return NextResponse.json(
      {
        ok: false,
        error:
          "Amount must be greater than 0"
      },
      {
        status: 400
      }
    );
  }

  if (
    body.debit_account_id ===
    body.credit_account_id
  ) {

    return NextResponse.json(
      {
        ok: false,
        error:
          "Debit and credit accounts cannot match"
      },
      {
        status: 400
      }
    );
  }

  const originalCurrency =
    body.original_currency ?? "ZAR";

  const baseCurrency =
    body.base_currency ?? "ZAR";

  const originalAmount =
    Number(
      body.original_amount ??
      body.amount
    );

  const exchangeRateUsed =
    Number(
      body.exchange_rate_used ?? 1
    );

  const baseAmount =
    Number(
      body.base_amount ??
      (
        originalAmount *
        exchangeRateUsed
      )
    );

  const { data: transaction, error } =
    await supabaseAdmin
      .from("finance_transactions")
      .insert({
        debit_account_id:
          body.debit_account_id,

        credit_account_id:
          body.credit_account_id,

        amount:
          body.amount,

        original_currency:
          originalCurrency,

        original_amount:
          originalAmount,

        base_currency:
          baseCurrency,

        base_amount:
          baseAmount,

        exchange_rate_used:
          exchangeRateUsed,

        exchange_rate_source:
          body.exchange_rate_source ??
          "manual",

        exchange_rate_date:
          body.exchange_rate_date ??
          new Date()
            .toISOString()
            .split("T")[0],

        reference_type:
          body.reference_type,

        reference_id:
          body.reference_id ?? null,

        description:
          body.description ?? null,

        metadata: {
          ...(body.metadata ?? {}),

          posting_warnings:
            postingWarnings
        }
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

  await emitAuditEvent({

    event_type:
      "transaction",

    entity_type:
      "finance_transaction",

    entity_id:
      transaction.id,

    action:
      "created",

    metadata: {

      amount:
        transaction.amount,

      original_currency:
        transaction.original_currency,

      base_currency:
        transaction.base_currency,

      exchange_rate_used:
        transaction.exchange_rate_used,

      posting_warnings:
        postingWarnings
    }
  });

  return NextResponse.json({
    ok: true,
    posting_warnings:
      postingWarnings,
    transaction
  });
}
