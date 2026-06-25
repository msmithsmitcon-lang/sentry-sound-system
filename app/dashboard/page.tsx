import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context";
import { getCanonicalWorkSummaryRows } from "@/lib/works/works-read-repository";

import { DashboardShell } from "./dashboard-shell";
import { MissionControlWelcome } from "./mission-control";

export default async function DashboardPage() {
  const { workspace, user } = await getAuthenticatedWorkspaceContext();
  const existingWorks = await getCanonicalWorkSummaryRows({ workspaceId: workspace.id, limit: 1 });

  if (existingWorks.length === 0) {
    return <MissionControlWelcome firstName={user.firstName ?? "there"} />;
  }

  return <DashboardShell />;
}
