import { NextResponse }
from "next/server"

import {
  SupabaseLearnerStateRepository
} from "@/lib/academy/runtime/repositories/supabase/supabase-learner-state-repository"

export async function POST(
  request: Request
) {

  const body =
    await request.json()

  const repo =
    new SupabaseLearnerStateRepository()

  const learnerState =
    await repo.createOrUpdate({
      learnerId:
        body.learnerId,

      programmeId:
        body.programmeId,

      moduleId:
        body.moduleId,

      slbId:
        body.slbId,

      competencyState:
        body.competencyState,

      remediationHistory: [],

      completedStates: [],

      telemetrySummary: {
        misconceptionsDetected: 0,
        remediationCount: 0,
        retryCount: 0,
      },

      updatedAt:
        new Date().toISOString(),
    })

  return NextResponse.json({
    success: true,
    learnerState,
  })
}
