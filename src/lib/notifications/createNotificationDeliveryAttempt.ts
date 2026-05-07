import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createNotificationDeliveryAttempt(input: {
  workspaceId: string;
  notificationRecipientId: string;

  deliveryStatus?: "queued" | "sent" | "delivered" | "failed" | "cancelled";

  providerName?: string | null;
  providerReference?: string | null;
  errorMessage?: string | null;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.notificationRecipientId) throw new Error("notificationRecipientId is required");

  const { data, error } = await supabaseAdmin
    .from("notification_delivery_attempts")
    .insert({
      workspace_id: input.workspaceId,
      notification_recipient_id: input.notificationRecipientId,
      delivery_status: input.deliveryStatus ?? "queued",
      provider_name: input.providerName ?? null,
      provider_reference: input.providerReference ?? null,
      error_message: input.errorMessage ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
