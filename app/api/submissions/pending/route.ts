import { NextResponse } from "next/server"

import { getPendingSubmissionQueueItems } from "@/lib/registration/submission-engine/repositories/get-pending-submission-queue-items"

export async function GET() {
  try {
    const submissions =
      await getPendingSubmissionQueueItems()

    return NextResponse.json({
      success: true,
      count: submissions.length,
      submissions,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch pending submissions",
      },
      {
        status: 500,
      }
    )
  }
}
