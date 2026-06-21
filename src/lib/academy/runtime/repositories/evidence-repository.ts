import { LearnerEvidenceRecord }
from "../evidence/learner-evidence-record"

import { RuntimeRepository }
from "./runtime-repository"

export interface EvidenceRepository
extends RuntimeRepository<
  LearnerEvidenceRecord
> {}
