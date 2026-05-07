import { NextResponse } from "next/server";

import { createApprovalRequest } from "@/lib/approval-workflows";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const approvalRequest =
      await createApprovalRequest(body);

    return NextResponse.json({
      success: true,
      approvalRequest,
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
