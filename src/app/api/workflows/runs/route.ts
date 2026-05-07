import { NextResponse } from "next/server";

import { createWorkflowRun } from "@/lib/workflow-orchestration";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const workflowRun =
      await createWorkflowRun(body);

    return NextResponse.json({
      success: true,
      workflowRun,
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
