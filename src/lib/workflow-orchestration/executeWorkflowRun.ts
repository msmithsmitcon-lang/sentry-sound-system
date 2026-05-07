import { supabaseAdmin } from "@/lib/supabase/admin";

import { createDashboardAlert } from "@/lib/operational-dashboard";
import { addDashboardActivity } from "@/lib/operational-dashboard";
import { createTaskItem } from "@/lib/calendar-tasks";
import { createNotification, addNotificationRecipient } from "@/lib/notifications";

export async function executeWorkflowRun(input: {
  workspaceId: string;
  workflowRunId: string;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.workflowRunId) {
    throw new Error("workflowRunId is required");
  }

  const { data: run, error: runError } = await supabaseAdmin
    .from("workflow_runs")
    .select(`
      *,
      workflow_rules (*)
    `)
    .eq("id", input.workflowRunId)
    .eq("workspace_id", input.workspaceId)
    .single();

  if (runError) throw runError;

  await supabaseAdmin
    .from("workflow_runs")
    .update({
      run_status: "running",
    })
    .eq("id", run.id);

  const actions =
    run.workflow_rules?.actions ?? [];

  for (const action of actions) {
    switch (action.type) {

      case "dashboard_alert":
        await createDashboardAlert({
          workspaceId: input.workspaceId,
          alertType: action.alertType ?? "workflow",
          severityLevel: action.severityLevel ?? "normal",
          alertTitle: action.alertTitle ?? "Workflow Alert",
          alertSummary: action.alertSummary ?? "Workflow-generated alert",
          metadata: action.metadata ?? {},
        });
        break;

      case "dashboard_activity":
        await addDashboardActivity({
          workspaceId: input.workspaceId,
          activityType: action.activityType ?? "workflow",
          activitySummary:
            action.activitySummary ??
            "Workflow-generated activity",
          activityPayload: action.activityPayload ?? {},
        });
        break;

      case "create_task":
        await createTaskItem({
          workspaceId: input.workspaceId,
          taskType: action.taskType ?? "workflow",
          title: action.title ?? "Workflow Task",
          description:
            action.description ??
            "Workflow-generated task",
          priorityLevel:
            action.priorityLevel ?? "normal",
        });
        break;

      case "send_notification": {
        const notification = await createNotification({
          workspaceId: input.workspaceId,
          notificationType: action.notificationType ?? "workflow",
          title: action.title ?? "Workflow Notification",
          message: action.message ?? "Workflow-generated notification",
          linkedRecordType: action.linkedRecordType ?? null,
          linkedRecordId: action.linkedRecordId ?? null,
          metadata: action.metadata ?? {},
        });

        await addNotificationRecipient({
          workspaceId: input.workspaceId,
          notificationId: notification.id,
          recipientType: action.recipientType ?? "workspace_member",
          recipientId: action.recipientId ?? null,
          recipientEmail: action.recipientEmail ?? null,
          deliveryChannel: action.deliveryChannel ?? "in_app",
          metadata: action.recipientMetadata ?? {},
        });

        break;
      }
    }
  }

  await supabaseAdmin
    .from("workflow_runs")
    .update({
      run_status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", run.id);

  return {
    workflowRunId: run.id,
    executedActions: actions.length,
    status: "completed",
  };
}

