import { supabaseAdmin } from "../../../../supabaseAdmin"

import { RuntimeTelemetryEvent } from "../../telemetry/runtime-telemetry-event"

function toRuntimeEventType(eventType: string) {
  if (eventType === "slb_completed") return "lesson_completed"
  if (eventType === "slb_started") return "lesson_started"
  if (eventType === "interaction_started") return "runtime_learning_event_executed"
  if (eventType === "remediation_triggered") return "remediation_started"
  return eventType
}

export class SupabaseTelemetryRepository {
  async create(payload: RuntimeTelemetryEvent) {
    const slbCode = payload.slbId

    const { data: mapping, error: mappingError } = await supabaseAdmin
      .from("academy_slb_registry")
      .select(`
        academy_slb_id,
        academy_slb_competency_map (
          competency_id
        )
      `)
      .eq("slb_code", slbCode)
      .single()

    if (mappingError) {
      throw mappingError
    }

    const competencyId =
      mapping.academy_slb_competency_map?.[0]?.competency_id

    if (!competencyId) {
      throw new Error(`No runtime competency mapped for SLB: ${slbCode}`)
    }

    const { data, error } = await supabaseAdmin
      .from("runtime_telemetry_events")
      .insert({
        tenant_id: "11111111-1111-1111-1111-111111111111",
        learner_id: payload.learnerId,
        session_id: payload.sessionId,
        competency_id: competencyId,
        lesson_id: null,
        slb_id: mapping.academy_slb_id,
        event_type: toRuntimeEventType(payload.eventType),
        event_payload: {
          ...(payload.metadata || {}),
          academySlbId: slbCode,
          runtimeState: payload.runtimeState,
        },
        confidence_impact: 0,
        remediation_impact:
          payload.eventType === "remediation_triggered" ? 1 : 0,
        progression_impact:
          payload.eventType === "slb_completed" ? 10 : 0,
        generated_by_runtime: true,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }
}


