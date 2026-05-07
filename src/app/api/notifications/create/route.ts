import { NextResponse } from "next/server";

import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const notification =
      await createNotification(body);

    return NextResponse.json({
      success: true,
      notification,
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
