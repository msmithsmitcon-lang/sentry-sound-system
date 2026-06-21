import {
  DEMO_WORKSPACE_NAME,
  resolveWorkspacePlan,
} from "./index"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const demoWorkspace = resolveWorkspacePlan({
  workspace: {
    id: "workspace_demo",
    name: DEMO_WORKSPACE_NAME,
    status: "active",
  },
})

assert(
  demoWorkspace.planKey === "TEST_DEMO_PLAN",
  "Demo workspace must resolve to TEST_DEMO_PLAN."
)

assert(
  demoWorkspace.subscriptionStatus === "test_demo",
  "Demo workspace must resolve to test_demo subscription status."
)

assert(
  demoWorkspace.source === "demo_workspace_fallback",
  "Demo workspace must use explicit demo fallback source."
)

assert(
  !demoWorkspace.isProductionEligible,
  "Demo workspace must not be production eligible."
)

const normalWorkspace = resolveWorkspacePlan({
  workspace: {
    id: "workspace_normal",
    name: "Normal Production Workspace",
    status: "active",
  },
})

assert(
  normalWorkspace.planKey === undefined,
  "Normal workspace without persisted plan must not infer a plan key."
)

assert(
  normalWorkspace.subscriptionStatus === "not_configured",
  "Normal workspace without persisted plan must resolve to not_configured."
)

assert(
  !normalWorkspace.isProductionEligible,
  "Normal workspace without persisted plan must fail closed."
)

const suspendedWorkspace = resolveWorkspacePlan({
  workspace: {
    id: "workspace_suspended",
    name: "Suspended Workspace",
    status: "suspended",
  },
})

assert(
  suspendedWorkspace.subscriptionStatus === "suspended",
  "Suspended workspace must resolve to suspended subscription status."
)

assert(
  !suspendedWorkspace.isProductionEligible,
  "Suspended workspace must not be production eligible."
)

const inactiveWorkspace = resolveWorkspacePlan({
  workspace: {
    id: "workspace_inactive",
    name: "Inactive Workspace",
    status: "inactive",
  },
})

assert(
  inactiveWorkspace.reasonCode === "WORKSPACE_INACTIVE",
  "Inactive workspace must use WORKSPACE_INACTIVE reason code."
)

assert(
  !inactiveWorkspace.isProductionEligible,
  "Inactive workspace must not be production eligible."
)

const malformedWorkspace = resolveWorkspacePlan({
  workspace: {
    name: "Missing Id Workspace",
    status: "active",
  },
})

assert(
  malformedWorkspace.subscriptionStatus === "unknown",
  "Malformed workspace input must resolve to unknown."
)

assert(
  malformedWorkspace.reasonCode === "WORKSPACE_PLAN_UNKNOWN",
  "Malformed workspace input must use WORKSPACE_PLAN_UNKNOWN reason code."
)

assert(
  !malformedWorkspace.isProductionEligible,
  "Malformed workspace input must fail closed."
)

const missingWorkspace = resolveWorkspacePlan({})

assert(
  missingWorkspace.subscriptionStatus === "unknown",
  "Missing workspace input must resolve to unknown."
)

assert(
  !missingWorkspace.isProductionEligible,
  "Missing workspace input must fail closed."
)

console.log("Workspace plan context tests passed")
