import { NextResponse } from "next/server";

import { createWorkflowEvent } from "@/lib/workflow-orchestration";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const workflowEvent =
      await createWorkflowEvent(body);

    return NextResponse.json({
      success: true,
      workflowEvent,
    });

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
