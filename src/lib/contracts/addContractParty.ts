import { supabaseAdmin } from "@/lib/supabase/admin";

export async function addContractParty(input: {
  workspaceId: string;
  contractId: string;

  crmContactId?: string | null;
  contributorId?: string | null;

  partyRole: string;

  signingAuthority?: boolean;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.contractId) {
    throw new Error("contractId is required");
  }

  if (!input.partyRole?.trim()) {
    throw new Error("partyRole is required");
  }

  const { data, error } = await supabaseAdmin
    .from("contract_parties")
    .insert({
      workspace_id: input.workspaceId,
      contract_id: input.contractId,

      crm_contact_id: input.crmContactId ?? null,
      contributor_id: input.contributorId ?? null,

      party_role: input.partyRole.trim(),

      signing_authority:
        input.signingAuthority ?? false,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin
    .from("contract_audit_events")
    .insert({
      workspace_id: input.workspaceId,
      contract_id: input.contractId,
      event_type: "contract.party.added",
      event_summary: `Contract party added: ${input.partyRole}`,
      event_payload: {
        contractParty: data,
      },
    });

  return data;
}
