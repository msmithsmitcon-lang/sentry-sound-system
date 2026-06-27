import { NextResponse } from "next/server";

import { getReleaseReadinessReport } from "@/lib/release-readiness/release-readiness";
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, context: { params: Promise<{ workId: string }> }) {
  const { workId } = await context.params;

  if (!UUID_PATTERN.test(workId)) {
    return NextResponse.json({ success: false, error: "Invalid work ID." }, { status: 400 });
  }

  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext();

    const report = await getReleaseReadinessReport({
      workId,
      workspaceId: workspaceContext.workspace.id,
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load release readiness.";
    const status = message === "Authentication required." ? 401 : message === "Work not found." ? 404 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
