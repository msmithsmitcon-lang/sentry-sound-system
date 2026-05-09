import { NextResponse } from "next/server";
import { resolveWorkspaceContext } from "@/lib/authz/workspace-context/resolve-workspace-context";

export async function GET() {
  try {
    const context = await resolveWorkspaceContext();

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
