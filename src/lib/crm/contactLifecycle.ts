import { supabaseAdmin } from "@/lib/supabase/admin";

export const CRM_LIFECYCLE_STATUSES = [
  "draft",
  "active",
  "inactive",
  "archived",
] as const;

export type CrmLifecycleStatus =
  typeof CRM_LIFECYCLE_STATUSES[number];

export async function updateCrmContactLifecycle(input: {
  workspaceId: string;
  contactId: string;
  lifecycleStatus: CrmLifecycleStatus;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.contactId) {
    throw new Error("contactId is required");
  }

  if (!CRM_LIFECYCLE_STATUSES.includes(input.lifecycleStatus)) {
    throw new Error("Invalid lifecycle status");
  }

  const { data, error } = await supabaseAdmin
    .from("crm_contacts")
    .update({
      lifecycle_status: input.lifecycleStatus,
    })
    .eq("id", input.contactId)
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin
    .from("crm_contact_audit_events")
    .insert({
      workspace_id: input.workspaceId,
      contact_id: input.contactId,
      event_type: "contact.lifecycle.updated",
      event_summary: `CRM lifecycle updated to ${input.lifecycleStatus}`,
      event_payload: {
        lifecycleStatus: input.lifecycleStatus,
      },
    });

  return data;
}
