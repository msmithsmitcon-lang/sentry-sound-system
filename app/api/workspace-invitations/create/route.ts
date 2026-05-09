import { NextRequest, NextResponse } from "next/server";
import { createWorkspaceInvitation } from "@/lib/workspace-invitations/create-workspace-invitation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = body.email as string;
    const roleKey = body.roleKey as string;

    if (!email || !roleKey) {
      return NextResponse.json(
        { success: false, error: "email and roleKey are required." },
        { status: 400 }
      );
    }

    const result = await createWorkspaceInvitation({
      email,
      roleKey,
    });

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
            : "Failed to create workspace invitation.",
      },
      { status: 500 }
    );
  }
}
