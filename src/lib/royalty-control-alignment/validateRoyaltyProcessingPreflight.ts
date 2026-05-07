import { validateRightsOwnershipTotals } from "@/lib/rights-lifecycle";

export async function validateRoyaltyProcessingPreflight(input: {
  workspaceId: string;

  rightsAssetId?: string | null;
  releaseId?: string | null;
  distributionReleaseId?: string | null;
  territoryCode?: string | null;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  const checks = {
    rightsOwnership: null as Awaited<ReturnType<typeof validateRightsOwnershipTotals>> | null,
    releaseLinked: Boolean(input.releaseId),
    distributionLinked: Boolean(input.distributionReleaseId),
    territoryCode: input.territoryCode ?? null,
  };

  if (input.rightsAssetId) {
    checks.rightsOwnership = await validateRightsOwnershipTotals({
      workspaceId: input.workspaceId,
      rightsAssetId: input.rightsAssetId,
      territoryCode: input.territoryCode ?? null,
    });
  }

  return {
    canProcess:
      !checks.rightsOwnership ||
      checks.rightsOwnership.isComplete,

    checks,
  };
}
