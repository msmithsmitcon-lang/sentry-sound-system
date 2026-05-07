import { NextResponse } from "next/server";

import { processApprovalEscalations } from "@/lib/approval-workflows";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result =
      await processApprovalEscalations(body);

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
