import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createApprovalRequest(input: {
  workspaceId: string;

  approvalType: string;

  title: string;
  summary?: string | null;

  linkedRecordType?: string | null;
  linkedRecordId?: string | null;

  requestedByWorkspaceMemberId?: string | null;

  expiresAt?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.approvalType?.trim()) {
    throw new Error("approvalType is required");
  }

  if (!input.title?.trim()) {
    throw new Error("title is required");
  }

  const { data, error } = await supabaseAdmin
    .from("approval_requests")
    .insert({
      workspace_id: input.workspaceId,

      approval_type:
        input.approvalType.trim(),

      title: input.title.trim(),
      summary: input.summary ?? null,

      linked_record_type:
        input.linkedRecordType ?? null,

      linked_record_id:
        input.linkedRecordId ?? null,

      requested_by_workspace_member_id:
        input.requestedByWorkspaceMemberId ?? null,

      expires_at:
        input.expiresAt ?? null,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
