import { prisma } from "@/lib/db/prisma"
import { EscalationResolutionResult, EscalationTriggerType } from "./escalation.types"

export async function persistEscalationEvent(params: {
  id: string
  triggerType: EscalationTriggerType
  resolution: EscalationResolutionResult
}) {
  return prisma.operationalEscalationEvent.create({
    data: {
      id: params.id,
      trigger_type: params.triggerType,
      severity: params.resolution.resolvedSeverity ?? "LOW",
      lifecycle_state: params.resolution.lifecycleState,
      policy_code: params.resolution.matchedPolicy?.code,
      reasons: params.resolution.reasons,
    },
  })
}
