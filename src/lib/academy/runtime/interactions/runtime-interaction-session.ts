import { SLBInteractionStep }
from "../../slbs/interactions/slb-interaction-step"

export interface RuntimeInteractionSession {
  sessionId: string

  slbId: string

  currentStepIndex: number

  completedSteps: string[]

  activeStep?: SLBInteractionStep
}
