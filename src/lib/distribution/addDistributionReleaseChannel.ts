import { supabaseAdmin } from "@/lib/supabase/admin";

export async function addDistributionReleaseChannel(input: {
  workspaceId: string;
  distributionReleaseId: string;
  distributionChannelId: string;

  territoryCode?: string | null;
  externalReferenceId?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.distributionReleaseId) throw new Error("distributionReleaseId is required");
  if (!input.distributionChannelId) throw new Error("distributionChannelId is required");

  const { data, error } = await supabaseAdmin
    .from("distribution_release_channels")
    .insert({
      workspace_id: input.workspaceId,
      distribution_release_id: input.distributionReleaseId,
      distribution_channel_id: input.distributionChannelId,
      territory_code: input.territoryCode ?? null,
      external_reference_id: input.externalReferenceId ?? null,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("distribution_delivery_events").insert({
    workspace_id: input.workspaceId,
    distribution_release_channel_id: data.id,
    event_type: "distribution.channel.added",
    event_summary: "Distribution channel added to release",
    event_payload: { distributionReleaseChannel: data },
  });

  return data;
}
