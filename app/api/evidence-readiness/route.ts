import { NextRequest, NextResponse } from "next/server"

import {
  evaluateEvidencePackReadiness,
} from "@/lib/evidence-vault/evaluateEvidencePackReadiness"

export async function GET(request: NextRequest) {
  try {
    const workId =
      request.nextUrl.searchParams.get("work_id")

    if (!workId) {
      return NextResponse.json(
        {
          success: false,
          error: "work_id is required",
        },
        {
          status: 400,
        }
      )
    }

    const evidenceReadiness =
      await evaluateEvidencePackReadiness(workId)

    return NextResponse.json({
      success: true,
      evidenceReadiness,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to evaluate evidence readiness",
      },
      {
        status: 500,
      }
    )
  }
}
