import { supabaseAdmin } from "@/lib/supabase/admin";

export async function addNotificationRecipient(input: {
  workspaceId: string;
  notificationId: string;

  recipientType: string;
  recipientId?: string | null;
  recipientEmail?: string | null;

  deliveryChannel:
    | "in_app"
    | "email"
    | "sms"
    | "webhook";

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.notificationId) throw new Error("notificationId is required");
  if (!input.recipientType?.trim()) throw new Error("recipientType is required");
  if (!input.deliveryChannel) throw new Error("deliveryChannel is required");

  const { data, error } = await supabaseAdmin
    .from("notification_recipients")
    .insert({
      workspace_id: input.workspaceId,
      notification_id: input.notificationId,
      recipient_type: input.recipientType.trim(),
      recipient_id: input.recipientId ?? null,
      recipient_email: input.recipientEmail ?? null,
      delivery_channel: input.deliveryChannel,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
