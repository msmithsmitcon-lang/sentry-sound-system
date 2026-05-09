import { NextRequest, NextResponse } from "next/server";
import { executeReport } from "@/lib/analytics-report-engine/execute-report";
import { requirePermission } from "@/lib/authz/require-permission";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const workspaceId = body.workspaceId as string;
    const userId = body.userId as string;
    const executionId = body.executionId as string;

    if (!workspaceId || !userId || !executionId) {
      return NextResponse.json(
        { error: "workspaceId, userId and executionId are required." },
        { status: 400 }
      );
    }

    await requirePermission({
      workspaceId,
      userId,
      resource: "analytics",
      action: "execute",
    });

    await executeReport({ executionId });

    return NextResponse.json({
      success: true,
      executionId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to execute analytics report.",
      },
      { status: 500 }
    );
  }
}
