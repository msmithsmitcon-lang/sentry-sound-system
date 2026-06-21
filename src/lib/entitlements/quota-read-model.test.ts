import {
  UsageCounterProvider,
  checkQuota,
  getUsageCounter,
} from "./index"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const exceeded = checkQuota({
  workspaceId: "workspace_1",
  quotaKey: "active_works",
  period: "monthly",
  used: 11,
  limit: 10,
  productionSensitive: true,
})

assert(exceeded.exceeded, "Exceeded quota must be marked exceeded.")
assert(exceeded.status === "exceeded", "Exceeded quota must return exceeded status.")

const underLimit = checkQuota({
  workspaceId: "workspace_1",
  quotaKey: "active_works",
  period: "monthly",
  used: 9,
  limit: 10,
})

assert(!underLimit.exceeded, "Under-limit quota must not be exceeded.")
assert(
  underLimit.status === "within_limit",
  "Under-limit quota must return within_limit status."
)

const unlimited = checkQuota({
  workspaceId: "workspace_1",
  quotaKey: "api_requests",
  period: "monthly",
  used: 100000,
  limit: "unlimited",
})

assert(!unlimited.exceeded, "Unlimited quota must not be exceeded.")
assert(unlimited.status === "unlimited", "Unlimited quota status must be explicit.")

const custom = checkQuota({
  workspaceId: "workspace_1",
  quotaKey: "automation_runs",
  period: "annual",
  used: 12,
  limit: "custom",
})

assert(!custom.exceeded, "Custom quota must not be exceeded by the pure checker.")
assert(custom.status === "custom", "Custom quota status must be explicit.")

const missingSource = checkQuota({
  workspaceId: "workspace_1",
  quotaKey: "report_exports",
  period: "monthly",
  source: "not_available",
  productionSensitive: true,
})

assert(missingSource.exceeded, "Missing source must fail closed.")
assert(
  missingSource.status === "not_available",
  "Missing source must return not_available status."
)

const unknownQuota = checkQuota({
  workspaceId: "workspace_1",
  period: "monthly",
  used: 1,
  limit: 10,
  productionSensitive: true,
})

assert(unknownQuota.exceeded, "Unknown quota must fail closed.")
assert(unknownQuota.status === "unknown", "Unknown quota must return unknown status.")

const productionSensitiveMissing = checkQuota({
  workspaceId: null,
  quotaKey: "monthly_submission_queue_items",
  period: "monthly",
  used: 1,
  limit: 10,
  productionSensitive: true,
})

assert(
  productionSensitiveMissing.exceeded,
  "Production-sensitive missing workspace quota must fail closed."
)

async function runProviderBoundaryTest() {
  const provider: UsageCounterProvider = {
    async getUsageCounter() {
      return checkQuota({
        workspaceId: "workspace_provider",
        quotaKey: "active_works",
        period: "lifetime",
        used: 2,
        limit: 5,
        source: "read_model",
      })
    },
  }

  const provided = await getUsageCounter(provider, {
    workspaceId: "workspace_provider",
    quotaKey: "active_works",
    period: "lifetime",
  })

  assert(
    provided.source === "read_model",
    "Provider boundary must support future read-model usage counters."
  )
}

runProviderBoundaryTest().then(() => {
  console.log("Quota read model tests passed")
})
