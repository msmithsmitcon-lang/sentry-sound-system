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
      .from("finance_scheduled_jobs")
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

  const now =
    new Date().toISOString();

  const { data, error } =
    await supabaseAdmin
      .from("finance_scheduled_jobs")
      .update({
        last_run_at: now,
        last_run_status: "success"
      })
      .eq("id", jobId)
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