import { CompetencyCheckpoint }
from "./competency-checkpoint"

export const SLB_01_01_CHECKPOINTS:
CompetencyCheckpoint[] = [

  {
    checkpointId: "checkpoint-role-awareness",

    slbId: "SLB-01.01",

    competencyTarget: "role awareness",

    required: true,

    validationType: "question",
  },

  {
    checkpointId: "checkpoint-workflow-awareness",

    slbId: "SLB-01.01",

    competencyTarget: "workflow awareness",

    required: true,

    validationType: "workflow_sequence",
  },

  {
    checkpointId: "checkpoint-terminology-awareness",

    slbId: "SLB-01.01",

    competencyTarget: "terminology awareness",

    required: true,

    validationType: "terminology_validation",
  },
]
