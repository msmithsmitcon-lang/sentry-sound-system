import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/db/prisma"

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

    const submissions =
      await prisma.submissionQueue.findMany({
        where: {
          entityId: workId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      })

    const submissionQueueIds =
      submissions.map((submission) => submission.id)

    const events =
      submissionQueueIds.length > 0
        ? await prisma.submissionQueueEvent.findMany({
            where: {
              submissionQueueId: {
                in: submissionQueueIds,
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          })
        : []

    return NextResponse.json({
      success: true,
      work_id: workId,
      count: {
        submissions: submissions.length,
        events: events.length,
      },
      submissions,
      events,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch submission lifecycle",
      },
      {
        status: 500,
      }
    )
  }
}
