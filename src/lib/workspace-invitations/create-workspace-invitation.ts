import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context";
import { requirePermission } from "@/lib/authz/require-permission";

interface CreateWorkspaceInvitationInput {
  email: string;
  roleKey: string;
  expiresInDays?: number;
}

export async function createWorkspaceInvitation(
  input: CreateWorkspaceInvitationInput
) {
  const context = await getAuthenticatedWorkspaceContext();
  const supabase = await createClient();

  await requirePermission({
    workspaceId: context.workspace.id,
    userId: context.user.clerkUserId,
    resource: "settings",
    action: "admin",
  });

  const { data: role, error: roleError } = await supabase
    .from("rbac_roles")
    .select("*")
    .eq("role_key", input.roleKey)
    .single();

  if (roleError || !role) {
    throw new Error("Invitation role not found.");
  }

  const invitationToken = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (input.expiresInDays ?? 7));

  const { data, error } = await supabase
    .from("workspace_invitations")
    .insert({
      workspace_id: context.workspace.id,
      email: input.email.toLowerCase().trim(),
      role_id: role.id,
      invited_by_clerk_user_id: context.user.clerkUserId,
      invitation_token: invitationToken,
      expires_at: expiresAt.toISOString(),
      status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create workspace invitation: ${error.message}`);
  }

  return {
    invitation: data,
    invitationToken,
  };
}
