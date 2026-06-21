import { NextRequest, NextResponse } from "next/server"

import { getSubmissionReadiness } from "@/lib/registration/submission-engine/readiness/get-submission-readiness"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const workId = searchParams.get("work_id")

    if (!workId) {
      return NextResponse.json({
        success: false,
        error: "work_id is required"
      })
    }

    const result = await getSubmissionReadiness(workId)

    return NextResponse.json({
      success: true,
      readiness: result
    })

  } catch (error) {
    console.error("READINESS_ERROR:", error)

    return NextResponse.json({
      success: false,
      error: "Failed to evaluate submission readiness"
    })
  }
}
