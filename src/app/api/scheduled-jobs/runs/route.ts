import { NextResponse } from "next/server";

import { createScheduledJobRun } from "@/lib/scheduled-jobs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const scheduledJobRun =
      await createScheduledJobRun(body);

    return NextResponse.json({
      success: true,
      scheduledJobRun,
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
