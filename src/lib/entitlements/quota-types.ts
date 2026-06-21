import { EntitlementQuotaKey } from "./types"

export const ENTITLEMENT_QUOTA_PERIODS = [
  "lifetime",
  "monthly",
  "annual",
] as const

export type EntitlementQuotaPeriod =
  (typeof ENTITLEMENT_QUOTA_PERIODS)[number]

export type EntitlementQuotaLimit = number | "unlimited" | "custom"

export type EntitlementQuotaSource =
  | "provided"
  | "read_model"
  | "not_available"
  | "unknown"

export type EntitlementQuotaStatus =
  | "within_limit"
  | "exceeded"
  | "unlimited"
  | "custom"
  | "not_available"
  | "unknown"

export type UsageCounter = {
  workspaceId: string | null
  quotaKey: EntitlementQuotaKey
  period: EntitlementQuotaPeriod
  used: number | null
  limit: EntitlementQuotaLimit | null
  exceeded: boolean
  status: EntitlementQuotaStatus
  source: EntitlementQuotaSource
}

export type CheckQuotaInput = {
  workspaceId?: string | null
  quotaKey?: EntitlementQuotaKey | null
  period?: EntitlementQuotaPeriod | null
  used?: number | null
  limit?: EntitlementQuotaLimit | null
  source?: EntitlementQuotaSource
  productionSensitive?: boolean
}

export type GetUsageCounterInput = {
  workspaceId: string
  quotaKey: EntitlementQuotaKey
  period: EntitlementQuotaPeriod
}

export type UsageCounterProvider = {
  getUsageCounter(input: GetUsageCounterInput): Promise<UsageCounter>
}
