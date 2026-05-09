import { createClient } from "@/lib/supabase/server";
import {
  PermissionAction,
  PermissionResource,
} from "@/lib/rbac/types";

interface LogAuthorizationEventInput {
  workspaceId?: string | null;
  clerkUserId?: string | null;
  resource: PermissionResource;
  action: PermissionAction;
  allowed: boolean;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export async function logAuthorizationEvent(
  input: LogAuthorizationEventInput
): Promise<void> {
  const supabase = await createClient();

  await supabase.from("authorization_audit_events").insert({
    workspace_id: input.workspaceId ?? null,
    clerk_user_id: input.clerkUserId ?? null,
    resource: input.resource,
    action: input.action,
    allowed: input.allowed,
    reason: input.reason ?? null,
    metadata: input.metadata ?? {},
  });
}
