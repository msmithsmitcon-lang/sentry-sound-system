import { prisma } from "@/lib/db/prisma"

import {
  OperationalSLABreach
} from "./operationalSLA.types"

export async function resolveSLABreaches():
  Promise<OperationalSLABreach[]> {

  const breaches:
    OperationalSLABreach[] = []

  const unresolvedIncidents =
    await prisma.operationalIncident
      .count({
        where: {
          status: "open"
        }
      })

  if (unresolvedIncidents >= 3) {

    breaches.push({
      type:
        "incident_backlog",

      severity:
        "critical",

      message:
        "High unresolved incident backlog detected",

      metadata: {
        unresolvedIncidents
      },

      detectedAt:
        new Date().toISOString()
    })
  }

  const failedDispatches =
    await prisma.submissionDispatchQueue
      .count({
        where: {
          status: "failed"
        }
      })

  if (failedDispatches >= 10) {

    breaches.push({
      type:
        "dispatch_failure_sla",

      severity:
        "warning",

      message:
        "Dispatch failure SLA threshold exceeded",

      metadata: {
        failedDispatches
      },

      detectedAt:
        new Date().toISOString()
    })
  }

  return breaches
}
