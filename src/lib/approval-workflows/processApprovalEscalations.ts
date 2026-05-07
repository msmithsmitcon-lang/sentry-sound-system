import { supabaseAdmin } from "@/lib/supabase/admin";

import { createWorkflowEvent } from "@/lib/workflow-orchestration";
import { createDashboardAlert } from "@/lib/operational-dashboard";
import { createNotification } from "@/lib/notifications";

export async function processApprovalEscalations(input: {
  workspaceId: string;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  const now = new Date().toISOString();

  const { data: overdueSteps, error } = await supabaseAdmin
    .from("approval_steps")
    .select(`
      *,
      approval_requests (*)
    `)
    .eq("workspace_id", input.workspaceId)
    .eq("lifecycle_status", "pending_review")
    .lt("due_at", now);

  if (error) throw error;

  const results = [];

  for (const step of overdueSteps ?? []) {
    await createDashboardAlert({
      workspaceId: input.workspaceId,
      alertType: "approval_overdue",
      severityLevel: "high",
      alertTitle: "Approval step overdue",
      alertSummary: `Approval step ${step.step_order} is overdue.`,
      linkedRecordType:
        step.approval_requests?.linked_record_type ?? "approval_request",
      linkedRecordId:
        step.approval_request_id,
      metadata: { approvalStepId: step.id },
    });

    await createWorkflowEvent({
      workspaceId: input.workspaceId,
      sourceModule: "approval_workflows",
      eventType: "approval.step.overdue",
      linkedRecordType: "approval_step",
      linkedRecordId: step.id,
      eventPayload: {
        approvalRequestId: step.approval_request_id,
        approvalStepId: step.id,
        stepOrder: step.step_order,
      },
    });

    await createNotification({
      workspaceId: input.workspaceId,
      notificationType: "approval_escalation",
      title: "Approval step overdue",
      message: `Approval step ${step.step_order} requires attention.`,
      linkedRecordType: "approval_step",
      linkedRecordId: step.id,
      metadata: {
        approvalRequestId: step.approval_request_id,
      },
    });

    results.push({
      approvalStepId: step.id,
      status: "escalated",
    });
  }

  return {
    processed: results.length,
    results,
  };
}
