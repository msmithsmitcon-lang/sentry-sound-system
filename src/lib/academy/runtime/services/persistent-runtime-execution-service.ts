import { SLBContract }
from "../../slbs/contracts/slb-contract"

import {
  createSLBRuntimeSession,
} from "../orchestration/slb-runtime-session"

import {
  SupabaseTelemetryRepository
} from "../repositories/supabase/supabase-telemetry-repository"

import {
  createTelemetryEvent
} from "../telemetry/create-telemetry-event"

import { supabaseAdmin } from "../../../supabaseAdmin"

export class PersistentRuntimeExecutionService {

  private telemetryRepo =
    new SupabaseTelemetryRepository()

  async startSlbSession(
    sessionId: string,
    learnerId: string,
    slb: SLBContract
  ) {

    const session =
      createSLBRuntimeSession(
        sessionId,
        learnerId,
        slb
      )

    const { data: mapping, error: mappingError } =
      await supabaseAdmin
        .from("academy_slb_registry")
        .select(`
          academy_slb_id,
          academy_slb_competency_map (
            competency_id
          )
        `)
        .eq("slb_code", slb.slbId)
        .single()

    if (mappingError) {
      throw mappingError
    }

    const competencyId =
      mapping.academy_slb_competency_map?.[0]?.competency_id

    if (!competencyId) {
      throw new Error(`No runtime competency mapped for SLB: ${slb.slbId}`)
    }

    await supabaseAdmin
      .from("academy_lesson_execution_sessions")
      .upsert({
        session_id: sessionId,
        learner_id: learnerId,
        lesson_id: slb.slbId,
        slm_id: "SLM-ACADEMY-V1",
        slb_id: slb.slbId,
        current_state: session.currentState,
        started_at: new Date().toISOString(),

        tenant_id: "11111111-1111-1111-1111-111111111111",
        runtime_learner_id: learnerId,
        academy_slb_uuid: mapping.academy_slb_id,
        runtime_competency_id: competencyId,
        metadata: {
          source: "PersistentRuntimeExecutionService",
          runtimeVersion: "v1",
        },
      })

    const telemetry =
      createTelemetryEvent({
        eventId: crypto.randomUUID(),

        learnerId,

        slbId: slb.slbId,

        sessionId,

        eventType: "slb_started",

        runtimeState:
          session.currentState,
      })

    await this.telemetryRepo.create(
      telemetry
    )

    return session
  }
}
