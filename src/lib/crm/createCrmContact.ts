import { supabaseAdmin } from "@/lib/supabase/admin";

export type CrmContactType = "person" | "company" | "organization";
export type CrmLifecycleStatus = "draft" | "active" | "inactive" | "archived";

export type CreateCrmContactInput = {
  workspaceId: string;
  contactType?: CrmContactType;
  displayName: string;
  legalName?: string | null;
  tradingName?: string | null;
  countryCode?: string | null;
  taxIdentifier?: string | null;
  registrationNumber?: string | null;
  metadata?: Record<string, unknown>;
};

export async function createCrmContact(input: CreateCrmContactInput) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.displayName?.trim()) throw new Error("displayName is required");

  const { data: contact, error } = await supabaseAdmin
    .from("crm_contacts")
    .insert({
      workspace_id: input.workspaceId,
      contact_type: input.contactType ?? "person",
      display_name: input.displayName.trim(),
      legal_name: input.legalName ?? null,
      trading_name: input.tradingName ?? null,
      country_code: input.countryCode ?? null,
      tax_identifier: input.taxIdentifier ?? null,
      registration_number: input.registrationNumber ?? null,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  const { error: auditError } = await supabaseAdmin
    .from("crm_contact_audit_events")
    .insert({
      workspace_id: input.workspaceId,
      contact_id: contact.id,
      event_type: "contact.created",
      event_summary: `CRM contact created: ${contact.display_name}`,
      event_payload: { contact },
    });

  if (auditError) throw auditError;

  return contact;
}
