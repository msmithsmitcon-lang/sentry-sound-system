import { NextResponse } from "next/server"

import { generateCmoSubmissionPack } from "@/lib/compliance/cmo-pack-generator"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * ENTITLEMENT GATE — STUB, FLAGGED FOR MARKUS:
 *
 * PLEXICON_MASTER_EXECUTION_BRIEF_V1.md Part 5 specifies a pay-per-action
 * gate here (R50/CMO pack on the free tier, unlimited on Growth tier via
 * PayFast). No PayFast integration exists anywhere in this codebase —
 * confirmed by an exhaustive search (zero files reference PayFast). The
 * existing entitlement registry (src/lib/entitlements/capability-registry.ts)
 * also marks most capabilities `rolloutState: "test_only"`, meaning wiring
 * this route through it would block all production downloads outright,
 * not just free-tier ones.
 *
 * This route currently allows pack generation unconditionally rather than
 * either (a) building a fake payment wall, or (b) blocking the
 * end-to-end journey on missing payment infrastructure. This is a real
 * product/business decision — whether V1 ships with billing enforcement
 * deferred, or whether PayFast integration is a blocking dependency for
 * this feature — not a technical one, and needs Markus's call before a
 * real gate replaces this comment.
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
