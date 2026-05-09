import { resolveWorkspaceContext } from "@/lib/authz/workspace-context/resolve-workspace-context";
import { checkPermission } from "@/lib/rbac/check-permission";
import {
  PermissionAction,
  PermissionResource,
} from "@/lib/rbac/types";
import { logAuthorizationEvent } from "@/lib/authz/log-authorization-event";

interface PermissionGuardConfig {
  resource: PermissionResource;
  action: PermissionAction;
}

export function withPermissionGuard<TArgs extends unknown[], TResult>(
  config: PermissionGuardConfig,
  handler: (
    context: Awaited<ReturnType<typeof resolveWorkspaceContext>>,
    ...args: TArgs
  ) => Promise<TResult>
) {
  return async (...args: TArgs): Promise<TResult> => {
    const context = await resolveWorkspaceContext();

    const allowed = checkPermission({
      role: context.role.role_key,
      resource: config.resource,
      action: config.action,
    });

    await logAuthorizationEvent({
      workspaceId: context.workspace.id,
      clerkUserId: context.user.clerkUserId,
      resource: config.resource,
      action: config.action,
      allowed,
      reason: allowed
        ? "Permission granted via guard."
        : "Permission denied via guard.",
    });

    if (!allowed) {
      throw new Error("Access denied.");
    }

    return handler(context, ...args);
  };
}
