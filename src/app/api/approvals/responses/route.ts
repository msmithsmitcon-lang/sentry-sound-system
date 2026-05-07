import { NextResponse } from "next/server";

import { createApprovalResponse } from "@/lib/approval-workflows";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const approvalResponse =
      await createApprovalResponse(body);

    return NextResponse.json({
      success: true,
      approvalResponse,
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
