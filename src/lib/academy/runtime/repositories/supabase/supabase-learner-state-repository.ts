import { supabaseAdmin } from "../../../../supabaseAdmin"

import { LearnerCompetencyState }
from "../../learner-state/learner-competency-state"

function resolveMasteryLevel(state: LearnerCompetencyState["competencyState"]) {
  if (state === "competency_achieved" || state === "completed") return "advanced"
  if (state === "in_progress") return "developing"
  return "novice"
}

function resolveReadinessState(state: LearnerCompetencyState["competencyState"]) {
  if (state === "competency_achieved" || state === "completed") return "ready"
  if (state === "in_progress") return "partially_ready"
  return "not_ready"
}

function resolveRemediationState(state: LearnerCompetencyState["competencyState"]) {
  if (state === "remediation_required") return "remediation_recommended"
  if (state === "competency_achieved" || state === "completed") return "stable"
  return "none"
}

export class SupabaseLearnerStateRepository {

  async createOrUpdate(
    payload: LearnerCompetencyState
  ) {

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

    if (mappingError) {
      throw mappingError
    }

    const competencyId =
      mapping.academy_slb_competency_map?.[0]?.competency_id

    if (!competencyId) {
      throw new Error(`No runtime competency mapped for SLB: ${payload.slbId}`)
    }

    const { data, error } =
      await supabaseAdmin
        .from("runtime_learner_states")
        .upsert(
          {
            tenant_id:
              "11111111-1111-1111-1111-111111111111",

            learner_id:
              payload.learnerId,

            competency_id:
              competencyId,

            mastery_level:
              resolveMasteryLevel(payload.competencyState),

            confidence_score:
              payload.competencyState === "competency_achieved" ||
              payload.competencyState === "completed"
                ? 70
                : payload.competencyState === "in_progress"
                  ? 50
                  : 30,

            remediation_state:
              resolveRemediationState(payload.competencyState),

            readiness_state:
              resolveReadinessState(payload.competencyState),

            evidence_strength:
              payload.competencyState === "competency_achieved" ||
              payload.competencyState === "completed"
                ? 70
                : 30,

            competency_decay_score:
              0,

            progression_velocity:
              1,

            remediation_attempts:
              payload.telemetrySummary?.remediationCount || 0,

            validation_attempts:
              1,

            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict:
              "learner_id,competency_id",
          }
        )
        .select()
        .single()

    if (error) {
      throw error
    }

    return data
  }
}
