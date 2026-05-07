import { supabaseAdmin } from "@/lib/supabase/admin";

export async function addCrmContactEmail(input: {
  workspaceId: string;
  contactId: string;
  email: string;
  label?: string;
  isPrimary?: boolean;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.contactId) throw new Error("contactId is required");
  if (!input.email?.trim()) throw new Error("email is required");

  const { data, error } = await supabaseAdmin
    .from("crm_contact_emails")
    .upsert({
      contact_id: input.contactId,
      email: input.email.trim().toLowerCase(),
      label: input.label ?? "primary",
      is_primary: input.isPrimary ?? false,
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("crm_contact_audit_events").upsert({
    workspace_id: input.workspaceId,
    contact_id: input.contactId,
    event_type: "contact.email.added",
    event_summary: `Email added to CRM contact: ${data.email}`,
    event_payload: { email: data },
  });

  return data;
}

export async function addCrmContactPhone(input: {
  workspaceId: string;
  contactId: string;
  phone: string;
  label?: string;
  isPrimary?: boolean;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.contactId) throw new Error("contactId is required");
  if (!input.phone?.trim()) throw new Error("phone is required");

  const { data, error } = await supabaseAdmin
    .from("crm_contact_phones")
    .upsert({
      contact_id: input.contactId,
      phone: input.phone.trim(),
      label: input.label ?? "primary",
      is_primary: input.isPrimary ?? false,
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("crm_contact_audit_events").upsert({
    workspace_id: input.workspaceId,
    contact_id: input.contactId,
    event_type: "contact.phone.added",
    event_summary: `Phone added to CRM contact: ${data.phone}`,
    event_payload: { phone: data },
  });

  return data;
}

