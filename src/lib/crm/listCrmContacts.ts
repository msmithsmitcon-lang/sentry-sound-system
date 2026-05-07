import { supabaseAdmin } from "@/lib/supabase/admin";

export async function listCrmContacts(input: {
  workspaceId: string;
  search?: string;
  lifecycleStatus?: "draft" | "active" | "inactive" | "archived";
  contactType?: "person" | "company" | "organization";
  limit?: number;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");

  let query = supabaseAdmin
    .from("crm_contacts")
    .select(`
      *,
      emails:crm_contact_emails(*),
      phones:crm_contact_phones(*)
    `)
    .eq("workspace_id", input.workspaceId)
    .order("display_name", { ascending: true })
    .limit(input.limit ?? 50);

  if (input.search?.trim()) {
    query = query.ilike("display_name", `%${input.search.trim()}%`);
  }

  if (input.lifecycleStatus) {
    query = query.eq("lifecycle_status", input.lifecycleStatus);
  }

  if (input.contactType) {
    query = query.eq("contact_type", input.contactType);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}
