import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createScheduledJobRun(input: {
  workspaceId: string;

  scheduledJobId?: string | null;

  runPayload?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  const { data, error } = await supabaseAdmin
    .from("scheduled_job_runs")
    .insert({
      workspace_id: input.workspaceId,
      scheduled_job_id: input.scheduledJobId ?? null,
      run_payload: input.runPayload ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
