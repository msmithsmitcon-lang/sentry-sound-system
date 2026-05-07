import { NextResponse } from "next/server";

import { createNotificationDeliveryAttempt } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const deliveryAttempt =
      await createNotificationDeliveryAttempt(body);

    return NextResponse.json({
      success: true,
      deliveryAttempt,
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
