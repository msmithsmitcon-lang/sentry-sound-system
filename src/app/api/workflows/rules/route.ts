import { NextResponse } from "next/server";

import { createWorkflowRule } from "@/lib/workflow-orchestration";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const workflowRule =
      await createWorkflowRule(body);

    return NextResponse.json({
      success: true,
      workflowRule,
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
