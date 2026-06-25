import { NextRequest, NextResponse } from "next/server"

import { updateSubmissionQueueStatus } from "@/lib/registration/submission-engine/repositories/update-submission-queue-status"

const allowedStatuses =
  [
    "queued",
    "submitted",
    "accepted",
    "rejected",
    "failed",
  ]

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json()

    const submissionQueueId =
      body.submission_queue_id

    const status =
      body.status

    if (!submissionQueueId) {
      return NextResponse.json(
        {
          success: false,
          error: "submission_queue_id is required",
        },
        {
          status: 400,
        }
      )
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status",
          allowedStatuses,
        },
        {
          status: 400,
        }
      )
    }

    const submission =
      await updateSubmissionQueueStatus(
        submissionQueueId,
        status,
        {
          source: "update-status-api",
          updatedStatus: status,
        }
      )

    return NextResponse.json({
      success: true,
      submission,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update submission status",
      },
      {
        status: 500,
      }
    )
  }
}
