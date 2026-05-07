import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } =
    await supabaseAdmin
      .from("finance_scheduled_jobs")
      .select("*")
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
      .from("finance_scheduled_jobs")
      .insert({
        job_name:
          body.job_name,

        job_type:
          body.job_type,

        schedule_expression:
          body.schedule_expression ?? null,

        next_run_at:
          body.next_run_at ?? null,

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
