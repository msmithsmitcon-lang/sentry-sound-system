import { NextResponse } from "next/server";

import { createScheduledJob } from "@/lib/scheduled-jobs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const scheduledJob =
      await createScheduledJob(body);

    return NextResponse.json({
      success: true,
      scheduledJob,
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
