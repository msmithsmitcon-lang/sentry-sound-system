import { createClient } from "@/lib/supabase/server";
import { getCurrentClerkUser } from "@/lib/authz/get-current-clerk-user";

interface AcceptWorkspaceInvitationInput {
  invitationToken: string;
}

export async function acceptWorkspaceInvitation(
  input: AcceptWorkspaceInvitationInput
) {
  const user = await getCurrentClerkUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const supabase = await createClient();

  const { data: invitation, error: invitationError } = await supabase
    .from("workspace_invitations")
    .select("*")
    .eq("invitation_token", input.invitationToken)
    .eq("status", "pending")
    .single();

  if (invitationError || !invitation) {
    throw new Error("Valid pending invitation not found.");
  }

  if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
    throw new Error("Invitation has expired.");
  }

  if (
    invitation.email &&
    user.email &&
    invitation.email.toLowerCase() !== user.email.toLowerCase()
  ) {
    throw new Error("Invitation email does not match authenticated user.");
  }

  const { error: roleAssignError } = await supabase
    .from("workspace_user_roles")
    .upsert(
      {
        workspace_id: invitation.workspace_id,
        user_id: user.clerkUserId,
        role_id: invitation.role_id,
      },
      { onConflict: "workspace_id,user_id,role_id" }
    );

  if (roleAssignError) {
    throw new Error(`Failed to assign invited role: ${roleAssignError.message}`);
  }

  const { error: updateError } = await supabase
    .from("workspace_invitations")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
      accepted_by_clerk_user_id: user.clerkUserId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invitation.id);

  if (updateError) {
    throw new Error(`Failed to mark invitation accepted: ${updateError.message}`);
  }

  return {
    accepted: true,
    workspaceId: invitation.workspace_id,
    roleId: invitation.role_id,
  };
}
