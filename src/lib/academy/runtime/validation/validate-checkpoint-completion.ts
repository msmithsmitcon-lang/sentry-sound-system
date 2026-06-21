import { CompetencyCheckpoint }
from "./competency-checkpoint"

export function validateCheckpointCompletion(
  checkpoints: CompetencyCheckpoint[],
  completed: string[]
): boolean {

  const required =
    checkpoints.filter((c) => c.required)

  return required.every((checkpoint) =>
    completed.includes(
      checkpoint.checkpointId
    )
  )
}
