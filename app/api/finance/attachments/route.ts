import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {

  const url = new URL(req.url);

  const entityType =
    url.searchParams.get("entity_type");

  const entityId =
    url.searchParams.get("entity_id");

  let query = supabaseAdmin
    .from("finance_attachments")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (entityType) {
    query = query.eq(
      "entity_type",
      entityType
    );
  }

  if (entityId) {
    query = query.eq(
      "entity_id",
      entityId
    );
  }

  const { data, error } =
    await query;

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
    attachments: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } =
    await supabaseAdmin
      .from("finance_attachments")
      .insert({
        entity_type:
          body.entity_type,

        entity_id:
          body.entity_id,

        file_name:
          body.file_name,

        file_type:
          body.file_type ?? null,

        file_size:
          body.file_size ?? null,

        storage_path:
          body.storage_path,

        uploaded_by:
          body.uploaded_by ?? null,

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
    attachment: data
  });
}
