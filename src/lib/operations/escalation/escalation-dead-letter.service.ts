import { prisma } from "@/lib/db/prisma"

import {
  EscalationDeadLetterInput,
} from "./escalation-dead-letter.types"

export async function quarantineEscalationNotification(
  input: EscalationDeadLetterInput
) {
  return prisma.escalationDeadLetterQueue.create({
    data: {
      id: input.id,

      notification_id: input.notificationId,

      escalation_id: input.escalationId,

      channel: input.channel,

      failure_reason: input.failureReason,

      original_status: input.originalStatus,
    },
  })
}
