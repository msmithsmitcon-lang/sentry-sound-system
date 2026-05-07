import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } =
    await supabaseAdmin
      .from("finance_report_jobs")
      .select(`
        *,
        export:export_id (
          id,
          report_type,
          export_format,
          file_name
        )
      `)
      .order("created_at", {
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
    jobs: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } =
    await supabaseAdmin
      .from("finance_report_jobs")
      .insert({
        report_type:
          body.report_type,

        export_format:
          body.export_format,

        requested_by:
          body.requested_by ?? null,

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
    job: data
  });
}
