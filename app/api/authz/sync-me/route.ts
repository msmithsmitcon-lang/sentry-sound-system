import { NextResponse } from "next/server";
import { syncCurrentClerkUserToWorkspace } from "@/lib/authz/clerk-sync/sync-clerk-user";

export async function POST() {
  try {
    const result = await syncCurrentClerkUserToWorkspace();

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
            : "Failed to sync Clerk user.",
      },
      { status: 500 }
    );
  }
}
