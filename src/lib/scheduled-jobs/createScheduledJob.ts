import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createScheduledJob(input: {
  workspaceId: string;

  jobType: string;
  jobName: string;

  active?: boolean;

  scheduleConfig?: Record<string, unknown>;
  jobPayload?: Record<string, unknown>;

  nextRunAt?: string | null;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.jobType?.trim()) {
    throw new Error("jobType is required");
  }

  if (!input.jobName?.trim()) {
    throw new Error("jobName is required");
  }

  const { data, error } = await supabaseAdmin
    .from("scheduled_jobs")
    .insert({
      workspace_id: input.workspaceId,

      job_type: input.jobType.trim(),
      job_name: input.jobName.trim(),

      active: input.active ?? true,

      schedule_config:
        input.scheduleConfig ?? {},

      job_payload:
        input.jobPayload ?? {},

      next_run_at:
        input.nextRunAt ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
