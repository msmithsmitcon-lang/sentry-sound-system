import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createApprovalStep(input: {
  workspaceId: string;

  approvalRequestId: string;

  stepOrder: number;

  approverType: string;

  approverWorkspaceMemberId?: string | null;

  dueAt?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.approvalRequestId) {
    throw new Error("approvalRequestId is required");
  }

  if (!input.stepOrder) {
    throw new Error("stepOrder is required");
  }

  if (!input.approverType?.trim()) {
    throw new Error("approverType is required");
  }

  const { data, error } = await supabaseAdmin
    .from("approval_steps")
    .insert({
      workspace_id: input.workspaceId,

      approval_request_id:
        input.approvalRequestId,

      step_order: input.stepOrder,

      approver_type:
        input.approverType.trim(),

      approver_workspace_member_id:
        input.approverWorkspaceMemberId ?? null,

      due_at:
        input.dueAt ?? null,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
