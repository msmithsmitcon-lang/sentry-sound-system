import { NextResponse } from "next/server";

import { addNotificationRecipient } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const notificationRecipient =
      await addNotificationRecipient(body);

    return NextResponse.json({
      success: true,
      notificationRecipient,
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
