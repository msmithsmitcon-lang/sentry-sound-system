import { prisma } from "@/lib/db/prisma"

import type { Prisma }
  from "@/generated/prisma/client"

import {
  CreateOperationalIncidentInput
} from "./operationalIncident.types"

export async function createOperationalIncident(
  input: CreateOperationalIncidentInput
) {

  return prisma.operationalIncident.create({
    data: {
      type:
        input.type,

      severity:
        input.severity,

      status:
        "open",

      title:
        input.title,

      description:
        input.description ?? undefined,

      metadata:
        input.metadata as Prisma.InputJsonValue
    }
  })
}
