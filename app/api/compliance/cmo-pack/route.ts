import { NextResponse } from "next/server"

import { generateCmoSubmissionPack } from "@/lib/compliance/cmo-pack-generator"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * ENTITLEMENT GATE — BILLING DEFERRAL DECIDED, NOT AN OVERSIGHT.
 *
 * PLEXICON_MASTER_EXECUTION_BRIEF_V1.md Part 5 specifies a pay-per-action
 * gate here (R50/CMO pack on the free tier, unlimited on Growth tier via
 * PayFast). No PayFast integration exists anywhere in this codebase.
 *
 * Decision made by Markus Wesley Ivan Smith on 2026-06-22: this route
 * intentionally allows CMO pack generation unconditionally for V1 — the
 * free tier's download stays open/unmetered. PayFast integration (and
 * re-introducing this charge) is scoped as a V1.5 task, not a blocking
 * dependency for V1 launch. See the BUILD-LOG entry dated 2026-06-22
 * for the full decision record.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const workId = body?.work_id

    if (typeof workId !== "string" || !UUID_PATTERN.test(workId)) {
      return NextResponse.json({ success: false, error: "A valid work_id is required." }, { status: 400 })
    }

    const workspaceContext = await getAuthenticatedWorkspaceContext()

    const result = await generateCmoSubmissionPack({
      workId,
      workspaceId: workspaceContext.workspace.id,
      actorId: workspaceContext.user.clerkUserId,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, issues: result.issues }, { status: 422 })
    }

    return new NextResponse(new Uint8Array(result.zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${result.fileName}"`,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate CMO submission pack."
    const status =
      message === "Authentication required."
        ? 401
        : message === "Work not found."
          ? 404
          : 400

    return NextResponse.json({ success: false, error: message }, { status })
  }
}
