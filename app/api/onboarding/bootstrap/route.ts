import { NextResponse } from "next/server";
import { bootstrapAuthenticatedUser } from "@/lib/onboarding/bootstrap-authenticated-user";

export async function GET() {
  try {
    const result = await bootstrapAuthenticatedUser();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to bootstrap authenticated user.",
      },
      { status: 500 }
    );
  }
}
