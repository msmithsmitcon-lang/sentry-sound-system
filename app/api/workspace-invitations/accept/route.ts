import { NextRequest, NextResponse } from "next/server";
import { acceptWorkspaceInvitation } from "@/lib/workspace-invitations/accept-workspace-invitation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const invitationToken = body.invitationToken as string;

    if (!invitationToken) {
      return NextResponse.json(
        { success: false, error: "invitationToken is required." },
        { status: 400 }
      );
    }

    const result = await acceptWorkspaceInvitation({
      invitationToken,
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
            : "Failed to accept workspace invitation.",
      },
      { status: 500 }
    );
  }
}
