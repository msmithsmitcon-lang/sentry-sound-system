import { NextResponse }
from "next/server"

import {
  validateRuntimeHealth
} from "@/lib/academy/runtime/testing/validate-runtime-health"

export async function GET() {

  const health =
    validateRuntimeHealth()

  return NextResponse.json({
    success: true,
    health,
  })
}
