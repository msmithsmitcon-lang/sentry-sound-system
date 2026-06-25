import { supabaseAdmin } from "../../../../supabaseAdmin"

const TENANT_ID = "11111111-1111-1111-1111-111111111111"
const DEFAULT_REMEDIATION_QUEUE = "default-remediation-queue"

export class SupabaseRemediationRepository {
  async createRemediation(payload: {
    learnerId: string
    slbId: string
    telemetryEventId: string
    remediationReason: string
    remediationLevel?: "standard" | "targeted_remediation"
  }) {
    const { data: mapping, error: mappingError } =
      await supabaseAdmin
        .from("academy_slb_registry")
        .select(`
          academy_slb_id,
          academy_slb_competency_map (
            competency_id
          )
        `)
        .eq("slb_code", payload.slbId)
        .single()

    if (mappingError) throw mappingError

    const competencyId =
      mapping.academy_slb_competency_map?.[0]?.competency_id

    if (!competencyId) {
      throw new Error(`No runtime competency mapped for SLB: ${payload.slbId}`)
    }

    const { data, error } =
      await supabaseAdmin
        .from("runtime_remediations")
        .insert({
          tenant_id: TENANT_ID,
          learner_id: payload.learnerId,
          competency_id: competencyId,
          originating_telemetry_event_id: payload.telemetryEventId,
          remediation_level: payload.remediationLevel || "standard",
          remediation_status: "active",
          remediation_reason: payload.remediationReason,
          escalation_required: false,
          instructor_review_required: false,
          confidence_before: 30,
          confidence_after: null,
          mastery_before: "novice",
          mastery_after: null,
          remediation_started_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (error) throw error

    return data
  }

  async enqueueRemediation(payload: {
    remediationId: string
    learnerId: string
    remediationType?: string
    severity?: "low" | "medium" | "high" | "critical"
  }) {
    const { data: queue, error: queueError } =
      await supabaseAdmin
        .from("runtime_remediation_queues")
        .select("id")
        .eq("queue_name", DEFAULT_REMEDIATION_QUEUE)
        .eq("tenant_id", TENANT_ID)
        .eq("status", "active")
        .single()

    if (queueError) throw queueError

    const { data, error } =
      await supabaseAdmin
        .rpc("create_runtime_remediation_queue_item", {
          p_tenant_id: TENANT_ID,
          p_remediation_queue_id: queue.id,
          p_learner_id: payload.learnerId,
          p_remediation_type: payload.remediationType || "workflow_confusion",
          p_severity: payload.severity || "medium",
          p_source_event_type: "runtime_remediation",
          p_source_event_id: payload.remediationId,
          p_remediation_payload: {
            remediationId: payload.remediationId,
            source: "academy_runtime",
          },
        })

    if (error) throw error

    return data
  }
}

