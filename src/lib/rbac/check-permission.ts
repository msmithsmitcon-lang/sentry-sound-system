import { ROLE_PERMISSIONS } from "./permissions";
import { CheckPermissionInput } from "./types";

export function checkPermission(input: CheckPermissionInput): boolean {
  const roleSet = ROLE_PERMISSIONS.find(
    (entry) => entry.role === input.role
  );

  if (!roleSet) {
    return false;
  }

  return roleSet.permissions.some((permission) => {
    const sameResource = permission.resource === input.resource;

    const hasExactAction = permission.action === input.action;
    const hasAdminAction = permission.action === "admin";

    return sameResource && (hasExactAction || hasAdminAction);
  });
}
