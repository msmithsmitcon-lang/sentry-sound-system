import { academySupabase }
from "./client"

import { LearnerCompetencyState }
from "../../learner-state/learner-competency-state"

export class SupabaseLearnerCompetencyRepository {

  async create(
    payload: LearnerCompetencyState
  ) {

    const { data, error } =
      await academySupabase
        .from(
          "academy_learner_competency_states"
        )
        .insert(payload)
        .select()
        .single()

    if (error) {
      throw error
    }

    return data
  }
}
