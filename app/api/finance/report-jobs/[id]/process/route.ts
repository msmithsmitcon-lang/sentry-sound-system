import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const params = await context.params;

  const jobId = params.id;

  const { data: job, error: jobError } =
    await supabaseAdmin
      .from("finance_report_jobs")
      .select("*")
      .eq("id", jobId)
      .single();

  if (jobError || !job) {

    return NextResponse.json(
      {
        ok: false,
        error: "Job not found"
      },
      {
        status: 404
      }
    );
  }

  await supabaseAdmin
    .from("finance_report_jobs")
    .update({
      status: "processing"
    })
    .eq("id", jobId);

  const generatedFileName =
    `${job.report_type}-${job.id}.${job.export_format}`;

  const generatedPath =
    `/finance/reports/${generatedFileName}`;

  const { data: exportRecord } =
    await supabaseAdmin
      .from("finance_report_exports")
      .insert({
        report_type:
          job.report_type,

        export_format:
          job.export_format,

        file_name:
          generatedFileName,

        storage_path:
          generatedPath,

        generated_by:
          job.requested_by
      })
      .select("*")
      .single();

  const { data, error } =
    await supabaseAdmin
      .from("finance_report_jobs")
      .update({
        status: "completed",

        completed_at:
          new Date().toISOString(),

        export_id:
          exportRecord.id
      })
      .eq("id", jobId)
      .select(`
        *,
        export:export_id (
          id,
          report_type,
          export_format,
          file_name,
          storage_path
        )
      `)
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