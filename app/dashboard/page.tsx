import { getDashboardHomeData } from "@/lib/dashboard/get-dashboard-home-data";
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context";

import { DashboardShell } from "./dashboard-shell";
import { MissionControlWelcome } from "./mission-control";

export default async function DashboardPage() {
  const { workspace, user } = await getAuthenticatedWorkspaceContext();
  const { projects, attentionItems } = await getDashboardHomeData({ workspaceId: workspace.id });

  if (projects.length === 0) {
    return <MissionControlWelcome firstName={user.firstName ?? "there"} />;
  }

  return (
    <DashboardShell
      workspaceName={workspace.name ?? "Your music business"}
      projects={projects}
      attentionItems={attentionItems}
    />
  );
}
