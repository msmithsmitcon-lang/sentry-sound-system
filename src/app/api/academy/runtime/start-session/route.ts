import { NextResponse }
from "next/server"

import {
  PersistentRuntimeExecutionService
} from "@/lib/academy/runtime/services/persistent-runtime-execution-service"

import {
  SLB_01_01
} from "@/lib/academy/slbs/contracts/slb-01-01"

export async function POST(
  request: Request
) {

  const body =
    await request.json()

  const runtime =
    new PersistentRuntimeExecutionService()

  const session =
    await runtime.startSlbSession(
      crypto.randomUUID(),

      body.learnerId,

      SLB_01_01
    )

  return NextResponse.json({
    success: true,
    session,
  })
}
