import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createApprovalResponse(input: {
  workspaceId: string;
  approvalStepId: string;

  responseType: "approved" | "rejected" | "commented";
  responseComment?: string | null;

  respondedByWorkspaceMemberId?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.approvalStepId) throw new Error("approvalStepId is required");
  if (!input.responseType) throw new Error("responseType is required");

  const { data, error } = await supabaseAdmin
    .from("approval_responses")
    .insert({
      workspace_id: input.workspaceId,
      approval_step_id: input.approvalStepId,
      response_type: input.responseType,
      response_comment: input.responseComment ?? null,
      responded_by_workspace_member_id: input.respondedByWorkspaceMemberId ?? null,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
