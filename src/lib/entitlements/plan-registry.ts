import {
  WORKSPACE_PLAN_KEYS,
  WorkspacePlanKey,
  WorkspacePlanRegistryItem,
} from "./types"

export const workspacePlanRegistry = [
  {
    key: "TEST_DEMO_PLAN",
    label: "TEST / Demo Plan",
    productionEligible: false,
    requestScopedOnly: false,
    billingRequiredLater: false,
  },
  {
    key: "FREE_INVITED_CONTRIBUTOR_ACCESS",
    label: "Free / Invited Contributor Access",
    productionEligible: false,
    requestScopedOnly: true,
    billingRequiredLater: false,
  },
  {
    key: "ARTIST_STARTER",
    label: "Artist Starter",
    productionEligible: true,
    requestScopedOnly: false,
    billingRequiredLater: true,
  },
  {
    key: "ARTIST_PRO",
    label: "Artist Pro",
    productionEligible: true,
    requestScopedOnly: false,
    billingRequiredLater: true,
  },
  {
    key: "PRODUCER_STUDIO",
    label: "Producer / Studio",
    productionEligible: true,
    requestScopedOnly: false,
    billingRequiredLater: true,
  },
  {
    key: "LABEL_PUBLISHER",
    label: "Label / Publisher",
    productionEligible: true,
    requestScopedOnly: false,
    billingRequiredLater: true,
  },
  {
    key: "ENTERPRISE_ADMIN_COMPANY",
    label: "Enterprise / Admin Company",
    productionEligible: true,
    requestScopedOnly: false,
    billingRequiredLater: true,
  },
] as const satisfies readonly WorkspacePlanRegistryItem[]

export const workspacePlanRegistryByKey = Object.fromEntries(
  workspacePlanRegistry.map((plan) => [plan.key, plan])
) as Record<WorkspacePlanKey, WorkspacePlanRegistryItem>

export function isWorkspacePlanKey(value: string): value is WorkspacePlanKey {
  return WORKSPACE_PLAN_KEYS.includes(value as WorkspacePlanKey)
}
