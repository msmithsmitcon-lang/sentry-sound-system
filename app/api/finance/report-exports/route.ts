import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } =
    await supabaseAdmin
      .from("finance_report_exports")
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
    exports: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } =
    await supabaseAdmin
      .from("finance_report_exports")
      .insert({
        report_type:
          body.report_type,

        export_format:
          body.export_format,

        file_name:
          body.file_name,

        storage_path:
          body.storage_path,

        generated_by:
          body.generated_by ?? null,

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
    export: data
  });
}
