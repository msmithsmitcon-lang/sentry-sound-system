import {
  CheckQuotaInput,
  EntitlementQuotaLimit,
  EntitlementQuotaPeriod,
  EntitlementQuotaSource,
  UsageCounter,
} from "./quota-types"
import { EntitlementQuotaKey } from "./types"

export function checkQuota(input: CheckQuotaInput): UsageCounter {
  const workspaceId = input.workspaceId ?? null
  const quotaKey = input.quotaKey ?? "unknown"
  const period = input.period ?? "lifetime"
  const source = input.source ?? "provided"

  if (!workspaceId || !input.quotaKey) {
    return buildUsageCounter({
      workspaceId,
      quotaKey,
      period,
      used: null,
      limit: null,
      exceeded: true,
      status: "unknown",
      source: source === "provided" ? "unknown" : source,
    })
  }

  if (
    source === "not_available" ||
    source === "unknown" ||
    input.used === null ||
    input.used === undefined ||
    input.limit === null ||
    input.limit === undefined
  ) {
    return buildUsageCounter({
      workspaceId,
      quotaKey: input.quotaKey,
      period,
      used: input.used ?? null,
      limit: input.limit ?? null,
      exceeded: true,
      status: source === "not_available" ? "not_available" : "unknown",
      source,
    })
  }

  if (input.limit === "unlimited") {
    return buildUsageCounter({
      workspaceId,
      quotaKey: input.quotaKey,
      period,
      used: input.used,
      limit: input.limit,
      exceeded: false,
      status: "unlimited",
      source,
    })
  }

  if (input.limit === "custom") {
    return buildUsageCounter({
      workspaceId,
      quotaKey: input.quotaKey,
      period,
      used: input.used,
      limit: input.limit,
      exceeded: false,
      status: "custom",
      source,
    })
  }

  const exceeded = input.used > input.limit

  return buildUsageCounter({
    workspaceId,
    quotaKey: input.quotaKey,
    period,
    used: input.used,
    limit: input.limit,
    exceeded,
    status: exceeded ? "exceeded" : "within_limit",
    source,
  })
}

function buildUsageCounter(input: {
  workspaceId: string | null
  quotaKey: EntitlementQuotaKey
  period: EntitlementQuotaPeriod
  used: number | null
  limit: EntitlementQuotaLimit | null
  exceeded: boolean
  status: UsageCounter["status"]
  source: EntitlementQuotaSource
}): UsageCounter {
  return {
    workspaceId: input.workspaceId,
    quotaKey: input.quotaKey,
    period: input.period,
    used: input.used,
    limit: input.limit,
    exceeded: input.exceeded,
    status: input.status,
    source: input.source,
  }
}
