import { prisma } from "@/lib/db/prisma"

import type { Prisma } from "@/generated/prisma/client"

import {
  CreateEvidenceAuditEventInput
} from "./createEvidenceAuditEvent.types"

export async function createEvidenceAuditEvent(
  input: CreateEvidenceAuditEventInput
) {

  return prisma.evidenceAuditEvent.create({
    data: {
      evidenceId: input.evidenceId,

      eventType: input.eventType,

      actorUserId:
        input.actorUserId ?? undefined,

      relatedEntityType:
        input.relatedEntityType ?? undefined,

      relatedEntityId:
        input.relatedEntityId ?? undefined,

      previousState:
        input.previousState as Prisma.InputJsonValue,

      nextState:
        input.nextState as Prisma.InputJsonValue,

      metadata:
        input.metadata as Prisma.InputJsonValue
    }
  })
}
