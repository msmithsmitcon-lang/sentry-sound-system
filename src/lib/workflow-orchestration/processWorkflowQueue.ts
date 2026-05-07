import { supabaseAdmin } from "@/lib/supabase/admin";

import { executeWorkflowRun } from "./executeWorkflowRun";

export async function processWorkflowQueue(input: {
  workspaceId: string;
  limit?: number;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  const limit = input.limit ?? 10;

  const { data: queueItems, error } = await supabaseAdmin
    .from("workflow_queue")
    .select("*")
    .eq("workspace_id", input.workspaceId)
    .eq("queue_status", "queued")
    .lte("available_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw error;

  const results = [];

  for (const item of queueItems ?? []) {
    try {
      await supabaseAdmin
        .from("workflow_queue")
        .update({
          queue_status: "processing",
          attempts: (item.attempts ?? 0) + 1,
        })
        .eq("id", item.id);

      await executeWorkflowRun({
        workspaceId: input.workspaceId,
        workflowRunId: item.workflow_run_id,
      });

      await supabaseAdmin
        .from("workflow_queue")
        .update({
          queue_status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      results.push({
        queueItemId: item.id,
        status: "completed",
      });

    } catch (err) {
      const attempts =
        (item.attempts ?? 0) + 1;

      const failed =
        attempts >= (item.max_attempts ?? 3);

      await supabaseAdmin
        .from("workflow_queue")
        .update({
          queue_status:
            failed ? "failed" : "queued",

          last_error:
            err instanceof Error
              ? err.message
              : "Unknown error",

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", item.id);

      results.push({
        queueItemId: item.id,
        status: failed ? "failed" : "retrying",
      });
    }
  }

  return {
    processed: results.length,
    results,
  };
}
