import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const checks: any = {
    database: false,
    finance_accounts: false,
    finance_transactions: false,
    finance_reports: false,
    finance_jobs: false
  };

  try {

    const accounts =
      await supabaseAdmin
        .from("finance_accounts")
        .select("id")
        .limit(1);

    checks.finance_accounts =
      !accounts.error;

    const transactions =
      await supabaseAdmin
        .from("finance_transactions")
        .select("id")
        .limit(1);

    checks.finance_transactions =
      !transactions.error;

    const reports =
      await supabaseAdmin
        .from("finance_report_exports")
        .select("id")
        .limit(1);

    checks.finance_reports =
      !reports.error;

    const jobs =
      await supabaseAdmin
        .from("finance_scheduled_jobs")
        .select("id")
        .limit(1);

    checks.finance_jobs =
      !jobs.error;

    checks.database = true;

  } catch (err) {

    return NextResponse.json(
      {
        ok: false,
        status: "critical",
        checks
      },
      {
        status: 500
      }
    );
  }

  const allHealthy =
    Object.values(checks)
      .every((v) => v === true);

  return NextResponse.json({
    ok: true,

    status:
      allHealthy
        ? "healthy"
        : "warning",

    checks,

    checked_at:
      new Date().toISOString()
  });
}
