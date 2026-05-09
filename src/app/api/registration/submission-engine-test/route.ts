import { NextResponse } from "next/server"

import { runSubmissionEngineTest } from "@/lib/registration/submission-engine/services/run-submission-engine-test.service"

export async function GET() {
  try {
    const result =
      await runSubmissionEngineTest()

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown submission engine error",
      },
      {
        status: 500,
      }
    )
  }
}
