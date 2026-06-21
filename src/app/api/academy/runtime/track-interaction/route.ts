import { NextResponse }
from "next/server"

import {
  createTelemetryEvent
} from "@/lib/academy/runtime/telemetry/create-telemetry-event"

import {
  SupabaseTelemetryRepository
} from "@/lib/academy/runtime/repositories/supabase/supabase-telemetry-repository"

export async function POST(
  request: Request
) {

  const body =
    await request.json()

  const telemetryRepo =
    new SupabaseTelemetryRepository()

  const event =
    createTelemetryEvent({
      eventId: crypto.randomUUID(),

      learnerId:
        body.learnerId,

      slbId:
        body.slbId,

      sessionId:
        body.sessionId,

      eventType:
        body.eventType,

      runtimeState:
        body.runtimeState,

      metadata:
        body.metadata,
    })

  const saved =
    await telemetryRepo.create(
      event
    )

  return NextResponse.json({
    success: true,
    telemetry: saved,
    })
}
