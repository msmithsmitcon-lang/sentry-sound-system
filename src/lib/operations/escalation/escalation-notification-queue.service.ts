import { prisma } from "@/lib/db/prisma"

import {
  QueueEscalationNotificationInput,
} from "./escalation-notification-queue.types"

export async function queueEscalationNotification(
  input: QueueEscalationNotificationInput
) {
  return prisma.escalationNotificationQueue.create({
    data: {
      id: input.id,

      escalation_id: input.escalationId,

      channel: input.channel,

      recipients: input.recipients,

      subject: input.subject,

      message: input.message,
    },
  })
}
