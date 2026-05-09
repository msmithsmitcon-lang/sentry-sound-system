import { checkPermission } from "@/lib/rbac/check-permission";
import {
  PermissionAction,
  PermissionResource,
} from "@/lib/rbac/types";
import { getUserRole } from "./get-user-role";
import { logAuthorizationEvent } from "./log-authorization-event";

interface RequirePermissionInput {
  workspaceId: string;
  userId: string;
  resource: PermissionResource;
  action: PermissionAction;
}

export async function requirePermission(
  input: RequirePermissionInput
): Promise<void> {
  const role = await getUserRole({
    workspaceId: input.workspaceId,
    userId: input.userId,
  });

  if (!role) {
    await logAuthorizationEvent({
      workspaceId: input.workspaceId,
      clerkUserId: input.userId,
      resource: input.resource,
      action: input.action,
      allowed: false,
      reason: "No workspace role assigned.",
    });

    throw new Error("Access denied: no workspace role assigned.");
  }

  const allowed = checkPermission({
    role,
    resource: input.resource,
    action: input.action,
  });

  await logAuthorizationEvent({
    workspaceId: input.workspaceId,
    clerkUserId: input.userId,
    resource: input.resource,
    action: input.action,
    allowed,
    reason: allowed
      ? "Permission granted."
      : "Insufficient permissions.",
  });

  if (!allowed) {
    throw new Error("Access denied: insufficient permissions.");
  }
}
