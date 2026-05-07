import { supabaseAdmin } from "@/lib/supabase/admin";

import { createWorkflowEvent } from "@/lib/workflow-orchestration";
import { createNotification } from "@/lib/notifications";

export async function processApprovalLifecycle(input: {
  workspaceId: string;
  approvalRequestId: string;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.approvalRequestId) {
    throw new Error("approvalRequestId is required");
  }

  const { data: approvalRequest, error: requestError } =
    await supabaseAdmin
      .from("approval_requests")
      .select("*")
      .eq("id", input.approvalRequestId)
      .eq("workspace_id", input.workspaceId)
      .single();

  if (requestError) throw requestError;

  const { data: steps, error: stepsError } =
    await supabaseAdmin
      .from("approval_steps")
      .select("*")
      .eq("approval_request_id", input.approvalRequestId)
      .order("step_order", { ascending: true });

  if (stepsError) throw stepsError;

  const { data: responses, error: responsesError } =
    await supabaseAdmin
      .from("approval_responses")
      .select("*")
      .in(
        "approval_step_id",
        (steps ?? []).map((s) => s.id)
      );

  if (responsesError) throw responsesError;

  const rejected = (responses ?? []).some(
    (r) => r.response_type === "rejected"
  );

  const approvedSteps = new Set(
    (responses ?? [])
      .filter((r) => r.response_type === "approved")
      .map((r) => r.approval_step_id)
  );

  const allApproved =
    (steps ?? []).length > 0 &&
    (steps ?? []).every((s) =>
      approvedSteps.has(s.id)
    );

  let lifecycleStatus =
    approvalRequest.lifecycle_status;

  if (rejected) {
    lifecycleStatus = "rejected";
  } else if (allApproved) {
    lifecycleStatus = "approved";
  } else {
    lifecycleStatus = "pending_review";
  }

  await supabaseAdmin
    .from("approval_requests")
    .update({
      lifecycle_status: lifecycleStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", approvalRequest.id);

  await createWorkflowEvent({
    workspaceId: input.workspaceId,
    sourceModule: "approval_workflows",
    eventType: `approval.${lifecycleStatus}`,
    linkedRecordType:
      approvalRequest.linked_record_type ?? null,
    linkedRecordId:
      approvalRequest.linked_record_id ?? null,
    eventPayload: {
      approvalRequestId: approvalRequest.id,
      lifecycleStatus,
    },
  });

  await createNotification({
    workspaceId: input.workspaceId,
    notificationType: "approval_status",
    title: `Approval ${lifecycleStatus}`,
    message:
      approvalRequest.title +
      " is now " +
      lifecycleStatus,
    linkedRecordType:
      approvalRequest.linked_record_type ?? null,
    linkedRecordId:
      approvalRequest.linked_record_id ?? null,
    metadata: {
      approvalRequestId: approvalRequest.id,
    },
  });

  return {
    approvalRequestId: approvalRequest.id,
    lifecycleStatus,
    rejected,
    allApproved,
  };
}
