import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createDistributionRelease(input: {
  workspaceId: string;

  sourceReleaseId?: string | null;

  scheduledReleaseDate?: string | null;

  distributionNotes?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  const { data, error } = await supabaseAdmin
    .from("distribution_releases")
    .insert({
      workspace_id: input.workspaceId,

      source_release_id:
        input.sourceReleaseId ?? null,

      scheduled_release_date:
        input.scheduledReleaseDate ?? null,

      distribution_notes:
        input.distributionNotes ?? null,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin
    .from("distribution_audit_events")
    .insert({
      workspace_id: input.workspaceId,
      distribution_release_id: data.id,
      event_type: "distribution.release.created",
      event_summary: "Distribution release created",
      event_payload: {
        distributionRelease: data,
      },
    });

  return data;
}
