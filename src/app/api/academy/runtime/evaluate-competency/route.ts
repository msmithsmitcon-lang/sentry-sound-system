import { NextResponse }
from "next/server"

import {
  evaluateCompetency
} from "@/lib/academy/runtime/validation/evaluate-competency"

export async function POST(
  request: Request
) {

  const body =
    await request.json()

  const result =
    evaluateCompetency(
      body.learnerId,

      body.slbId,

      body.checks || []
    )

  return NextResponse.json({
    success: true,
    result,
  })
}
