import {
  getWorkspaceEntitlementSummary,
  getWorkspaceSubscriptionSummary,
  WorkspaceEntitlementSummaryResult,
  WorkspaceSubscriptionAdminRepository,
  WorkspaceSubscriptionSummary,
} from "@/lib/entitlements/workspace-subscription-admin"
import {
  getWorkspaceOnboardingSummary,
  WorkspaceOnboardingAdminRepository,
  WorkspaceOnboardingSummary,
} from "@/lib/workspace-onboarding/workspace-onboarding-admin"

export const WORKSPACE_ADMIN_OVERVIEW_MODE = "TEST_INTERNAL_ADMIN_ONLY"

export type WorkspaceAdminOverviewRepositories = {
  onboarding: WorkspaceOnboardingAdminRepository
  subscription: WorkspaceSubscriptionAdminRepository
}

export type WorkspaceAdminOverviewErrorSource =
  | "overview"
  | "onboarding"
  | "subscription"
  | "entitlement"

export type WorkspaceAdminOverview = {
  workspaceId: string
  onboardingSummary: WorkspaceOnboardingSummary
  subscriptionSummary: WorkspaceSubscriptionSummary
  entitlementSummary: WorkspaceEntitlementSummaryResult
  flags: {
    mode: typeof WORKSPACE_ADMIN_OVERVIEW_MODE
    testInternalAdminOnly: true
    productionActivation: false
    billingIntegration: false
    middlewareActivation: false
    routeProductionIntegration: false
  }
  warnings: string[]
}

export type WorkspaceAdminOverviewResult =
  | {
      ok: true
      mode: typeof WORKSPACE_ADMIN_OVERVIEW_MODE
      data: WorkspaceAdminOverview
    }
  | {
      ok: false
      mode: typeof WORKSPACE_ADMIN_OVERVIEW_MODE
      error: {
        code: string
        message: string
        source: WorkspaceAdminOverviewErrorSource
      }
    }

export async function getWorkspaceAdminOverview(input: {
  repositories: WorkspaceAdminOverviewRepositories
  workspaceId?: string | null
  now?: Date
}): Promise<WorkspaceAdminOverviewResult> {
  const workspaceId = input.workspaceId?.trim()

  if (!workspaceId) {
    return fail("MISSING_WORKSPACE_ID", "workspace_id is required.", "overview")
  }

  const onboardingSummary = await getWorkspaceOnboardingSummary({
    repository: input.repositories.onboarding,
    workspaceId,
  })

  if (!onboardingSummary.ok) {
    return fail(
      onboardingSummary.error.code,
      onboardingSummary.error.message,
      "onboarding"
    )
  }

  const subscriptionSummary = await getWorkspaceSubscriptionSummary({
    repository: input.repositories.subscription,
    workspaceId,
    now: input.now,
  })

  if (!subscriptionSummary.ok) {
    return fail(
      subscriptionSummary.error.code,
      subscriptionSummary.error.message,
      "subscription"
    )
  }

  const entitlementSummary = await getWorkspaceEntitlementSummary({
    repository: input.repositories.subscription,
    workspaceId,
    now: input.now,
  })

  if (!entitlementSummary.ok) {
    return fail(
      entitlementSummary.error.code,
      entitlementSummary.error.message,
      "entitlement"
    )
  }

  return {
    ok: true,
    mode: WORKSPACE_ADMIN_OVERVIEW_MODE,
    data: {
      workspaceId,
      onboardingSummary: onboardingSummary.data,
      subscriptionSummary: subscriptionSummary.data,
      entitlementSummary: entitlementSummary.data,
      flags: testAdminFlags(),
      warnings: testAdminWarnings(),
    },
  }
}

function testAdminFlags(): WorkspaceAdminOverview["flags"] {
  return {
    mode: WORKSPACE_ADMIN_OVERVIEW_MODE,
    testInternalAdminOnly: true,
    productionActivation: false,
    billingIntegration: false,
    middlewareActivation: false,
    routeProductionIntegration: false,
  }
}

function testAdminWarnings(): string[] {
  return [
    "TEST/internal/admin support only.",
    "This overview does not activate production onboarding.",
    "This overview does not activate production entitlement enforcement.",
    "This overview does not integrate billing.",
    "This overview does not add middleware or production route guards.",
    "Song/submission/evidence workflows remain TEST-only.",
  ]
}

function fail(
  code: string,
  message: string,
  source: WorkspaceAdminOverviewErrorSource
): WorkspaceAdminOverviewResult {
  return {
    ok: false,
    mode: WORKSPACE_ADMIN_OVERVIEW_MODE,
    error: {
      code,
      message,
      source,
    },
  }
}
