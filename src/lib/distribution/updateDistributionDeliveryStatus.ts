import { supabaseAdmin } from "@/lib/supabase/admin";

export const DISTRIBUTION_DELIVERY_STATUSES = [
  "pending",
  "queued",
  "submitted",
  "processing",
  "live",
  "failed",
  "removed",
] as const;

export type DistributionDeliveryStatus =
  typeof DISTRIBUTION_DELIVERY_STATUSES[number];

export async function updateDistributionDeliveryStatus(input: {
  workspaceId: string;
  distributionReleaseChannelId: string;
  deliveryStatus: DistributionDeliveryStatus;
  eventSummary?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.distributionReleaseChannelId) throw new Error("distributionReleaseChannelId is required");

  if (!DISTRIBUTION_DELIVERY_STATUSES.includes(input.deliveryStatus)) {
    throw new Error("Invalid distribution delivery status");
  }

  const { data, error } = await supabaseAdmin
    .from("distribution_release_channels")
    .update({
      delivery_status: input.deliveryStatus,
      metadata: input.metadata ?? {},
    })
    .eq("id", input.distributionReleaseChannelId)
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("distribution_delivery_events").insert({
    workspace_id: input.workspaceId,
    distribution_release_channel_id: input.distributionReleaseChannelId,
    event_type: "distribution.delivery.status_updated",
    event_summary: input.eventSummary ?? `Delivery status updated to ${input.deliveryStatus}`,
    event_payload: {
      deliveryStatus: input.deliveryStatus,
      metadata: input.metadata ?? {},
    },
  });

  return data;
}
