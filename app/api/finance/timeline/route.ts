import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {

  const url = new URL(req.url);

  const entityType =
    url.searchParams.get("entity_type");

  const entityId =
    url.searchParams.get("entity_id");

  if (!entityType || !entityId) {

    return NextResponse.json(
      {
        ok: false,
        error:
          "entity_type and entity_id required"
      },
      {
        status: 400
      }
    );
  }

  const [
    notesResult,
    approvalsResult,
    notificationsResult,
    auditResult,
    attachmentsResult
  ] = await Promise.all([

    supabaseAdmin
      .from("finance_notes")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId),

    supabaseAdmin
      .from("finance_approvals")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId),

    supabaseAdmin
      .from("finance_notifications")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId),

    supabaseAdmin
      .from("finance_audit_events")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId),

    supabaseAdmin
      .from("finance_attachments")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
  ]);

  const timeline = [];

  for (const note of notesResult.data ?? []) {

    timeline.push({
      type: "note",
      created_at: note.created_at,
      data: note
    });
  }

  for (const approval of approvalsResult.data ?? []) {

    timeline.push({
      type: "approval",
      created_at: approval.created_at,
      data: approval
    });
  }

  for (const notification of notificationsResult.data ?? []) {

    timeline.push({
      type: "notification",
      created_at: notification.created_at,
      data: notification
    });
  }

  for (const audit of auditResult.data ?? []) {

    timeline.push({
      type: "audit_event",
      created_at: audit.created_at,
      data: audit
    });
  }

  for (const attachment of attachmentsResult.data ?? []) {

    timeline.push({
      type: "attachment",
      created_at: attachment.created_at,
      data: attachment
    });
  }

  timeline.sort(
    (a: any, b: any) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  return NextResponse.json({
    ok: true,
    timeline
  });
}
