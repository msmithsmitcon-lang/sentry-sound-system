import { NextResponse } from "next/server"

import { generateCollaborationCertificate } from "@/lib/compliance/collaboration-certificate"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(
  _request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  const { workId } = await context.params

  if (!UUID_PATTERN.test(workId)) {
    return NextResponse.json({ success: false, error: "Invalid work ID." }, { status: 400 })
  }

  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext()

    const certificate = await generateCollaborationCertificate({
      workId,
      workspaceId: workspaceContext.workspace.id,
      generatedByUserId: workspaceContext.user.clerkUserId,
    })

    return NextResponse.json({ success: true, certificate }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate certificate."
    const status = message === "Authentication required." ? 401 : message === "Work not found." ? 404 : 400

    return NextResponse.json({ success: false, error: message }, { status })
  }
}
