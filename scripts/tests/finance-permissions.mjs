import { financeRolePermissions } from "../../src/lib/finance/auth/finance-permissions.ts"

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

assert(financeRolePermissions.viewer.includes("finance:read"), "viewer must read")
assert(!financeRolePermissions.viewer.includes("finance:write"), "viewer must not write")

assert(financeRolePermissions.editor.includes("finance:write"), "editor must write")
assert(financeRolePermissions.approver.includes("finance:approve"), "approver must approve")
assert(financeRolePermissions.admin.includes("finance:admin"), "admin must admin")

console.log("Finance permission tests passed.")
