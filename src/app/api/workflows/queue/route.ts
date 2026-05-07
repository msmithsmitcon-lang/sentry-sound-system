import { NextResponse } from "next/server";

import {
  enqueueWorkflowRun,
  processWorkflowQueue,
} from "@/lib/workflow-orchestration";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "enqueue") {
      const queueItem =
        await enqueueWorkflowRun(body);

      return NextResponse.json({
        success: true,
        queueItem,
      });
    }

    if (body.action === "process") {
      const result =
        await processWorkflowQueue(body);

      return NextResponse.json({
        success: true,
        result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid queue action",
      },
      { status: 400 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
