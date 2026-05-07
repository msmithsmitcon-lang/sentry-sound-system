import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createRightsOwnershipClaim(input: {
  workspaceId: string;
  rightsAssetId: string;

  crmContactId?: string | null;
  contributorId?: string | null;

  ownershipRole: string;
  ownershipPercentage: number;

  territoryCode?: string | null;

  effectiveFrom?: string | null;
  effectiveTo?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.rightsAssetId) {
    throw new Error("rightsAssetId is required");
  }

  if (!input.ownershipRole?.trim()) {
    throw new Error("ownershipRole is required");
  }

  if (
    input.ownershipPercentage <= 0 ||
    input.ownershipPercentage > 100
  ) {
    throw new Error("ownershipPercentage must be between 0 and 100");
  }

  const { data, error } = await supabaseAdmin
    .from("rights_ownership_claims")
    .insert({
      workspace_id: input.workspaceId,
      rights_asset_id: input.rightsAssetId,

      crm_contact_id: input.crmContactId ?? null,
      contributor_id: input.contributorId ?? null,

      ownership_role: input.ownershipRole.trim(),
      ownership_percentage: input.ownershipPercentage,

      territory_code: input.territoryCode ?? null,

      effective_from: input.effectiveFrom ?? null,
      effective_to: input.effectiveTo ?? null,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin
    .from("rights_audit_events")
    .insert({
      workspace_id: input.workspaceId,
      rights_asset_id: input.rightsAssetId,
      event_type: "rights.ownership.created",
      event_summary: `Ownership claim created: ${input.ownershipRole}`,
      event_payload: {
        ownershipClaim: data,
      },
    });

  return data;
}
