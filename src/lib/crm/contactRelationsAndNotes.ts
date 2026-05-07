import { supabaseAdmin } from "@/lib/supabase/admin";

export async function addCrmContactRelationship(input: {
  workspaceId: string;
  fromContactId: string;
  toContactId: string;
  relationshipType: string;
  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.fromContactId) throw new Error("fromContactId is required");
  if (!input.toContactId) throw new Error("toContactId is required");
  if (!input.relationshipType?.trim()) throw new Error("relationshipType is required");

  const { data, error } = await supabaseAdmin
    .from("crm_contact_relationships")
    .insert({
      workspace_id: input.workspaceId,
      from_contact_id: input.fromContactId,
      to_contact_id: input.toContactId,
      relationship_type: input.relationshipType.trim(),
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("crm_contact_audit_events").insert({
    workspace_id: input.workspaceId,
    contact_id: input.fromContactId,
    event_type: "contact.relationship.added",
    event_summary: `CRM relationship added: ${data.relationship_type}`,
    event_payload: { relationship: data },
  });

  return data;
}

export async function addCrmContactNote(input: {
  workspaceId: string;
  contactId: string;
  note: string;
  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.contactId) throw new Error("contactId is required");
  if (!input.note?.trim()) throw new Error("note is required");

  const { data, error } = await supabaseAdmin
    .from("crm_contact_notes")
    .insert({
      workspace_id: input.workspaceId,
      contact_id: input.contactId,
      note: input.note.trim(),
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("crm_contact_audit_events").insert({
    workspace_id: input.workspaceId,
    contact_id: input.contactId,
    event_type: "contact.note.added",
    event_summary: "CRM contact note added",
    event_payload: { note: data },
  });

  return data;
}
