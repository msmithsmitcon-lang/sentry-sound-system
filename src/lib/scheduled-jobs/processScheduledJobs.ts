import { supabaseAdmin } from "@/lib/supabase/admin";

import { processWorkflowQueue } from "@/lib/workflow-orchestration";
import { processApprovalEscalations } from "@/lib/approval-workflows";

export async function processScheduledJobs(input: {
  workspaceId: string;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  const now = new Date().toISOString();

  const { data: jobs, error } = await supabaseAdmin
    .from("scheduled_jobs")
    .select("*")
    .eq("workspace_id", input.workspaceId)
    .eq("active", true)
    .lte("next_run_at", now);

  if (error) throw error;

  const results = [];

  for (const job of jobs ?? []) {
    const startedAt = new Date().toISOString();

    const { data: run } = await supabaseAdmin
      .from("scheduled_job_runs")
      .insert({
        workspace_id: input.workspaceId,
        scheduled_job_id: job.id,
        run_status: "running",
        started_at: startedAt,
        run_payload: job.job_payload ?? {},
      })
      .select("*")
      .single();

    try {
      let resultPayload = {};

      switch (job.job_type) {

        case "workflow_queue_processing":
          resultPayload =
            await processWorkflowQueue({
              workspaceId: input.workspaceId,
            });
          break;

        case "approval_escalation":
          resultPayload =
            await processApprovalEscalations({
              workspaceId: input.workspaceId,
            });
          break;
      }

      await supabaseAdmin
        .from("scheduled_job_runs")
        .update({
          run_status: "completed",
          result_payload: resultPayload,
          completed_at: new Date().toISOString(),
        })
        .eq("id", run?.id);

      await supabaseAdmin
        .from("scheduled_jobs")
        .update({
          last_run_at: startedAt,
        })
        .eq("id", job.id);

      results.push({
        scheduledJobId: job.id,
        status: "completed",
      });

    } catch (err) {
      await supabaseAdmin
        .from("scheduled_job_runs")
        .update({
          run_status: "failed",
          error_message:
            err instanceof Error
              ? err.message
              : "Unknown error",

          completed_at:
            new Date().toISOString(),
        })
        .eq("id", run?.id);

      results.push({
        scheduledJobId: job.id,
        status: "failed",
      });
    }
  }

  return {
    processed: results.length,
    results,
  };
}
