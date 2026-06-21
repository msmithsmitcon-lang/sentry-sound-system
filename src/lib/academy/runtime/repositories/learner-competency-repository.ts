import { LearnerCompetencyState }
from "../learner-state/learner-competency-state"

import { RuntimeRepository }
from "./runtime-repository"

export interface LearnerCompetencyRepository
extends RuntimeRepository<
  LearnerCompetencyState
> {}
