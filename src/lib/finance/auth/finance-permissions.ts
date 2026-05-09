export type FinancePermission =
  | "finance:read"
  | "finance:write"
  | "finance:approve"
  | "finance:admin"

export type FinanceRole = "viewer" | "editor" | "approver" | "admin"

export const financeRolePermissions: Record<FinanceRole, FinancePermission[]> = {
  viewer: ["finance:read"],
  editor: ["finance:read", "finance:write"],
  approver: ["finance:read", "finance:approve"],
  admin: ["finance:read", "finance:write", "finance:approve", "finance:admin"],
}

export function hasFinancePermission(role: FinanceRole, permission: FinancePermission) {
  return financeRolePermissions[role]?.includes(permission) ?? false
}
