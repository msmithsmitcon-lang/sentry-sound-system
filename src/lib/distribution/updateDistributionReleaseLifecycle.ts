import { supabaseAdmin } from "@/lib/supabase/admin";

export const DISTRIBUTION_RELEASE_STATUSES = [
  "draft",
  "scheduled",
  "submitted",
  "delivered",
  "live",
  "takedown_requested",
  "removed",
  "failed",
  "archived",
] as const;

export type DistributionReleaseStatus =
  typeof DISTRIBUTION_RELEASE_STATUSES[number];

export async function updateDistributionReleaseLifecycle(input: {
  workspaceId: string;
  distributionReleaseId: string;
  lifecycleStatus: DistributionReleaseStatus;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.distributionReleaseId) throw new Error("distributionReleaseId is required");

  if (!DISTRIBUTION_RELEASE_STATUSES.includes(input.lifecycleStatus)) {
    throw new Error("Invalid distribution release lifecycle status");
  }

  const { data, error } = await supabaseAdmin
    .from("distribution_releases")
    .update({ lifecycle_status: input.lifecycleStatus })
    .eq("id", input.distributionReleaseId)
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("distribution_audit_events").insert({
    workspace_id: input.workspaceId,
    distribution_release_id: input.distributionReleaseId,
    event_type: "distribution.release.lifecycle.updated",
    event_summary: `Distribution release lifecycle updated to ${input.lifecycleStatus}`,
    event_payload: { lifecycleStatus: input.lifecycleStatus },
  });

  return data;
}
