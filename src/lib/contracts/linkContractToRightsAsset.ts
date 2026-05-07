import { supabaseAdmin } from "@/lib/supabase/admin";

export async function linkContractToRightsAsset(input: {
  workspaceId: string;
  contractId: string;
  rightsAssetId: string;

  rightsScope?: string | null;
  territoryCode?: string | null;

  effectiveFrom?: string | null;
  effectiveTo?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.contractId) throw new Error("contractId is required");
  if (!input.rightsAssetId) throw new Error("rightsAssetId is required");

  const { data, error } = await supabaseAdmin
    .from("contract_rights_links")
    .insert({
      workspace_id: input.workspaceId,
      contract_id: input.contractId,
      rights_asset_id: input.rightsAssetId,
      rights_scope: input.rightsScope ?? null,
      territory_code: input.territoryCode ?? null,
      effective_from: input.effectiveFrom ?? null,
      effective_to: input.effectiveTo ?? null,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("contract_audit_events").insert({
    workspace_id: input.workspaceId,
    contract_id: input.contractId,
    event_type: "contract.rights.linked",
    event_summary: "Contract linked to rights asset",
    event_payload: { contractRightsLink: data },
  });

  return data;
}
