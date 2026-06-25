import { NextResponse } from "next/server"

import { saveTestWorkIntelligenceV1 } from "@/lib/works/work-intelligence-v1-repository"

// DEPRECATED TEST ROUTE:
// Retained temporarily for TEST/control/backward compatibility only.
// Dashboard Song Profile saves now use canonical PATCH /api/works/[workId]/profile.
// New product code must not depend on this TEST route; future cleanup may remove or archive it.
export async function POST(
  request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  try {
    const { workId } = await context.params
    const body = await request.json()

    const result = await saveTestWorkIntelligenceV1(workId, body)

    return NextResponse.json({
      success: true,
      mode: "TEST_V1_ONLY",
      production_ready: false,
      warning:
        "This route saves Step 2 Work Intelligence for TEST/V1 only. It is not production governance.",
      ...result,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        mode: "TEST_V1_ONLY",
        production_ready: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save work intelligence.",
      },
      { status: 400 }
    )
  }
}
