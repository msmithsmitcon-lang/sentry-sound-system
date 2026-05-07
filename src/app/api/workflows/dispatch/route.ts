import { NextResponse } from "next/server";

import { dispatchWorkflowEvent } from "@/lib/workflow-orchestration";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result =
      await dispatchWorkflowEvent(body);

    return NextResponse.json({
      success: true,
      result,
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
