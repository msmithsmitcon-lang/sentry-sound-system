import { LearnerEvidenceRecord }
from "./learner-evidence-record"

export function createEvidenceRecord(
  payload: LearnerEvidenceRecord
): LearnerEvidenceRecord {

  return {
    ...payload,
    submittedAt: new Date().toISOString(),
  }
}
