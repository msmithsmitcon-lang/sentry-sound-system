import { supabaseAdmin } from "@/lib/supabase/admin";

export async function validateRightsOwnershipTotals(input: {
  workspaceId: string;
  rightsAssetId: string;
  territoryCode?: string | null;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.rightsAssetId) throw new Error("rightsAssetId is required");

  let query = supabaseAdmin
    .from("rights_ownership_claims")
    .select("ownership_percentage")
    .eq("workspace_id", input.workspaceId)
    .eq("rights_asset_id", input.rightsAssetId)
    .eq("verification_status", "verified");

  if (input.territoryCode) {
    query = query.eq("territory_code", input.territoryCode);
  }

  const { data, error } = await query;

  if (error) throw error;

  const total = (data ?? []).reduce(
    (sum, row) => sum + Number(row.ownership_percentage ?? 0),
    0
  );

  return {
    rightsAssetId: input.rightsAssetId,
    territoryCode: input.territoryCode ?? null,
    verifiedOwnershipTotal: total,
    isComplete: total === 100,
    isOverAllocated: total > 100,
    isUnderAllocated: total < 100,
  };
}
