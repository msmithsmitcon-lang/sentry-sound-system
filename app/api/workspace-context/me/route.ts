import { NextResponse } from "next/server";
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context";

export async function GET() {
  try {
    const context = await getAuthenticatedWorkspaceContext();

    return NextResponse.json({
      success: true,
      context,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to resolve workspace context.",
      },
      { status: 500 }
    );
  }
}
