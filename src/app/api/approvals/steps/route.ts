import { NextResponse } from "next/server";

import { createApprovalStep } from "@/lib/approval-workflows";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const approvalStep =
      await createApprovalStep(body);

    return NextResponse.json({
      success: true,
      approvalStep,
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
