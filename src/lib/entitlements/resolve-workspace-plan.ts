import {
  DEMO_WORKSPACE_NAME,
  WorkspacePlanContext,
} from "./workspace-plan-status"

export type WorkspacePlanResolutionInput = {
  workspace?: {
    id?: string | null
    name?: string | null
    status?: string | null
  } | null
}

export function resolveWorkspacePlan(
  input: WorkspacePlanResolutionInput
): WorkspacePlanContext {
  const workspace = input.workspace
  const workspaceId = workspace?.id ?? null
  const workspaceName = workspace?.name ?? null
  const workspaceStatus = workspace?.status ?? null

  if (!workspace || !workspaceId) {
    return {
      workspaceId,
      workspaceName,
      workspaceStatus,
      subscriptionStatus: "unknown",
      source: "unknown",
      isProductionEligible: false,
      reasonCode: "WORKSPACE_PLAN_UNKNOWN",
    }
  }

  if (workspaceStatus === "suspended") {
    return {
      workspaceId,
      workspaceName,
      workspaceStatus,
      subscriptionStatus: "suspended",
      source: "not_configured",
      isProductionEligible: false,
      reasonCode: "WORKSPACE_SUSPENDED",
    }
  }

  if (workspaceStatus === "inactive") {
    return {
      workspaceId,
      workspaceName,
      workspaceStatus,
      subscriptionStatus: "not_configured",
      source: "not_configured",
      isProductionEligible: false,
      reasonCode: "WORKSPACE_INACTIVE",
    }
  }

  if (workspaceName === DEMO_WORKSPACE_NAME) {
    return {
      workspaceId,
      workspaceName,
      workspaceStatus,
      planKey: "TEST_DEMO_PLAN",
      subscriptionStatus: "test_demo",
      source: "demo_workspace_fallback",
      isProductionEligible: false,
      reasonCode: "TEST_DEMO_WORKSPACE",
    }
  }

  return {
    workspaceId,
    workspaceName,
    workspaceStatus,
    subscriptionStatus: "not_configured",
    source: "not_configured",
    isProductionEligible: false,
    reasonCode: "WORKSPACE_PLAN_NOT_CONFIGURED",
  }
}
