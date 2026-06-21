import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/db/prisma"

import { createSubmissionQueueItem } from "@/lib/registration/submission-engine/repositories/create-submission-queue-item"

import { getSubmissionReadiness } from "@/lib/registration/submission-engine/readiness/get-submission-readiness"

import { generateSubmissionFingerprint } from "@/lib/registration/submission-engine/utils/generate-submission-fingerprint"

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json()

    const workId = body.work_id

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

    const workRows: { id: string }[] =
      await prisma.$queryRaw`
        SELECT id
        FROM musical_works
        WHERE id::text = ${workId}
        LIMIT 1
      `

    if (workRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "WORK_NOT_FOUND",
        },
        {
          status: 404,
        }
      )
    }

    const readiness =
      await getSubmissionReadiness(workId)

    if (!readiness.ready) {
      return NextResponse.json(
        {
          success: false,
          error: "READINESS_BLOCKED",
          issues: readiness.issues,
        },
        {
          status: 400,
        }
      )
    }

    const fingerprint =
      generateSubmissionFingerprint({
        workId,
        target: "SAMRO",
        exportFormat: "CWR",
      })

    const existingQueueItem =
      await prisma.submissionQueue.findFirst({
        where: {
          fingerprint,
        },
      })

    if (existingQueueItem) {
      return NextResponse.json({
        success: true,
        duplicatePrevented: true,
        submission: existingQueueItem,
      })
    }

    const queueItem =
      await createSubmissionQueueItem({
        target: "SAMRO",

        status: "queued",

        priority: "normal",

        entityType: "musical_work",

        entityId: workId,

        exportFormat: "CWR",

        fingerprint,

        metadata: {
          source: "create-from-work-api",
        },
      })

    return NextResponse.json({
      success: true,
      duplicatePrevented: false,
      submission: queueItem,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create submission queue item",
      },
      {
        status: 500,
      }
    )
  }
}
