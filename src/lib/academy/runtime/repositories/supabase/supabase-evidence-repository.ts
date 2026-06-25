import { supabaseAdmin }
from "../../../../supabaseAdmin"

import { LearnerEvidenceRecord }
from "../../evidence/learner-evidence-record"

export class SupabaseEvidenceRepository {

  async create(
    payload: LearnerEvidenceRecord
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
      throw new Error(
        `No runtime competency mapped for SLB: ${payload.slbId}`
      )
    }

    const { data, error } =
      await supabaseAdmin
        .from("runtime_evidence_records")
        .insert({
          evidence_id:
            payload.evidenceId,

          tenant_id:
            "11111111-1111-1111-1111-111111111111",

          learner_id:
            payload.learnerId,

          competency_id:
            competencyId,

          slb_id:
            mapping.academy_slb_id,

          evidence_type:
            payload.evidenceType,

          evidence_source:
            "academy_runtime",

          evidence_payload: {
            programmeId:
              payload.programmeId,

            moduleId:
              payload.moduleId,

            competencyTarget:
              payload.competencyTarget,

            passed:
              payload.passed,

            ...(payload.metadata || {}),
          },

          validation_status:
            payload.passed
              ? "validated"
              : "pending",

          confidence_score:
            payload.passed
              ? 80
              : 40,

          submitted_at:
            payload.submittedAt,

          validated_at:
            payload.passed
              ? new Date().toISOString()
              : null,

          created_at:
            new Date().toISOString(),

          updated_at:
            new Date().toISOString(),
        })
        .select()
        .single()

    if (error) {
      throw error
    }

    return data
  }
}
