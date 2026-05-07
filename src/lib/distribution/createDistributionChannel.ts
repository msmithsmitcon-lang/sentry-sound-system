import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createDistributionChannel(input: {
  workspaceId: string;
  channelName: string;
  platformType: string;
  active?: boolean;
  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.channelName?.trim()) throw new Error("channelName is required");
  if (!input.platformType?.trim()) throw new Error("platformType is required");

  const { data, error } = await supabaseAdmin
    .from("distribution_channels")
    .insert({
      workspace_id: input.workspaceId,
      channel_name: input.channelName.trim(),
      platform_type: input.platformType.trim(),
      active: input.active ?? true,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
